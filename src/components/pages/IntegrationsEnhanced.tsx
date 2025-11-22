import { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  RefreshCw, 
  Settings2, 
  Trash2,
  Copy,
  Eye,
  EyeOff,
  AlertCircle,
  Clock,
  Loader2,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import {
  type ChannelType,
  type Integration,
  channelInfoMap,
  loadIntegrations,
  saveIntegrations,
} from '../../utils/integrations';
import { OAuthModal, APIKeyModal, ComplexSetupModal } from '../IntegrationModals';

export function IntegrationsEnhanced() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [activeModal, setActiveModal] = useState<{
    type: 'oauth' | 'api_key' | 'complex';
    channel: ChannelType;
  } | null>(null);
  const [showCredentials, setShowCredentials] = useState<Record<string, boolean>>({});

  // Load integrations on mount
  useEffect(() => {
    const loaded = loadIntegrations();
    setIntegrations(loaded);
  }, []);

  const connectedCount = integrations.filter((int) => int.status === 'connected').length;
  const allChannels: ChannelType[] = ['slack', 'email', 'whatsapp', 'telegram', 'discord', 'sms'];
  const totalMessages = integrations.reduce((sum, int) => sum + (int.stats?.totalMessages || 0), 0);

  const handleConnect = (channel: ChannelType) => {
    const info = channelInfoMap[channel];
    
    if (info.authMethod === 'oauth') {
      setActiveModal({ type: 'oauth', channel });
    } else if (info.authMethod === 'api_key') {
      setActiveModal({ type: 'api_key', channel });
    } else if (info.authMethod === 'complex') {
      setActiveModal({ type: 'complex', channel });
    }
  };

  const handleIntegrationSuccess = (integration: Integration) => {
    setIntegrations((prev) => {
      const filtered = prev.filter((int) => int.channelType !== integration.channelType);
      const updated = [...filtered, integration];
      saveIntegrations(updated);
      return updated;
    });
    setActiveModal(null);
  };

  const handleSync = (integrationId: string) => {
    toast.info('Syncing messages...');
    setTimeout(() => {
      setIntegrations((prev) =>
        prev.map((int) =>
          int.id === integrationId
            ? { ...int, lastSyncAt: new Date() }
            : int
        )
      );
      toast.success('Sync complete!');
    }, 1500);
  };

  const handleDisconnect = (integrationId: string) => {
    if (confirm('Are you sure you want to disconnect this integration?')) {
      setIntegrations((prev) => {
        const updated = prev.filter((int) => int.id !== integrationId);
        saveIntegrations(updated);
        return updated;
      });
      toast.success('Integration disconnected');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const toggleShowCredential = (id: string) => {
    setShowCredentials((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getIntegrationForChannel = (channel: ChannelType) => {
    return integrations.find((int) => int.channelType === channel);
  };

  const getStatusBadge = (integration?: Integration) => {
    if (!integration) {
      return (
        <Badge variant="outline" className="text-muted-foreground">
          Not Connected
        </Badge>
      );
    }

    switch (integration.status) {
      case 'connected':
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle2 className="size-3 mr-1" />
            Connected
          </Badge>
        );
      case 'pending_verification':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="size-3 mr-1" />
            Pending
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="destructive">
            <AlertCircle className="size-3 mr-1" />
            Error
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            Not Connected
          </Badge>
        );
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header with Stats */}
        <div>
          <h1 className="mb-1">Integrations</h1>
          <p className="text-muted-foreground mb-6">
            Connect and manage your messaging channels
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Channels Connected</p>
                    <div className="flex items-baseline gap-2">
                      <div className="text-3xl font-semibold">
                        {connectedCount}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        / {allChannels.length}
                      </div>
                    </div>
                  </div>
                  <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="size-6 text-primary" />
                  </div>
                </div>
                <Progress
                  value={(connectedCount / allChannels.length) * 100}
                  className="mt-3 h-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Messages</p>
                    <div className="text-3xl font-semibold">
                      {totalMessages.toLocaleString()}
                    </div>
                  </div>
                  <div className="size-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <RefreshCw className="size-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">System Status</p>
                    <div className="text-lg font-semibold text-green-600 flex items-center gap-2 mt-1">
                      <div className="size-2 rounded-full bg-green-600 animate-pulse" />
                      All Systems Operational
                    </div>
                  </div>
                  <div className="size-12 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="size-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Channel Management Cards */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Channel Management</h2>
          <div className="grid grid-cols-2 gap-4">
            {allChannels.map((channel) => {
              const info = channelInfoMap[channel];
              const integration = getIntegrationForChannel(channel);
              const isConnected = integration?.status === 'connected';

              return (
                <Card key={channel}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="size-12 rounded-lg bg-accent flex items-center justify-center">
                          <span className="text-2xl">
                            {channel === 'whatsapp' && '💬'}
                            {channel === 'email' && '📧'}
                            {channel === 'telegram' && '✈️'}
                            {channel === 'slack' && '💼'}
                            {channel === 'discord' && '🎮'}
                            {channel === 'sms' && '📱'}
                          </span>
                        </div>
                        <div>
                          <CardTitle className="text-base">{info.name}</CardTitle>
                          {getStatusBadge(integration)}
                        </div>
                      </div>
                      {!isConnected && (
                        <Badge
                          variant="outline"
                          className={
                            info.complexity === 'easy'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : info.complexity === 'moderate'
                              ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                          }
                        >
                          {info.complexity === 'easy' && '🟢 Easy'}
                          {info.complexity === 'moderate' && '🟡 Moderate'}
                          {info.complexity === 'complex' && '🔴 Complex'}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {isConnected && integration ? (
                      <>
                        {/* Connected Info */}
                        <div className="space-y-2 text-sm">
                          {integration.metadata.emailAddress && (
                            <div>
                              <div className="text-muted-foreground">Email</div>
                              <div className="font-medium">{integration.metadata.emailAddress}</div>
                            </div>
                          )}
                          {integration.metadata.workspaceName && (
                            <div>
                              <div className="text-muted-foreground">Workspace</div>
                              <div className="font-medium">{integration.metadata.workspaceName}</div>
                            </div>
                          )}
                          {integration.metadata.phoneNumber && (
                            <div>
                              <div className="text-muted-foreground">Phone</div>
                              <div className="font-medium">{integration.metadata.phoneNumber}</div>
                            </div>
                          )}
                          {integration.metadata.botUsername && (
                            <div>
                              <div className="text-muted-foreground">Bot</div>
                              <div className="font-medium">{integration.metadata.botUsername}</div>
                            </div>
                          )}
                          {integration.stats && (
                            <>
                              <div>
                                <div className="text-muted-foreground">Messages synced</div>
                                <div className="font-medium">{integration.stats.totalMessages.toLocaleString()}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Last sync</div>
                                <div className="font-medium">
                                  {integration.lastSyncAt
                                    ? formatDistanceToNow(integration.lastSyncAt, { addSuffix: true })
                                    : 'Never'}
                                </div>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleSync(integration.id)}
                          >
                            <RefreshCw className="size-4 mr-2" />
                            Sync
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleConnect(channel)}
                          >
                            <Settings2 className="size-4 mr-2" />
                            Configure
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDisconnect(integration.id)}
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </div>
                      </>
                    ) : integration?.status === 'pending_verification' ? (
                      <>
                        <p className="text-sm text-yellow-700">
                          Business verification in progress. You'll receive an email when ready (typically 2-5 business days).
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          disabled
                        >
                          <Clock className="size-4 mr-2" />
                          Awaiting Verification
                        </Button>
                      </>
                    ) : (
                      <>
                        {/* Not Connected Info */}
                        <div className="text-sm text-muted-foreground">
                          <div className="mb-2">{info.timeEstimate} setup</div>
                          <div className="space-y-1">
                            {info.requirements.map((req, idx) => (
                              <div key={idx}>• {req}</div>
                            ))}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => handleConnect(channel)}
                        >
                          Connect {info.name}
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* API Keys & Webhooks */}
        {integrations.some((int) => int.credentials) && (
          <Card>
            <CardHeader>
              <CardTitle>API Keys & Webhooks</CardTitle>
              <CardDescription>
                Manage your integration credentials securely
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {integrations
                .filter((int) => int.credentials)
                .map((integration) => {
                  const info = channelInfoMap[integration.channelType];
                  return (
                    <div key={integration.id}>
                      {integration.credentials?.token && (
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium">{info.name} Token</div>
                            <div className="text-sm text-muted-foreground font-mono">
                              {showCredentials[integration.id]
                                ? integration.credentials.token
                                : integration.credentials.token}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleShowCredential(integration.id)}
                            >
                              {showCredentials[integration.id] ? (
                                <EyeOff className="size-4" />
                              ) : (
                                <Eye className="size-4" />
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(integration.credentials!.token!)}
                            >
                              <Copy className="size-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                      {integration.credentials?.accountSid && (
                        <div className="flex items-center justify-between p-3 border rounded-lg mt-2">
                          <div className="flex-1">
                            <div className="font-medium">Account SID</div>
                            <div className="text-sm text-muted-foreground font-mono">
                              {integration.credentials.accountSid}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(integration.credentials!.accountSid!)}
                          >
                            <Copy className="size-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}

              {/* Webhook URL */}
              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                <div className="flex-1">
                  <div className="font-medium">Webhook URL</div>
                  <div className="text-sm text-muted-foreground font-mono">
                    https://api.wondai.com/webhooks/user_abc123
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard('https://api.wondai.com/webhooks/user_abc123')}
                >
                  <Copy className="size-4" />
                </Button>
              </div>

              <div className="text-xs text-muted-foreground pt-2">
                🔒 All credentials are encrypted at rest and transmitted over secure connections • SOC 2 Type II compliant
              </div>
            </CardContent>
          </Card>
        )}

        {/* Documentation Links */}
        <Card>
          <CardHeader>
            <CardTitle>Documentation & Support</CardTitle>
            <CardDescription>
              Learn more about integrations and get help
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="justify-start">
                <BookOpen className="size-4 mr-2" />
                Integration Guides
                <ExternalLink className="size-3 ml-auto" />
              </Button>
              <Button variant="outline" className="justify-start">
                <Settings2 className="size-4 mr-2" />
                API Documentation
                <ExternalLink className="size-3 ml-auto" />
              </Button>
              <Button variant="outline" className="justify-start">
                <AlertCircle className="size-4 mr-2" />
                Troubleshooting
                <ExternalLink className="size-3 ml-auto" />
              </Button>
              <Button variant="outline" className="justify-start">
                <BookOpen className="size-4 mr-2" />
                Contact Support
                <ExternalLink className="size-3 ml-auto" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      {activeModal?.type === 'oauth' && (
        <OAuthModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          channelType={activeModal.channel}
          onSuccess={handleIntegrationSuccess}
        />
      )}

      {activeModal?.type === 'api_key' && (
        <APIKeyModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          channelType={activeModal.channel}
          onSuccess={handleIntegrationSuccess}
        />
      )}

      {activeModal?.type === 'complex' && (
        <ComplexSetupModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          onSuccess={handleIntegrationSuccess}
        />
      )}
    </div>
  );
}
