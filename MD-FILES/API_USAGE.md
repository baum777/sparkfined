# API Usage Guide — Sparkfined Alpha

This document describes how to configure and use the data provider APIs for Sparkfined.

---

## Table of Contents

1. [Provider Configuration](#provider-configuration)
2. [DexPaprika API](#dexpaprika-api)
3. [Moralis API](#moralis-api)
4. [AI Providers](#ai-providers)
5. [Rate Limits & Costs](#rate-limits--costs)
6. [Fallback Behavior](#fallback-behavior)
7. [Telemetry](#telemetry)

---

## Provider Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Primary Provider (required)
VITE_DATA_PRIMARY=dexpaprika  # or 'moralis'
DEXPAPRIKA_API_KEY=your_key_here

# Secondary Provider (optional, recommended)
VITE_DATA_SECONDARY=moralis  # or 'none'
MORALIS_API_KEY=your_key_here

# AI Analysis (optional)
VITE_ANALYSIS_AI_PROVIDER=none  # or 'openai' | 'grok'
OPENAI_API_KEY=your_key_here
```

### Provider Selection Logic

```
Request → Primary (DexPaprika)
  ↓ fail (timeout/error)
  → Secondary (Moralis)
    ↓ fail
    → Error (both failed)
```

Cache: 300s (5 min) for token snapshots.

---

## DexPaprika API

### Endpoints Used

- **Token Info:** `GET https://api.dexpaprika.com/v1/solana/tokens/{address}`

### Response Mapping

```json
{
  "symbol": "SOL",
  "name": "Solana",
  "priceUsd": 150.25,
  "ohlcv": {
    "h24": { "high": 155.0, "low": 145.0 }
  },
  "volume24h": 1234567,
  "pool": { "liquidity": 999999 }
}
```

Maps to `TokenSnapshot`:
- `price` ← `priceUsd`
- `high24` ← `ohlcv.h24.high`
- `low24` ← `ohlcv.h24.low`
- `volume24` ← `volume24h`
- `liquidity` ← `pool.liquidity`

### Configuration

```bash
DEXPAPRIKA_BASE=https://api.dexpaprika.com
DEXPAPRIKA_API_KEY=__PLACEHOLDER__  # Optional for higher limits
DEXPAPRIKA_TIMEOUT=5000  # 5s
DEXPAPRIKA_CACHE_TTL_MIN=15  # 15 min
```

### Rate Limits

- **Free Tier:** 100 req/min
- **With API Key:** 1000 req/min
- **Cache:** 15 min recommended to stay within limits

---

## Moralis API

### Endpoints Used

- **Token Price:** `GET https://deep-index.moralis.io/api/v2.2/erc20/{address}/price?chain=solana`

### Response Mapping

```json
{
  "tokenSymbol": "SOL",
  "tokenName": "Solana",
  "usdPrice": 151.0,
  "24hrPercentChange": 2.5,
  "volume24h": 1000000,
  // Note: Moralis may not provide high/low24, use usdPrice ± %
}
```

Maps to `TokenSnapshot`:
- `price` ← `usdPrice`
- `high24` ← estimated from `usdPrice * (1 + 24hrPercentChange/200)`
- `low24` ← estimated from `usdPrice * (1 - 24hrPercentChange/200)`
- `volume24` ← `volume24h`
- `liquidity` ← Not always available, defaults to 0

### Configuration

```bash
MORALIS_BASE=https://deep-index.moralis.io/api/v2.2
MORALIS_API_KEY=__REQUIRED__  # Moralis requires API key
MORALIS_TIMEOUT=6000  # 6s
MORALIS_CACHE_TTL_MIN=10  # 10 min
```

### Rate Limits

- **Free Tier:** 40,000 compute units/month (~2000 requests)
- **Paid Plans:** Start at $49/mo for 3M compute units
- **Recommendation:** Use as secondary/fallback only

---

## AI Providers

### OpenAI (GPT-4o-mini recommended)

```bash
VITE_ANALYSIS_AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
AI_TEASER_TIMEOUT_MS=2000
AI_TEASER_MAX_TOKENS=500
```

**Cost:** ~$0.0001 per teaser (GPT-4o-mini)
**Latency:** ~800ms median

### Grok (xAI)

```bash
VITE_ANALYSIS_AI_PROVIDER=grok
GROK_API_KEY=xai-...
```

**Cost:** TBD (beta pricing)
**Latency:** ~1200ms median

### Heuristic (Local, Free)

```bash
VITE_ANALYSIS_AI_PROVIDER=none
```

**Cost:** $0
**Latency:** <300ms
**Quality:** Basic S/R, SL/TP calculation

---

## Rate Limits & Costs

| Provider | Free Tier | Cost (Paid) | Recommended Usage |
|----------|-----------|-------------|-------------------|
| DexPaprika | 100 req/min | $0 (w/ key: 1000/min) | Primary |
| Moralis | 2000 req/month | $49/mo (3M compute) | Secondary/Fallback |
| OpenAI (GPT-4o-mini) | $0 | $0.15/1M input tokens | Optional AI Teaser |
| Grok | TBD | TBD | Optional AI Teaser |
| Heuristic | ∞ | $0 | Always Available |

### Best Practices

1. **Cache aggressively:** 300s (5 min) for token snapshots
2. **Use secondary sparingly:** Only on primary failure
3. **AI Teaser:** Keep `max_tokens` low (500) to minimize cost
4. **Monitor telemetry:** Track `provider_fallback` events

---

## Fallback Behavior

### Scenario: Primary Timeout

```
User requests SOL snapshot
  → Call DexPaprika API (timeout 5s)
    → Timeout after 5s
  → Fallback to Moralis API (timeout 6s)
    → Success
  → Return TokenSnapshot (meta.fallback = true)
  → Log telemetry event: provider_fallback
```

### Scenario: Both Fail

```
User requests SOL snapshot
  → Call DexPaprika → Fail
  → Call Moralis → Fail
  → Return Error: "Unable to fetch token data"
  → UI shows error state with retry button
```

### Cache Behavior

- **Cache Hit:** Return immediately (age shown in UI)
- **Cache Miss:** Fetch from provider(s)
- **Stale While Revalidate:** Return stale data, fetch fresh in background

---

## Telemetry

### Logged Events

```typescript
Telemetry.log('provider_fallback', 1, { from: 'dexpaprika', to: 'moralis' });
Telemetry.log('snapshot_age_s', 120, { address: 'So111...' });
Telemetry.log('api_request_ms', 450, { provider: 'dexpaprika' });
```

### Export Telemetry

```typescript
// JSON
const data = Telemetry.dump();

// CSV
const csv = Telemetry.exportCSV();
```

### Performance Budgets

- **API Median:** ≤500ms
- **AI Teaser p95:** ≤2000ms
- Alerts trigger if budgets exceeded for >5% of requests

---

## Troubleshooting

### Issue: API Key Not Working

**Symptom:** 401/403 errors from provider
**Fix:** Verify key in `.env.local`, ensure it's prefixed correctly (e.g., `VITE_` for client-accessible vars)

### Issue: Frequent Fallbacks

**Symptom:** Telemetry shows high `provider_fallback` rate
**Fix:** Check DexPaprika rate limits, increase cache TTL, verify network stability

### Issue: AI Teaser Timeout

**Symptom:** AI teaser always falls back to heuristic
**Fix:** Increase `AI_TEASER_TIMEOUT_MS` (default 2000ms), check API key, verify provider status

### Issue: Stale Data

**Symptom:** Token prices not updating
**Fix:** Reduce cache TTL (`SNAPSHOT_CACHE_TTL_SEC`), force refresh, check provider uptime

---

## Security Notes

- **Never commit API keys** to git
- **Use edge functions** to proxy API calls (protects keys from client exposure)
- **Validate inputs:** Always validate Solana addresses (Base58) before API calls
- **Monitor usage:** Set up alerts for unexpected API usage spikes

---

## Support

- **Provider Issues:** Contact provider support directly
- **App Issues:** https://github.com/baum777/sparkfined/issues
- **Rate Limit Help:** See provider dashboards for usage stats

---

**Last Updated:** 2025-10-29
**Alpha Version:** 1.0.0-alpha
