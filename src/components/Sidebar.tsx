import { mockFeedDetails, mockRecentContacts, type Contact } from '../utils/mockData';
import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import {
  Inbox,
  UserCircle,
  Users,
  Star,
  Pin,
  MessageCircle,
  Mail,
  Send,
  Hash,
  MessageSquare,
  Phone,
  Zap,
  Award,
  AlertCircle,
  CreditCard,
  Clock,
  Package,
  RefreshCw,
  UsersRound,
  BarChart3,
  Settings,
  FileText,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MoreVertical,
  Plus,
  Target,
  Search,
  Building2,
  Tag,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { FeedDetailsModal, type FeedDetails } from './FeedDetailsModal';
import { CreateFeedModal } from './CreateFeedModal';
import { ContactDetailsModal } from './ContactDetailsModal';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const [selectedFeed, setSelectedFeed] = useState<FeedDetails | null>(null);
  const [isFeedModalOpen, setIsFeedModalOpen] = useState(false);
  const [isCreateFeedModalOpen, setIsCreateFeedModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  // Section collapse states - Focus and Feeds open by default, others closed
  const [sectionsExpanded, setSectionsExpanded] = useState({
    focus: true,
    feeds: true,
    contacts: true,
    channels: false,
    team: false,
    settings: false,
  });

  // Contacts search state
  const [contactsSearch, setContactsSearch] = useState('');

  const toggleSection = (section: keyof typeof sectionsExpanded) => {
    setSectionsExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Fuzzy search for contacts
  const getFilteredContacts = () => {
    if (!contactsSearch.trim()) {
      // Return 5 most recent contacts when no search
      return mockRecentContacts.slice(0, 5);
    }

    const query = contactsSearch.toLowerCase();
    const filtered = mockRecentContacts.filter(contact => 
      contact.name.toLowerCase().includes(query)
    );
    
    return filtered;
  };

  const filteredContacts = getFilteredContacts();

  // Helper function to get contact icon
  const getContactIcon = (contact: Contact) => {
    if (contact.type === 'contact') return UserCircle;
    if (contact.type === 'company') return Building2;
    if (contact.type === 'tag') return Tag;
    return UserCircle;
  };

  // Helper function to get contact color based on channel
  const getContactColor = (contact: Contact) => {
    if (!contact.channel) return undefined;
    const channelColors: Record<string, string> = {
      whatsapp: 'hsl(var(--whatsapp))',
      email: 'hsl(var(--email))',
      telegram: 'hsl(var(--telegram))',
      slack: 'hsl(var(--slack))',
      discord: 'hsl(var(--discord))',
      sms: 'hsl(var(--sms))',
    };
    return channelColors[contact.channel];
  };

  const handleFeedMenuClick = (feedId: string) => {
    const feedData = mockFeedDetails[feedId];
    if (feedData) {
      setSelectedFeed(feedData);
      setIsFeedModalOpen(true);
    }
  };

  const handleFeedModalClose = () => {
    setIsFeedModalOpen(false);
    setSelectedFeed(null);
  };

  const handleFeedUpdate = (updatedFeed: FeedDetails) => {
    // In a real app, you would update the feed in your state management
    console.log('Feed updated:', updatedFeed);
  };

  const handleCreateFeed = () => {
    setIsCreateFeedModalOpen(true);
  };

  const handleCreateFeedModalClose = () => {
    setIsCreateFeedModalOpen(false);
  };

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    setIsContactModalOpen(true);
  };

  const handleContactModalClose = () => {
    setIsContactModalOpen(false);
    setSelectedContact(null);
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname.startsWith('/dashboard/inbox');
    }
    return location.pathname.startsWith(path);
  };

  const NavSection = ({ 
    title, 
    children, 
    sectionKey, 
    isExpanded 
  }: { 
    title: string; 
    children: React.ReactNode;
    sectionKey?: keyof typeof sectionsExpanded;
    isExpanded?: boolean;
  }) => (
    <div className="mb-6">
      {!collapsed && (
        <>
          <button
            onClick={() => sectionKey && toggleSection(sectionKey)}
            className="w-full px-3 mb-2 text-xs text-muted-foreground uppercase tracking-wider flex items-center justify-between hover:text-foreground transition-colors"
          >
            <span>{title}</span>
            {sectionKey && (
              <ChevronRight 
                className={cn(
                  "size-3 transition-transform",
                  isExpanded && "rotate-90"
                )} 
              />
            )}
          </button>
        </>
      )}
      {(!sectionKey || isExpanded) && (
        <div className="space-y-0.5">{children}</div>
      )}
    </div>
  );

  const NavSectionWithAction = ({ 
    title, 
    children, 
    onActionClick,
    sectionKey,
    isExpanded
  }: { 
    title: string; 
    children: React.ReactNode;
    onActionClick?: () => void;
    sectionKey?: keyof typeof sectionsExpanded;
    isExpanded?: boolean;
  }) => (
    <div className="mb-6">
      {!collapsed && (
        <div className="w-full px-3 mb-2 text-xs text-muted-foreground uppercase tracking-wider flex items-center justify-between group">
          <span>{title}</span>
          <div className="flex items-center gap-1">
            {onActionClick && (
              <button
                onClick={onActionClick}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-accent rounded"
                aria-label={`Create new ${title.toLowerCase()}`}
              >
                <Plus className="size-3" />
              </button>
            )}
            {sectionKey && (
              <button
                onClick={() => toggleSection(sectionKey)}
                className="p-0.5 hover:bg-accent rounded hover:text-foreground transition-colors"
                aria-label={`Toggle ${title}`}
              >
                <ChevronRight 
                  className={cn(
                    "size-3 transition-transform",
                    isExpanded && "rotate-90"
                  )} 
                />
              </button>
            )}
          </div>
        </div>
      )}
      {(!sectionKey || isExpanded) && (
        <div className="space-y-0.5">{children}</div>
      )}
    </div>
  );

  const NavSectionWithSearch = ({ 
    title, 
    children,
    sectionKey,
    isExpanded,
    searchValue,
    onSearchChange,
    searchPlaceholder = "Search..."
  }: { 
    title: string; 
    children: React.ReactNode;
    sectionKey?: keyof typeof sectionsExpanded;
    isExpanded?: boolean;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
  }) => (
    <div className="mb-6">
      {!collapsed && (
        <div className="w-full px-3 mb-2 text-xs text-muted-foreground uppercase tracking-wider flex items-center justify-between">
          <span>{title}</span>
          {sectionKey && (
            <button
              onClick={() => toggleSection(sectionKey)}
              className="p-0.5 hover:bg-accent rounded hover:text-foreground transition-colors"
              aria-label={`Toggle ${title}`}
            >
              <ChevronRight 
                className={cn(
                  "size-3 transition-transform",
                  isExpanded && "rotate-90"
                )} 
              />
            </button>
          )}
        </div>
      )}
      {(!sectionKey || isExpanded) && (
        <div className="space-y-0.5">
          {onSearchChange && (
            <div className="px-2 mb-1">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-7 pr-2 py-1.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
                />
              </div>
            </div>
          )}
          {children}
        </div>
      )}
    </div>
  );

  const NavItem = ({
    to,
    icon: Icon,
    label,
    badge,
    color,
    onMenuClick,
  }: {
    to: string;
    icon: any;
    label: string;
    badge?: number;
    color?: string;
    onMenuClick?: () => void;
  }) => (
    <Link
      to={to}
      className={cn(
        'flex items-center gap-3 px-3 py-1.5 rounded-md transition-colors group',
        isActive(to)
          ? 'bg-accent text-accent-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
      )}
    >
      <Icon className="size-4 flex-shrink-0" style={color ? { color } : undefined} />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{label}</span>
          {onMenuClick && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onMenuClick();
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-accent rounded"
              aria-label="Feed options"
            >
              <MoreVertical className="size-3.5" />
            </button>
          )}
          {badge !== undefined && badge > 0 && (
            <span className="px-1.5 py-0.5 rounded text-xs bg-primary text-primary-foreground opacity-10">
              {badge}
            </span>
          )}
        </>
      )}
    </Link>
  );

  return (
    <div
      className={cn(
        'h-screen bg-card border-r border-border flex flex-col transition-all duration-300',
        collapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      {/* Header */}
      <div className="h-14 border-b border-border flex items-center justify-between px-3">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Sparkles className="size-5" style={{ color: 'hsl(var(--ai))' }} />
            <span className="font-semibold">Wondai</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded hover:bg-accent transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-2">
        <NavSection title="Focus" sectionKey="focus" isExpanded={sectionsExpanded.focus}>
          <NavItem to="/dashboard" icon={Target} label="Up Next" badge={12} />
          <NavItem to="/dashboard/inbox/mentions" icon={Inbox} label="Mentions" badge={2} />
          <NavItem to="/dashboard/inbox/starred" icon={Star} label="Starred" />
          <NavItem to="/dashboard/inbox/pinned" icon={Pin} label="Pinned" />
        </NavSection>

        <NavSectionWithAction 
          title="Feeds" 
          onActionClick={handleCreateFeed}
          sectionKey="feeds"
          isExpanded={sectionsExpanded.feeds}
        >
          <NavItem
            to="/dashboard/smart-filters"
            icon={BarChart3}
            label="Overview"
          />
          <NavItem
            to="/dashboard/inbox/urgent"
            icon={Zap}
            label="Urgent"
            badge={5}
            color="hsl(var(--urgent))"
            onMenuClick={() => handleFeedMenuClick('urgent')}
          />
          <NavItem
            to="/dashboard/inbox/vip"
            icon={Award}
            label="VIP"
            badge={3}
            color="hsl(var(--vip))"
            onMenuClick={() => handleFeedMenuClick('vip')}
          />
          <NavItem
            to="/dashboard/inbox/complaints"
            icon={AlertCircle}
            label="Complaints"
            color="hsl(var(--complaint))"
            onMenuClick={() => handleFeedMenuClick('complaints')}
          />
          <NavItem
            to="/dashboard/inbox/payment"
            icon={CreditCard}
            label="Payment Issues"
            badge={4}
            color="hsl(210 100% 50%)"
            onMenuClick={() => handleFeedMenuClick('payment')}
          />
          <NavItem
            to="/dashboard/inbox/followups"
            icon={Clock}
            label="Follow-ups Needed"
            badge={8}
            color="hsl(45 93% 47%)"
            onMenuClick={() => handleFeedMenuClick('followups')}
          />
          <NavItem
            to="/dashboard/inbox/aftersales"
            icon={Package}
            label="After Sales"
            color="hsl(162 73% 46%)"
            onMenuClick={() => handleFeedMenuClick('aftersales')}
          />
          <NavItem
            to="/dashboard/inbox/recurring"
            icon={RefreshCw}
            label="Recurring Issues"
            color="hsl(var(--ai))"
            onMenuClick={() => handleFeedMenuClick('recurring')}
          />
        </NavSectionWithAction>

        <NavSectionWithSearch 
          title="Contacts" 
          sectionKey="contacts"
          isExpanded={sectionsExpanded.contacts}
          searchValue={contactsSearch}
          onSearchChange={setContactsSearch}
        >
          <NavItem
            to="/dashboard/contacts/overview"
            icon={BarChart3}
            label="Overview"
          />
          {filteredContacts.length > 0 ? (
            filteredContacts.map(contact => (
              <NavItem
                key={contact.id}
                to={`/dashboard/contact/${contact.id}`}
                icon={getContactIcon(contact)}
                label={contact.name}
                color={getContactColor(contact)}
                onMenuClick={() => handleContactClick(contact)}
              />
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-muted-foreground text-center">
              No contacts found
            </div>
          )}
        </NavSectionWithSearch>

        <NavSection title="Channels" sectionKey="channels" isExpanded={sectionsExpanded.channels}>
          <NavItem
            to="/dashboard/channel/whatsapp"
            icon={MessageCircle}
            label="WhatsApp"
            badge={28}
            color="hsl(var(--whatsapp))"
          />
          <NavItem
            to="/dashboard/channel/email"
            icon={Mail}
            label="Email"
            badge={52}
            color="hsl(var(--email))"
          />
          <NavItem
            to="/dashboard/channel/telegram"
            icon={Send}
            label="Telegram"
            badge={14}
            color="hsl(var(--telegram))"
          />
          <NavItem
            to="/dashboard/channel/slack"
            icon={Hash}
            label="Slack"
            badge={19}
            color="hsl(var(--slack))"
          />
          <NavItem
            to="/dashboard/channel/discord"
            icon={MessageSquare}
            label="Discord"
            badge={7}
            color="hsl(var(--discord))"
          />
          <NavItem
            to="/dashboard/channel/sms"
            icon={Phone}
            label="SMS"
            color="hsl(var(--sms))"
          />
        </NavSection>

        <NavSection title="Settings" sectionKey="settings" isExpanded={sectionsExpanded.settings}>
          <NavItem to="/dashboard/integrations" icon={RefreshCw} label="Integrations" />
          <NavItem to="/dashboard/settings/personal" icon={UserCircle} label="Personal" />
          <NavItem to="/dashboard/settings/team" icon={UsersRound} label="Team" />
          <NavItem to="/dashboard/settings/sla" icon={BarChart3} label="SLA Dashboard" />
          <NavItem to="/dashboard/audit-logs" icon={FileText} label="Audit Logs" />
        </NavSection>
      </div>

      {/* Feed Details Modal */}
      <FeedDetailsModal
        isOpen={isFeedModalOpen}
        onClose={handleFeedModalClose}
        feed={selectedFeed}
        onUpdate={handleFeedUpdate}
      />

      {/* Create Feed Modal */}
      <CreateFeedModal
        isOpen={isCreateFeedModalOpen}
        onClose={handleCreateFeedModalClose}
      />

      {/* Contact Details Modal */}
      <ContactDetailsModal
        isOpen={isContactModalOpen}
        onClose={handleContactModalClose}
        contact={selectedContact}
      />
    </div>
  );
}