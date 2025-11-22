import { Inbox, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';

interface EmptyStateProps {
  type?: 'inbox' | 'search' | 'filtered' | 'completed';
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const emptyStates = {
  inbox: {
    icon: <Inbox className="size-16 text-muted-foreground/50" />,
    title: 'Inbox Zero!',
    description: 'All caught up! No messages to display.',
  },
  search: {
    icon: <Sparkles className="size-16 text-muted-foreground/50" />,
    title: 'No results found',
    description: 'Try adjusting your search terms or filters.',
  },
  filtered: {
    icon: <Inbox className="size-16 text-muted-foreground/50" />,
    title: 'No threads match this filter',
    description: 'Try selecting a different filter or clearing your filters.',
  },
  completed: {
    icon: <CheckCircle2 className="size-16 text-muted-foreground/50" />,
    title: 'Great work!',
    description: 'All threads in this view have been resolved.',
  },
};

export function EmptyState({ type = 'inbox', title, description, icon, action }: EmptyStateProps) {
  const state = emptyStates[type];

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="mb-4">{icon || state.icon}</div>
      <h3 className="mb-2">{title || state.title}</h3>
      <p className="text-muted-foreground max-w-md mb-6">{description || state.description}</p>
      {action && (
        <Button onClick={action.onClick} variant="outline">
          {action.label}
        </Button>
      )}
    </div>
  );
}
