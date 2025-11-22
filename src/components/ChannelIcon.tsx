import { MessageCircle, Mail, Send, Hash, MessageSquare, Phone } from 'lucide-react';
import type { ChannelType } from '../utils/mockData';

interface ChannelIconProps {
  channel: ChannelType;
  className?: string;
}

export function ChannelIcon({ channel, className = "size-4" }: ChannelIconProps) {
  const getIcon = () => {
    switch (channel) {
      case 'whatsapp':
        return <MessageCircle className={className} style={{ color: 'hsl(var(--whatsapp))' }} />;
      case 'email':
        return <Mail className={className} style={{ color: 'hsl(var(--email))' }} />;
      case 'telegram':
        return <Send className={className} style={{ color: 'hsl(var(--telegram))' }} />;
      case 'slack':
        return <Hash className={className} style={{ color: 'hsl(var(--slack))' }} />;
      case 'discord':
        return <MessageSquare className={className} style={{ color: 'hsl(var(--discord))' }} />;
      case 'sms':
        return <Phone className={className} style={{ color: 'hsl(var(--sms))' }} />;
    }
  };

  return getIcon();
}
