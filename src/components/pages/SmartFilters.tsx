import { Plus, Edit2, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { smartFilters } from '../../utils/mockData';
import { useState } from 'react';
import { CreateFeedModal } from '../CreateFeedModal';

export function SmartFilters() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1>Feeds Overview</h1>
            <p className="text-muted-foreground">
              AI-powered feeds to organize your inbox by meaning
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="size-4 mr-2" />
            Create Feed
          </Button>
        </div>

        {/* Suggested by Wanda AI */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-5" style={{ color: 'hsl(var(--ai))' }} />
              Suggested by Wanda AI
            </CardTitle>
            <CardDescription>
              Based on your recent message patterns, Wanda suggests these improvements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Create New Feed Suggestion */}
            <div className="flex items-center justify-between p-3 border border-border rounded-md hover:border-purple-300 hover:bg-purple-50/50 transition-all">
              <div>
                <div className="font-medium">Create "Shipping Delays" Feed</div>
                <div className="text-sm text-muted-foreground">
                  18 threads about late deliveries could be organized into a new feed
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">New Feed</Badge>
                <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>Create Feed</Button>
              </div>
            </div>

            {/* Adjust Existing Feed Suggestion */}
            <div className="flex items-center justify-between p-3 border border-border rounded-md hover:border-purple-300 hover:bg-purple-50/50 transition-all">
              <div>
                <div className="font-medium">Refine "Payment Issues" Feed</div>
                <div className="text-sm text-muted-foreground">
                  Add filter for "duplicate charges" - 12 threads match this pattern
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">Adjust Feed</Badge>
                <Button size="sm" variant="outline">Review</Button>
              </div>
            </div>

            {/* Another Adjustment Suggestion */}
            <div className="flex items-center justify-between p-3 border border-border rounded-md hover:border-purple-300 hover:bg-purple-50/50 transition-all">
              <div>
                <div className="font-medium">Expand "VIP" Feed Criteria</div>
                <div className="text-sm text-muted-foreground">
                  6 high-value customers aren't tagged as VIP yet
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">Adjust Feed</Badge>
                <Button size="sm" variant="outline">Review</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feed Insights */}
        <div>
          <h2 className="mb-4">Feed Insights</h2>
          <div className="grid grid-cols-2 gap-4">
            {smartFilters.map((filter) => (
              <Card key={filter.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <div
                          className="size-3 rounded-full"
                          style={{ backgroundColor: filter.color }}
                        />
                        {filter.name}
                      </CardTitle>
                      <CardDescription>{filter.description}</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" className="size-8">
                      <Edit2 className="size-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Thread Count */}
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{filter.count} threads</Badge>
                    <Button variant="outline" size="sm">
                      View Threads
                    </Button>
                  </div>

                  {/* High-level Insights */}
                  <div className="pt-3 border-t space-y-2">
                    <div className="text-xs text-muted-foreground mb-2">Recent Activity</div>
                    
                    {/* Response Time */}
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="size-3.5 text-green-600" />
                      <span className="text-muted-foreground">Avg response: 2.3 hrs</span>
                    </div>

                    {/* Sentiment Trend */}
                    <div className="flex items-center gap-2 text-sm">
                      {filter.id === 'urgent' || filter.id === 'complaints' ? (
                        <>
                          <TrendingDown className="size-3.5 text-orange-600" />
                          <span className="text-muted-foreground">Sentiment declining</span>
                        </>
                      ) : (
                        <>
                          <TrendingUp className="size-3.5 text-green-600" />
                          <span className="text-muted-foreground">Sentiment improving</span>
                        </>
                      )}
                    </div>

                    {/* Alert if needed */}
                    {(filter.id === 'urgent' || filter.id === 'payment') && (
                      <div className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="size-3.5 text-red-600" />
                        <span className="text-red-600">3 threads over 24hrs old</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Create Feed Modal */}
      <CreateFeedModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}