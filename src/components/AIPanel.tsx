import { X, TrendingUp, TrendingDown, Minus, CheckCircle, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { cn } from '../lib/utils';
import type { AIInsight } from '../utils/mockData';

interface AIPanelProps {
  insight: AIInsight;
  onClose: () => void;
}

export function AIPanel({ insight, onClose }: AIPanelProps) {
  const getSentimentIcon = () => {
    switch (insight.sentiment) {
      case 'positive':
        return <TrendingUp className="size-4 text-green-600" />;
      case 'negative':
        return <TrendingDown className="size-4 text-red-600" />;
      case 'neutral':
        return <Minus className="size-4 text-gray-600" />;
    }
  };

  const getSentimentColor = () => {
    switch (insight.sentiment) {
      case 'positive':
        return 'text-green-600 bg-green-50';
      case 'negative':
        return 'text-red-600 bg-red-50';
      case 'neutral':
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="w-96 h-full border-l border-border bg-card flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="h-14 border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5" style={{ color: 'hsl(var(--ai))' }} />
          <h3 className="font-semibold">Wanda AI Insights</h3>
        </div>
        <Button variant="ghost" size="icon" className="size-8" onClick={onClose}>
          <X className="size-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Summary */}
        <div>
          <h4 className="font-medium mb-2">Summary</h4>
          <p className="text-sm text-muted-foreground">{insight.summary}</p>
        </div>

        {/* Sentiment */}
        <div>
          <h4 className="font-medium mb-2">Sentiment Analysis</h4>
          <div className={cn('flex items-center gap-2 px-3 py-2 rounded-md', getSentimentColor())}>
            {getSentimentIcon()}
            <span className="font-medium capitalize">{insight.sentiment}</span>
          </div>
        </div>

        {/* Priority Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">Priority Score</h4>
            <span className="text-sm font-semibold">{insight.priorityScore}/100</span>
          </div>
          <Progress value={insight.priorityScore} className="h-2" />
          <div className="mt-1 text-xs text-muted-foreground">
            Confidence: {Math.round(insight.confidence * 100)}%
          </div>
        </div>

        {/* Intent */}
        <div>
          <h4 className="font-medium mb-2">Customer Intent</h4>
          <Badge variant="outline">{insight.intent}</Badge>
        </div>

        {/* Tasks */}
        {insight.tasks.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Extracted Tasks</h4>
            <div className="space-y-2">
              {insight.tasks.map((task, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="size-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <span>{task}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Follow-ups */}
        {insight.followUps.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Suggested Follow-ups</h4>
            <div className="space-y-2">
              {insight.followUps.map((followUp, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <AlertCircle className="size-4 mt-0.5 text-blue-600 flex-shrink-0" />
                  <span>{followUp}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deadlines */}
        {insight.deadlines.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Deadlines</h4>
            <div className="space-y-2">
              {insight.deadlines.map((deadline, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <Clock className="size-4 mt-0.5 text-orange-600 flex-shrink-0" />
                  <div>
                    <div>{deadline.task}</div>
                    <div className="text-xs text-muted-foreground">{deadline.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recurring Issues */}
        {insight.recurringIssues.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Recurring Issues Detected</h4>
            <div className="space-y-2">
              {insight.recurringIssues.map((issue, idx) => (
                <Badge key={idx} variant="secondary" className="mr-2">
                  {issue}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Tags */}
        {insight.suggestedTags.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Suggested Tags</h4>
            <div className="flex flex-wrap gap-2">
              {insight.suggestedTags.map((tag, idx) => (
                <Badge key={idx} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="mt-2 w-full">
              Apply suggestions
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}