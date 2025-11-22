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
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { GripVertical, Pencil } from 'lucide-react';
import { ChannelIcon } from './ChannelIcon';
import { cn } from '../lib/utils';
import type { Thread } from '../utils/mockData';

export interface SmartFilter {
  id: string;
  description: string;
}

export interface FeedDetails {
  id: string;
  name: string;
  description: string;
  smartFilters: SmartFilter[];
  examples: {
    leastLikely: Thread;
    average: Thread;
    mostLikely: Thread;
  };
  threadCount: number;
}

interface FeedDetailsModalProps {
  feed: FeedDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (feed: FeedDetails) => void;
}

interface DraggableFilterCardProps {
  filter: SmartFilter;
  index: number;
  moveFilter: (fromIndex: number, toIndex: number) => void;
  onEdit: (id: string, description: string) => void;
}

const ITEM_TYPE = 'FILTER_CARD';

function DraggableFilterCard({ filter, index, moveFilter, onEdit }: DraggableFilterCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(filter.description);

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(filter.description);
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={cn(
        'flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-move',
        isDragging && 'opacity-50'
      )}
    >
      <GripVertical className="size-4 text-slate-400 mt-0.5 flex-shrink-0" />
      {isEditing ? (
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="flex-1 h-auto py-1 px-2 text-sm"
          autoFocus
        />
      ) : (
        <div className="flex-1 flex items-start gap-2 group">
          <p className="text-sm text-slate-700 flex-1">{filter.description}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Pencil className="size-3 text-slate-400 hover:text-slate-600" />
          </button>
        </div>
      )}
    </div>
  );
}

function ThreadPreviewCard({ thread, label }: { thread: Thread; label: string }) {
  return (
    <div className="flex-1 min-w-0">
      <div className="text-xs text-slate-500 mb-2">{label}</div>
      <Card className="border-slate-200">
        <CardContent className="p-3 space-y-2">
          <div className="flex items-start gap-2">
            <ChannelIcon channel={thread.channel} className="size-4 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{thread.subject}</div>
              <div className="text-xs text-slate-600 truncate">{thread.customerName}</div>
            </div>
          </div>
          <p className="text-xs text-slate-500 line-clamp-2">{thread.lastMessage}</p>
          <div className="flex flex-wrap gap-1">
            {thread.tags.slice(0, 2).map((tag, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs py-0 px-1.5">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function FeedDetailsModal({ feed, isOpen, onClose, onUpdate }: FeedDetailsModalProps) {
  const [editableFeed, setEditableFeed] = useState<FeedDetails | null>(feed);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  // Update local state when feed prop changes
  if (feed && editableFeed?.id !== feed.id) {
    setEditableFeed(feed);
  }

  if (!editableFeed) return null;

  const handleTitleChange = (value: string) => {
    const updated = { ...editableFeed, name: value };
    setEditableFeed(updated);
    onUpdate?.(updated);
  };

  const handleDescriptionChange = (value: string) => {
    const updated = { ...editableFeed, description: value };
    setEditableFeed(updated);
    onUpdate?.(updated);
  };

  const handleFilterEdit = (id: string, description: string) => {
    const updated = {
      ...editableFeed,
      smartFilters: editableFeed.smartFilters.map((f) =>
        f.id === id ? { ...f, description } : f
      ),
    };
    setEditableFeed(updated);
    onUpdate?.(updated);
  };

  const moveFilter = (fromIndex: number, toIndex: number) => {
    const newFilters = [...editableFeed.smartFilters];
    const [moved] = newFilters.splice(fromIndex, 1);
    newFilters.splice(toIndex, 0, moved);
    const updated = { ...editableFeed, smartFilters: newFilters };
    setEditableFeed(updated);
    onUpdate?.(updated);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="!max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle asChild>
            {/* Inline-editable Title */}
            {isEditingTitle ? (
              <Input
                value={editableFeed.name}
                onChange={(e) => handleTitleChange(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setIsEditingTitle(false);
                  if (e.key === 'Escape') setIsEditingTitle(false);
                }}
                className="text-lg font-semibold"
                autoFocus
              />
            ) : (
              <div
                className="flex items-center gap-2 group cursor-pointer"
                onClick={() => setIsEditingTitle(true)}
              >
                <h2 className="text-lg font-semibold">{editableFeed.name}</h2>
                <Pencil className="size-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
          </DialogTitle>
          <DialogDescription>
            {editableFeed.threadCount} threads
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Description */}
          <div>
            <h3 className="font-medium mb-2">Description</h3>
            {isEditingDescription ? (
              <Textarea
                value={editableFeed.description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                onBlur={() => setIsEditingDescription(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setIsEditingDescription(false);
                }}
                className="text-sm resize-none"
                rows={2}
                autoFocus
              />
            ) : (
              <div
                className="text-sm text-slate-600 p-2 rounded hover:bg-slate-50 cursor-pointer group"
                onClick={() => setIsEditingDescription(true)}
              >
                <span>{editableFeed.description}</span>
                <Pencil className="size-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity inline-block ml-2" />
              </div>
            )}
          </div>

          {/* Smart Filters */}
          <div>
            <h3 className="font-medium mb-1">Smart Filters</h3>
            <p className="text-xs text-slate-500 mb-3">
              Criteria that define this feed's meaning
            </p>
            <DndProvider backend={HTML5Backend}>
              <div className="space-y-2">
                {editableFeed.smartFilters.map((filter, index) => (
                  <DraggableFilterCard
                    key={filter.id}
                    filter={filter}
                    index={index}
                    moveFilter={moveFilter}
                    onEdit={handleFilterEdit}
                  />
                ))}
              </div>
            </DndProvider>
          </div>

          {/* Examples */}
          <div>
            <h3 className="font-medium mb-1">Examples</h3>
            <p className="text-xs text-slate-500 mb-3">
              Least likely to most likely messages matched by your current filters
            </p>
            <div className="flex gap-4">
              <ThreadPreviewCard
                thread={editableFeed.examples.leastLikely}
                label="Least Likely"
              />
              <ThreadPreviewCard
                thread={editableFeed.examples.average}
                label="Average"
              />
              <ThreadPreviewCard
                thread={editableFeed.examples.mostLikely}
                label="Most Likely"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}