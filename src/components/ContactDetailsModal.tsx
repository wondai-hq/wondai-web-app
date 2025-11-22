import { ContactEditModal } from './ContactEditModal';
import type { Contact } from '../utils/mockData';

interface ContactDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact | null;
}

export function ContactDetailsModal({ isOpen, onClose, contact }: ContactDetailsModalProps) {
  if (!contact) return null;

  // Transform Contact to the format expected by ContactEditModal
  const mockContactData = {
    id: contact.id,
    name: contact.name,
    autoMerged: [
      {
        platform: (contact.channel || 'email') as 'email' | 'whatsapp' | 'telegram' | 'slack',
        identifier: contact.name,
        messageCount: 47,
        lastMessage: '2 hours ago',
        messageSummary: 'Recent discussions about project updates and deadlines',
      },
    ],
    suggested: [],
  };

  return (
    <ContactEditModal
      isOpen={isOpen}
      onClose={onClose}
      contact={mockContactData}
    />
  );
}
