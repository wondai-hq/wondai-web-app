import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Sparkles, UserPlus, Users, TrendingUp, Calendar, MessageSquare, Check, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { ContactEditModal } from '../ContactEditModal';
import { mockRecentContacts } from '../../utils/mockData';

export function ContactsOverview() {
  const navigate = useNavigate();
  const [selectedContact, setSelectedContact] = useState<any | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const goBack = () => {
    navigate('/dashboard/inbox');
  };

  // Mock data for suggested merges
  const suggestedMerges = [
    {
      id: 'merge-1',
      primaryContact: {
        id: 'c1',
        name: 'Sarah Chen',
        identities: [
          { platform: 'email' as const, identifier: 'sarah.chen@acme.com', messageCount: 47, lastMessage: '2 hours ago', messageSummary: 'Discussed Q4 contract renewal and payment schedules' }
        ]
      },
      suggestedIdentities: [
        { platform: 'whatsapp' as const, identifier: '+1 (555) 234-5678', messageCount: 23, lastMessage: '1 day ago', messageSummary: 'Urgent shipping inquiry for Order #A-2847' },
        { platform: 'telegram' as const, identifier: '@sarahchen_design', messageCount: 8, lastMessage: '3 days ago', messageSummary: 'Follow-up on design mockups and feedback' }
      ],
      confidence: 92
    },
    {
      id: 'merge-2',
      primaryContact: {
        id: 'c2',
        name: 'TechCorp Solutions',
        identities: [
          { platform: 'email' as const, identifier: 'contact@techcorp.io', messageCount: 34, lastMessage: '5 hours ago', messageSummary: 'Partnership proposal and pricing negotiations' }
        ]
      },
      suggestedIdentities: [
        { platform: 'slack' as const, identifier: '#techcorp-support', messageCount: 15, lastMessage: '2 days ago', messageSummary: 'Technical integration support requests' }
      ],
      confidence: 87
    },
    {
      id: 'merge-3',
      primaryContact: {
        id: 'c3',
        name: 'Marcus Rivera',
        identities: [
          { platform: 'email' as const, identifier: 'marcus.r@startup.co', messageCount: 19, lastMessage: '6 hours ago', messageSummary: 'Product feature requests and bug reports' }
        ]
      },
      suggestedIdentities: [
        { platform: 'whatsapp' as const, identifier: '+1 (555) 876-5432', messageCount: 12, lastMessage: '4 hours ago', messageSummary: 'Payment issue with invoice #INV-3421' }
      ],
      confidence: 78
    }
  ];

  // Mock data for recent/frequent contacts
  const recentContacts = mockRecentContacts.slice(0, 6).map((contact, idx) => ({
    ...contact,
    messageCount: [47, 34, 28, 23, 19, 15][idx],
    lastActive: ['2 hours ago', '5 hours ago', '1 day ago', '2 days ago', '3 days ago', '4 days ago'][idx],
    trend: ['+12%', '+8%', '+5%', '-3%', '+15%', '+2%'][idx],
  }));

  const handleViewMerge = (merge: typeof suggestedMerges[0]) => {
    const contactData = {
      id: merge.primaryContact.id,
      name: merge.primaryContact.name,
      autoMerged: merge.primaryContact.identities,
      suggested: merge.suggestedIdentities,
    };
    setSelectedContact(contactData);
    setIsContactModalOpen(true);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="h-14 border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={goBack}>
            <ArrowLeft className="size-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Users className="size-5 text-muted-foreground" />
            <h1 className="font-semibold">Contacts Overview</h1>
          </div>
        </div>
        <Button>
          <UserPlus className="size-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* AI Summary Card */}
          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="size-5" style={{ color: 'hsl(var(--ai))' }} />
                <CardTitle>Wanda's Insights</CardTitle>
              </div>
              <CardDescription>AI-powered contact intelligence</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">
                You have <strong>3 suggested contact merges</strong> with high confidence scores. 
                Merging these contacts will unify conversations across channels and provide better context.
              </p>
              <p className="text-sm">
                <strong>Sarah Chen</strong> is your most active contact this week with a 12% increase in engagement. 
                She's primarily reaching out about contract renewals and shipping inquiries across Email and WhatsApp.
              </p>
              <p className="text-sm">
                <strong>5 contacts</strong> haven't been active in over 2 weeks but had previously shown high engagement - 
                consider a follow-up campaign.
              </p>
            </CardContent>
          </Card>

          {/* Suggested Merges Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Suggested Contact Merges</h2>
                <p className="text-sm text-muted-foreground">
                  Wanda identified these contacts that might be the same person
                </p>
              </div>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">
                {suggestedMerges.length} Pending
              </Badge>
            </div>

            <div className="space-y-3">
              {suggestedMerges.map((merge) => (
                <Card key={merge.id} className="border-amber-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <Avatar className="size-10">
                          <AvatarFallback>
                            {merge.primaryContact.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{merge.primaryContact.name}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {merge.confidence}% Match
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm">
                              <span className="text-muted-foreground">Merge with:</span>
                              <div className="mt-1 space-y-1">
                                {merge.suggestedIdentities.map((identity, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-sm">
                                    <Badge variant="outline" className="text-xs">
                                      {identity.platform}
                                    </Badge>
                                    <span>{identity.identifier}</span>
                                    <span className="text-muted-foreground">
                                      ({identity.messageCount} messages)
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewMerge(merge)}
                        >
                          Review
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Most Active Contacts Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Most Active Contacts</h2>
                <p className="text-sm text-muted-foreground">
                  Based on message frequency in the last 7 days
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentContacts.map((contact) => (
                <Card key={contact.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-10">
                          <AvatarFallback>
                            {contact.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-sm">{contact.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {contact.messageCount} messages
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={
                          contact.trend.startsWith('+')
                            ? 'bg-green-50 text-green-700 border-green-300'
                            : 'bg-red-50 text-red-700 border-red-300'
                        }
                      >
                        <TrendingUp className="size-3 mr-1" />
                        {contact.trend}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="size-3" />
                      <span>Last active {contact.lastActive}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <MessageSquare className="size-3" />
                      <span>Primary: {contact.channel || 'Email'}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your contacts efficiently</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button variant="outline">
                <UserPlus className="size-4 mr-2" />
                Import Contacts
              </Button>
              <Button variant="outline">
                <Users className="size-4 mr-2" />
                Export All Contacts
              </Button>
              <Button variant="outline">
                <Sparkles className="size-4 mr-2" style={{ color: 'hsl(var(--ai))' }} />
                Auto-merge All Suggestions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact Edit Modal */}
      <ContactEditModal
        isOpen={isContactModalOpen}
        onClose={() => {
          setIsContactModalOpen(false);
          setSelectedContact(null);
        }}
        contact={selectedContact}
      />
    </div>
  );
}
