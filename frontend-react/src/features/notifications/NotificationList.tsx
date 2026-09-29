import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/api/notificationService';
import { PageHeader } from '@/components/PageHeader';

export const NotificationList: React.FC = () => {
  const queryClient = useQueryClient();
  
  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationService.getAll().then(res => res.data)
  });

  const markRead = useMutation({
    mutationFn: (id: number) => notificationService.markAsRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] })
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" />
      <div className="space-y-2">
        {notifications?.content?.map((notif: any) => (
          <div 
            key={notif.id} 
            className={`p-4 border rounded ${notif.isRead ? 'bg-white' : 'bg-blue-50 border-blue-200 cursor-pointer'}`}
            onClick={() => !notif.isRead && markRead.mutate(notif.id)}
          >
            <h3 className="font-bold">{notif.title}</h3>
            <p className="text-gray-600">{notif.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
