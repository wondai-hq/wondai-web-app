import { useSearchParams } from 'react-router';
import { Search, Filter, Calendar, Paperclip, User, MessageSquare } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { ChannelIcon } from '../ChannelIcon';
import { EmptyState } from '../EmptyState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { mockThreads } from '../../utils/mockData';
import { formatDistanceToNow } from 'date-fns';

export function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  // Mock search results - in real app, would filter based on query
  const filteredThreads = query
    ? mockThreads.filter(
        (t) =>
          t.subject.toLowerCase().includes(query.toLowerCase()) ||
          t.customerName.toLowerCase().includes(query.toLowerCase()) ||
          t.lastMessage.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Search Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search messages, contacts, intents..."
                defaultValue={query}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="size-4 mr-2" />
              Filters
            </Button>
          </div>

          {query && (
            <div className="text-sm text-muted-foreground">
              Found {filteredThreads.length} results for "{query}"
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Filter by:</span>
          <Button variant="outline" size="sm">
            <Calendar className="size-3 mr-1" />
            Date
          </Button>
          <Button variant="outline" size="sm">
            <MessageSquare className="size-3 mr-1" />
            Channel
          </Button>
          <Button variant="outline" size="sm">
            <User className="size-3 mr-1" />
            Assigned
          </Button>
          <Button variant="outline" size="sm">
            Sentiment
          </Button>
        </div>

        {/* Results Tabs */}
        <Tabs defaultValue="messages" className="space-y-4">
          <TabsList>
            <TabsTrigger value="messages">
              Messages ({filteredThreads.length})
            </TabsTrigger>
            <TabsTrigger value="contacts">Contacts (0)</TabsTrigger>
            <TabsTrigger value="attachments">Attachments (0)</TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="space-y-3">
            {filteredThreads.length === 0 ? (
              <EmptyState
                type="search"
                title={query ? 'No results found' : 'Start searching'}
                description={query ? `No messages found for "${query}". Try different keywords.` : 'Enter a search query to find messages, contacts, and attachments.'}
              />
            ) : (
              filteredThreads.map((thread) => (
                <div
                  key={thread.id}
                  className="border border-border rounded-lg p-4 hover:bg-accent transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <Avatar className="size-10">
                      <AvatarFallback>
                        {thread.customerName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{thread.customerName}</span>
                        <ChannelIcon channel={thread.channel} className="size-3" />
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(thread.timestamp, { addSuffix: true })}
                        </span>
                      </div>
                      <div className="font-medium mb-1">{thread.subject}</div>
                      <div className="text-sm text-muted-foreground mb-3">
                        {thread.lastMessage}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {thread.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {thread.hasAttachments && (
                          <Badge variant="outline" className="text-xs">
                            <Paperclip className="size-3 mr-1" />
                            Attachments
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="contacts" className="text-center py-12 text-muted-foreground">
            No contacts found
          </TabsContent>

          <TabsContent value="attachments" className="text-center py-12 text-muted-foreground">
            No attachments found
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}