import { Download, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { format } from 'date-fns';

const mockLogs = [
  {
    id: '1',
    action: 'Thread Assigned',
    user: 'Alex Rivera',
    details: 'Assigned thread #1234 to Sarah Chen',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    severity: 'info',
  },
  {
    id: '2',
    action: 'Integration Connected',
    user: 'Jennifer Park',
    details: 'Connected WhatsApp Business account',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    severity: 'success',
  },
  {
    id: '3',
    action: 'User Role Changed',
    user: 'Jennifer Park',
    details: 'Changed Michael Torres role from Agent to Manager',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    severity: 'warning',
  },
  {
    id: '4',
    action: 'Settings Updated',
    user: 'Jennifer Park',
    details: 'Updated SLA configuration',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    severity: 'info',
  },
  {
    id: '5',
    action: 'Failed Login Attempt',
    user: 'Unknown',
    details: 'Failed login from IP 192.168.1.100',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    severity: 'error',
  },
  {
    id: '6',
    action: 'API Key Regenerated',
    user: 'Jennifer Park',
    details: 'Regenerated organization API key',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    severity: 'warning',
  },
  {
    id: '7',
    action: 'Message Sent',
    user: 'Sarah Chen',
    details: 'Sent reply via WhatsApp to John Martinez',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    severity: 'info',
  },
  {
    id: '8',
    action: 'User Invited',
    user: 'Alex Rivera',
    details: 'Invited new team member: james.wilson@wondai.com',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    severity: 'success',
  },
];

export function AuditLogs() {
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'warning':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Warning</Badge>;
      case 'success':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Success</Badge>;
      default:
        return <Badge variant="secondary">Info</Badge>;
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1>Audit Logs</h1>
            <p className="text-muted-foreground">
              Track all actions and events in your organization
            </p>
          </div>
          <Button variant="outline">
            <Download className="size-4 mr-2" />
            Export Logs
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Event Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="user">User Actions</SelectItem>
                    <SelectItem value="integration">Integrations</SelectItem>
                    <SelectItem value="settings">Settings</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select defaultValue="7">
                  <SelectTrigger>
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Last 24 hours</SelectItem>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="User" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="sarah">Sarah Chen</SelectItem>
                    <SelectItem value="michael">Michael Torres</SelectItem>
                    <SelectItem value="alex">Alex Rivera</SelectItem>
                    <SelectItem value="jennifer">Jennifer Park</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logs Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Severity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">
                      {format(log.timestamp, 'MMM d, h:mm a')}
                    </TableCell>
                    <TableCell className="font-medium">{log.action}</TableCell>
                    <TableCell>
                      {log.user !== 'Unknown' ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="size-6">
                            <AvatarFallback className="text-xs">
                              {log.user
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span>{log.user}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">{log.user}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {log.details}
                    </TableCell>
                    <TableCell>{getSeverityBadge(log.severity)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
