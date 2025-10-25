import { NavLink } from 'react-router-dom'
import { ChartBarIcon, BookOpenIcon, PlayIcon } from '@heroicons/react/24/outline'

const navItems = [
  { path: '/', label: 'Analyze', icon: ChartBarIcon },
  { path: '/journal', label: 'Journal', icon: BookOpenIcon },
  { path: '/replay', label: 'Replay', icon: PlayIcon },
]

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-800"
      role="navigation"
      aria-label="Bottom navigation"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-around">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-3 px-4 min-w-[80px] transition-colors ${
                  isActive ? 'text-blue-500' : 'text-slate-400 hover:text-slate-200'
                }`
              }
              aria-label={label}
            >
              <Icon className="w-6 h-6 mb-1" aria-hidden="true" />
              <span className="text-xs font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
      {/* Safe area padding for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}
