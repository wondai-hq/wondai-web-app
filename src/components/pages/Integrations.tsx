import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ChannelIcon } from '../ChannelIcon';
import { integrations } from '../../utils/mockData';
import { formatDistanceToNow } from 'date-fns';

export function Integrations() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1>Integrations</h1>
          <p className="text-muted-foreground">
            Connect your messaging channels to Wondai
          </p>
        </div>

        {/* Integration Cards */}
        <div className="grid grid-cols-3 gap-4">
          {integrations.map((integration) => (
            <Card key={integration.id}>
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-accent flex items-center justify-center">
                      <ChannelIcon
                        channel={integration.icon as any}
                        className="size-5"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-base">{integration.name}</CardTitle>
                      {integration.connected ? (
                        <Badge variant="outline" className="mt-1 text-green-600 border-green-600">
                          <CheckCircle className="size-3 mr-1" />
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="mt-1 text-gray-600 border-gray-600">
                          <XCircle className="size-3 mr-1" />
                          Not Connected
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <CardDescription>{integration.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {integration.connected && (
                  <>
                    <div className="text-sm">
                      <div className="text-muted-foreground">Messages synced</div>
                      <div className="font-medium">{integration.messagesCount.toLocaleString()}</div>
                    </div>
                    <div className="text-sm">
                      <div className="text-muted-foreground">Last sync</div>
                      <div className="font-medium">
                        {integration.lastSync
                          ? formatDistanceToNow(integration.lastSync, { addSuffix: true })
                          : 'Never'}
                      </div>
                    </div>
                  </>
                )}
                <div className="flex gap-2 pt-2">
                  {integration.connected ? (
                    <>
                      <Button variant="outline" size="sm" className="flex-1">
                        <RefreshCw className="size-4 mr-2" />
                        Sync Now
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Configure
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" className="flex-1">
                      Connect
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* API Keys Section */}
        <Card>
          <CardHeader>
            <CardTitle>API Keys & Webhooks</CardTitle>
            <CardDescription>
              Manage your integration credentials and webhook endpoints
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 border border-border rounded-md">
                <div>
                  <div className="font-medium">WhatsApp Business API Key</div>
                  <div className="text-sm text-muted-foreground font-mono">
                    waba_••••••••••••••••••••3f7a
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Regenerate
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-md">
                <div>
                  <div className="font-medium">Telegram Bot Token</div>
                  <div className="text-sm text-muted-foreground font-mono">
                    bot••••••••••••••••••••••••8a2c
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Regenerate
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-md">
                <div>
                  <div className="font-medium">Webhook URL</div>
                  <div className="text-sm text-muted-foreground font-mono">
                    https://api.wondai.com/webhook/abc123
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Copy
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
