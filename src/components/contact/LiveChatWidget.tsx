import { X, Send, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatMessage {
  id: number;
  sender: "user" | "bot";
  message: string;
  time: string;
}

interface LiveChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  chatMessage: string;
  onChatMessageChange: (value: string) => void;
  chatHistory: ChatMessage[];
  onSendMessage: () => void;
}

export const LiveChatWidget = ({
  isOpen,
  onClose,
  chatMessage,
  onChatMessageChange,
  chatHistory,
  onSendMessage,
}: LiveChatWidgetProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
      <div className="p-4 border-b bg-gray-50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
              <MessageSquareText className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Support Assistant</h3>
              <p className="text-xs text-sky-600 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Online - Quick response
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-gray-500 hover:text-orange-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {chatHistory.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.sender === "user" ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-900"
              }`}
            >
              <p className="text-sm">{msg.message}</p>
              <p className="text-xs opacity-70 mt-1">{msg.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={chatMessage}
            onChange={(e) => onChatMessageChange(e.target.value)}
            placeholder="Type your message here..."
            onKeyDown={(e) => e.key === "Enter" && onSendMessage()}
            className="flex-1 focus:border-orange-400 focus:ring-orange-400"
          />
          <Button onClick={onSendMessage} disabled={!chatMessage.trim()} className="bg-orange-600 hover:bg-orange-700">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
