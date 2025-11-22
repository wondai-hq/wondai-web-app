export type ChannelType = 'whatsapp' | 'email' | 'telegram' | 'slack' | 'discord' | 'sms';

export interface Message {
  id: string;
  threadId: string;
  channel: ChannelType;
  sender: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  isInternal?: boolean;
  attachments?: string[];
  voiceTranscript?: string;
}

export interface Thread {
  id: string;
  subject: string;
  channel: ChannelType;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
  tags: string[];
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  sentiment: 'positive' | 'neutral' | 'negative';
  customerName: string;
  customerAvatar?: string;
  messageCount: number;
  hasAttachments?: boolean;
}

export interface AIInsight {
  threadId: string;
  summary: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  tasks: string[];
  followUps: string[];
  deadlines: { task: string; date: string }[];
  intent: string;
  priorityScore: number;
  recurringIssues: string[];
  confidence: number;
  suggestedTags: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Agent' | 'Viewer';
  avatar?: string;
  activeThreads: number;
  status: 'online' | 'away' | 'offline';
}

export const mockThreads: Thread[] = [
  {
    id: '1',
    subject: 'Payment issue with order #45234',
    channel: 'whatsapp',
    lastMessage: 'I still haven\'t received my refund after 5 days...',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    unread: true,
    tags: ['Payment Issues', 'Urgent', 'VIP'],
    assignedTo: 'Sarah Chen',
    priority: 'urgent',
    sentiment: 'negative',
    customerName: 'John Martinez',
    messageCount: 8,
    hasAttachments: true,
  },
  {
    id: '2',
    subject: 'Product inquiry - Enterprise plan',
    channel: 'email',
    lastMessage: 'Can we schedule a demo for next week?',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    unread: true,
    tags: ['VIP', 'Follow-ups Needed'],
    assignedTo: 'Michael Torres',
    priority: 'high',
    sentiment: 'positive',
    customerName: 'Lisa Anderson',
    messageCount: 4,
  },
  {
    id: '3',
    subject: 'Technical support needed',
    channel: 'slack',
    lastMessage: 'The integration keeps disconnecting every few hours',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    unread: false,
    tags: ['Recurring Issues (AI)', 'After Sales'],
    assignedTo: 'Sarah Chen',
    priority: 'medium',
    sentiment: 'neutral',
    customerName: 'David Kim',
    messageCount: 12,
    hasAttachments: true,
  },
  {
    id: '4',
    subject: 'Complaint about delivery time',
    channel: 'telegram',
    lastMessage: 'This is unacceptable. I was promised 2-day shipping.',
    timestamp: new Date(Date.now() - 1000 * 60 * 180),
    unread: true,
    tags: ['Complaints', 'Urgent'],
    priority: 'urgent',
    sentiment: 'negative',
    customerName: 'Emma Wilson',
    messageCount: 6,
  },
  {
    id: '5',
    subject: 'Question about subscription renewal',
    channel: 'discord',
    lastMessage: 'Thanks for the help! That makes sense now.',
    timestamp: new Date(Date.now() - 1000 * 60 * 240),
    unread: false,
    tags: ['After Sales'],
    assignedTo: 'Alex Rivera',
    priority: 'low',
    sentiment: 'positive',
    customerName: 'Ryan Chang',
    messageCount: 5,
  },
  {
    id: '6',
    subject: 'Billing question',
    channel: 'sms',
    lastMessage: 'Why was I charged twice?',
    timestamp: new Date(Date.now() - 1000 * 60 * 300),
    unread: true,
    tags: ['Payment Issues'],
    priority: 'high',
    sentiment: 'negative',
    customerName: 'Sophie Taylor',
    messageCount: 3,
  },
  {
    id: '7',
    subject: 'Feature request - API documentation',
    channel: 'email',
    lastMessage: 'Would love to see more examples in the docs',
    timestamp: new Date(Date.now() - 1000 * 60 * 400),
    unread: false,
    tags: ['Follow-ups Needed'],
    assignedTo: 'Michael Torres',
    priority: 'low',
    sentiment: 'positive',
    customerName: 'James Brown',
    messageCount: 2,
  },
  {
    id: '8',
    subject: 'Urgent: Account locked',
    channel: 'whatsapp',
    lastMessage: 'I need access immediately for a client presentation!',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    unread: true,
    tags: ['Urgent', 'VIP'],
    priority: 'urgent',
    sentiment: 'negative',
    customerName: 'Maria Garcia',
    messageCount: 4,
  },
];

export const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      threadId: '1',
      channel: 'whatsapp',
      sender: 'John Martinez',
      content: 'Hi, I ordered product #45234 last week and was charged twice on my credit card.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    },
    {
      id: 'm2',
      threadId: '1',
      channel: 'whatsapp',
      sender: 'Sarah Chen (Agent)',
      content: 'Hello John! I apologize for the inconvenience. Let me check your order right away.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5 + 1000 * 60 * 5),
    },
    {
      id: 'm3',
      threadId: '1',
      channel: 'whatsapp',
      sender: 'Sarah Chen (Agent)',
      content: '[INTERNAL NOTE] Customer is VIP tier. Checked payment system - confirmed duplicate charge of $299.99. Refund initiated, should process in 3-5 business days.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5 + 1000 * 60 * 10),
      isInternal: true,
    },
    {
      id: 'm4',
      threadId: '1',
      channel: 'whatsapp',
      sender: 'Sarah Chen (Agent)',
      content: 'I\'ve confirmed the duplicate charge and initiated a refund of $299.99. It should appear in your account within 3-5 business days. I\'ve also added a $50 credit to your account for the inconvenience.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5 + 1000 * 60 * 12),
    },
    {
      id: 'm5',
      threadId: '1',
      channel: 'whatsapp',
      sender: 'John Martinez',
      content: 'Thank you! When exactly should I expect it? I need to make sure my credit card statement is correct.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    },
    {
      id: 'm6',
      threadId: '1',
      channel: 'whatsapp',
      sender: 'Sarah Chen (Agent)',
      content: 'The refund was processed on our end on the 18th, so you should see it by the 23rd at the latest. I\'ll follow up with you on the 23rd to confirm!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 15),
    },
    {
      id: 'm7',
      threadId: '1',
      channel: 'whatsapp',
      sender: 'John Martinez',
      content: 'I still haven\'t received my refund after 5 days...',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
    },
    {
      id: 'm8',
      threadId: '1',
      channel: 'whatsapp',
      sender: 'Sarah Chen (Agent)',
      content: '[INTERNAL NOTE] Need to escalate to finance team. Customer is getting frustrated. This is day 5.',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      isInternal: true,
    },
  ],
};

export const mockAIInsights: Record<string, AIInsight> = {
  '1': {
    threadId: '1',
    summary: 'VIP customer experiencing delayed refund for duplicate payment charge ($299.99). Initial promise of 3-5 days has passed. Customer is frustrated and needs immediate escalation.',
    sentiment: 'negative',
    tasks: [
      'Escalate to finance team',
      'Verify refund status in payment system',
      'Provide concrete timeline or immediate resolution',
    ],
    followUps: [
      'Call customer to apologize and provide update',
      'Consider additional compensation for extended delay',
    ],
    deadlines: [
      { task: 'Resolve refund issue', date: 'Today' },
      { task: 'Follow up confirmation', date: 'Tomorrow' },
    ],
    intent: 'Complaint Resolution - Payment Issue',
    priorityScore: 95,
    recurringIssues: ['Payment processing delays', 'Duplicate charges'],
    confidence: 0.94,
    suggestedTags: ['Escalate to Manager', 'Compensation Needed'],
  },
};

export const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@wondai.com',
    role: 'Agent',
    activeThreads: 12,
    status: 'online',
  },
  {
    id: '2',
    name: 'Michael Torres',
    email: 'michael.torres@wondai.com',
    role: 'Agent',
    activeThreads: 8,
    status: 'online',
  },
  {
    id: '3',
    name: 'Alex Rivera',
    email: 'alex.rivera@wondai.com',
    role: 'Manager',
    activeThreads: 5,
    status: 'away',
  },
  {
    id: '4',
    name: 'Jennifer Park',
    email: 'jennifer.park@wondai.com',
    role: 'Admin',
    activeThreads: 2,
    status: 'online',
  },
];

export const smartFilters = [
  {
    id: 'urgent',
    name: 'Urgent',
    description: 'Messages requiring immediate attention',
    count: 43,
    color: 'hsl(var(--urgent))',
  },
  {
    id: 'vip',
    name: 'VIP',
    description: 'High-value customers and priority accounts',
    count: 28,
    color: 'hsl(var(--vip))',
  },
  {
    id: 'complaints',
    name: 'Complaints',
    description: 'Customer complaints and negative feedback',
    count: 15,
    color: 'hsl(var(--complaint))',
  },
  {
    id: 'payment',
    name: 'Payment Issues',
    description: 'Billing, refunds, and payment-related queries',
    count: 22,
    color: 'hsl(210 100% 50%)',
  },
  {
    id: 'followups',
    name: 'Follow-ups Needed',
    description: 'Conversations awaiting follow-up action',
    count: 31,
    color: 'hsl(45 93% 47%)',
  },
  {
    id: 'aftersales',
    name: 'After Sales',
    description: 'Post-purchase support and inquiries',
    count: 19,
    color: 'hsl(162 73% 46%)',
  },
  {
    id: 'recurring',
    name: 'Recurring Issues (AI)',
    description: 'Patterns detected by Wanda AI',
    count: 12,
    color: 'hsl(var(--ai))',
  },
];

export const integrations = [
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    description: 'Connect your WhatsApp Business account',
    icon: 'whatsapp',
    connected: true,
    lastSync: new Date(Date.now() - 1000 * 60 * 15),
    messagesCount: 1234,
  },
  {
    id: 'email',
    name: 'Gmail / Outlook',
    description: 'Sync your email inbox',
    icon: 'email',
    connected: true,
    lastSync: new Date(Date.now() - 1000 * 60 * 5),
    messagesCount: 3456,
  },
  {
    id: 'telegram',
    name: 'Telegram Bot API',
    description: 'Connect your Telegram bot',
    icon: 'telegram',
    connected: true,
    lastSync: new Date(Date.now() - 1000 * 60 * 30),
    messagesCount: 567,
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Integrate your Slack workspace',
    icon: 'slack',
    connected: true,
    lastSync: new Date(Date.now() - 1000 * 60 * 8),
    messagesCount: 890,
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Connect your Discord server',
    icon: 'discord',
    connected: false,
    lastSync: null,
    messagesCount: 0,
  },
  {
    id: 'sms',
    name: 'SMS Provider',
    description: 'Twilio, Vonage, or custom SMS gateway',
    icon: 'sms',
    connected: true,
    lastSync: new Date(Date.now() - 1000 * 60 * 45),
    messagesCount: 234,
  },
];

// Feed Details with Smart Filters
export interface FeedDetails {
  id: string;
  name: string;
  description: string;
  smartFilters: Array<{ id: string; description: string }>;
  examples: {
    leastLikely: Thread;
    average: Thread;
    mostLikely: Thread;
  };
  threadCount: number;
}

export const mockFeedDetails: Record<string, FeedDetails> = {
  'urgent': {
    id: 'urgent',
    name: 'Urgent Feed',
    description: 'Messages requiring immediate attention based on sentiment, keywords, and customer status.',
    threadCount: 8,
    smartFilters: [
      { id: 'f1', description: 'Messages containing urgent keywords like "immediately", "asap", or "emergency"' },
      { id: 'f2', description: 'Negative sentiment with high priority score from Wanda AI' },
      { id: 'f3', description: 'VIP customers with unresolved issues older than 24 hours' },
      { id: 'f4', description: 'Payment-related complaints from any customer' },
    ],
    examples: {
      leastLikely: mockThreads[6], // James Brown - feature request
      average: mockThreads[2], // David Kim - technical support
      mostLikely: mockThreads[7], // Maria Garcia - urgent account locked
    },
  },
  'vip': {
    id: 'vip',
    name: 'VIP Customers',
    description: 'High-value customers and priority accounts that require special attention and faster response times.',
    threadCount: 5,
    smartFilters: [
      { id: 'f1', description: 'Customers tagged as VIP in the system' },
      { id: 'f2', description: 'Enterprise plan subscribers' },
      { id: 'f3', description: 'Customers with lifetime value over $10,000' },
    ],
    examples: {
      leastLikely: mockThreads[4], // Ryan Chang - subscription question
      average: mockThreads[1], // Lisa Anderson - enterprise inquiry
      mostLikely: mockThreads[0], // John Martinez - VIP payment issue
    },
  },
  'payment': {
    id: 'payment',
    name: 'Payment Issues',
    description: 'All billing, refund, and payment-related queries that need careful handling and quick resolution.',
    threadCount: 6,
    smartFilters: [
      { id: 'f1', description: 'Messages mentioning payment, billing, refund, or charge keywords' },
      { id: 'f2', description: 'Wanda AI detected payment intent with high confidence' },
      { id: 'f3', description: 'Complaints about duplicate charges or failed transactions' },
    ],
    examples: {
      leastLikely: mockThreads[4], // Ryan Chang - subscription renewal
      average: mockThreads[5], // Sophie Taylor - billing question
      mostLikely: mockThreads[0], // John Martinez - duplicate charge refund
    },
  },
};

// Contacts
export interface Contact {
  id: string;
  name: string;
  type: 'contact' | 'company' | 'tag' | 'thread';
  channel?: ChannelType;
  lastViewed: Date;
  icon?: string;
}

export const mockRecentContacts: Contact[] = [
  {
    id: 's1',
    name: 'John Martinez',
    type: 'contact',
    channel: 'whatsapp',
    lastViewed: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: 's2',
    name: 'Acme Corporation',
    type: 'company',
    channel: 'email',
    lastViewed: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: 's3',
    name: 'Lisa Anderson',
    type: 'contact',
    channel: 'email',
    lastViewed: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: 's4',
    name: 'Priority Support',
    type: 'tag',
    lastViewed: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    id: 's5',
    name: 'David Kim',
    type: 'contact',
    channel: 'slack',
    lastViewed: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    id: 's6',
    name: 'TechStart Inc',
    type: 'company',
    channel: 'telegram',
    lastViewed: new Date(Date.now() - 1000 * 60 * 90),
  },
  {
    id: 's7',
    name: 'Emma Wilson',
    type: 'contact',
    channel: 'telegram',
    lastViewed: new Date(Date.now() - 1000 * 60 * 120),
  },
  {
    id: 's8',
    name: 'Enterprise Customers',
    type: 'tag',
    lastViewed: new Date(Date.now() - 1000 * 60 * 150),
  },
];