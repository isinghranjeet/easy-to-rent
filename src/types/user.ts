export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'owner' | 'admin';
  phone?: string;
  profileImage?: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin?: string;
  lastLoginIP?: string;
}
