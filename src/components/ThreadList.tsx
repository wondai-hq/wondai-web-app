import { formatDistanceToNow } from 'date-fns';
import { useNavigate, useParams } from 'react-router';
import { ChannelIcon } from './ChannelIcon';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { EmptyState } from './EmptyState';
import { Button } from './ui/button';
import { Paperclip, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import type { Thread } from '../utils/mockData';

interface ThreadListProps {
  threads: Thread[];
  selectedThreadId?: string;
  onSelectThread: (threadId: string) => void;
  feedName?: string;
}

export function ThreadList({ threads, selectedThreadId, onSelectThread, feedName = 'Inbox' }: ThreadListProps) {
  const navigate = useNavigate();
  const { filter, channel, contactId } = useParams<{ filter?: string; channel?: string; contactId?: string }>();

  const handleSummaryClick = () => {
    if (contactId) {
      navigate(`/dashboard/contact/${contactId}/summary`);
    } else if (channel) {
      navigate(`/dashboard/channel/${channel}/summary`);
    } else if (filter) {
      navigate(`/dashboard/inbox/${filter}/summary`);
    } else {
      navigate('/dashboard/inbox/summary');
    }
  };

  const getPriorityColor = (priority: Thread['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'hsl(var(--urgent))';
      case 'high':
        return 'hsl(45 93% 47%)';
      case 'medium':
        return 'hsl(210 100% 50%)';
      case 'low':
        return 'hsl(240 5% 64.9%)';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="h-14 border-b border-border flex items-center justify-between px-4">
        <h2 className="font-semibold">{feedName}</h2>
        <div className="flex items-center gap-2">
          <select className="text-sm border border-input rounded px-2 py-1">
            <option>Newest first</option>
            <option>Priority</option>
            <option>Unread</option>
          </select>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={handleSummaryClick}
          >
            <Sparkles className="size-4" style={{ color: 'hsl(var(--ai))' }} />
          </Button>
        </div>
      </div>

      {/* Thread list */}
      <div className="flex-1 overflow-y-auto">
        {threads.length > 0 ? (
          threads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => onSelectThread(thread.id)}
              className={cn(
                'border-b border-border px-4 py-3 cursor-pointer transition-colors hover:bg-accent/50',
                selectedThreadId === thread.id && 'bg-accent',
                thread.unread && 'bg-accent/30'
              )}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <Avatar className="size-10 flex-shrink-0">
                  <AvatarFallback>
                    {thread.customerName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={cn('font-medium truncate', thread.unread && 'font-semibold')}>
                        {thread.customerName}
                      </span>
                      <ChannelIcon channel={thread.channel} className="size-3 flex-shrink-0" />
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(thread.timestamp, { addSuffix: true })}
                    </span>
                  </div>

                  <div className="text-sm text-muted-foreground mb-1 truncate">{thread.subject}</div>

                  <div className="text-sm mb-2 truncate">{thread.lastMessage}</div>

                  {/* Tags and metadata */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Priority indicator */}
                    <div
                      className="size-2 rounded-full"
                      style={{ backgroundColor: getPriorityColor(thread.priority) }}
                    />

                    {thread.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0">
                        {tag}
                      </Badge>
                    ))}

                    {thread.assignedTo && (
                      <span className="text-xs text-muted-foreground">@{thread.assignedTo}</span>
                    )}

                    {thread.hasAttachments && <Paperclip className="size-3 text-muted-foreground" />}

                    <span className="text-xs text-muted-foreground">{thread.messageCount} msgs</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            title="No threads found"
            description="There are no threads to display. Try creating a new thread or checking back later."
          />
        )}
      </div>
    </div>
  );
}