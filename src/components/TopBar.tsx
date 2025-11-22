import { useNavigate } from 'react-router';
import { Bell, Settings, User, LogOut } from 'lucide-react';
import { useAuth } from '../utils/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { ExpandableActionSearch } from './ExpandableActionSearch';

export function TopBar() {
  const navigate = useNavigate();
  const { logout, userEmail } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="h-14 border-b border-border bg-card flex items-center justify-between px-4 gap-4">
      {/* Search */}
      <ExpandableActionSearch />

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 rounded-md hover:bg-accent transition-colors">
              <Bell className="size-4" />
              <Badge className="absolute -top-1 -right-1 size-4 p-0 flex items-center justify-center text-[10px]">
                5
              </Badge>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <div className="font-medium">New urgent message</div>
                <div className="text-xs text-muted-foreground">
                  John Martinez replied to payment issue thread
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <div className="font-medium">Thread assigned to you</div>
                <div className="text-xs text-muted-foreground">
                  Lisa Anderson - Enterprise plan inquiry
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <div className="font-medium">SLA threshold reached</div>
                <div className="text-xs text-muted-foreground">
                  3 threads over 24h without reply
                </div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings */}
        <button
          onClick={() => navigate('/dashboard/settings/personal')}
          className="p-2 rounded-md hover:bg-accent transition-colors"
        >
          <Settings className="size-4" />
        </button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1 rounded-md hover:bg-accent transition-colors">
              <Avatar className="size-7">
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div>Sarah Chen</div>
              <div className="text-xs text-muted-foreground">{userEmail || 'sarah.chen@wondai.com'}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/dashboard/settings/personal')}>
              <User className="size-4 mr-2" />
              Personal Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/dashboard/settings/team')}>
              <User className="size-4 mr-2" />
              Team Overview
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="size-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}