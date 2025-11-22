import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { GripVertical, Sparkles, X, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { cn } from '../lib/utils';

export interface SmartFilter {
  id: string;
  description: string;
}

interface CreateFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (feed: { name: string; description: string; smartFilters: SmartFilter[] }) => void;
}

interface SuggestionBubble {
  id: string;
  name: string;
  description: string;
  smartFilters: SmartFilter[];
  estimatedThreads: number;
}

const aiSuggestions: SuggestionBubble[] = [
  {
    id: 'shipping-delays',
    name: 'Shipping Delays',
    description: 'Messages mentioning late deliveries, tracking issues, or shipping delays',
    estimatedThreads: 18,
    smartFilters: [
      { id: 'f1', description: 'Messages containing keywords: "late", "delayed", "tracking", "where is my order"' },
      { id: 'f2', description: 'Negative sentiment combined with shipping-related terms' },
      { id: 'f3', description: 'Messages with unanswered questions about delivery status' },
    ],
  },
  {
    id: 'pricing-inquiries',
    name: 'Pricing Inquiries',
    description: 'Questions about costs, discounts, and pricing plans',
    estimatedThreads: 24,
    smartFilters: [
      { id: 'f1', description: 'Messages containing: "price", "cost", "discount", "how much"' },
      { id: 'f2', description: 'Questions about plan comparisons and upgrades' },
      { id: 'f3', description: 'Requests for quotes or custom pricing' },
    ],
  },
  {
    id: 'feature-requests',
    name: 'Feature Requests',
    description: 'Customer suggestions and requests for new features',
    estimatedThreads: 31,
    smartFilters: [
      { id: 'f1', description: 'Messages containing: "feature", "suggestion", "would be great if", "add support for"' },
      { id: 'f2', description: 'Positive sentiment with future-oriented language' },
      { id: 'f3', description: 'Comparison with competitors\' features' },
    ],
  },
  {
    id: 'onboarding-help',
    name: 'Onboarding Help',
    description: 'New customers needing help getting started',
    estimatedThreads: 15,
    smartFilters: [
      { id: 'f1', description: 'Messages from customers with accounts less than 7 days old' },
      { id: 'f2', description: 'Questions containing: "how do I", "getting started", "setup", "first time"' },
      { id: 'f3', description: 'Multiple questions in a single thread' },
    ],
  },
  {
    id: 'cancellation-risk',
    name: 'Cancellation Risk',
    description: 'Customers showing signs they might cancel or leave',
    estimatedThreads: 9,
    smartFilters: [
      { id: 'f1', description: 'Messages mentioning: "cancel", "unsubscribe", "not satisfied", "disappointed"' },
      { id: 'f2', description: 'Negative sentiment with mentions of competitors' },
      { id: 'f3', description: 'Repeated unresolved issues in thread history' },
    ],
  },
  {
    id: 'integration-issues',
    name: 'Integration Issues',
    description: 'Problems with third-party integrations and API connections',
    estimatedThreads: 12,
    smartFilters: [
      { id: 'f1', description: 'Messages containing: "integration", "API", "sync", "connection failed"' },
      { id: 'f2', description: 'Error codes or technical error messages' },
      { id: 'f3', description: 'Mentions of third-party service names (Zapier, Slack, etc.)' },
    ],
  },
];

interface DraggableFilterCardProps {
  filter: SmartFilter;
  index: number;
  moveFilter: (fromIndex: number, toIndex: number) => void;
  onEdit: (id: string, description: string) => void;
  onDelete: (id: string) => void;
}

function DraggableFilterCard({ filter, index, moveFilter, onEdit, onDelete }: DraggableFilterCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(filter.description);

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'FILTER',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'FILTER',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveFilter(item.index, index);
        item.index = index;
      }
    },
  });

  const handleSave = () => {
    onEdit(filter.id, editValue);
    setIsEditing(false);
  };

  return (
    <div ref={(node) => preview(drop(node))} className={cn('relative', isDragging && 'opacity-50')}>
      <Card className="p-3 border border-slate-200">
        <div className="flex items-start gap-2">
          <div ref={drag} className="cursor-move mt-1">
            <GripVertical className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="text-sm resize-none"
                  rows={2}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave}>
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditValue(filter.description);
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p
                className="text-sm text-slate-600 cursor-pointer hover:text-slate-900"
                onClick={() => setIsEditing(true)}
              >
                {filter.description}
              </p>
            )}
          </div>
          <button
            onClick={() => onDelete(filter.id)}
            className="p-1 hover:bg-slate-100 rounded transition-colors"
            aria-label="Delete filter"
          >
            <X className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </Card>
    </div>
  );
}

export function CreateFeedModal({ isOpen, onClose, onCreate }: CreateFeedModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [smartFilters, setSmartFilters] = useState<SmartFilter[]>([]);
  const [isSuggestionsExpanded, setIsSuggestionsExpanded] = useState(true);
  const [chatInput, setChatInput] = useState('');

  const handleSuggestionClick = (suggestion: SuggestionBubble) => {
    setName(suggestion.name);
    setDescription(suggestion.description);
    setSmartFilters(suggestion.smartFilters);
    setIsSuggestionsExpanded(false);
  };

  const handleFormInput = () => {
    if (isSuggestionsExpanded) {
      setIsSuggestionsExpanded(false);
    }
  };

  const handleSendChat = () => {
    if (chatInput.trim()) {
      // TODO: Process AI request to generate feed structure
      // For now, just close suggestions
      setIsSuggestionsExpanded(false);
    }
  };

  const handleChatKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendChat();
    }
  };

  const handleReset = () => {
    setName('');
    setDescription('');
    setSmartFilters([]);
    setChatInput('');
    setIsSuggestionsExpanded(true);
  };

  const handleCreate = () => {
    if (onCreate && name && description && smartFilters.length > 0) {
      onCreate({ name, description, smartFilters });
      handleReset();
      onClose();
    }
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const moveFilter = (fromIndex: number, toIndex: number) => {
    const updatedFilters = [...smartFilters];
    const [movedFilter] = updatedFilters.splice(fromIndex, 1);
    updatedFilters.splice(toIndex, 0, movedFilter);
    setSmartFilters(updatedFilters);
  };

  const handleEditFilter = (id: string, newDescription: string) => {
    setSmartFilters(smartFilters.map((f) => (f.id === id ? { ...f, description: newDescription } : f)));
  };

  const handleDeleteFilter = (id: string) => {
    setSmartFilters(smartFilters.filter((f) => f.id !== id));
  };

  const handleAddFilter = () => {
    const newFilter: SmartFilter = {
      id: `f${Date.now()}`,
      description: 'New filter criteria...',
    };
    setSmartFilters([...smartFilters, newFilter]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="!max-w-6xl">
        <DialogHeader>
          <DialogTitle>Create New Feed</DialogTitle>
          <DialogDescription>
            Use AI suggestions or describe your feed in plain language to get started
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* AI Suggestions Collapsible with Border */}
          <div className="border border-slate-200 rounded-lg">
            <Collapsible open={isSuggestionsExpanded} onOpenChange={setIsSuggestionsExpanded}>
              <CollapsibleTrigger asChild>
                <button className="flex items-center justify-between w-full p-3 hover:bg-purple-50/30 transition-all group rounded-t-lg">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" style={{ color: 'hsl(var(--ai))' }} />
                    <span className="font-medium text-sm">AI-Powered Suggestions</span>
                    <Badge variant="secondary" className="text-xs">
                      {aiSuggestions.length} templates
                    </Badge>
                  </div>
                  {isSuggestionsExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              </CollapsibleTrigger>

              {/* Chat Input - Always visible */}
              <div className="px-3 pb-3">
                <div className="flex gap-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => {
                      setChatInput(e.target.value);
                      handleFormInput();
                    }}
                    onKeyDown={handleChatKeyDown}
                    placeholder="Describe the new feed and its meaning..."
                    className="bg-slate-50 border-slate-200 focus:bg-white"
                  />
                  <Button 
                    size="icon"
                    onClick={handleSendChat}
                    disabled={!chatInput.trim()}
                    className="shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <CollapsibleContent>
                <div className="px-3 pb-3">
                  <div className="grid grid-cols-3 gap-3">
                    {aiSuggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-left p-3 border border-slate-200 rounded-lg hover:border-purple-300 hover:bg-purple-50/50 transition-all group"
                      >
                        <div className="font-medium text-sm mb-1 group-hover:text-purple-700">{suggestion.name}</div>
                        <div className="text-xs text-slate-500 mb-2 line-clamp-2">{suggestion.description}</div>
                        <Badge variant="secondary" className="text-xs">
                          ~{suggestion.estimatedThreads} threads
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Feed Name */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Feed Name</label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                handleFormInput();
              }}
              placeholder="e.g., Shipping Delays"
            />
          </div>

          {/* Feed Description */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Description</label>
            <Textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                handleFormInput();
              }}
              placeholder="Describe what this feed captures..."
              rows={2}
            />
          </div>

          {/* Smart Filters */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-medium text-sm">Smart Filters</h3>
                <p className="text-xs text-slate-500">
                  Define the criteria that determine which threads appear in this feed
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={handleAddFilter}>
                Add Filter
              </Button>
            </div>

            {smartFilters.length > 0 ? (
              <DndProvider backend={HTML5Backend}>
                <div className="space-y-2">
                  {smartFilters.map((filter, index) => (
                    <DraggableFilterCard
                      key={filter.id}
                      filter={filter}
                      index={index}
                      moveFilter={moveFilter}
                      onEdit={handleEditFilter}
                      onDelete={handleDeleteFilter}
                    />
                  ))}
                </div>
              </DndProvider>
            ) : (
              <div className="text-center py-8 border border-dashed border-slate-200 rounded-lg">
                <p className="text-sm text-slate-500">No filters added yet</p>
                <p className="text-xs text-slate-400 mt-1">Click "Add Filter" to define your first criteria</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="ghost" onClick={handleReset}>
              Start Over
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreate}
                disabled={!name || !description || smartFilters.length === 0}
              >
                Create Feed
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}