export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-lg font-bold text-white">S</span>
          </div>
          <h1 className="text-xl font-bold text-white">Sparkfined</h1>
        </div>

        <div className="flex items-center gap-2">{/* Future: Add settings, profile, etc. */}</div>
      </div>
    </header>
  )
}
