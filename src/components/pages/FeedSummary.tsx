import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Sparkles, Archive, Filter, Plus, Send } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { MarkdownRenderer } from '../MarkdownRenderer';
import { mockThreads } from '../../utils/mockData';

export function FeedSummary() {
  const { filter, channel } = useParams<{ filter?: string; channel?: string }>();
  const navigate = useNavigate();
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);

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

  const goBack = () => {
    if (channel) {
      navigate(`/dashboard/channel/${channel}`);
    } else if (filter) {
      navigate(`/dashboard/inbox/${filter}`);
    } else {
      navigate('/dashboard/inbox');
    }
  };

  // Generate feed summary based on threads
  const generateSummary = () => {
    const feedName = getFeedName();
    const threadCount = mockThreads.length;
    const urgentCount = mockThreads.filter(t => t.priority === 'urgent').length;
    const highCount = mockThreads.filter(t => t.priority === 'high').length;
    const unassignedCount = mockThreads.filter(t => !t.assignedTo).length;

    // Get top tags
    const tagCounts = mockThreads.reduce((acc, thread) => {
      thread.tags.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const topTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([tag]) => tag);

    // Generate actionables based on feed analysis
    const actionables: Array<{ icon: string; text: string; priority: number }> = [];
    
    // Priority 1: Urgent threads
    if (urgentCount > 0) {
      actionables.push({
        icon: '🔴',
        text: `**Respond to ${urgentCount} urgent thread${urgentCount !== 1 ? 's' : ''}** - These require immediate attention to prevent escalation`,
        priority: 1
      });
    }
    
    // Priority 2: Unassigned threads
    if (unassignedCount > 3) {
      actionables.push({
        icon: '👥',
        text: `**Assign ${unassignedCount} unassigned thread${unassignedCount !== 1 ? 's' : ''}** - Distribute workload to improve response times`,
        priority: 2
      });
    }
    
    // Priority 3: Common issues that need templates
    if (topTags[0] && tagCounts[topTags[0]] > 3) {
      actionables.push({
        icon: '📝',
        text: `**Create template for "${topTags[0]}" issues** - ${tagCounts[topTags[0]]} threads could benefit from standardized responses`,
        priority: 3
      });
    }
    
    // Priority 4: High priority threads
    if (highCount > 2 && actionables.length < 3) {
      actionables.push({
        icon: '🟡',
        text: `**Address ${highCount} high-priority conversations** - These customers expect faster-than-usual responses`,
        priority: 4
      });
    }
    
    // Priority 5: Follow-up suggestions
    if (actionables.length < 3 && threadCount > 5) {
      const oldThreadsCount = Math.floor(threadCount * 0.3);
      actionables.push({
        icon: '📅',
        text: `**Review ${oldThreadsCount} threads older than 24 hours** - Proactive follow-ups maintain customer satisfaction`,
        priority: 5
      });
    }
    
    // Sort and limit to top 3 actionables
    const topActionables = actionables
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 3);

    let summary = `# ${feedName} Feed Summary\n\n`;

    summary += `## Overview\n\n`;
    summary += `You have **${threadCount} active conversations** in this feed. `;
    
    if (urgentCount > 0) {
      summary += `**${urgentCount} thread${urgentCount !== 1 ? 's are' : ' is'} marked urgent** and require immediate attention. `;
    }
    
    if (highCount > 0) {
      summary += `${highCount} thread${highCount !== 1 ? 's are' : ' is'} high priority. `;
    }

    summary += `\n\n`;

    // Add Key Actionables section
    if (topActionables.length > 0) {
      summary += `## 🎯 Key Actionables\n\n`;
      summary += `**Wanda recommends focusing on these ${topActionables.length} action${topActionables.length !== 1 ? 's' : ''} first:**\n\n`;
      topActionables.forEach((actionable, i) => {
        summary += `${i + 1}. ${actionable.icon} ${actionable.text}\n\n`;
      });
    }

    if (urgentCount > 0 || highCount > 0) {
      summary += `## Priority Items\n\n`;
      
      const priorityThreads = mockThreads
        .filter(t => t.priority === 'urgent' || t.priority === 'high')
        .slice(0, 5);

      priorityThreads.forEach((thread, i) => {
        const priorityEmoji = thread.priority === 'urgent' ? '🔴' : '🟡';
        summary += `${i + 1}. ${priorityEmoji} **${thread.customerName}** - ${thread.subject}\n`;
        summary += `   - *${thread.lastMessage}*\n`;
        summary += `   - Tags: ${thread.tags.join(', ')}\n`;
        if (thread.assignedTo) {
          summary += `   - Assigned to: @${thread.assignedTo}\n`;
        } else {
          summary += `   - ⚠️ Unassigned\n`;
        }
        summary += `\n`;
      });
    }

    if (topTags.length > 0) {
      summary += `## Common Themes\n\n`;
      summary += `The most frequent issues in this feed are:\n\n`;
      topTags.forEach(tag => {
        summary += `- **${tag}** (${tagCounts[tag]} threads)\n`;
      });
      summary += `\n`;
    }

    summary += `\n## Recommendations\n\n`;
    
    if (urgentCount > 0) {
      summary += `- ⚡ Address urgent threads within the next hour to prevent escalation\n`;
    }
    if (unassignedCount > 3) {
      summary += `- 👥 Assign threads to team members to improve response times\n`;
    }
    if (topTags[0] && tagCounts[topTags[0]] > 3) {
      summary += `- 📝 Create a template response for "${topTags[0]}" issues to improve efficiency\n`;
    }
    summary += `- 📅 Review threads older than 24 hours to maintain customer satisfaction\n`;

    return summary;
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    // Add user message
    const newHistory = [...chatHistory, { role: 'user' as const, content: chatInput }];
    
    // Generate AI response (mock)
    const responses = [
      "Based on the current feed, I recommend prioritizing the urgent threads first. The average response time for urgent issues is 2.5 hours.",
      "I've analyzed the conversation patterns. Most complaints are related to delivery delays. Consider creating a proactive communication template.",
      "The VIP customers in this feed have an average satisfaction score of 4.2/5. The main pain points are response time and issue resolution speed.",
      `Looking at the "${getFeedName()}" feed, I notice a trend of similar issues. Would you like me to create a new smart filter to catch these patterns earlier?`,
    ];
    
    const aiResponse = responses[Math.floor(Math.random() * responses.length)];
    newHistory.push({ role: 'assistant', content: aiResponse });
    
    setChatHistory(newHistory);
    setChatInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="h-14 border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={goBack}>
            <ArrowLeft className="size-4" />
          </Button>
          <Sparkles className="size-5" style={{ color: 'hsl(var(--ai))' }} />
          <div>
            <h1 className="font-semibold">Feed Analysis</h1>
            <p className="text-xs text-muted-foreground">{getFeedName()}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Archive className="size-4 mr-2" />
            Archive All Messages
          </Button>
          <Button variant="outline" size="sm">
            <Plus className="size-4 mr-2" />
            New Feed from Chat
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="size-4 mr-2" />
            Adjust Filters from Chat
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          {/* AI Summary */}
          <div className="mb-8">
            <MarkdownRenderer content={generateSummary()} />
          </div>

          {/* Chat History */}
          {chatHistory.length > 0 && (
            <div className="space-y-4 mb-8">
              <div className="border-t border-border pt-6">
                <h3 className="font-medium mb-4">Conversation</h3>
              </div>
              {chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-accent text-accent-foreground'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="size-4" style={{ color: 'hsl(var(--ai))' }} />
                        <span className="text-xs font-medium">Wanda</span>
                      </div>
                    )}
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Input - Fixed at bottom */}
      <div className="border-t border-border bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <Textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask Wanda about this feed... (e.g., 'What are the most urgent issues?' or 'Create a filter for payment complaints')"
                className="resize-none pr-12 min-h-[60px]"
                rows={2}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!chatInput.trim()}
              size="lg"
              className="h-[60px]"
            >
              <Send className="size-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}