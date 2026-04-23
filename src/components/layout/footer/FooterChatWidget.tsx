import {
  Bot,
  Copy,
  LogOut,
  Mail,
  Maximize2,
  MessageSquare,
  Minimize2,
  Paperclip,
  Phone,
  Search,
  Send,
  Settings,
  Smile,
  Trash2,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";

interface FooterChatWidgetProps {
  showChat: boolean;
  unreadCount: number;
  isMinimized: boolean;
  showSettings: boolean;
  showEmojiPicker: boolean;
  isTyping: boolean;
  isMuted: boolean;
  userMessage: string;
  searchTerm: string;
  attachments: File[];
  chatMessages: any[];
  propertyTypes: string[];
  emojis: string[];
  isMobile: boolean;
  chatRef: React.RefObject<HTMLDivElement>;
  chatEndRef: React.RefObject<HTMLDivElement>;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  settingsRef: React.RefObject<HTMLDivElement>;
  handleLiveChat: () => void;
  toggleMinimize: () => void;
  clearChat: () => void;
  handleCopyMessage: (text: string) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  setShowSettings: (value: boolean) => void;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEmojiPicker: (value: boolean) => void;
  setUserMessage: React.Dispatch<React.SetStateAction<string>>;
  setSearchTerm: (value: string) => void;
}

export function FooterChatWidget(props: FooterChatWidgetProps) {
  const {
    showChat,
    unreadCount,
    isMinimized,
    showSettings,
    showEmojiPicker,
    isTyping,
    isMuted,
    userMessage,
    searchTerm,
    attachments,
    chatMessages,
    propertyTypes,
    emojis,
    isMobile,
    chatRef,
    chatEndRef,
    inputRef,
    fileInputRef,
    settingsRef,
    handleLiveChat,
    toggleMinimize,
    clearChat,
    handleCopyMessage,
    handleFileUpload,
    handleSendMessage,
    handleKeyPress,
    setShowSettings,
    setIsMuted,
    setShowEmojiPicker,
    setUserMessage,
    setSearchTerm,
  } = props;

  return (
    <>
      <div className="fixed bottom-4 md:bottom-6 right-4 md:right-6 z-50">
        <button onClick={handleLiveChat} className="live-support-btn">
          <MessageSquare className="h-4 w-4 md:h-5 md:w-5" />
          <span className="hidden sm:inline">Live Support</span>
          <span className="sm:hidden">Support</span>
        </button>
        {unreadCount > 0 && <div className="unread-badge">{unreadCount}</div>}
      </div>

      {showChat && (
        <div className={`chat-window ${isMinimized ? "minimized" : ""}`} ref={chatRef}>
          <div className="chat-header" onClick={() => toggleMinimize()}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-orange-500">
                  <Bot className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm md:text-base">EasyToRent Support</h3>
                  <div className="flex items-center gap-1 text-xs opacity-90">
                    <span className="status-indicator"></span>
                    <span className="hidden sm:inline">Riya Sharma</span>
                    <span className="sm:hidden">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSettings(!showSettings);
                    setShowEmojiPicker(false);
                  }}
                  className={`header-btn ${showSettings ? "active" : ""}`}
                >
                  <Settings className="h-3 w-3 md:h-4 md:w-4" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); toggleMinimize(); }} className="header-btn">
                  {isMinimized ? <Maximize2 className="h-3 w-3 md:h-4 md:w-4" /> : <Minimize2 className="h-3 w-3 md:h-4 md:w-4" />}
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleLiveChat(); }} className="header-btn">
                  <X className="h-3 w-3 md:h-4 md:w-4" />
                </button>
              </div>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="chat-body">
                <div className="search-bar">
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <Search className="search-icon h-3 w-3 md:h-4 md:w-4" />
                </div>

                {attachments.length > 0 && (
                  <div className="attachments-preview">
                    {attachments.map((file, idx) => (
                      <span key={idx} className="attachment-badge">
                        <Paperclip className="h-3 w-3" />
                        {file.name.length > 15 ? `${file.name.substring(0, 15)}...` : file.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="space-y-3">
                  {chatMessages.map((message) => (
                    <div key={message.id} className="message-wrapper">
                      <div className="agent-name">
                        {message.agentName}
                        {message.isAgent && <span className="agent-status"></span>}
                      </div>
                      <div className={`message-bubble ${message.isAgent ? "agent-message" : "user-message"} ${message.isSystem ? "system-message" : ""}`}>
                        <div className="whitespace-pre-line text-xs md:text-sm">{message.text}</div>
                        <div className="message-time">{message.time}</div>
                        {message.isAgent && (
                          <div className="message-actions">
                            <button className="message-action-btn" onClick={() => handleCopyMessage(message.text)}>
                              <Copy className="h-2 w-2 md:h-3 md:w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="typing-indicator">
                      <span className="text-xs mr-2 hidden sm:inline">Agent is typing</span>
                      <span className="text-xs mr-2 sm:hidden">Typing...</span>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div className="property-chips">
                  {propertyTypes.map((type, idx) => (
                    <button key={idx} className="property-chip" onClick={() => { setUserMessage(type); inputRef.current?.focus(); }}>
                      {type}
                    </button>
                  ))}
                </div>

                <div className="contact-panel">
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                    <Phone className="h-3 w-3 md:h-4 md:w-4 text-orange-500" />
                    Direct Contact
                  </h4>
                  <div className="contact-item">
                    <Phone className="h-3 w-3 md:h-4 md:w-4" />
                    <a href="tel:+919315058665" className="text-xs md:text-sm">+91 93150 58665</a>
                  </div>
                  <div className="contact-item">
                    <Mail className="h-3 w-3 md:h-4 md:w-4" />
                    <a href="mailto:supporteasytorent@gmail.com" className="text-xs md:text-sm break-all">supporteasytorent@gmail.com</a>
                  </div>
                </div>
              </div>

              <div className="chat-input-area">
                {showSettings && (
                  <div className="settings-menu" ref={settingsRef}>
                    <div className="settings-item" onClick={() => setIsMuted((prev) => !prev)}>
                      {isMuted ? <VolumeX className="h-3 w-3 md:h-4 md:w-4" /> : <Volume2 className="h-3 w-3 md:h-4 md:w-4" />}
                      <span className="text-xs md:text-sm">{isMuted ? "Unmute" : "Mute"}</span>
                    </div>
                    <div className="settings-item" onClick={clearChat}>
                      <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                      <span className="text-xs md:text-sm">Clear Chat</span>
                    </div>
                    <div className="settings-divider"></div>
                    <div className="settings-item" onClick={handleLiveChat}>
                      <LogOut className="h-3 w-3 md:h-4 md:w-4" />
                      <span className="text-xs md:text-sm">Close</span>
                    </div>
                  </div>
                )}

                {showEmojiPicker && (
                  <div className="emoji-picker">
                    {emojis.map((emoji, idx) => (
                      <button
                        key={idx}
                        className="emoji-item"
                        onClick={() => { setUserMessage((prev) => prev + emoji); setShowEmojiPicker(false); inputRef.current?.focus(); }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                <div className="chat-input-container">
                  <textarea
                    ref={inputRef}
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={isMobile ? "Message..." : "Type your message..."}
                    className="chat-input"
                    rows={1}
                  />
                  <div className="input-actions">
                    <button className="input-action-btn" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                      <Smile className="h-3 w-3 md:h-4 md:w-4" />
                    </button>
                    <button className="input-action-btn" onClick={() => fileInputRef.current?.click()}>
                      <Paperclip className="h-3 w-3 md:h-4 md:w-4" />
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: "none" }} multiple />
                  </div>
                  <button onClick={handleSendMessage} className="send-btn" disabled={!userMessage.trim()}>
                    <Send className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
