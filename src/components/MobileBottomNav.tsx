import { LayoutDashboard, Briefcase, ShoppingCart, Headphones, User } from 'lucide-react';

interface MobileBottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function MobileBottomNav({ currentPage, onNavigate }: MobileBottomNavProps) {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'my-orders', label: 'Orders', icon: ShoppingCart },
    { id: 'support', label: 'Support', icon: Headphones },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 h-20 backdrop-blur-xl bg-sidebar border-t border-sidebar-border z-30">
      <div className="flex items-center justify-around h-full px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all ${
                isActive
                  ? 'text-purple-400'
                  : 'text-gray-400'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'text-purple-400' : 'text-gray-400'}`} />
              <span className={`text-xs ${isActive ? 'text-purple-400' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
