import { LayoutDashboard, Briefcase, ShoppingCart, Headphones, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import logoImage from 'figma:asset/e94e31d557b531bbff850d12750a11fe68edae35.png';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onSignOut: () => void;
  userName?: string;
}

export function Sidebar({ currentPage, onNavigate, onSignOut, userName }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'my-orders', label: 'My Orders', icon: ShoppingCart },
    { id: 'support', label: 'Support', icon: Headphones },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="hidden lg:flex fixed left-0 top-0 h-screen w-64 backdrop-blur-xl bg-sidebar border-r border-sidebar-border z-40 flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg shadow-purple-500/50 ring-2 ring-purple-500/30">
            <img src={logoImage} alt="RudraCore" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-white">RudraCore</h2>
            <p className="text-xs text-gray-400">Client Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-lg shadow-purple-500/20'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Info */}
      {userName && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">{userName.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">Welcome back 👋</p>
              <p className="text-xs text-gray-400 truncate">{userName}</p>
            </div>
          </div>
        </div>
      )}

      {/* Sign Out */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          onClick={onSignOut}
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-400 hover:text-white hover:bg-sidebar-accent/50"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
