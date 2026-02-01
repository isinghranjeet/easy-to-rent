// Custom icon components
import { LucideProps } from 'lucide-react';

export const PieChartIcon = (props: LucideProps) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
  </svg>
);

export const ImageIcon = (props: LucideProps) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

// Re-export lucide icons for convenience
export {
  Home,
  Eye,
  Star,
  ShieldCheck,
  DollarSign,
  TrendingUp,
  Users,
  Building,
  MapPin,
  Phone,
  Mail,
  User,
  Filter,
  Search,
  Plus,
  Download,
  Upload,
  RefreshCw,
  Edit,
  Trash2,
  EyeOff,
  StarOff,
  CheckCircle,
  X,
  Save,
  Loader2,
  Server,
  Grid,
  List
} from 'lucide-react';