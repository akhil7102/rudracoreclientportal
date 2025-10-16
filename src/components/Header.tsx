import { LogOut, User, UserCircle } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface HeaderProps {
  userName?: string;
  userEmail?: string;
  onSignOut: () => void;
  onProfileClick?: () => void;
}

export function Header({ userName, userEmail, onSignOut, onProfileClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-cyan-500/20 bg-card/50 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/50">
            <span className="text-white">R</span>
          </div>
          <h1 className="text-xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">RudraCore</h1>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm ring-offset-background transition-colors hover:bg-cyan-500/10 hover:text-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="hidden sm:inline text-gray-300">{userName || 'User'}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-xl border-cyan-500/30">
            <DropdownMenuLabel>
              <div>
                <p className="text-gray-200">{userName || 'User'}</p>
                <p className="text-xs text-gray-400">{userEmail}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-cyan-500/20" />
            {onProfileClick && (
              <DropdownMenuItem onClick={onProfileClick} className="cursor-pointer text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-400">
                <UserCircle className="w-4 h-4 mr-2" />
                View Profile
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={onSignOut} className="text-red-400 cursor-pointer hover:bg-red-500/10">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}