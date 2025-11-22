export type IntegrationStatus = 
  | 'not_connected' 
  | 'connecting' 
  | 'connected' 
  | 'error' 
  | 'pending_verification';

export type ChannelType = 
  | 'slack' 
  | 'email' 
  | 'whatsapp' 
  | 'telegram' 
  | 'discord' 
  | 'sms';

export type ComplexityLevel = 'easy' | 'moderate' | 'complex';

export interface Integration {
  id: string;
  channelType: ChannelType;
  instanceName: string;
  status: IntegrationStatus;
  connectedAt?: Date;
  lastSyncAt?: Date;
  metadata: {
    workspaceName?: string; // Slack, Discord
    emailAddress?: string; // Email
    phoneNumber?: string; // WhatsApp, SMS
    botUsername?: string; // Telegram
    provider?: string; // SMS provider (Twilio, MessageBird)
  };
  stats?: {
    totalMessages: number;
    unreadCount: number;
    lastMessageAt?: Date;
  };
  credentials?: {
    token?: string; // Masked for display
    accountSid?: string; // For SMS
  };
}

export interface ChannelInfo {
  id: ChannelType;
  name: string;
  complexity: ComplexityLevel;
  timeEstimate: string;
  requirements: string[];
  authMethod: 'oauth' | 'api_key' | 'complex';
  providers?: string[]; // For channels like SMS that support multiple providers
}

export const channelInfoMap: Record<ChannelType, ChannelInfo> = {
  slack: {
    id: 'slack',
    name: 'Slack',
    complexity: 'easy',
    timeEstimate: '30 seconds',
    requirements: [
      'Workspace admin access',
      'Permission to install apps',
    ],
    authMethod: 'oauth',
  },
  email: {
    id: 'email',
    name: 'Email',
    complexity: 'easy',
    timeEstimate: '1 minute',
    requirements: [
      'Gmail or Outlook account',
      'Email access permissions',
    ],
    authMethod: 'oauth',
  },
  discord: {
    id: 'discord',
    name: 'Discord',
    complexity: 'easy',
    timeEstimate: '1 minute',
    requirements: [
      'Server admin access',
      'Permission to add bots',
    ],
    authMethod: 'oauth',
  },
  telegram: {
    id: 'telegram',
    name: 'Telegram',
    complexity: 'moderate',
    timeEstimate: '2-3 minutes',
    requirements: [
      'Telegram account',
      'Bot token from @BotFather',
    ],
    authMethod: 'api_key',
  },
  sms: {
    id: 'sms',
    name: 'SMS',
    complexity: 'moderate',
    timeEstimate: '3-5 minutes',
    requirements: [
      'Twilio or MessageBird account',
      'API credentials',
      'Phone number',
    ],
    authMethod: 'api_key',
    providers: ['Twilio', 'MessageBird'],
  },
  whatsapp: {
    id: 'whatsapp',
    name: 'WhatsApp',
    complexity: 'complex',
    timeEstimate: '3-5 business days',
    requirements: [
      'Meta Business Account',
      'Business verification',
      'Phone number verification',
      'Webhook configuration',
    ],
    authMethod: 'complex',
  },
};

// Local storage keys
const STORAGE_KEYS = {
  INTEGRATIONS: 'wondai_integrations',
  SELECTED_CHANNELS: 'wondai_selected_channels',
};

// Create mock integration data
export const createMockIntegration = (
  channelType: ChannelType,
  status: IntegrationStatus = 'connected'
): Integration => {
  const mockData: Record<ChannelType, Partial<Integration>> = {
    slack: {
      instanceName: 'Engineering Workspace',
      metadata: {
        workspaceName: 'Acme Corp Engineering',
      },
      stats: {
        totalMessages: 1247,
        unreadCount: 23,
        lastMessageAt: new Date(),
      },
    },
    email: {
      instanceName: 'Support Inbox',
      metadata: {
        emailAddress: 'support@acmecorp.com',
      },
      stats: {
        totalMessages: 3891,
        unreadCount: 45,
        lastMessageAt: new Date(),
      },
    },
    whatsapp: {
      instanceName: 'Customer Service',
      metadata: {
        phoneNumber: '+1 (555) 123-4567',
      },
      stats: {
        totalMessages: 892,
        unreadCount: 12,
        lastMessageAt: new Date(),
      },
    },
    telegram: {
      instanceName: 'Support Bot',
      metadata: {
        botUsername: '@acme_support_bot',
      },
      stats: {
        totalMessages: 534,
        unreadCount: 8,
        lastMessageAt: new Date(),
      },
      credentials: {
        token: 'telegram_••••••••••••8a2c',
      },
    },
    discord: {
      instanceName: 'Community Server',
      metadata: {
        workspaceName: 'Acme Community',
      },
      stats: {
        totalMessages: 2103,
        unreadCount: 67,
        lastMessageAt: new Date(),
      },
    },
    sms: {
      instanceName: 'Twilio SMS',
      metadata: {
        phoneNumber: '+1 (555) 987-6543',
        provider: 'Twilio',
      },
      stats: {
        totalMessages: 421,
        unreadCount: 5,
        lastMessageAt: new Date(),
      },
      credentials: {
        accountSid: 'AC••••••••••••••••34f2',
        token: 'twilio_••••••••••••7b9a',
      },
    },
  };

  const base = mockData[channelType] || {};

  return {
    id: `int_${channelType}_${Date.now()}`,
    channelType,
    status,
    connectedAt: status === 'connected' ? new Date() : undefined,
    lastSyncAt: status === 'connected' ? new Date() : undefined,
    instanceName: base.instanceName || channelType,
    metadata: base.metadata || {},
    stats: base.stats,
    credentials: base.credentials,
  };
};

// Storage functions
export const saveIntegrations = (integrations: Integration[]) => {
  localStorage.setItem(STORAGE_KEYS.INTEGRATIONS, JSON.stringify(integrations));
};

export const loadIntegrations = (): Integration[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.INTEGRATIONS);
  if (!stored) return [];
  
  const integrations = JSON.parse(stored);
  // Convert date strings back to Date objects
  return integrations.map((int: any) => ({
    ...int,
    connectedAt: int.connectedAt ? new Date(int.connectedAt) : undefined,
    lastSyncAt: int.lastSyncAt ? new Date(int.lastSyncAt) : undefined,
    stats: int.stats ? {
      ...int.stats,
      lastMessageAt: int.stats.lastMessageAt ? new Date(int.stats.lastMessageAt) : undefined,
    } : undefined,
  }));
};

export const saveSelectedChannels = (channels: ChannelType[]) => {
  localStorage.setItem(STORAGE_KEYS.SELECTED_CHANNELS, JSON.stringify(channels));
};

export const loadSelectedChannels = (): ChannelType[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.SELECTED_CHANNELS);
  return stored ? JSON.parse(stored) : [];
};

export const clearIntegrationData = () => {
  localStorage.removeItem(STORAGE_KEYS.INTEGRATIONS);
  localStorage.removeItem(STORAGE_KEYS.SELECTED_CHANNELS);
};
