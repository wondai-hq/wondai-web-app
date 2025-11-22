import { AlertTriangle, TrendingUp, Users, Clock, MessageSquare, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { ChannelIcon } from '../ChannelIcon';
import { mockThreads, mockTeamMembers } from '../../utils/mockData';

export function SLADashboard() {
  const unrepliedOver24h = mockThreads.filter(
    (t) => Date.now() - t.timestamp.getTime() > 24 * 60 * 60 * 1000 && t.unread
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1>SLA Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor team performance and service level agreements
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Clock className="size-4" />
                Avg Response Time
              </CardDescription>
              <CardTitle className="text-3xl">2.4h</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="size-4 text-green-600" />
                <span className="text-green-600">12% faster</span>
                <span className="text-muted-foreground">vs last week</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <AlertTriangle className="size-4" />
                Overdue Threads
              </CardDescription>
              <CardTitle className="text-3xl text-orange-600">
                {unrepliedOver24h.length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Over 24h without reply</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <MessageSquare className="size-4" />
                Active Threads
              </CardDescription>
              <CardTitle className="text-3xl">47</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Across all channels</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Users className="size-4" />
                Team Utilization
              </CardDescription>
              <CardTitle className="text-3xl">78%</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={78} className="h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Overdue Threads */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-orange-600" />
              Unreplied Over 24 Hours
            </CardTitle>
            <CardDescription>
              Threads that require immediate attention to meet SLA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {unrepliedOver24h.slice(0, 5).map((thread) => (
                <div
                  key={thread.id}
                  className="flex items-center justify-between p-3 border border-border rounded-md hover:bg-accent transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="size-10">
                      <AvatarFallback>
                        {thread.customerName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium truncate">{thread.customerName}</span>
                        <ChannelIcon channel={thread.channel} className="size-3 flex-shrink-0" />
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {thread.subject}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {thread.assignedTo ? (
                      <Badge variant="outline">{thread.assignedTo}</Badge>
                    ) : (
                      <Badge variant="outline">Unassigned</Badge>
                    )}
                    <Badge variant="destructive">
                      {Math.floor((Date.now() - thread.timestamp.getTime()) / (1000 * 60 * 60))}h
                      overdue
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Workload */}
        <Card>
          <CardHeader>
            <CardTitle>Team Workload Distribution</CardTitle>
            <CardDescription>Active threads per team member</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTeamMembers.map((member) => (
                <div key={member.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback>
                          {member.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        {member.activeThreads} threads
                      </span>
                      <div className="w-32">
                        <Progress
                          value={(member.activeThreads / 15) * 100}
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* VIP Priority Queue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-5" style={{ color: 'hsl(var(--vip))' }} />
              VIP Priority Queue
            </CardTitle>
            <CardDescription>High-value customers requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockThreads
                .filter((t) => t.tags.includes('VIP'))
                .slice(0, 5)
                .map((thread) => (
                  <div
                    key={thread.id}
                    className="flex items-center justify-between p-3 border border-border rounded-md hover:bg-accent transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar className="size-10">
                        <AvatarFallback>
                          {thread.customerName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium truncate">{thread.customerName}</span>
                          <ChannelIcon channel={thread.channel} className="size-3 flex-shrink-0" />
                          <Badge variant="outline" className="text-xs">
                            VIP
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground truncate">
                          {thread.subject}
                        </div>
                      </div>
                    </div>
                    {thread.assignedTo && <Badge variant="secondary">{thread.assignedTo}</Badge>}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Recurring Themes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-5" style={{ color: 'hsl(var(--ai))' }} />
              Recurring Themes (AI Detected)
            </CardTitle>
            <CardDescription>Patterns identified by Wanda across conversations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { theme: 'Payment processing delays', count: 12, trend: 'up' },
                { theme: 'Integration setup questions', count: 8, trend: 'stable' },
                { theme: 'Feature requests for API', count: 6, trend: 'down' },
                { theme: 'Shipping time complaints', count: 5, trend: 'up' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 border border-border rounded-md"
                >
                  <div>
                    <div className="font-medium">{item.theme}</div>
                    <div className="text-sm text-muted-foreground">{item.count} occurrences this week</div>
                  </div>
                  <Badge variant={item.trend === 'up' ? 'destructive' : 'secondary'}>
                    {item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→'}{' '}
                    {item.trend}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
