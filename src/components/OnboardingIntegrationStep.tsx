import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  CheckCircle2, 
  Loader2, 
  AlertCircle, 
  Clock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { 
  type ChannelType, 
  type Integration, 
  type IntegrationStatus,
  channelInfoMap,
  saveIntegrations,
  loadIntegrations 
} from '../utils/integrations';
import { OAuthModal, APIKeyModal, ComplexSetupModal } from './IntegrationModals';

interface OnboardingIntegrationStepProps {
  selectedChannels: ChannelType[];
  onContinue: (integrations: Integration[]) => void;
  onBack: () => void;
}

export function OnboardingIntegrationStep({ 
  selectedChannels, 
  onContinue, 
  onBack 
}: OnboardingIntegrationStepProps) {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [activeModal, setActiveModal] = useState<{
    type: 'oauth' | 'api_key' | 'complex';
    channel: ChannelType;
  } | null>(null);

  // Load existing integrations on mount
  useEffect(() => {
    const existing = loadIntegrations();
    setIntegrations(existing);
  }, []);

  // Save integrations whenever they change
  useEffect(() => {
    saveIntegrations(integrations);
  }, [integrations]);

  const getIntegrationForChannel = (channel: ChannelType) => {
    return integrations.find((int) => int.channelType === channel);
  };

  const handleSetup = (channel: ChannelType) => {
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
      // Remove any existing integration for this channel
      const filtered = prev.filter((int) => int.channelType !== integration.channelType);
      return [...filtered, integration];
    });
    setActiveModal(null);
  };

  const handleContinueWithDemo = () => {
    onContinue(integrations);
  };

  const handleContinue = () => {
    onContinue(integrations);
  };

  const connectedCount = integrations.filter((int) => int.status === 'connected').length;
  const pendingCount = integrations.filter((int) => int.status === 'pending_verification').length;

  const getStatusBadge = (status: IntegrationStatus) => {
    switch (status) {
      case 'connected':
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle2 className="size-3 mr-1" />
            Connected
          </Badge>
        );
      case 'connecting':
        return (
          <Badge variant="secondary">
            <Loader2 className="size-3 mr-1 animate-spin" />
            Connecting
          </Badge>
        );
      case 'pending_verification':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
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

  const getComplexityBadge = (complexity: 'easy' | 'moderate' | 'complex') => {
    switch (complexity) {
      case 'easy':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Easy • {channelInfoMap[selectedChannels.find((ch) => channelInfoMap[ch].complexity === 'easy') || 'slack'].timeEstimate}
          </Badge>
        );
      case 'moderate':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Moderate
          </Badge>
        );
      case 'complex':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Complex
          </Badge>
        );
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Connect Your Channels</h2>
          <p className="text-muted-foreground">
            Set up the messaging platforms you selected
          </p>
        </div>

        {/* Progress Indicator */}
        {connectedCount > 0 && (
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                {connectedCount} of {selectedChannels.length} channels connected
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round((connectedCount / selectedChannels.length) * 100)}%
              </span>
            </div>
            <Progress 
              value={(connectedCount / selectedChannels.length) * 100} 
              className="h-2"
            />
          </div>
        )}

        {/* Channel Cards */}
        <div className="space-y-3">
          {selectedChannels.map((channel) => {
            const info = channelInfoMap[channel];
            const integration = getIntegrationForChannel(channel);
            const status = integration?.status || 'not_connected';

            return (
              <div
                key={channel}
                className="p-4 bg-card border rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Channel Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{info.name}</h3>
                      {getStatusBadge(status)}
                    </div>
                    
                    {status === 'not_connected' && (
                      <>
                        <div className="text-xs text-muted-foreground">
                          <div className="mb-1">You'll need:</div>
                          <ul className="space-y-0.5">
                            {info.requirements.map((req, idx) => (
                              <li key={idx}>• {req}</li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}

                    {status === 'connected' && integration && (
                      <div className="text-sm text-muted-foreground">
                        <div>
                          {integration.metadata.emailAddress && `📧 ${integration.metadata.emailAddress}`}
                          {integration.metadata.workspaceName && `💬 ${integration.metadata.workspaceName}`}
                          {integration.metadata.phoneNumber && `📱 ${integration.metadata.phoneNumber}`}
                          {integration.metadata.botUsername && `🤖 ${integration.metadata.botUsername}`}
                        </div>
                        {integration.stats && (
                          <div className="text-xs text-green-600 mt-1">
                            ✓ {integration.stats.totalMessages.toLocaleString()} messages synced
                          </div>
                        )}
                      </div>
                    )}

                    {status === 'pending_verification' && (
                      <div className="text-sm text-yellow-700">
                        Awaiting business verification (usually 2-5 days)
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div>
                    {status === 'not_connected' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetup(channel)}
                      >
                        Setup
                      </Button>
                    )}
                    {status === 'connected' && (
                      <Button variant="ghost" size="sm" disabled>
                        <CheckCircle2 className="size-4 text-green-600" />
                      </Button>
                    )}
                    {status === 'pending_verification' && (
                      <Button variant="ghost" size="sm" disabled>
                        <Clock className="size-4 text-yellow-600" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Encouragement / Demo Option */}
        {connectedCount === 0 && (
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium text-purple-900 mb-1">
                  Not ready to connect yet?
                </div>
                <p className="text-purple-800">
                  You can skip this step and explore Wondai with demo data. 
                  Connect your real channels anytime from Settings → Integrations.
                </p>
              </div>
            </div>
          </div>
        )}

        {connectedCount > 0 && connectedCount < selectedChannels.length && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium text-blue-900 mb-1">
                  Great progress! 🎉
                </div>
                <p className="text-blue-800">
                  You've connected {connectedCount} {connectedCount === 1 ? 'channel' : 'channels'}. 
                  You can add the others later from Settings → Integrations.
                </p>
              </div>
            </div>
          </div>
        )}

        {connectedCount === selectedChannels.length && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium text-green-900 mb-1">
                  All channels connected! 🎉
                </div>
                <p className="text-green-800">
                  Wondai will now start importing and enriching your messages.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center gap-3 pt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onBack}
          >
            Back
          </Button>
          
          {connectedCount > 0 ? (
            <Button
              className="flex-1"
              onClick={handleContinue}
            >
              Continue with {connectedCount} {connectedCount === 1 ? 'channel' : 'channels'}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleContinueWithDemo}
            >
              Skip - Use Demo Data
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          )}
        </div>
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
    </>
  );
}