import React, { useState, useEffect } from 'react';
import { Heart, Send, Search, Sparkles, CheckCircle2, MessageCircleHeart, User, Calendar, RotateCcw, Quote } from 'lucide-react';
import { LoveMessage } from '../types';
import { LoveMessageStorage } from '../services/storage';

export function LoveWall() {
  const [messages, setMessages] = useState<LoveMessage[]>([]);
  const [senderName, setSenderName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [messageText, setMessageText] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submittedMessageId, setSubmittedMessageId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Search filter states
  const [searchSender, setSearchSender] = useState('');
  const [searchPartner, setSearchPartner] = useState('');
  const [likedNoteIds, setLikedNoteIds] = useState<string[]>([]);

  // Load messages & state on mount
  useEffect(() => {
    refreshMessages();
    setHasSubmitted(LoveMessageStorage.hasUserSubmitted());
    setSubmittedMessageId(LoveMessageStorage.getUserSubmittedId());
    setLikedNoteIds(LoveMessageStorage.getLikedNotes());
  }, []);

  const refreshMessages = () => {
    const list = LoveMessageStorage.getAllMessages();
    setMessages(list);
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (hasSubmitted) {
      setNotification({
        type: 'error',
        text: 'You have already submitted a love note on this device ♡',
      });
      return;
    }

    if (!senderName.trim() || !partnerName.trim() || !messageText.trim()) {
      setNotification({
        type: 'error',
        text: 'Please enter your name, your partner’s name, and your message.',
      });
      return;
    }

    const result = LoveMessageStorage.saveMessage(senderName, partnerName, messageText);
    if (result.success && result.messageId) {
      setHasSubmitted(true);
      setSubmittedMessageId(result.messageId);
      setNotification({
        type: 'success',
        text: 'Your love note has been saved.',
      });
      refreshMessages();
      setMessageText('');
    } else {
      setNotification({
        type: 'error',
        text: result.error || 'Could not save your note.',
      });
    }
  };

  const handleToggleLike = (msgId: string) => {
    const res = LoveMessageStorage.toggleLike(msgId);
    setLikedNoteIds(LoveMessageStorage.getLikedNotes());
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, likes: res.count } : m))
    );
  };

  const handleClearSearch = () => {
    setSearchSender('');
    setSearchPartner('');
  };

  // Filter messages dynamically
  const displayedMessages = LoveMessageStorage.searchMessages(searchSender, searchPartner);

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Forever';
    }
  };

  const addQuickEmoji = (emoji: string) => {
    setMessageText((prev) => prev + emoji);
  };

  return (
    <section id="notes" className="w-full py-16 sm:py-24 px-4 sm:px-6 relative bg-gradient-to-b from-transparent via-rose-50/50 to-transparent">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* =========================================================
            SECTION HEADER & SUBMISSION FORM
           ========================================================= */}
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/90 border border-rose-200 text-rose-800 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <MessageCircleHeart className="w-4 h-4 text-rose-600" />
            <span>Private Love Wall</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#2c1810]">
            Leave a little love here 💌
          </h2>

          <p className="font-romantic text-xl sm:text-2xl text-rose-900/85 mt-2 italic">
            Write something for the person you love.
          </p>
        </div>

        {/* Message Form or "Saved" State */}
        <div className="max-w-2xl mx-auto">
          {hasSubmitted ? (
            <div className="glass-card rounded-3xl p-8 sm:p-10 border border-rose-200 shadow-xl text-center">
              <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-200 shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-[#2c1810]">
                Your love note has been saved.
              </h3>
              <p className="font-romantic text-lg text-rose-800/90 mt-2 italic">
                “Your words are forever preserved in our shared memory garden.”
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-xs font-medium text-rose-700 bg-rose-50 px-4 py-2 rounded-full border border-rose-200">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span>One cherished note per heart ♡</span>
              </div>
            </div>
          ) : (
            <form
              id="love-message-form"
              onSubmit={handleMessageSubmit}
              className="glass-card rounded-3xl p-6 sm:p-10 border border-rose-200/80 shadow-2xl shadow-rose-950/10 relative overflow-hidden"
            >
              {notification && (
                <div
                  className={`mb-6 p-4 rounded-2xl text-sm flex items-center gap-3 border ${
                    notification.type === 'success'
                      ? 'bg-emerald-50/90 text-emerald-900 border-emerald-200'
                      : 'bg-rose-50/90 text-rose-900 border-rose-200'
                  }`}
                >
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>{notification.text}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                {/* Your Name */}
                <div>
                  <label
                    htmlFor="senderNameInput"
                    className="block text-xs font-semibold text-rose-900 uppercase tracking-wider mb-1.5"
                  >
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-400" />
                    <input
                      id="senderNameInput"
                      type="text"
                      required
                      placeholder="e.g. Bbu"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/80 border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white text-[#2c1810] placeholder-rose-300 text-sm font-medium transition-all"
                    />
                  </div>
                </div>

                {/* BF/GF's Name */}
                <div>
                  <label
                    htmlFor="partnerNameInput"
                    className="block text-xs font-semibold text-rose-900 uppercase tracking-wider mb-1.5"
                  >
                    Your BF/GF's Name
                  </label>
                  <div className="relative">
                    <Heart className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-400" />
                    <input
                      id="partnerNameInput"
                      type="text"
                      required
                      placeholder="e.g. Bby"
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/80 border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white text-[#2c1810] placeholder-rose-300 text-sm font-medium transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Your Message */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="loveMessageTextarea"
                    className="text-xs font-semibold text-rose-900 uppercase tracking-wider"
                  >
                    Your Message
                  </label>
                  {/* Quick romantic emoji picker chips */}
                  <div className="flex items-center gap-1">
                    {['♡', '🌸', '✨', '💌', '💖', '☕'].map((emo) => (
                      <button
                        key={emo}
                        type="button"
                        onClick={() => addQuickEmoji(emo)}
                        className="text-xs px-2 py-0.5 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-800 transition-colors cursor-pointer"
                      >
                        {emo}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  id="loveMessageTextarea"
                  required
                  rows={4}
                  placeholder="Write from the heart... What makes your love special?"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-white/80 border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white text-[#2c1810] placeholder-rose-300 text-sm font-romantic leading-relaxed transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                id="submit-love-note-btn"
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 text-white font-semibold text-base shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 border border-white/30"
              >
                <Heart className="w-5 h-5 fill-white text-white" />
                <span>Leave My Message ♡</span>
              </button>
            </form>
          )}
        </div>

        {/* =========================================================
            SEARCH SECTION: Find a Love Message 🔎
           ========================================================= */}
        <div id="search-section" className="pt-8 border-t border-rose-200/60">
          <div className="max-w-3xl mx-auto mb-8 text-center">
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#2c1810] flex items-center justify-center gap-2">
              <span>Find a Love Message 🔎</span>
            </h3>
            <p className="text-sm text-rose-800/80 mt-1 font-medium">
              Search by your name, your partner's name, or both to reveal your sweet memories.
            </p>

            {/* Search Input Controls */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-3xl glass-card border border-rose-200 shadow-md">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-400" />
                <input
                  id="searchSenderInput"
                  type="text"
                  placeholder="Search by Your Name..."
                  value={searchSender}
                  onChange={(e) => setSearchSender(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/90 border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-xs sm:text-sm text-[#2c1810] placeholder-rose-400"
                />
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-400" />
                <input
                  id="searchPartnerInput"
                  type="text"
                  placeholder="Search by BF/GF Name..."
                  value={searchPartner}
                  onChange={(e) => setSearchPartner(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/90 border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-xs sm:text-sm text-[#2c1810] placeholder-rose-400"
                />
              </div>
            </div>

            {(searchSender || searchPartner) && (
              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="text-xs text-rose-700">
                  Showing {displayedMessages.length} matching note{displayedMessages.length === 1 ? '' : 's'}
                </span>
                <button
                  onClick={handleClearSearch}
                  className="text-xs text-rose-600 underline hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset filter</span>
                </button>
              </div>
            )}
          </div>

          {/* =========================================================
              DISPLAY MATCHING MESSAGES AS BEAUTIFUL ROMANTIC CARDS
             ========================================================= */}
          {displayedMessages.length === 0 ? (
            <div className="text-center py-16 px-4 glass-card rounded-3xl max-w-lg mx-auto border border-rose-200/70">
              <Heart className="w-10 h-10 text-rose-300 mx-auto mb-3" />
              <h4 className="font-heading text-xl font-bold text-[#2c1810]">No Love Notes Found</h4>
              <p className="text-sm text-rose-800/80 mt-1 font-romantic italic">
                Try searching with different names or be the first to leave a message above ♡
              </p>
              <button
                onClick={handleClearSearch}
                className="mt-4 px-4 py-2 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold hover:bg-rose-200 transition-colors cursor-pointer"
              >
                Show All Love Notes
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedMessages.map((note) => {
                const isLiked = likedNoteIds.includes(note.id);
                return (
                  <article
                    key={note.id}
                    id={`love-note-${note.id}`}
                    className="glass-card rounded-3xl p-6 sm:p-7 border border-rose-200/70 shadow-lg shadow-rose-950/5 hover:shadow-xl hover:shadow-rose-900/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative group overflow-hidden"
                  >
                    {/* Decorative subtle rose watermark accent */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-rose-200/40 via-transparent to-transparent rounded-bl-full pointer-events-none" />

                    <div>
                      {/* Romantic Header: From [Name] For [BF/GF Name] */}
                      <div className="mb-4 pb-3 border-b border-rose-100">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-rose-600 uppercase tracking-widest">
                            Love Note
                          </span>
                          <span className="font-script text-lg text-rose-400">with love ♡</span>
                        </div>

                        <div className="mt-2 space-y-0.5">
                          <p className="text-sm font-semibold text-[#2c1810]">
                            <span className="text-rose-500 font-normal text-xs uppercase tracking-wider mr-1">From:</span>
                            {note.senderName}
                          </p>
                          <p className="text-sm font-semibold text-[#2c1810]">
                            <span className="text-rose-500 font-normal text-xs uppercase tracking-wider mr-1">For:</span>
                            {note.partnerName}
                          </p>
                        </div>
                      </div>

                      {/* Message Content */}
                      <div className="relative my-4">
                        <Quote className="w-5 h-5 text-rose-200 absolute -top-2.5 -left-1 transform -scale-x-100 opacity-60" />
                        <p className="font-romantic text-base sm:text-lg text-[#2c1810]/90 leading-relaxed pl-3 italic whitespace-pre-line">
                          {note.message}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer: Subtle Date & Interactive Heart Like */}
                    <div className="pt-4 mt-2 border-t border-rose-100/80 flex items-center justify-between text-xs text-rose-700/80">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-rose-400" />
                        <span>{formatDate(note.createdAt)}</span>
                      </div>

                      <button
                        onClick={() => handleToggleLike(note.id)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer ${
                          isLiked
                            ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30 font-semibold'
                            : 'bg-rose-100/80 text-rose-700 hover:bg-rose-200/80'
                        }`}
                        aria-label="Like this love note"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-white' : 'text-rose-500'}`} />
                        <span>{note.likes ?? 0}</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
