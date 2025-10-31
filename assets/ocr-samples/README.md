# OCR Test Samples

This directory contains sample trading chart screenshots for OCR testing (Alpha Issue 5).

## Required Samples

Add 3 sample PNG files here for testing:
- `sample1.png` - Chart with RSI indicator
- `sample2.png` - Chart with Bollinger Bands
- `sample3.png` - Chart with EMA/SMA indicators

## Test Criteria

Each sample should allow OCR to extract:
- At least 1 labeled indicator value (e.g., "RSI: 70")
- Price levels if visible
- Moving average values if present

## Performance Target

OCR p95 <= 1.2s across all samples
