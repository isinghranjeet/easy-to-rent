import { Shield, RefreshCw, Download, Upload, Cloud, Database, Activity } from 'lucide-react';
import { ServerStatus } from './types';

interface AdminHeaderProps {
  serverStatus: ServerStatus;
  listingsCount: number;
  publishedCount: number;
  onRefresh: () => void;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  actionLoading: boolean;
}

const AdminHeader = ({
  serverStatus,
  listingsCount,
  publishedCount,
  onRefresh,
  onExport,
  onImport,
  actionLoading
}: AdminHeaderProps) => {
  const getStatusIcon = () => {
    switch (serverStatus.status) {
      case 'online':
        return <Cloud className="h-5 w-5 text-green-400" />;
      case 'offline':
        return <Database className="h-5 w-5 text-red-400" />;
      default:
        return <Activity className="h-5 w-5 text-yellow-400" />;
    }
  };

  const getStatusText = () => {
    switch (serverStatus.status) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      default: return 'Checking...';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 to-black border-b border-gray-800 shadow-2xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 animate-pulse">
                <div className={`h-3 w-3 rounded-full border-2 border-gray-900 ${
                  serverStatus.status === 'online' ? 'bg-green-500' :
                  serverStatus.status === 'offline' ? 'bg-red-500' :
                  'bg-yellow-500'
                }`}></div>
              </div>
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-white bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                PG Admin Dashboard
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-2 px-2 py-1 bg-gray-800 rounded-full">
                  {getStatusIcon()}
                  <span className={`text-sm font-medium ${
                    serverStatus.status === 'online' ? 'text-green-400' :
                    serverStatus.status === 'offline' ? 'text-red-400' :
                    'text-yellow-400'
                  }`}>
                    {getStatusText()}
                  </span>
                </div>
                <span className="text-gray-400 text-sm">•</span>
                <span className="text-sm text-gray-300">
                  {listingsCount} listings • {publishedCount} live
                </span>
              </div>
            </div>
          </div>
          
          {/* Right Section */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onRefresh}
              disabled={actionLoading}
              className="group px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 flex items-center gap-2 border border-gray-700 hover:border-gray-600"
            >
              <RefreshCw className={`h-4 w-4 group-hover:rotate-180 transition-transform duration-500 ${actionLoading ? 'animate-spin' : ''}`} />
              Sync
            </button>
            
            <label className="group px-4 py-2 bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 rounded-xl font-medium transition-all duration-300 cursor-pointer flex items-center gap-2 border border-blue-800 hover:border-blue-600">
              <Upload className="h-4 w-4" />
              Import
              <input
                type="file"
                accept=".json,.csv"
                onChange={onImport}
                className="hidden"
              />
            </label>
            
            <button
              onClick={onExport}
              className="group px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 flex items-center gap-2"
            >
              <Download className="h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
              Export Data
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;