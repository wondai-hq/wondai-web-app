import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Archive, Reply, Star, Pin, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { ChannelIcon } from '../ChannelIcon';
import { cn } from '../../lib/utils';
import { mockThreads, mockMessages } from '../../utils/mockData';

type ViewMode = 'focused' | 'others';

export function UpNext() {
  const [viewMode, setViewMode] = useState<ViewMode>('focused');
  const [processedIds, setProcessedIds] = useState<Set<string>>(new Set());

  // Filter threads based on view mode
  const getFilteredThreads = () => {
    const unprocessed = mockThreads.filter(t => !processedIds.has(t.id));
    
    if (viewMode === 'focused') {
      // Priority-based: urgent, high priority, or tagged with important categories
      return unprocessed.filter(t => 
        t.priority === 'urgent' || 
        t.priority === 'high' ||
        t.tags.some(tag => ['complaint', 'payment-issue', 'vip'].includes(tag))
      );
    } else {
      // Others: Easy to handle - low priority, simple queries, short threads
      return unprocessed.filter(t => 
        (t.priority === 'low' || t.priority === 'medium') &&
        t.messageCount <= 3 &&
        !t.tags.some(tag => ['complaint', 'payment-issue'].includes(tag))
      );
    }
  };

  const availableThreads = getFilteredThreads();
  const currentThread = availableThreads[0];
  const currentMessages = currentThread ? mockMessages[currentThread.id] || [] : [];
  const latestMessage = currentMessages[currentMessages.length - 1];

  const handleAction = (action: 'archive' | 'reply' | 'star' | 'pin') => {
    if (!currentThread) return;
    
    console.log(`Action: ${action} on thread ${currentThread.id}`);
    
    // Mark as processed and move to next
    setProcessedIds(prev => new Set([...prev, currentThread.id]));
  };

  const getPriorityColor = (priority: typeof currentThread.priority) => {
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

  // Show completion state when all messages are processed
  if (!currentThread || availableThreads.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <div className="text-center max-w-md">
          <div className="mb-4 inline-flex items-center justify-center size-16 rounded-full bg-accent">
            <Sparkles className="size-8 text-primary" />
          </div>
          <h2 className="mb-2">All caught up!</h2>
          <p className="text-muted-foreground">
            You've handled all priority messages. Great work! Check back later for new items.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Main Message Display */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background">
        <div className="w-full max-w-3xl">
          {/* Progress Indicator */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                {processedIds.size} handled · {availableThreads.length} remaining
              </span>
            </div>
            
            {/* View Mode Toggle */}
            <div className="inline-flex items-center rounded-lg border border-border bg-card p-1">
              <button
                onClick={() => setViewMode('focused')}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-md transition-colors",
                  viewMode === 'focused' 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Focused
              </button>
              <button
                onClick={() => setViewMode('others')}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-md transition-colors",
                  viewMode === 'others' 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Others
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <div
                className="size-2 rounded-full"
                style={{ backgroundColor: getPriorityColor(currentThread.priority) }}
              />
              <span className="text-sm capitalize text-muted-foreground">{currentThread.priority} priority</span>
            </div>
          </div>

          {/* Message Card */}
          <div className="bg-card border border-border rounded-lg shadow-sm mb-6">
            {/* Header */}
            <div className="border-b border-border p-6">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="size-12">
                  <AvatarFallback>
                    {currentThread.customerName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{currentThread.customerName}</span>
                    <ChannelIcon channel={currentThread.channel} className="size-4" />
                    {currentThread.assignedTo && (
                      <Badge variant="secondary" className="text-xs">
                        @{currentThread.assignedTo}
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {currentThread.subject}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDistanceToNow(currentThread.timestamp, { addSuffix: true })}
                </span>
              </div>

              {/* Tags */}
              {currentThread.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {currentThread.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Message Content */}
            <div className="p-6">
              <div className="prose prose-sm max-w-none">
                {latestMessage ? latestMessage.content : currentThread.lastMessage}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-border p-6 bg-accent/30">
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => handleAction('archive')}
                  variant="outline"
                  className="flex-1"
                >
                  <Archive className="size-4 mr-2" />
                  Archive
                </Button>
                <Button
                  onClick={() => handleAction('reply')}
                  className="flex-1"
                >
                  <Reply className="size-4 mr-2" />
                  Reply
                </Button>
                <Button
                  onClick={() => handleAction('star')}
                  variant="outline"
                  size="icon"
                >
                  <Star className="size-4" />
                </Button>
                <Button
                  onClick={() => handleAction('pin')}
                  variant="outline"
                  size="icon"
                >
                  <Pin className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Skip Button */}
          <div className="text-center">
            <Button
              onClick={() => handleAction('archive')}
              variant="ghost"
              size="sm"
            >
              Skip for now
              <ChevronRight className="size-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Wanda's AI Insights Panel */}
      <div className="w-[380px] border-l border-border bg-card p-6 overflow-y-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="size-5" style={{ color: 'hsl(var(--ai))' }} />
            <h3 className="font-medium">Wanda's Insights</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            {viewMode === 'focused' 
              ? "Here's what you need to know to handle this message effectively:"
              : "Quick wins! This should be easy to handle:"}
          </p>
        </div>

        {/* Quick Context */}
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2">Quick Context</h4>
          <div className="space-y-2 text-sm">
            <div className="p-3 bg-accent/50 rounded-md">
              <span className="text-muted-foreground">Customer has been waiting </span>
              <span className="font-medium">
                {formatDistanceToNow(currentThread.timestamp)}
              </span>
            </div>
            {currentThread.messageCount > 1 && (
              <div className="p-3 bg-accent/50 rounded-md">
                <span className="text-muted-foreground">Thread contains </span>
                <span className="font-medium">{currentThread.messageCount} messages</span>
              </div>
            )}
          </div>
        </div>

        {/* Suggested Action */}
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2">Suggested Action</h4>
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-md">
            <p className="text-sm mb-3">
              This appears to be a {currentThread.tags[0] || 'customer inquiry'}. Consider:
            </p>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>• Acknowledge receipt and show empathy</li>
              <li>• Provide a clear timeline for resolution</li>
              <li>• Ask clarifying questions if needed</li>
            </ul>
          </div>
        </div>

        {/* Conversation History Summary */}
        {currentMessages.length > 1 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-2">Conversation Summary</h4>
            <div className="space-y-2">
              {currentMessages.slice(0, -1).reverse().slice(0, 3).map((msg, idx) => (
                <div key={idx} className="p-3 bg-accent/30 rounded-md text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      "text-xs",
                      msg.sender.type === 'customer' ? 'text-muted-foreground' : 'text-primary'
                    )}>
                      {msg.sender.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(msg.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-muted-foreground line-clamp-2">{msg.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Potential Blockers */}
        <div>
          <h4 className="text-sm font-medium mb-2">Potential Blockers</h4>
          <div className="p-4 bg-accent/30 rounded-md">
            <p className="text-sm text-muted-foreground">
              {currentThread.priority === 'urgent' 
                ? "Time-sensitive: This customer needs immediate attention to prevent escalation."
                : "Take your time to provide a thoughtful, complete response. Quality matters more than speed here."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}