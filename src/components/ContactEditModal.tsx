import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  Mail, 
  MessageSquare, 
  Send, 
  Check, 
  X, 
  Plus,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useState } from 'react';

interface ContactIdentity {
  platform: 'whatsapp' | 'email' | 'telegram' | 'slack' | 'discord' | 'sms';
  identifier: string; // phone number, email, username
  messageCount: number;
  lastMessage: string;
  messageSummary: string;
}

interface Contact {
  name: string;
  autoMerged: ContactIdentity[];
  suggested: ContactIdentity[];
}

interface ContactEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact?: Contact;
}

const platformConfig = {
  whatsapp: { icon: MessageSquare, color: 'bg-green-500', label: 'WhatsApp' },
  email: { icon: Mail, color: 'bg-red-500', label: 'Email' },
  telegram: { icon: Send, color: 'bg-blue-500', label: 'Telegram' },
  slack: { icon: MessageSquare, color: 'bg-purple-500', label: 'Slack' },
  discord: { icon: MessageSquare, color: 'bg-indigo-500', label: 'Discord' },
  sms: { icon: MessageSquare, color: 'bg-orange-500', label: 'SMS' },
};

// Mock data for demonstration
const mockContact: Contact = {
  name: 'Sarah Chen',
  autoMerged: [
    {
      platform: 'email',
      identifier: 'sarah.chen@acme.com',
      messageCount: 47,
      lastMessage: '2 hours ago',
      messageSummary: 'Discussed Q4 contract renewal, payment schedules, and shipping delays'
    },
    {
      platform: 'whatsapp',
      identifier: '+1-555-0123',
      messageCount: 89,
      lastMessage: '5 hours ago',
      messageSummary: 'Urgent requests about product delivery, invoice questions, support issues'
    }
  ],
  suggested: [
    {
      platform: 'telegram',
      identifier: '@sarahchen',
      messageCount: 12,
      lastMessage: '1 day ago',
      messageSummary: 'Quick questions about pricing and availability'
    },
    {
      platform: 'slack',
      identifier: 'sarah.chen',
      messageCount: 8,
      lastMessage: '3 days ago',
      messageSummary: 'Project collaboration and team updates'
    }
  ]
};

export function ContactEditModal({ isOpen, onClose, contact }: ContactEditModalProps) {
  // Use mock contact as fallback if no contact is provided
  const activeContact = contact || mockContact;
  
  const [acceptedSuggestions, setAcceptedSuggestions] = useState<Set<string>>(new Set());
  const [rejectedSuggestions, setRejectedSuggestions] = useState<Set<string>>(new Set());
  const [removedAutoMerged, setRemovedAutoMerged] = useState<Set<string>>(new Set());
  const [manualPlatform, setManualPlatform] = useState<ContactIdentity['platform']>('email');
  const [manualIdentifier, setManualIdentifier] = useState('');

  const handleAcceptSuggestion = (identifier: string) => {
    const newAccepted = new Set(acceptedSuggestions);
    newAccepted.add(identifier);
    setAcceptedSuggestions(newAccepted);
    
    const newRejected = new Set(rejectedSuggestions);
    newRejected.delete(identifier);
    setRejectedSuggestions(newRejected);
  };

  const handleRejectSuggestion = (identifier: string) => {
    const newRejected = new Set(rejectedSuggestions);
    newRejected.add(identifier);
    setRejectedSuggestions(newRejected);
    
    const newAccepted = new Set(acceptedSuggestions);
    newAccepted.delete(identifier);
    setAcceptedSuggestions(newAccepted);
  };

  const handleRemoveAutoMerged = (identifier: string) => {
    const newRemoved = new Set(removedAutoMerged);
    if (newRemoved.has(identifier)) {
      newRemoved.delete(identifier);
    } else {
      newRemoved.add(identifier);
    }
    setRemovedAutoMerged(newRemoved);
  };

  const handleAddManual = () => {
    if (!manualIdentifier.trim()) return;
    // TODO: Add manual identity to contact
    console.log('Adding manual identity:', manualPlatform, manualIdentifier);
    setManualIdentifier('');
  };

  const handleSave = () => {
    // TODO: Save changes
    console.log('Saving contact changes...');
    console.log('Accepted suggestions:', Array.from(acceptedSuggestions));
    console.log('Rejected suggestions:', Array.from(rejectedSuggestions));
    console.log('Removed auto-merged:', Array.from(removedAutoMerged));
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white">
                {activeContact.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            {activeContact.name}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Review and manage merged identities across platforms
          </p>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Auto-Merged Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold">
                Automatically Merged ({activeContact.autoMerged.length})
              </h3>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                High Confidence
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              These identities were merged based on matching information
            </p>
            
            <div className="space-y-2">
              {activeContact.autoMerged.map((identity) => {
                const config = platformConfig[identity.platform];
                const Icon = config.icon;
                const isRemoved = removedAutoMerged.has(identity.identifier);
                
                return (
                  <div 
                    key={identity.identifier}
                    className={`border rounded-lg transition-all ${
                      isRemoved ? 'bg-red-50 border-red-200 opacity-60' : 'bg-white'
                    }`}
                  >
                    <div className="p-3 flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`w-8 h-8 ${config.color} rounded-lg flex items-center justify-center shrink-0`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{identity.identifier}</span>
                            <Badge variant="secondary" className="text-xs">
                              {config.label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                            <span>{identity.messageCount} messages</span>
                            <span>•</span>
                            <span>Last: {identity.lastMessage}</span>
                          </div>
                          <p className="text-sm text-slate-600">{identity.messageSummary}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 ml-2">
                        <Button
                          variant={isRemoved ? "outline" : "ghost"}
                          size="sm"
                          onClick={() => handleRemoveAutoMerged(identity.identifier)}
                          className={isRemoved ? "text-green-600 hover:text-green-700" : "text-red-600 hover:text-red-700"}
                        >
                          {isRemoved ? (
                            <>
                              <Check className="w-4 h-4 mr-1" />
                              Undo
                            </>
                          ) : (
                            <>
                              <X className="w-4 h-4 mr-1" />
                              Unmerge
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Suggested Merges Section */}
          {activeContact.suggested.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold">
                  Suggested Merges ({activeContact.suggested.length})
                </h3>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">
                  Review Needed
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                These identities might belong to the same person
              </p>
              
              <div className="space-y-2">
                {activeContact.suggested.map((identity) => {
                  const config = platformConfig[identity.platform];
                  const Icon = config.icon;
                  const isAccepted = acceptedSuggestions.has(identity.identifier);
                  const isRejected = rejectedSuggestions.has(identity.identifier);
                  
                  return (
                    <div 
                      key={identity.identifier}
                      className={`border rounded-lg transition-all ${
                        isAccepted 
                          ? 'bg-green-50 border-green-200' 
                          : isRejected 
                          ? 'bg-red-50 border-red-200 opacity-60' 
                          : 'bg-white border-amber-200'
                      }`}
                    >
                      <div className="p-3 flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`w-8 h-8 ${config.color} rounded-lg flex items-center justify-center shrink-0`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{identity.identifier}</span>
                              <Badge variant="secondary" className="text-xs">
                                {config.label}
                              </Badge>
                              {isAccepted && (
                                <Badge className="bg-green-600 text-xs">
                                  <Check className="w-3 h-3 mr-1" />
                                  Accepted
                                </Badge>
                              )}
                              {isRejected && (
                                <Badge variant="outline" className="text-xs">
                                  Rejected
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                              <span>{identity.messageCount} messages</span>
                              <span>•</span>
                              <span>Last: {identity.lastMessage}</span>
                            </div>
                            <p className="text-sm text-slate-600">{identity.messageSummary}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 ml-2">
                          {!isRejected && (
                            <Button
                              variant={isAccepted ? "outline" : "ghost"}
                              size="sm"
                              onClick={() => handleAcceptSuggestion(identity.identifier)}
                              className={isAccepted ? "text-green-600 border-green-300" : "text-green-600 hover:text-green-700"}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Merge
                            </Button>
                          )}
                          {!isAccepted && (
                            <Button
                              variant={isRejected ? "outline" : "ghost"}
                              size="sm"
                              onClick={() => handleRejectSuggestion(identity.identifier)}
                              className={isRejected ? "text-red-600 border-red-300" : "text-red-600 hover:text-red-700"}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Ignore
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Manual Add Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Plus className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold">Add Identity Manually</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Add an email, phone number, or username that belongs to this contact
            </p>
            
            <div className="p-4 border rounded-lg bg-slate-50">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <Label className="text-sm mb-2">Platform</Label>
                  <select 
                    className="w-full h-9 rounded-md border border-input bg-white px-3 text-sm"
                    value={manualPlatform}
                    onChange={(e) => setManualPlatform(e.target.value as ContactIdentity['platform'])}
                  >
                    {Object.entries(platformConfig).map(([key, config]) => (
                      <option key={key} value={key}>{config.label}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm mb-2">Email / Phone / Username</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., sarah@company.com or +1-555-0123"
                      value={manualIdentifier}
                      onChange={(e) => setManualIdentifier(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddManual();
                        }
                      }}
                    />
                    <Button 
                      onClick={handleAddManual}
                      disabled={!manualIdentifier.trim()}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {acceptedSuggestions.size > 0 && (
              <span className="text-green-600">
                {acceptedSuggestions.size} suggestion(s) accepted
              </span>
            )}
            {acceptedSuggestions.size > 0 && removedAutoMerged.size > 0 && ' • '}
            {removedAutoMerged.size > 0 && (
              <span className="text-red-600">
                {removedAutoMerged.size} identity(ies) removed
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}