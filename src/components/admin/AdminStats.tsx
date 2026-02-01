import { Home, Eye, Star, ShieldCheck, DollarSign, TrendingUp, Users, Building, BarChart3, Target, Award } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: any;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'indigo' | 'cyan' | 'emerald';
  trend?: number;
  description?: string;
}

const StatsCard = ({ title, value, icon: Icon, color, trend, description }: StatsCardProps) => {
  const colors = {
    blue: { bg: 'from-blue-500 to-cyan-500', text: 'text-blue-300', light: 'bg-blue-900/30' },
    green: { bg: 'from-emerald-500 to-teal-500', text: 'text-emerald-300', light: 'bg-emerald-900/30' },
    orange: { bg: 'from-orange-500 to-amber-500', text: 'text-orange-300', light: 'bg-orange-900/30' },
    purple: { bg: 'from-purple-500 to-pink-500', text: 'text-purple-300', light: 'bg-purple-900/30' },
    red: { bg: 'from-rose-500 to-red-500', text: 'text-rose-300', light: 'bg-rose-900/30' },
    indigo: { bg: 'from-indigo-500 to-blue-500', text: 'text-indigo-300', light: 'bg-indigo-900/30' },
    cyan: { bg: 'from-cyan-500 to-blue-500', text: 'text-cyan-300', light: 'bg-cyan-900/30' },
    emerald: { bg: 'from-emerald-500 to-green-500', text: 'text-emerald-300', light: 'bg-emerald-900/30' }
  };

  const colorSet = colors[color as keyof typeof colors] || colors.blue;

  return (
    <div className="group bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorSet.bg} shadow-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {trend !== undefined && (
          <span className={`text-sm font-medium px-3 py-1 rounded-full ${trend > 0 ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800' : 'bg-rose-900/30 text-rose-400 border border-rose-800'}`}>
            {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="mb-2">
        <div className="text-3xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          {value}
        </div>
        <div className="text-sm text-gray-400 mt-1">{title}</div>
      </div>
      {description && (
        <div className="text-xs text-gray-500 mt-3 border-t border-gray-800 pt-3">{description}</div>
      )}
    </div>
  );
};

interface AdminStatsProps {
  stats: {
    total: number;
    published: number;
    draft: number;
    featured: number;
    verified: number;
    boys: number;
    girls: number;
    coed: number;
    family: number;
    avgRating: number;
    totalReviews: number;
    avgPrice: number;
    totalValue: number;
  };
}

const AdminStats = ({ stats }: AdminStatsProps) => {
  return (
    <>
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatsCard
          title="Total Listings"
          value={stats.total}
          icon={Building}
          color="blue"
          trend={stats.total > 0 ? 12 : 0}
          description="All PG listings"
        />
        <StatsCard
          title="Published"
          value={stats.published}
          icon={Eye}
          color="green"
          trend={Math.round((stats.published / stats.total) * 100)}
          description={`${Math.round((stats.published / stats.total) * 100)}% published`}
        />
        <StatsCard
          title="Featured"
          value={stats.featured}
          icon={Star}
          color="orange"
          trend={Math.round((stats.featured / stats.total) * 100)}
          description="Highlighted listings"
        />
        <StatsCard
          title="Verified"
          value={stats.verified}
          icon={ShieldCheck}
          color="purple"
          trend={Math.round((stats.verified / stats.total) * 100)}
          description="Trusted PGs"
        />
        <StatsCard
          title="Avg. Price"
          value={`₹${stats.avgPrice.toLocaleString()}`}
          icon={DollarSign}
          color="emerald"
          description="Monthly average"
        />
        <StatsCard
          title="Avg. Rating"
          value={stats.avgRating.toFixed(1)}
          icon={TrendingUp}
          color="cyan"
          description={`${stats.totalReviews} reviews`}
        />
      </div>

      {/* Type Distribution */}
      <div className="mb-8">
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-800 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl">
                <Users className="h-6 w-6 text-indigo-300" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">PG Type Distribution</h3>
                <p className="text-sm text-gray-400">Breakdown by accommodation type</p>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              Total: {stats.total} listings
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-5 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl border border-blue-800/30 hover:border-blue-600/50 transition-all duration-300">
              <div className="text-3xl font-bold text-blue-300">{stats.boys}</div>
              <div className="text-sm text-blue-400 mt-1">Boys PG</div>
              <div className="text-xs text-gray-500 mt-2">
                {stats.total > 0 ? Math.round((stats.boys / stats.total) * 100) : 0}% of total
              </div>
            </div>
            <div className="text-center p-5 bg-gradient-to-br from-pink-900/30 to-rose-900/30 rounded-xl border border-pink-800/30 hover:border-pink-600/50 transition-all duration-300">
              <div className="text-3xl font-bold text-pink-300">{stats.girls}</div>
              <div className="text-sm text-pink-400 mt-1">Girls PG</div>
              <div className="text-xs text-gray-500 mt-2">
                {stats.total > 0 ? Math.round((stats.girls / stats.total) * 100) : 0}% of total
              </div>
            </div>
            <div className="text-center p-5 bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl border border-purple-800/30 hover:border-purple-600/50 transition-all duration-300">
              <div className="text-3xl font-bold text-purple-300">{stats.coed}</div>
              <div className="text-sm text-purple-400 mt-1">Co-ed PG</div>
              <div className="text-xs text-gray-500 mt-2">
                {stats.total > 0 ? Math.round((stats.coed / stats.total) * 100) : 0}% of total
              </div>
            </div>
            <div className="text-center p-5 bg-gradient-to-br from-emerald-900/30 to-green-900/30 rounded-xl border border-emerald-800/30 hover:border-emerald-600/50 transition-all duration-300">
              <div className="text-3xl font-bold text-emerald-300">{stats.family}</div>
              <div className="text-sm text-emerald-400 mt-1">Family PG</div>
              <div className="text-xs text-gray-500 mt-2">
                {stats.total > 0 ? Math.round((stats.family / stats.total) * 100) : 0}% of total
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminStats;