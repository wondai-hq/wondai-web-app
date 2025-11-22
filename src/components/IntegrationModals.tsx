import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Loader2, 
  CheckCircle2, 
  Copy, 
  Eye, 
  EyeOff, 
  ExternalLink,
  AlertTriangle,
  AlertCircle,
  MessageSquare,
  Mail
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { type ChannelType, type Integration, createMockIntegration } from '../utils/integrations';

// OAuth Flow Modal
interface OAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelType: ChannelType;
  onSuccess: (integration: Integration) => void;
}

export function OAuthModal({ isOpen, onClose, channelType, onSuccess }: OAuthModalProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [emailProvider, setEmailProvider] = useState<'gmail' | 'outlook' | null>(null);

  const channelNames: Record<string, string> = {
    slack: 'Slack',
    email: 'Email',
    discord: 'Discord',
  };

  const handleConnect = (provider?: string) => {
    setIsConnecting(true);

    // Simulate OAuth flow
    setTimeout(() => {
      const integration = createMockIntegration(channelType, 'connected');
      
      if (provider === 'gmail') {
        integration.metadata.emailAddress = 'support@acmecorp.com';
      } else if (provider === 'outlook') {
        integration.metadata.emailAddress = 'support@acmecorp.onmicrosoft.com';
      }

      onSuccess(integration);
      setIsConnecting(false);
      toast.success(`${channelNames[channelType]} connected successfully!`);
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Connect {channelNames[channelType]}</DialogTitle>
          <DialogDescription>
            Authorize Wondai to access your {channelNames[channelType]} workspace
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Permissions Info */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm font-medium mb-2">Wondai will be able to:</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              {channelType === 'slack' && (
                <>
                  <li>• Read messages from channels</li>
                  <li>• Send messages on your behalf</li>
                  <li>• Access user profiles</li>
                  <li>• Manage notifications</li>
                </>
              )}
              {channelType === 'email' && (
                <>
                  <li>• Read and send emails</li>
                  <li>• Access contact information</li>
                  <li>• Manage labels and folders</li>
                  <li>• Access read/unread status</li>
                </>
              )}
              {channelType === 'discord' && (
                <>
                  <li>• Read messages from server</li>
                  <li>• Send messages on your behalf</li>
                  <li>• Access member information</li>
                  <li>• Manage notifications</li>
                </>
              )}
            </ul>
          </div>

          {/* Email Provider Selection */}
          {channelType === 'email' && !emailProvider && (
            <div className="space-y-3">
              <Label>Choose your email provider:</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col gap-2"
                  onClick={() => setEmailProvider('gmail')}
                >
                  <Mail className="size-6" />
                  <span>Gmail</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col gap-2"
                  onClick={() => setEmailProvider('outlook')}
                >
                  <Mail className="size-6" />
                  <span>Outlook</span>
                </Button>
              </div>
            </div>
          )}

          {/* Connect Button */}
          {(channelType !== 'email' || emailProvider) && (
            <Button 
              className="w-full" 
              onClick={() => handleConnect(emailProvider || undefined)}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  Connect with {channelType === 'email' ? emailProvider : channelNames[channelType]}
                </>
              )}
            </Button>
          )}

          {/* Security Note */}
          <p className="text-xs text-muted-foreground text-center">
            🔒 Encrypted end-to-end • SOC 2 compliant • We never store passwords
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// API Key Flow Modal
interface APIKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelType: ChannelType;
  onSuccess: (integration: Integration) => void;
}

export function APIKeyModal({ isOpen, onClose, channelType, onSuccess }: APIKeyModalProps) {
  const [isTesting, setIsTesting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [smsProvider, setSmsProvider] = useState<'twilio' | 'messagebird' | null>(null);
  
  // Form fields
  const [botToken, setBotToken] = useState('');
  const [accountSid, setAccountSid] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [webhookUrl] = useState(`https://api.wondai.com/webhooks/user_123/${channelType}`);

  const handleTest = () => {
    setIsTesting(true);

    // Simulate testing
    setTimeout(() => {
      // Simple validation
      if (channelType === 'telegram' && botToken.length > 20) {
        setIsConnected(true);
        toast.success('Connection test successful!');
      } else if (channelType === 'sms' && accountSid && authToken) {
        setIsConnected(true);
        toast.success('Connection test successful!');
      } else {
        toast.error('Invalid credentials. Please check and try again.');
      }
      setIsTesting(false);
    }, 1500);
  };

  const handleConnect = () => {
    const integration = createMockIntegration(channelType, 'connected');
    
    if (channelType === 'telegram') {
      integration.metadata.botUsername = '@acme_support_bot';
      integration.credentials = { token: `telegram_••••••••••••${botToken.slice(-4)}` };
    } else if (channelType === 'sms') {
      integration.metadata.provider = smsProvider === 'twilio' ? 'Twilio' : 'MessageBird';
      integration.metadata.phoneNumber = phoneNumber;
      integration.credentials = {
        accountSid: `AC••••••••••••••••${accountSid.slice(-4)}`,
        token: `${smsProvider}_••••••••••••${authToken.slice(-4)}`,
      };
    }

    onSuccess(integration);
    toast.success(`${channelType === 'telegram' ? 'Telegram' : 'SMS'} connected successfully!`);
    onClose();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Connect {channelType === 'telegram' ? 'Telegram' : 'SMS'}
          </DialogTitle>
          <DialogDescription>
            Follow the steps below to set up your integration
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Telegram Setup */}
          {channelType === 'telegram' && (
            <>
              {/* Instructions */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <div className="size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 text-sm">
                    1
                  </div>
                  <div className="flex-1 text-sm">
                    <div className="font-medium mb-1">Create a bot with @BotFather</div>
                    <p className="text-muted-foreground">
                      Open Telegram and search for <code className="px-1.5 py-0.5 bg-background rounded">@BotFather</code>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <div className="size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 text-sm">
                    2
                  </div>
                  <div className="flex-1 text-sm">
                    <div className="font-medium mb-1">Send /newbot command</div>
                    <p className="text-muted-foreground">
                      Follow the prompts to create your bot and get your API token
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <div className="size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 text-sm">
                    3
                  </div>
                  <div className="flex-1 text-sm">
                    <div className="font-medium mb-1">Copy your bot token</div>
                    <p className="text-muted-foreground">
                      It looks like: <code className="px-1.5 py-0.5 bg-background rounded">110201543:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw</code>
                    </p>
                  </div>
                </div>
              </div>

              {/* Token Input */}
              <div className="space-y-2">
                <Label htmlFor="bot-token">Bot Token</Label>
                <div className="relative">
                  <Input
                    id="bot-token"
                    type={showToken ? 'text' : 'password'}
                    placeholder="110201543:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw"
                    value={botToken}
                    onChange={(e) => setBotToken(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowToken(!showToken)}
                  >
                    {showToken ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                </div>
              </div>

              {/* Webhook URL */}
              <div className="space-y-2">
                <Label>Webhook URL (copy this to your bot settings)</Label>
                <div className="flex gap-2">
                  <Input value={webhookUrl} readOnly className="font-mono text-sm" />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(webhookUrl)}
                  >
                    <Copy className="size-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Configure this in @BotFather using /setwebhook
                </p>
              </div>
            </>
          )}

          {/* SMS Setup */}
          {channelType === 'sms' && (
            <>
              {/* Provider Selection */}
              {!smsProvider && (
                <div className="space-y-3">
                  <Label>Select your SMS provider:</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="h-auto py-6 flex flex-col gap-2"
                      onClick={() => setSmsProvider('twilio')}
                    >
                      <MessageSquare className="size-6" />
                      <span>Twilio</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto py-6 flex flex-col gap-2"
                      onClick={() => setSmsProvider('messagebird')}
                    >
                      <MessageSquare className="size-6" />
                      <span>MessageBird</span>
                    </Button>
                  </div>
                </div>
              )}

              {smsProvider && (
                <>
                  {/* Instructions */}
                  <Alert>
                    <AlertTitle>
                      You'll need your {smsProvider === 'twilio' ? 'Twilio' : 'MessageBird'} credentials
                    </AlertTitle>
                    <AlertDescription>
                      <a
                        href={smsProvider === 'twilio' ? 'https://console.twilio.com' : 'https://dashboard.messagebird.com'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        Open {smsProvider === 'twilio' ? 'Twilio' : 'MessageBird'} Console
                        <ExternalLink className="size-3" />
                      </a>
                    </AlertDescription>
                  </Alert>

                  {/* Form Fields */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="account-sid">
                        {smsProvider === 'twilio' ? 'Account SID' : 'API Key'}
                      </Label>
                      <Input
                        id="account-sid"
                        placeholder={smsProvider === 'twilio' ? 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' : 'xxxxxxxxxxxxxxxxxxxxxxxx'}
                        value={accountSid}
                        onChange={(e) => setAccountSid(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="auth-token">Auth Token</Label>
                      <div className="relative">
                        <Input
                          id="auth-token"
                          type={showToken ? 'text' : 'password'}
                          placeholder="Enter your auth token"
                          value={authToken}
                          onChange={(e) => setAuthToken(e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowToken(!showToken)}
                        >
                          {showToken ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone-number">Phone Number</Label>
                      <Input
                        id="phone-number"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Webhook URL */}
                  <div className="space-y-2">
                    <Label>Webhook URL</Label>
                    <div className="flex gap-2">
                      <Input value={webhookUrl} readOnly className="font-mono text-sm" />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(webhookUrl)}
                      >
                        <Copy className="size-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Add this webhook URL in your {smsProvider === 'twilio' ? 'Twilio' : 'MessageBird'} console
                    </p>
                  </div>
                </>
              )}
            </>
          )}

          {/* Test/Connect Buttons */}
          {((channelType === 'telegram' && botToken) || (channelType === 'sms' && smsProvider && accountSid && authToken)) && (
            <div className="flex gap-3">
              {!isConnected && (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleTest}
                  disabled={isTesting}
                >
                  {isTesting ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    'Test Connection'
                  )}
                </Button>
              )}
              
              <Button
                className="flex-1"
                onClick={handleConnect}
                disabled={!isConnected}
              >
                {isConnected ? (
                  <>
                    <CheckCircle2 className="size-4 mr-2" />
                    Connect
                  </>
                ) : (
                  'Connect (test first)'
                )}
              </Button>
            </div>
          )}

          {/* Security Note */}
          <p className="text-xs text-muted-foreground text-center">
            🔒 All credentials are encrypted at rest • SOC 2 compliant
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Complex Setup Modal (WhatsApp)
interface ComplexSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (integration: Integration) => void;
}

export function ComplexSetupModal({ isOpen, onClose, onSuccess }: ComplexSetupModalProps) {
  const handleStartSetup = () => {
    // Open external link
    window.open('https://business.facebook.com', '_blank');
    toast.info('Opening Meta Business Manager...');
  };

  const handleSkip = () => {
    toast.info('You can set up WhatsApp later from the Integrations page');
    onClose();
  };

  const handleMarkPending = () => {
    const integration = createMockIntegration('whatsapp', 'pending_verification');
    onSuccess(integration);
    toast.info('WhatsApp verification in progress. We\'ll email you when ready.');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Connect WhatsApp Business</DialogTitle>
          <DialogDescription>
            Set up WhatsApp Business API integration for your account
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* WhatsApp Business Info */}
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
              <MessageSquare className="size-5 text-green-600" />
            </div>
            <div>
              <div className="font-semibold mb-1">WhatsApp Business</div>
              <p className="text-sm text-muted-foreground">
                Requires Meta Business verification and phone number
              </p>
            </div>
          </div>

          {/* Warning Alert */}
          <Alert className="bg-orange-50 border-orange-200">
            <AlertCircle className="size-4 text-orange-600" />
            <AlertTitle className="text-orange-900">Complex Setup Required</AlertTitle>
            <AlertDescription className="text-orange-800">
              WhatsApp Business API requires Meta Business verification and can take 3-5 business days. 
              We recommend skipping this for now and completing it from Settings → Integrations.
            </AlertDescription>
          </Alert>

          {/* Setup Steps */}
          <div>
            <div className="font-medium mb-3">Setup steps:</div>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li>1. Create or link a Meta Business Account</li>
              <li>2. Submit business verification documents</li>
              <li>3. Wait for Meta approval (3-5 business days)</li>
              <li>4. Add and verify a phone number</li>
              <li>5. Configure webhook settings in Meta Business Manager</li>
              <li>6. Test message delivery</li>
            </ol>
          </div>

          {/* Alternative Option */}
          <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
            <div className="size-8 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
              <MessageSquare className="size-4 text-green-600" />
            </div>
            <div>
              <div className="font-medium mb-1">Alternative: WhatsApp Cloud API</div>
              <p className="text-sm text-muted-foreground">
                Use Meta's Cloud API for faster setup (no approval needed for testing). 
                Limited to 1,000 conversations/month on free tier.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button className="w-full" onClick={handleStartSetup}>
              Start WhatsApp Setup
              <ExternalLink className="size-4 ml-2" />
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full" 
              onClick={handleSkip}
            >
              Skip for now - I'll set this up later
            </Button>
          </div>

          {/* Security Note */}
          <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
            <CheckCircle2 className="size-4 text-green-600 shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Your credentials are encrypted and stored securely. Wondai is SOC 2 Type II compliant and never stores your passwords.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}