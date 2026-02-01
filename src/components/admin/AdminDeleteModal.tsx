import { AlertTriangle, Trash2, Shield, X } from 'lucide-react';

interface AdminDeleteModalProps {
  listingName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const AdminDeleteModal = ({ listingName, onConfirm, onCancel }: AdminDeleteModalProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 w-full max-w-md border border-gray-800 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-red-900 to-rose-900 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse border border-red-800">
            <AlertTriangle className="h-10 w-10 text-red-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Delete Listing?
          </h3>
          <div className="bg-red-900/30 p-4 rounded-lg mb-4 border border-red-800">
            <p className="text-red-300 font-medium truncate">{listingName}</p>
          </div>
          <p className="text-gray-400">
            This action cannot be undone. All data will be permanently removed from the database.
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 border-2 border-gray-700 text-gray-300 rounded-xl font-semibold hover:bg-gray-800 transition-all hover:border-gray-600 flex items-center justify-center gap-2"
          >
            <X className="h-5 w-5" />
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-rose-700 transition-all shadow-lg hover:shadow-red-500/25 flex items-center justify-center gap-2"
          >
            <Trash2 className="h-5 w-5" />
            Delete Forever
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDeleteModal;