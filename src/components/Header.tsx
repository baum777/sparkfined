interface HeaderProps {
  title?: string
}

export default function Header({ title = 'Sparkfined' }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h1>
        </div>

        <button
          onClick={() => document.documentElement.classList.toggle('dark')}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle dark mode"
        >
          <span className="dark:hidden">🌙</span>
          <span className="hidden dark:inline">☀️</span>
        </button>
      </div>
    </header>
  )
}
