import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  Sparkles, 
  Send, 
  Archive, 
  UserCircle, 
  Building2,
  Tag,
  Calendar,
  MessageCircle,
  Mail,
  Phone,
  Hash,
  MessageSquare,
  Zap
} from 'lucide-react';
import { Button } from '../ui/button';
import { mockRecentSources } from '../../utils/mockData';
import { cn } from '../../lib/utils';

// Custom markdown-style renderer for the summary
function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n');
  
  return (
    <div className="space-y-3">
      {lines.map((line, index) => {
        // Headers
        if (line.startsWith('### ')) {
          return <h3 key={index} className="font-semibold mt-4 mb-2">{line.slice(4)}</h3>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="font-semibold mt-5 mb-2">{line.slice(3)}</h2>;
        }
        
        // Bullet points
        if (line.startsWith('- ')) {
          return (
            <div key={index} className="flex gap-2 ml-2">
              <span className="text-muted-foreground mt-1.5">•</span>
              <span className="flex-1">{line.slice(2)}</span>
            </div>
          );
        }
        
        // Bold text
        const boldRegex = /\*\*(.*?)\*\*/g;
        if (boldRegex.test(line)) {
          const parts = line.split(boldRegex);
          return (
            <p key={index} className="leading-relaxed">
              {parts.map((part, i) => 
                i % 2 === 1 ? <strong key={i}>{part}</strong> : part
              )}
            </p>
          );
        }
        
        // Empty lines
        if (!line.trim()) {
          return <div key={index} className="h-2" />;
        }
        
        // Regular paragraphs
        return <p key={index} className="leading-relaxed">{line}</p>;
      })}
    </div>
  );
}

export function SourceSummary() {
  const { sourceId } = useParams<{ sourceId: string }>();
  const navigate = useNavigate();
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);

  // Find the source
  const source = mockRecentSources.find((s) => s.id === sourceId);
  
  if (!source) {
    return <div>Source not found</div>;
  }

  // Get source icon
  const getSourceIcon = () => {
    if (source.type === 'contact') return UserCircle;
    if (source.type === 'company') return Building2;
    if (source.type === 'tag') return Tag;
    return UserCircle;
  };

  // Get channel icon
  const getChannelIcon = () => {
    if (!source.channel) return null;
    const icons: Record<string, any> = {
      whatsapp: MessageCircle,
      email: Mail,
      telegram: Send,
      slack: Hash,
      discord: MessageSquare,
      sms: Phone,
    };
    return icons[source.channel];
  };

  // Get channel color
  const getChannelColor = () => {
    if (!source.channel) return undefined;
    const colors: Record<string, string> = {
      whatsapp: 'hsl(var(--whatsapp))',
      email: 'hsl(var(--email))',
      telegram: 'hsl(var(--telegram))',
      slack: 'hsl(var(--slack))',
      discord: 'hsl(var(--discord))',
      sms: 'hsl(var(--sms))',
    };
    return colors[source.channel];
  };

  const SourceIcon = getSourceIcon();
  const ChannelIcon = getChannelIcon();
  const channelColor = getChannelColor();

  // Mock summary content based on source type
  const getSummaryContent = () => {
    if (source.type === 'contact') {
      return `## Who is ${source.name}?

${source.name} is a VIP customer who has been with your organization for **2 years and 4 months**. They are the primary contact for several high-value projects and typically communicates via ${source.channel || 'multiple channels'}.

### Relationship Summary

- **Customer Tier**: VIP / Enterprise
- **First Contact**: September 2022
- **Total Conversations**: 47 threads across all channels
- **Response Rate**: Typically responds within 2-4 hours during business days
- **Preferred Communication**: ${source.channel ? source.channel.charAt(0).toUpperCase() + source.channel.slice(1) : 'Email'}

### Recent Context

Your last conversation with ${source.name} was about a **payment issue with order #45234**. They were experiencing a delayed refund and expressed frustration about the timeline. The issue is still in progress and requires follow-up.

### Key Topics Discussed

- Payment processing and billing inquiries
- Enterprise plan features and upgrades
- Technical support for integrations
- Account management and customization requests

### Suggested Follow-ups

- **Immediate**: Follow up on the pending refund issue (order #45234) - this has been outstanding for 5 days
- **This Week**: Check in about their satisfaction with the recent account upgrade
- **This Month**: Schedule a quarterly business review to discuss their needs and explore upsell opportunities
- **Personal Touch**: Congratulate them on their company's recent Series B funding announcement`;
    } else if (source.type === 'company') {
      return `## About ${source.name}

${source.name} is an **enterprise client** that has been partnering with your organization since **March 2023**. They are in the technology sector with approximately 250 employees.

### Business Relationship

- **Account Type**: Enterprise (Multi-seat license)
- **Annual Contract Value**: $84,000
- **Contract Renewal**: September 2025
- **Primary Contacts**: 3 active users from their team
- **Industries**: SaaS, B2B Technology

### Recent Activity

Your team has had **12 conversations** with ${source.name} in the last 30 days, primarily focused on technical implementation and feature requests. Their engagement level is high, which is a positive indicator for renewal.

### Key Stakeholders

- John Martinez (IT Director) - Primary technical contact
- Lisa Anderson (VP of Operations) - Decision maker
- David Kim (Integration Specialist) - Day-to-day user

### Business Context

${source.name} is currently in a growth phase and has expressed interest in scaling their usage of your platform. They're evaluating competitors but have shown strong satisfaction with your support team.

### Suggested Follow-ups

- **Priority**: Schedule a demo of new enterprise features with Lisa Anderson (Decision Maker)
- **This Week**: Check in with David Kim about the integration issues mentioned last week
- **Before Q4**: Prepare renewal discussion and explore expansion opportunities
- **Relationship Building**: Invite key stakeholders to your upcoming customer advisory board meeting`;
    } else {
      return `## About the "${source.name}" Tag

This tag represents a **category of conversations** that share common characteristics or themes. It helps organize and track specific types of interactions across your communication channels.

### Tag Usage

- **Active Threads**: 23 conversations currently tagged
- **Created**: October 2024
- **Most Active Channel**: ${source.channel || 'Multiple channels'}
- **Average Response Time**: 4.2 hours

### Common Themes

Conversations tagged with "${source.name}" typically involve:

- High-priority customer requests requiring immediate attention
- Time-sensitive issues or urgent matters
- VIP customer communications that need special handling
- Critical business discussions

### Tag Performance

- **Resolution Rate**: 87% of tagged conversations resolved within SLA
- **Customer Satisfaction**: 4.3/5 average rating
- **Escalation Rate**: 12% require manager involvement

### Suggested Actions

- **Review**: Audit the 4 conversations that exceeded SLA targets
- **Process**: Consider creating a dedicated workflow for this tag
- **Team**: Assign a specialist to monitor this tag during peak hours
- **Follow-up**: Check on the 3 conversations that were resolved but haven't received follow-up confirmation`;
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    // Add user message
    const newMessages = [...chatMessages, { role: 'user' as const, content: chatInput }];
    setChatMessages(newMessages);
    setChatInput('');

    // Simulate AI response
    setTimeout(() => {
      const mockResponse = `Based on ${source.name}'s communication history, I can help with that. What specific aspect would you like to explore?`;
      setChatMessages([...newMessages, { role: 'assistant' as const, content: mockResponse }]);
    }, 1000);
  };

  const handleBack = () => {
    navigate(`/dashboard/source/${sourceId}`);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="h-14 border-b border-border flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="gap-2"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <div className="h-4 w-px bg-border" />
          <SourceIcon className="size-5" style={channelColor ? { color: channelColor } : undefined} />
          <div>
            <h1 className="font-semibold">{source.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Archive className="size-4" />
            Archive All
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Summary Card */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div 
                className="p-2 rounded-lg flex-shrink-0" 
                style={{ 
                  backgroundColor: 'hsl(var(--ai) / 0.1)',
                }}
              >
                <Sparkles className="size-5" style={{ color: 'hsl(var(--ai))' }} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold mb-1">Relationship Summary</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  AI-generated insights about {source.name} and your relationship
                </p>
                <div className="prose prose-sm max-w-none">
                  <MarkdownRenderer content={getSummaryContent()} />
                </div>
              </div>
            </div>

            {/* Source Metadata */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <SourceIcon className="size-4" />
                  <span className="capitalize">{source.type}</span>
                </div>
                {source.channel && ChannelIcon && (
                  <div className="flex items-center gap-2">
                    <ChannelIcon className="size-4" style={{ color: channelColor }} />
                    <span className="capitalize">{source.channel}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="size-4" />
                  <span>Last viewed {new Date(source.lastViewed).toLocaleString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="size-5" style={{ color: 'hsl(var(--ai))' }} />
              <h3 className="font-semibold">Ask Wanda about {source.name}</h3>
            </div>

            {/* Chat Messages */}
            {chatMessages.length > 0 && (
              <div className="space-y-4 mb-4 max-h-[300px] overflow-y-auto">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'p-3 rounded-lg',
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground ml-8'
                        : 'bg-muted mr-8'
                    )}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Chat Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={`Ask about ${source.name}'s history, preferences, or next steps...`}
                className="flex-1 px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
              <Button onClick={handleSendMessage} size="sm" className="gap-2">
                <Send className="size-4" />
                Send
              </Button>
            </div>

            {/* Suggested Questions */}
            {chatMessages.length === 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => setChatInput("What are the most important topics discussed?")}
                  className="px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 rounded-md transition-colors"
                >
                  Most important topics?
                </button>
                <button
                  onClick={() => setChatInput("What should I follow up with them about?")}
                  className="px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 rounded-md transition-colors"
                >
                  Follow-up suggestions?
                </button>
                <button
                  onClick={() => setChatInput("What is their communication style?")}
                  className="px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 rounded-md transition-colors"
                >
                  Communication style?
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}