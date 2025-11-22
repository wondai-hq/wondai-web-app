import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { ThreadList } from '../ThreadList';
import { ThreadView } from '../ThreadView';
import { AIPanel } from '../AIPanel';
import { EmptyState } from '../EmptyState';
import { mockThreads, mockMessages, mockAIInsights } from '../../utils/mockData';
import { useLayout } from '../../utils/LayoutContext';
import { cn } from "@/lib/utils";

export function UnifiedInbox() {
  const { filter, channel } = useParams<{ filter?: string; channel?: string }>();
  const [selectedThreadId, setSelectedThreadId] = useState<string | undefined>(mockThreads[0]?.id);
  const { 
    sidebarCollapsed, 
    setSidebarCollapsed,
    threadListCollapsed,
    setThreadListCollapsed,
    showAIPanel,
    setShowAIPanel
  } = useLayout();

  const selectedThread = mockThreads.find((t) => t.id === selectedThreadId);
  const threadMessages = selectedThreadId ? mockMessages[selectedThreadId] || [] : [];
  const aiInsight = selectedThreadId ? mockAIInsights[selectedThreadId] : undefined;

  // When AI Panel opens, auto-collapse sidebar and thread list
  useEffect(() => {
    if (showAIPanel) {
      setSidebarCollapsed(true);
      setThreadListCollapsed(true);
    }
  }, [showAIPanel, setSidebarCollapsed, setThreadListCollapsed]);

  // When sidebar expands, close AI Panel
  useEffect(() => {
    if (!sidebarCollapsed && showAIPanel) {
      setShowAIPanel(false);
    }
  }, [sidebarCollapsed, showAIPanel, setShowAIPanel]);

  // When thread list expands, close AI Panel
  useEffect(() => {
    if (!threadListCollapsed && showAIPanel) {
      setShowAIPanel(false);
    }
  }, [threadListCollapsed, showAIPanel, setShowAIPanel]);

  // Determine the current feed/view name
  const getFeedName = () => {
    if (channel) {
      return channel.charAt(0).toUpperCase() + channel.slice(1);
    }
    if (filter) {
      const filterNames: Record<string, string> = {
        mentions: 'Mentions',
        starred: 'Starred',
        pinned: 'Pinned',
        urgent: 'Urgent',
        vip: 'VIP',
        complaints: 'Complaints',
        payment: 'Payment Issues',
        followups: 'Follow-ups Needed',
        aftersales: 'After Sales',
        recurring: 'Recurring Issues',
      };
      return filterNames[filter] || filter.charAt(0).toUpperCase() + filter.slice(1);
    }
    return 'Must Handle';
  };

  return (
    <div className="flex h-full relative">
      {/* Thread List - Collapsible */}
      <div 
        className={cn(
          "border-r border-border transition-all duration-300 ease-in-out overflow-hidden",
          threadListCollapsed ? "w-0" : "w-[400px]"
        )}
      >
        <ThreadList
          threads={mockThreads}
          selectedThreadId={selectedThreadId}
          onSelectThread={setSelectedThreadId}
          feedName={getFeedName()}
        />
      </div>

      {/* Thread View */}
      {selectedThread ? (
        <div className="flex-1">
          <ThreadView
            thread={selectedThread}
            messages={threadMessages}
            onShowAIPanel={() => setShowAIPanel(true)}
            onToggleThreadList={() => setThreadListCollapsed(!threadListCollapsed)}
            showThreadListToggle={threadListCollapsed}
          />
        </div>
      ) : mockThreads.length === 0 ? (
        <div className="flex-1">
          <EmptyState type="inbox" />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          Select a thread to view
        </div>
      )}

      {/* AI Panel - No backdrop, just slides in */}
      {showAIPanel && aiInsight && (
        <div className="w-[400px] border-l border-border transition-all duration-300 ease-in-out">
          <AIPanel insight={aiInsight} onClose={() => setShowAIPanel(false)} />
        </div>
      )}
    </div>
  );
}