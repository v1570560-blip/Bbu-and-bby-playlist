import { LoveMessage } from '../types';

/**
 * ============================================================================
 * DATA STORAGE ENGINE & BACKEND EXTENSIBILITY CONFIGURATION
 * ============================================================================
 * This service handles persistent data storage for Love Messages.
 * Currently configured with LocalStorage for fast client-side durability.
 * 
 * To connect a real cloud backend (Firebase Firestore or Supabase):
 * 1. Replace the local methods below with async cloud calls.
 * 2. Set BACKEND_MODE = 'FIREBASE' | 'SUPABASE' | 'LOCAL'.
 * ============================================================================
 */
export const STORAGE_CONFIG = {
  mode: 'LOCAL' as 'LOCAL' | 'FIREBASE' | 'SUPABASE',
  collectionName: 'love_messages',
  storageKey: 'bbu_bby_love_messages_v1',
  userSubmittedKey: 'bbu_bby_user_submitted_msg_id',
  likedNotesKey: 'bbu_bby_liked_notes_v1',
};

// Initial romantic messages seeded to make the memory wall vibrant
const INITIAL_SEEDED_MESSAGES: LoveMessage[] = [
  {
    id: 'msg-seed-1',
    senderName: 'Bbu',
    partnerName: 'Bby',
    message: 'Every moment with you feels like my favourite love song. Thank you for being my constant smile, my peace, and the warmth in every cold day. I love you endlessly ♡',
    createdAt: '2026-08-20T14:30:00.000Z',
    themeColor: 'rose',
    likes: 12,
  },
  {
    id: 'msg-seed-2',
    senderName: 'Bby',
    partnerName: 'Bbu',
    message: 'Holding your hand is my safest place in the entire world. In all our songs and quiet smiles, you are my favourite destiny. Always yours ♡',
    createdAt: '2026-08-21T18:15:00.000Z',
    themeColor: 'peach',
    likes: 16,
  },
  {
    id: 'msg-seed-3',
    senderName: 'Bbu & Bby',
    partnerName: 'Our Love Story',
    message: '"Every song has a memory. Every memory has us." Here is to a lifetime of beautiful sunsets, late-night car rides, warm hugs, and endless love.',
    createdAt: '2026-08-22T08:00:00.000Z',
    themeColor: 'burgundy',
    likes: 24,
  },
];

export class LoveMessageStorage {
  private static getRawMessages(): LoveMessage[] {
    try {
      const data = localStorage.getItem(STORAGE_CONFIG.storageKey);
      if (!data) {
        localStorage.setItem(STORAGE_CONFIG.storageKey, JSON.stringify(INITIAL_SEEDED_MESSAGES));
        return INITIAL_SEEDED_MESSAGES;
      }
      return JSON.parse(data);
    } catch (e) {
      console.warn('Could not read from localStorage, using seed data', e);
      return INITIAL_SEEDED_MESSAGES;
    }
  }

  private static setRawMessages(messages: LoveMessage[]): void {
    try {
      localStorage.setItem(STORAGE_CONFIG.storageKey, JSON.stringify(messages));
    } catch (e) {
      console.error('Could not save to localStorage', e);
    }
  }

  public static getAllMessages(): LoveMessage[] {
    const list = this.getRawMessages();
    return [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public static hasUserSubmitted(): boolean {
    return !!localStorage.getItem(STORAGE_CONFIG.userSubmittedKey);
  }

  public static getUserSubmittedId(): string | null {
    return localStorage.getItem(STORAGE_CONFIG.userSubmittedKey);
  }

  public static saveMessage(senderName: string, partnerName: string, message: string): { success: boolean; messageId?: string; error?: string } {
    if (this.hasUserSubmitted()) {
      return {
        success: false,
        error: 'You have already submitted a love note on this device. Each love note is special and unique ♡',
      };
    }

    const trimmedSender = senderName.trim();
    const trimmedPartner = partnerName.trim();
    const trimmedMsg = message.trim();

    if (!trimmedSender || !trimmedPartner || !trimmedMsg) {
      return { success: false, error: 'Please fill in all names and your heartfelt message.' };
    }

    const newId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newNote: LoveMessage = {
      id: newId,
      senderName: trimmedSender,
      partnerName: trimmedPartner,
      message: trimmedMsg,
      createdAt: new Date().toISOString(),
      likes: 1,
    };

    const messages = this.getRawMessages();
    messages.unshift(newNote);
    this.setRawMessages(messages);
    localStorage.setItem(STORAGE_CONFIG.userSubmittedKey, newId);

    return { success: true, messageId: newId };
  }

  public static searchMessages(yourNameQuery: string, partnerNameQuery: string): LoveMessage[] {
    const all = this.getAllMessages();
    const q1 = yourNameQuery.trim().toLowerCase();
    const q2 = partnerNameQuery.trim().toLowerCase();

    if (!q1 && !q2) {
      return all;
    }

    return all.filter((item) => {
      const sender = item.senderName.toLowerCase();
      const partner = item.partnerName.toLowerCase();

      if (q1 && q2) {
        // Search by both names in either direction (sender matches q1 & partner matches q2, or vice versa)
        return (
          (sender.includes(q1) && partner.includes(q2)) ||
          (sender.includes(q2) && partner.includes(q1))
        );
      }

      const singleQuery = q1 || q2;
      return sender.includes(singleQuery) || partner.includes(singleQuery);
    });
  }

  public static getLikedNotes(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_CONFIG.likedNotesKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static toggleLike(messageId: string): { liked: boolean; count: number } {
    const likedNotes = this.getLikedNotes();
    const isCurrentlyLiked = likedNotes.includes(messageId);
    let updatedLikes: string[];

    if (isCurrentlyLiked) {
      updatedLikes = likedNotes.filter((id) => id !== messageId);
    } else {
      updatedLikes = [...likedNotes, messageId];
    }
    localStorage.setItem(STORAGE_CONFIG.likedNotesKey, JSON.stringify(updatedLikes));

    const messages = this.getRawMessages();
    let currentCount = 0;
    const updatedMessages = messages.map((msg) => {
      if (msg.id === messageId) {
        const delta = isCurrentlyLiked ? -1 : 1;
        const newCount = Math.max(0, (msg.likes || 0) + delta);
        currentCount = newCount;
        return { ...msg, likes: newCount };
      }
      return msg;
    });

    this.setRawMessages(updatedMessages);
    return { liked: !isCurrentlyLiked, count: currentCount };
  }
}
