import { NavLink, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/dashboard', icon: '🏠', label: 'Home' },
  { path: '/study', icon: '📖', label: 'Study' },
  { path: '/assignments', icon: '📋', label: 'Tasks' },
  { path: '/timetable', icon: '📅', label: 'Schedule' },
  { path: '/settings', icon: '⚙️', label: 'More' },
] as const;

export function BottomNav() {
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur border-t border-slate-800 z-50 safe-area-pb"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors min-w-[60px] ${
                isActive ? 'text-brand-500' : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="text-xl" aria-hidden="true">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
