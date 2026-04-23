export const footerStyles = `
        .footer-gradient {
          background: linear-gradient(135deg, #0b1120 0%, #0a0f1a 100%);
        }
        .footer-link {
          position: relative;
          display: inline-block;
          transition: all 0.3s ease;
        }
        .footer-link::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -4px;
          width: 0%;
          height: 2px;
          background: #f97316;
          transition: width 0.3s ease;
        }
        .footer-link:hover::after {
          width: 100%;
        }
        .footer-social {
          transition: all 0.3s ease;
        }
        .footer-social:hover {
          transform: translateY(-4px);
        }
        .footer-title {
          position: relative;
          padding-bottom: 8px;
        }
        .footer-title::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 40px;
          height: 3px;
          background: #f97316;
          border-radius: 999px;
        }
        .footer-bottom {
          background: rgba(255,255,255,0.02);
        }
        .trust-badge {
          background: rgba(249, 115, 22, 0.1);
          border: 1px solid rgba(249, 115, 22, 0.2);
        }
        .newsletter-input {
          background: rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
        }
        .newsletter-input:focus {
          background: rgba(255, 255, 255, 0.08);
          border-color: #f97316;
        }
        .chat-window {
          position: fixed;
          bottom: 90px;
          right: 20px;
          width: 400px;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
          z-index: 1000;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }
        @media (max-width: 768px) {
          .chat-window {
            width: 90vw;
            right: 5vw;
            left: 5vw;
            bottom: 80px;
            max-height: 80vh;
          }
        }
        @media (max-width: 480px) {
          .chat-window {
            width: 96vw;
            right: 2vw;
            left: 2vw;
            bottom: 70px;
            max-height: 85vh;
          }
          .live-support-btn {
            padding: 12px 20px !important;
            font-size: 14px !important;
          }
          .live-support-btn span {
            display: inline-block !important;
          }
        }
        .chat-window.minimized {
          height: 70px;
          overflow: hidden;
        }
        @media (max-width: 768px) {
          .chat-window.minimized {
            height: 60px;
          }
        }
        .chat-header {
          background: #1a1f2e;
          color: white;
          padding: 16px 20px;
          cursor: pointer;
          border-bottom: 2px solid #f97316;
        }
        @media (max-width: 768px) {
          .chat-header {
            padding: 12px 16px;
          }
        }
        .chat-body {
          padding: 20px;
          max-height: 450px;
          overflow-y: auto;
          background: #f8fafc;
        }
        @media (max-width: 768px) {
          .chat-body {
            padding: 16px;
            max-height: calc(80vh - 120px);
          }
        }
        .message-wrapper {
          margin-bottom: 16px;
        }
        .message-bubble {
          max-width: 85%;
          padding: 12px 16px;
          border-radius: 12px;
          word-wrap: break-word;
          line-height: 1.5;
          position: relative;
        }
        @media (max-width: 768px) {
          .message-bubble {
            max-width: 90%;
            padding: 10px 14px;
            font-size: 14px;
          }
        }
        .agent-message {
          background: #ffffff;
          color: #1e293b;
          border-left: 4px solid #f97316;
        }
        .user-message {
          background: #f97316;
          color: white;
          margin-left: auto;
        }
        .system-message {
          background: #f1f5f9;
          color: #64748b;
          font-style: italic;
          font-size: 12px;
          text-align: center;
          max-width: 100%;
        }
        .agent-name {
          font-size: 12px;
          font-weight: 600;
          color: #f97316;
          margin-bottom: 4px;
        }
        .agent-status {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          margin-left: 6px;
        }
        .message-time {
          font-size: 10px;
          color: #94a3b8;
          margin-top: 6px;
          text-align: right;
        }
        .user-message .message-time {
          color: #fef9c3;
        }
        .message-actions {
          position: absolute;
          top: -8px;
          right: 0;
          display: flex;
          gap: 4px;
          opacity: 0;
          transition: opacity 0.2s ease;
          background: white;
          padding: 4px;
          border-radius: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        @media (max-width: 768px) {
          .message-actions {
            opacity: 0.8;
            top: -6px;
          }
        }
        .message-bubble:hover .message-actions {
          opacity: 1;
        }
        .message-action-btn {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: none;
          background: white;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        .message-action-btn:hover {
          background: #f97316;
          color: white;
        }
        .property-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 16px 0;
        }
        .property-chip {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 8px 16px;
          font-size: 13px;
          color: #334155;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        @media (max-width: 768px) {
          .property-chip {
            padding: 6px 12px;
            font-size: 12px;
          }
        }
        .property-chip:hover {
          background: #f97316;
          border-color: #f97316;
          color: white;
        }
        .search-bar {
          margin-bottom: 16px;
          position: relative;
        }
        .search-input {
          width: 100%;
          padding: 10px 16px 10px 40px;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          font-size: 14px;
          background: white;
          color: #1e293b;
        }
        @media (max-width: 768px) {
          .search-input {
            padding: 8px 14px 8px 36px;
            font-size: 13px;
          }
        }
        .search-input:focus {
          outline: none;
          border-color: #f97316;
        }
        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }
        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 12px 16px;
          background: white;
          border-radius: 12px;
          width: fit-content;
          border-left: 4px solid #f97316;
        }
        .typing-dot {
          width: 8px;
          height: 8px;
          background: #f97316;
          border-radius: 50%;
          animation: typingBounce 1.4s infinite;
        }
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes typingBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.6; }
          40% { transform: scale(1); opacity: 1; }
        }
        .chat-input-area {
          padding: 16px 20px;
          background: white;
          border-top: 1px solid #e2e8f0;
          position: relative;
        }
        @media (max-width: 768px) {
          .chat-input-area {
            padding: 12px 16px;
          }
        }
        .chat-input-container {
          background: #ffffff;
          border: 2px solid #e2e8f0;
          border-radius: 30px;
          padding: 4px 4px 4px 20px;
          display: flex;
          align-items: center;
          transition: border-color 0.2s ease;
        }
        .chat-input {
          border: none;
          padding: 10px 0;
          font-size: 14px;
          width: 100%;
          background: transparent;
          outline: none;
          color: #0f172a;
          resize: none;
          max-height: 100px;
          font-family: inherit;
        }
        @media (max-width: 768px) {
          .chat-input {
            padding: 8px 0;
            font-size: 14px;
          }
        }
        .chat-input::placeholder {
          color: #94a3b8;
        }
        .input-actions {
          display: flex;
          gap: 4px;
          align-items: center;
        }
        .input-action-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background: transparent;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        @media (max-width: 768px) {
          .input-action-btn {
            width: 32px;
            height: 32px;
          }
        }
        .input-action-btn:hover {
          background: #f1f5f9;
          color: #f97316;
        }
        .send-btn {
          background: #f97316;
          color: white;
          border: none;
          border-radius: 30px;
          padding: 10px 20px;
          font-weight: 600;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          margin-left: 8px;
          transition: all 0.2s ease;
        }
        @media (max-width: 768px) {
          .send-btn {
            padding: 8px 16px;
            font-size: 13px;
          }
          .send-btn span {
            display: none;
          }
        }
        .send-btn:hover:not(:disabled) {
          background: #ea580c;
        }
        .send-btn:disabled {
          background: #cbd5e1;
          cursor: not-allowed;
        }
        .attachments-preview {
          display: flex;
          gap: 8px;
          padding: 8px;
          background: #f8fafc;
          border-radius: 12px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }
        .attachment-badge {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 4px 10px;
          font-size: 11px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .emoji-picker {
          position: absolute;
          bottom: 80px;
          left: 20px;
          background: white;
          border-radius: 16px;
          padding: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          border: 1px solid #e2e8f0;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
          z-index: 30;
        }
        @media (max-width: 768px) {
          .emoji-picker {
            bottom: 70px;
            left: 10px;
            right: 10px;
            grid-template-columns: repeat(7, 1fr);
          }
        }
        .emoji-item {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        @media (max-width: 768px) {
          .emoji-item {
            width: 32px;
            height: 32px;
            font-size: 18px;
          }
        }
        .emoji-item:hover {
          background: #fff7ed;
          transform: scale(1.1);
        }
        .status-indicator {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #10b981;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        .unread-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          border: 2px solid white;
        }
        .live-support-btn {
          background: #f97316;
          border: none;
          color: white;
          padding: 14px 24px;
          border-radius: 40px;
          font-weight: 600;
          font-size: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 10px 25px rgba(249, 115, 22, 0.4);
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .live-support-btn:hover {
          background: #ea580c;
          transform: translateY(-2px);
        }
        @media (max-width: 480px) {
          .live-support-btn {
            padding: 10px 16px !important;
          }
        }
        .contact-panel {
          background: white;
          border-radius: 12px;
          padding: 16px;
          margin-top: 16px;
          border: 1px solid #e2e8f0;
        }
        @media (max-width: 768px) {
          .contact-panel {
            padding: 12px;
          }
        }
        .contact-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
          color: #334155;
          font-size: 13px;
          border-bottom: 1px solid #f1f5f9;
        }
        .contact-item:last-child {
          border-bottom: none;
        }
        .contact-item a {
          color: #334155;
          text-decoration: none;
        }
        .contact-item a:hover {
          color: #f97316;
        }
        .settings-menu {
          position: absolute;
          top: 50px;
          right: 20px;
          background: white;
          border-radius: 12px;
          padding: 8px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          border: 1px solid #e2e8f0;
          z-index: 40;
          min-width: 180px;
        }
        @media (max-width: 768px) {
          .settings-menu {
            top: 45px;
            right: 10px;
            min-width: 160px;
          }
        }
        .settings-item {
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          border-radius: 8px;
          color: #334155;
          font-size: 13px;
          transition: all 0.2s ease;
        }
        .settings-item:hover {
          background: #fff7ed;
          color: #f97316;
        }
        .settings-divider {
          height: 1px;
          background: #e2e8f0;
          margin: 8px 0;
        }
        .header-btn {
          background: transparent;
          border: none;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        @media (max-width: 768px) {
          .header-btn {
            width: 28px;
            height: 28px;
          }
        }
        .header-btn:hover {
          background: rgba(255, 255, 255, 0.15);
        }
        .header-btn.active {
          background: rgba(249, 115, 22, 0.3);
        }
        @media (max-width: 768px) {
          button,
          .property-chip,
          .input-action-btn,
          .send-btn,
          .header-btn,
          .settings-item,
          .emoji-item {
            min-height: 44px;
            min-width: 44px;
          }
          .property-chip {
            min-height: 36px;
          }
          .input-action-btn,
          .header-btn {
            min-height: 40px;
            min-width: 40px;
          }
        }
`;
