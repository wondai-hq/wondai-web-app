import { useState } from 'react';
import { format } from 'date-fns';
import { ChannelIcon } from './ChannelIcon';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  MoreVertical,
  Star,
  Archive,
  Trash2,
  UserPlus,
  Tag,
  Paperclip,
  Send,
  Smile,
  Sparkles,
  Wand2,
  Languages,
  Zap,
  AlignLeft,
  Maximize2,
  Minimize2,
  Plus,
  PanelLeftOpen,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { cn } from '../lib/utils';
import type { Thread, Message } from '../utils/mockData';
import { mockTeamMembers } from '../utils/mockData';

interface ThreadViewProps {
  thread: Thread;
  messages: Message[];
  onShowAIPanel: () => void;
  onToggleThreadList?: () => void;
  showThreadListToggle?: boolean;
}

export function ThreadView({ thread, messages, onShowAIPanel, onToggleThreadList, showThreadListToggle = false }: ThreadViewProps) {
  const [replyText, setReplyText] = useState('');
  const [replyChannel, setReplyChannel] = useState<string>(thread.channel);
  const [assignedTo, setAssignedTo] = useState(thread.assignedTo || 'unassigned');
  const [aiPopoverOpen, setAiPopoverOpen] = useState(false);

  const handleSendReply = () => {
    if (replyText.trim()) {
      // Handle send reply
      setReplyText('');
    }
  };

  const handleAIPanelClick = () => {
    console.log('AI Panel button clicked!');
    onShowAIPanel();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="h-14 border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {showThreadListToggle && onToggleThreadList && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="size-8"
              onClick={onToggleThreadList}
            >
              <PanelLeftOpen className="size-4" />
            </Button>
          )}
          <Avatar className="size-8">
            <AvatarFallback>
              {thread.customerName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{thread.customerName}</div>
            <div className="text-xs text-muted-foreground">{thread.subject}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Assign to */}
          <Select value={assignedTo} onValueChange={setAssignedTo}>
            <SelectTrigger className="w-[160px] h-8">
              <SelectValue placeholder="Assign to..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {mockTeamMembers.map((member) => (
                <SelectItem key={member.id} value={member.name}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* AI Insights Button */}
          <Button variant="ghost" size="icon" className="size-8" onClick={handleAIPanelClick}>
            <Sparkles className="size-4" style={{ color: 'hsl(var(--ai))' }} />
          </Button>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Star className="size-4 mr-2" />
                Star thread
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Tag className="size-4 mr-2" />
                Add tags
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Archive className="size-4 mr-2" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="size-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tags bar */}
      <div className="border-b border-border px-4 py-2 flex items-center gap-2">
        {thread.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
        <Button variant="ghost" size="sm" className="h-6 px-2">
          <Tag className="size-3 mr-1" />
          Add tag
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex gap-3',
              message.isInternal && 'bg-yellow-50 border border-yellow-200 rounded-lg p-3 -mx-1'
            )}
          >
            <Avatar className="size-8 flex-shrink-0">
              <AvatarFallback>
                {message.sender
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{message.sender}</span>
                {message.isInternal && (
                  <Badge variant="outline" className="bg-yellow-100 border-yellow-300">
                    Internal Note
                  </Badge>
                )}
                <ChannelIcon channel={message.channel} className="size-3" />
                <span className="text-xs text-muted-foreground">
                  {format(message.timestamp, 'MMM d, h:mm a')}
                </span>
              </div>
              <div className="text-sm whitespace-pre-wrap">{message.content}</div>
              {message.attachments && message.attachments.length > 0 && (
                <div className="mt-2 flex gap-2">
                  {message.attachments.map((attachment, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-2 bg-accent rounded-md flex items-center gap-2 text-sm"
                    >
                      <Paperclip className="size-4" />
                      {attachment}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Reply composer */}
      <div className="border-t border-border p-4">
        {/* AI Assist Toolbar - Commented out, moved to inline dropdown */}
        {/* <div className="mb-3 flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground mr-1">AI Assist:</span>
          <Button variant="outline" size="sm" className="h-7 text-xs">
            <Wand2 className="size-3 mr-1.5" style={{ color: 'hsl(var(--ai))' }} />
            Draft Professional
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-xs">
            <Smile className="size-3 mr-1.5" style={{ color: 'hsl(var(--ai))' }} />
            Draft Casual
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-xs">
            <Zap className="size-3 mr-1.5" style={{ color: 'hsl(var(--ai))' }} />
            Summarize & Reply
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-xs">
            <Languages className="size-3 mr-1.5" style={{ color: 'hsl(var(--ai))' }} />
            Translate
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-xs">
            <Minimize2 className="size-3 mr-1.5" style={{ color: 'hsl(var(--ai))' }} />
            Shorten
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-xs">
            <Maximize2 className="size-3 mr-1.5" style={{ color: 'hsl(var(--ai))' }} />
            Expand
          </Button>
        </div> */}

        {/* Send Via Selector */}
        {/* Removed - moved to inline with send button */}

        <div className="relative">
          <Textarea
            placeholder="Type your reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="min-h-[100px] pr-24 resize-none"
          />
          <div className="absolute bottom-2 right-2 flex items-center gap-1">
            <Button variant="ghost" size="icon" className="size-8">
              <Paperclip className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" className="size-8">
              <Smile className="size-4" />
            </Button>
            {/* AI Assist Popover */}
            <Popover open={aiPopoverOpen} onOpenChange={setAiPopoverOpen}>
              <PopoverTrigger 
                className="inline-flex items-center justify-center size-8 rounded-md hover:bg-purple-100 hover:scale-110 transition-all"
                type="button"
              >
                <Sparkles className="size-4" style={{ color: 'hsl(var(--ai))' }} />
              </PopoverTrigger>
              <PopoverContent side="top" align="end" className="w-56 p-2 bg-white border shadow-lg">
                <div className="flex flex-col gap-1">
                  <Button variant="ghost" size="sm" className="justify-start h-8" onClick={() => console.log('Plus clicked')}>
                    <Plus className="size-4 mr-2" />
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start h-8">
                    <Wand2 className="size-4 mr-2" style={{ color: 'hsl(var(--ai))' }} />
                    Professional
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start h-8">
                    <Smile className="size-4 mr-2" style={{ color: 'hsl(var(--ai))' }} />
                    Casual
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start h-8">
                    <Zap className="size-4 mr-2" style={{ color: 'hsl(var(--ai))' }} />
                    Summarize
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start h-8">
                    <Languages className="size-4 mr-2" style={{ color: 'hsl(var(--ai))' }} />
                    Translate
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start h-8">
                    <Minimize2 className="size-4 mr-2" style={{ color: 'hsl(var(--ai))' }} />
                    Shorten
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start h-8">
                    <Maximize2 className="size-4 mr-2" style={{ color: 'hsl(var(--ai))' }} />
                    Expand
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {/* Send controls - channel selector + send button */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Send via:</span>
            <Select value={replyChannel} onValueChange={setReplyChannel}>
              <SelectTrigger className="w-[140px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="whatsapp">
                  <div className="flex items-center gap-2">
                    <ChannelIcon channel="whatsapp" className="size-3" />
                    WhatsApp
                  </div>
                </SelectItem>
                <SelectItem value="email">
                  <div className="flex items-center gap-2">
                    <ChannelIcon channel="email" className="size-3" />
                    Email
                  </div>
                </SelectItem>
                <SelectItem value="telegram">
                  <div className="flex items-center gap-2">
                    <ChannelIcon channel="telegram" className="size-3" />
                    Telegram
                  </div>
                </SelectItem>
                <SelectItem value="sms">
                  <div className="flex items-center gap-2">
                    <ChannelIcon channel="sms" className="size-3" />
                    SMS
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button size="sm" onClick={handleSendReply} disabled={!replyText.trim()}>
            <Send className="size-4 mr-1.5" />
            Send Reply
          </Button>
        </div>
      </div>
    </div>
  );
}