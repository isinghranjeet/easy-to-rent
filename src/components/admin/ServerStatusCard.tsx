import { Server, Database, Cpu, Activity, Zap, Shield } from 'lucide-react';
import { ServerStatus } from './types';

interface ServerStatusCardProps {
  status: ServerStatus;
}

const ServerStatusCard = ({ status }: ServerStatusCardProps) => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-black rounded-2xl p-6 border border-gray-800 shadow-2xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-cyan-900 to-blue-900 rounded-xl">
            <Server className="h-6 w-6 text-cyan-300" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">Server Status</h3>
            <p className="text-sm text-gray-400">Real-time backend monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full animate-pulse ${
            status.status === 'online' ? 'bg-green-500 shadow-green-500/50' :
            status.status === 'offline' ? 'bg-red-500 shadow-red-500/50' :
            'bg-yellow-500 shadow-yellow-500/50'
          }`}></div>
          <span className={`font-medium ${
            status.status === 'online' ? 'text-green-400' :
            status.status === 'offline' ? 'text-red-400' :
            'text-yellow-400'
          }`}>
            {status.status === 'online' ? '🟢 Operational' : 
             status.status === 'offline' ? '🔴 Offline' : 
             '🟡 Checking...'}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-gray-800 hover:border-cyan-800 transition-all duration-300">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-cyan-300" />
            <div className="text-xs text-gray-400">Response Time</div>
          </div>
          <div className="text-2xl font-bold text-white">
            {status.responseTime}ms
          </div>
        </div>
        
        <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-gray-800 hover:border-emerald-800 transition-all duration-300">
          <div className="flex items-center gap-2 mb-2">
            <Database className={`h-4 w-4 ${status.database === 'connected' ? 'text-emerald-300' : 'text-red-300'}`} />
            <div className="text-xs text-gray-400">Database</div>
          </div>
          <div className={`text-2xl font-bold ${status.database === 'connected' ? 'text-emerald-400' : 'text-red-400'}`}>
            {status.database === 'connected' ? 'Connected' : 'Disconnected'}
          </div>
        </div>
        
        <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-gray-800 hover:border-purple-800 transition-all duration-300">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-purple-300" />
            <div className="text-xs text-gray-400">Uptime</div>
          </div>
          <div className="text-2xl font-bold text-white">{status.uptime}</div>
        </div>
        
        <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-gray-800 hover:border-blue-800 transition-all duration-300">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-blue-300" />
            <div className="text-xs text-gray-400">API Version</div>
          </div>
          <div className="text-2xl font-bold text-white">v{status.apiVersion}</div>
        </div>
      </div>
    </div>
  );
};

export default ServerStatusCard;