import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchAdminProfile,
  updateAdminProfile,
  updateAdminPassword,
  fetchAdminOwnActivity,
} from '@/admin/services/adminApi';
import type { AdminUser, AdminProfileUpdateData, AdminPasswordUpdateData, UserActivityLog } from '@/admin/types';
import { toast } from 'sonner';

export const ADMIN_PROFILE_KEY = ['admin', 'profile'];
export const ADMIN_ACTIVITY_KEY = ['admin', 'profile-activity'];

export function useAdminProfile() {
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ADMIN_PROFILE_KEY,
    queryFn: fetchAdminProfile,
    staleTime: 60_000,
  });

  const activityQuery = useQuery({
    queryKey: ADMIN_ACTIVITY_KEY,
    queryFn: () => fetchAdminOwnActivity(50),
    staleTime: 60_000,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: AdminProfileUpdateData) => updateAdminProfile(data),
    onSuccess: (updatedProfile: AdminUser) => {
      queryClient.setQueryData(ADMIN_PROFILE_KEY, updatedProfile);
      toast.success('Profile updated successfully');
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to update profile'),
  });

  const updatePasswordMutation = useMutation({
    mutationFn: (data: AdminPasswordUpdateData) => updateAdminPassword(data),
    onSuccess: () => {
      toast.success('Password updated successfully');
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to update password'),
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isLoadingActivity: activityQuery.isLoading,
    activityLogs: (activityQuery.data || []) as UserActivityLog[],
    refetchProfile: profileQuery.refetch,
    refetchActivity: activityQuery.refetch,
    updateProfile: updateProfileMutation.mutateAsync,
    updatePassword: updatePasswordMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    isUpdatingPassword: updatePasswordMutation.isPending,
  };
}

