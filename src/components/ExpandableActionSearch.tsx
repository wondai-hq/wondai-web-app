import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Search, MessageSquare, UserPlus, Users, Zap, Clock, FileText, Settings, CornerDownLeft } from 'lucide-react';
import { Input } from './ui/input';
import { cn } from '../lib/utils';

interface SearchSuggestion {
  id: string;
  icon: any;
  title: string;
  description: string;
  action: () => void;
  shortcut?: string;
}

export function ExpandableActionSearch() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get filtered suggestions based on search query
  const getSuggestions = (): SearchSuggestion[] => {
    const query = searchQuery.toLowerCase().trim();

    const allSuggestions: SearchSuggestion[] = [
      {
        id: 'send-message',
        icon: MessageSquare,
        title: 'Send message',
        description: 'Quick action',
        action: () => {
          console.log('Send message');
          setIsExpanded(false);
          setSearchQuery('');
        },
      },
      {
        id: 'scheduled-send',
        icon: Clock,
        title: 'Scheduled send',
        description: 'Open settings',
        action: () => {
          navigate('/dashboard/settings/personal');
          setIsExpanded(false);
          setSearchQuery('');
        },
      },
      {
        id: 'create-contact',
        icon: UserPlus,
        title: 'Create new contact',
        description: 'Quick action',
        action: () => {
          console.log('Create new contact');
          setIsExpanded(false);
          setSearchQuery('');
        },
      },
      {
        id: 'import-contacts',
        icon: Users,
        title: 'Import contacts',
        description: 'Go to settings',
        action: () => {
          navigate('/dashboard/settings/team');
          setIsExpanded(false);
          setSearchQuery('');
        },
      },
      {
        id: 'create-intent',
        icon: Zap,
        title: 'Create new intent',
        description: 'Start workflow',
        action: () => {
          console.log('Create new intent');
          setIsExpanded(false);
          setSearchQuery('');
        },
      },
      {
        id: 'view-intent-logs',
        icon: FileText,
        title: 'View intent logs',
        description: 'See history',
        action: () => {
          navigate('/dashboard/audit-logs');
          setIsExpanded(false);
          setSearchQuery('');
        },
      },
      {
        id: 'search-messages',
        icon: Search,
        title: `Search messages for "${searchQuery}"`,
        description: 'Full text search',
        action: () => {
          if (searchQuery.trim()) {
            navigate(`/dashboard/search?q=${encodeURIComponent(searchQuery)}`);
            setIsExpanded(false);
            setSearchQuery('');
          }
        },
      },
      {
        id: 'integrations',
        icon: Settings,
        title: 'Manage integrations',
        description: 'Connect channels',
        action: () => {
          navigate('/dashboard/integrations');
          setIsExpanded(false);
          setSearchQuery('');
        },
      },
    ];

    if (!query) {
      // Show most common actions when no query
      return allSuggestions.slice(0, 5);
    }

    // Filter suggestions based on query
    return allSuggestions.filter(
      (suggestion) =>
        suggestion.title.toLowerCase().includes(query) ||
        suggestion.description.toLowerCase().includes(query)
    );
  };

  const suggestions = getSuggestions();

  // Handle expand
  const handleExpand = () => {
    setIsExpanded(true);
    setSelectedIndex(0);
  };

  // Handle collapse
  const handleCollapse = () => {
    setIsExpanded(false);
    setSearchQuery('');
    setSelectedIndex(0);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isExpanded) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleExpand();
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        handleCollapse();
        inputRef.current?.blur();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % suggestions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (suggestions[selectedIndex]) {
          suggestions[selectedIndex].action();
        }
        break;
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isExpanded &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        handleCollapse();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded]);

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Prevent body scroll when expanded
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isExpanded]);

  return (
    <>
      {/* Overlay */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 animate-in fade-in duration-200"
          onClick={handleCollapse}
        />
      )}

      {/* Search Container */}
      <div
        ref={containerRef}
        className={cn(
          'transition-all duration-300 ease-out',
          isExpanded
            ? 'fixed left-1/2 -translate-x-1/2 top-20 w-full max-w-2xl z-50'
            : 'flex-1 max-w-xl relative'
        )}
      >
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground z-10" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search messages, contacts, intents…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleExpand}
            onKeyDown={handleKeyDown}
            className={cn(
              'pl-10 transition-all duration-300',
              isExpanded ? 'h-12 text-base' : 'h-9'
            )}
          />
        </div>

        {/* Suggestions Dropdown */}
        {isExpanded && suggestions.length > 0 && (
          <div className="mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden animate-in slide-in-from-top-2 duration-200">
            <div className="max-h-[400px] overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.id}
                  onClick={() => suggestion.action()}
                  className={cn(
                    'w-full px-4 py-3 flex items-center gap-3 transition-colors',
                    'hover:bg-accent focus:bg-accent focus:outline-none',
                    index === selectedIndex && 'bg-accent'
                  )}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div
                    className={cn(
                      'size-9 rounded-md flex items-center justify-center flex-shrink-0',
                      index === selectedIndex ? 'bg-primary/10' : 'bg-muted'
                    )}
                  >
                    <suggestion.icon
                      className={cn(
                        'size-4',
                        index === selectedIndex ? 'text-primary' : 'text-muted-foreground'
                      )}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{suggestion.title}</div>
                    <div className="text-xs text-muted-foreground">{suggestion.description}</div>
                  </div>
                  {index === selectedIndex && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CornerDownLeft className="size-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Footer hint */}
            <div className="px-4 py-2 bg-muted/50 border-t border-border">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-background border border-border">↑</kbd>
                    <kbd className="px-1.5 py-0.5 rounded bg-background border border-border">↓</kbd>
                    to navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-background border border-border">↵</kbd>
                    to select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-background border border-border">esc</kbd>
                    to close
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
