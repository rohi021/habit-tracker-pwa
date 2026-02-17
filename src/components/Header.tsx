import { useAppStore } from '../store/useAppStore';

const QUOTES = [
  "The secret of getting ahead is getting started. — Mark Twain",
  "It always seems impossible until it's done. — Nelson Mandela",
  "Education is the most powerful weapon. — Nelson Mandela",
  "The only way to do great work is to love what you do. — Steve Jobs",
  "Believe you can and you're halfway there. — Theodore Roosevelt",
  "Learning never exhausts the mind. — Leonardo da Vinci",
  "An investment in knowledge pays the best interest. — Benjamin Franklin",
  "The expert in anything was once a beginner. — Helen Hayes",
  "Small daily improvements over time lead to stunning results. — Robin Sharma",
  "Strive for progress, not perfection.",
];

export function Header() {
  const notifications = useAppStore((s) => s.notifications);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur border-b border-slate-800">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white">
            <span aria-hidden="true">🎓</span> StudentOS
          </h1>
          <p className="text-xs text-slate-400 italic max-w-xs truncate">{quote}</p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <span className="bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
