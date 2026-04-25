 import { useState } from 'react';
import { X, Mail, Loader2, Send, Tag } from 'lucide-react';
import { api } from '@/services/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface SendBulkOfferModalProps {
  open: boolean;
  onClose: () => void;
}

export function SendBulkOfferModal({ open, onClose }: SendBulkOfferModalProps) {
  const [offerMessage, setOfferMessage] = useState(
    'Exclusive limited-time offer! Book your dream PG today and get special discounts on selected properties.'
  );
  const [discountCode, setDiscountCode] = useState('EASY20');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sentCount: number; failCount: number; totalUsers: number } | null>(null);

  const handleSend = async () => {
    if (!offerMessage.trim()) {
      toast.error('Please enter an offer message');
      return;
    }
    try {
      setSending(true);
      setResult(null);
      const res = await api.sendBulkOfferEmails(offerMessage.trim(), discountCode.trim() || undefined);
      if (res.success && res.data) {
        const { sentCount, failCount, totalUsers } = res.data as any;
        setResult({ sentCount: sentCount || 0, failCount: failCount || 0, totalUsers: totalUsers || 0 });
        toast.success(`Offer emails sent: ${sentCount || 0} success, ${failCount || 0} failed`);
      } else {
        toast.error(res.message || 'Failed to send offer emails');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to send offer emails');
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    if (!sending) {
      setResult(null);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Send Offer to All Users</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={sending}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {result ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800">
                <h3 className="font-medium text-green-700 dark:text-green-300 mb-2">Campaign Completed</h3>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">{result.sentCount}</p>
                    <p className="text-xs text-green-500">Sent</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">{result.failCount}</p>
                    <p className="text-xs text-red-500">Failed</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{result.totalUsers}</p>
                    <p className="text-xs text-blue-500">Total</p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-full py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Offer Message
                </label>
                <textarea
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm dark:text-white outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Enter your offer message..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Discount Code (optional)
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g. SUMMER20"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                <p className="text-xs text-blue-600 dark:text-blue-300">
                  This will send an offer email to all active users. The email includes your message and discount code.
                </p>
              </div>

              <button
                onClick={handleSend}
                disabled={sending || !offerMessage.trim()}
                className={cn(
                  'w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition-all',
                  sending || !offerMessage.trim()
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl'
                )}
              >
                {sending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending emails...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Offer to All Users
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

