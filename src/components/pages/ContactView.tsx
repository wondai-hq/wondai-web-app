import { useState } from 'react';
import { useParams } from 'react-router';
import { ThreadList } from '../ThreadList';
import { ThreadView } from '../ThreadView';
import { AIPanel } from '../AIPanel';
import { EmptyState } from '../EmptyState';
import { mockThreads, mockMessages, mockAIInsights, mockRecentContacts } from '../../utils/mockData';

export function ContactView() {
  const { contactId } = useParams<{ contactId: string }>();
  const [selectedThreadId, setSelectedThreadId] = useState<string | undefined>(mockThreads[0]?.id);
  const [showAIPanel, setShowAIPanel] = useState(false);

  const selectedThread = mockThreads.find((t) => t.id === selectedThreadId);
  const threadMessages = selectedThreadId ? mockMessages[selectedThreadId] || [] : [];
  const aiInsight = selectedThreadId ? mockAIInsights[selectedThreadId] : undefined;

  // Find the contact
  const contact = mockRecentContacts.find((c) => c.id === contactId);

  // Filter threads by contact (in a real app, threads would have a contactId field)
  // For now, we'll filter by customer name matching the contact name
  const contactThreads = mockThreads.filter((t) => 
    t.customerName.toLowerCase() === contact?.name.toLowerCase()
  );

  // Get the contact name for display
  const contactName = contact?.name || 'Unknown Contact';

  return (
    <div className="flex h-full relative">
      {/* Thread List */}
      <div className="w-[400px] border-r border-border">
        <ThreadList
          threads={contactThreads}
          selectedThreadId={selectedThreadId}
          onSelectThread={setSelectedThreadId}
          feedName={contactName}
        />
      </div>

      {/* Thread View */}
      {selectedThread ? (
        <div className="flex-1">
          <ThreadView
            thread={selectedThread}
            messages={threadMessages}
            onShowAIPanel={() => setShowAIPanel(true)}
          />
        </div>
      ) : contactThreads.length === 0 ? (
        <div className="flex-1">
          <EmptyState type="inbox" />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          Select a thread to view
        </div>
      )}

      {/* AI Panel - Overlay with slide-in animation */}
      {showAIPanel && aiInsight && (
        <>
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/20 z-40 transition-opacity duration-300"
            onClick={() => setShowAIPanel(false)}
          />
          {/* Panel */}
          <div className="absolute right-0 top-0 bottom-0 z-50">
            <AIPanel insight={aiInsight} onClose={() => setShowAIPanel(false)} />
          </div>
        </>
      )}
    </div>
  );
}
