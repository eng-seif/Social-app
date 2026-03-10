import React, { useState } from 'react';
import {
  Heart,
  MessageSquare,
  Repeat2,
  Check,
  CheckCheck,
  UserPlus,
  AtSign
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Skeleton } from "@heroui/react";
import { Link, useNavigate } from 'react-router-dom'; 


const timeAgoShort = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d`;
};


const NotificationSkeleton = () => (
  <div className="bg-[#15202B] border border-gray-800/50 rounded-2xl p-4 flex gap-4 mb-3 shadow-sm">
    <div className="shrink-0">
      <Skeleton className="w-12 h-12 rounded-full">
        <div className="w-12 h-12 rounded-full bg-[#1C2732]" />
      </Skeleton>
    </div>
    <div className="flex-1 flex flex-col justify-center gap-3">
      <div className="flex justify-between items-center">
        <Skeleton className="h-3 w-3/4 rounded-lg">
          <div className="h-3 w-3/4 bg-[#1C2732] rounded-lg" />
        </Skeleton>
        <Skeleton className="h-2 w-8 rounded-lg">
          <div className="h-2 w-8 bg-[#1C2732] rounded-lg" />
        </Skeleton>
      </div>
      <Skeleton className="h-2 w-1/2 rounded-lg">
        <div className="h-2 w-1/2 bg-[#1C2732] rounded-lg" />
      </Skeleton>
    </div>
  </div>
);

const NotificationsPage = () => {
  const [filter, setFilter] = useState('All'); 
  const [markedReadSession, setMarkedReadSession] = useState(new Set()); 
  
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');
  const navigate = useNavigate(); 

  const handleTabChange = (newTab) => {
    setFilter(newTab);
    setMarkedReadSession(new Set()); 
  };

  
  const { data: notifData, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => axios.get('https://route-posts.routemisr.com/notifications?unread=false&page=1&limit=20', {
      headers: { token }
    }),
  });

  const { data: countData } = useQuery({
    queryKey: ['unreadCount'],
    queryFn: () => axios.get('https://route-posts.routemisr.com/notifications/unread-count', {
      headers: { token }
    }),
  });

  const notifications = notifData?.data?.notifications || notifData?.data?.data?.notifications || [];
  const unreadCount = countData?.data?.count || countData?.data?.data?.count || notifications.filter(n => !n.isRead).length;
  
  const displayedNotifications = filter === 'All' 
    ? notifications 
    : notifications.filter(n => !n.isRead || markedReadSession.has(n._id || n.id));

  
  const markAllReadMutation = useMutation({
    mutationFn: () => {
      const unreadIds = notifications.filter(n => !n.isRead).map(n => n._id || n.id);
      setMarkedReadSession(prev => new Set([...prev, ...unreadIds]));

      return axios.patch('https://route-posts.routemisr.com/notifications/read-all', {}, {
        headers: { token }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      queryClient.invalidateQueries(['unreadCount']);
      toast.success('All notifications marked as read');
    }
  });

  const markSingleReadMutation = useMutation({
    mutationFn: (notificationId) => {
      setMarkedReadSession(prev => new Set(prev).add(notificationId));

      return axios.patch(`https://route-posts.routemisr.com/notifications/${notificationId}/read`, {}, {
        headers: { token }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      queryClient.invalidateQueries(['unreadCount']);
    }
  });

  
  const handleNotificationClick = (notification) => {
    const id = notification._id || notification.id;
    const isCurrentlyRead = notification.isRead || markedReadSession.has(id);
    
    
    if (!isCurrentlyRead) {
      markSingleReadMutation.mutate(id);
    }

    
    
    const relatedPostId = notification.post?._id || notification.post;

    
    
    if (relatedPostId) {
        navigate(`/post-details/${relatedPostId}`);
    }
  };

  
  const getNotificationUI = (notification) => {
    const type = notification.type?.toLowerCase() || notification.action?.toLowerCase() || '';
    const actionUser = notification.from || notification.user || notification.creator;
    const userName = actionUser?.name || 'Someone';
    
    let Icon = MessageSquare;
    let iconColor = "text-[#1DA1F2]"; 
    let actionText = "interacted with your post";

    if (type.includes('like')) {
      Icon = Heart;
      iconColor = "text-red-500";
      actionText = "liked your post";
    } else if (type.includes('comment')) {
      Icon = MessageSquare;
      iconColor = "text-[#1DA1F2]";
      actionText = "commented on your post";
    } else if (type.includes('share')) {
      Icon = Repeat2;
      iconColor = "text-green-500";
      actionText = "shared your post";
    } else if (type.includes('follow')) {
      Icon = UserPlus;
      iconColor = "text-[#1DA1F2]";
      actionText = "started following you";
    } else if (type.includes('mention')) {
      Icon = AtSign;
      iconColor = "text-[#1DA1F2]";
      actionText = "mentioned you in a comment";
    }

    return { Icon, iconColor, actionText, userName, actionUser };
  };

  return (
    <div className="min-h-screen bg-[#0B1014] font-sans flex justify-center py-8 px-4">
      <div className="w-full max-w-4xl flex flex-col h-fit">
        
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-wide">Notifications</h1>
            <p className="text-gray-400 text-sm mt-1">Realtime updates for likes, comments, shares, and follows.</p>
          </div>
          <button 
            onClick={() => markAllReadMutation.mutate()}
            disabled={unreadCount === 0 || markAllReadMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 border border-[#1DA1F2]/30 text-[#1DA1F2] rounded-xl text-sm font-bold hover:bg-[#1DA1F2]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            <CheckCheck size={16} /> Mark all as read
          </button>
        </div>

        
        <div className="flex gap-2 mb-6 border-b border-gray-800/50 pb-6">
          <button 
            onClick={() => handleTabChange('All')} 
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-colors ${
              filter === 'All' ? 'bg-[#1DA1F2] text-white shadow-sm' : 'bg-[#15202B] border border-gray-800/50 text-gray-400 hover:text-white hover:bg-[#1C2732]'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => handleTabChange('Unread')} 
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-colors ${
              filter === 'Unread' ? 'bg-[#1DA1F2] text-white shadow-sm' : 'bg-[#15202B] border border-gray-800/50 text-gray-400 hover:text-white hover:bg-[#1C2732]'
            }`}
          >
            Unread
            {unreadCount > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${filter === 'Unread' ? 'bg-white text-[#1DA1F2]' : 'bg-[#1DA1F2] text-white'}`}>
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        
        <div className="flex flex-col gap-3">
          {isLoading ? (
            <>
              <NotificationSkeleton />
              <NotificationSkeleton />
              <NotificationSkeleton />
            </>
          ) : displayedNotifications.length === 0 ? (
            <div className="bg-[#15202B] rounded-2xl p-10 text-center text-gray-500 border border-gray-800/50">
              {filter === 'Unread' ? "You're all caught up! No unread notifications." : "No notifications found."}
            </div>
          ) : (
            displayedNotifications.map((notif) => {
              const { Icon, iconColor, actionText, userName, actionUser } = getNotificationUI(notif);
              const userPhoto = actionUser?.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}&backgroundColor=475569`;
              const snippet = notif.content || notif.message || ""; 
              
              const isCurrentlyRead = notif.isRead || markedReadSession.has(notif._id || notif.id);

              return (
                <div 
                  key={notif._id || notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`border rounded-[16px] p-5 flex gap-4 transition-colors cursor-pointer hover:shadow-sm ${
                    isCurrentlyRead 
                      ? 'border-gray-800/50 bg-[#15202B]' 
                      : 'border-[#1DA1F2]/20 bg-[#1DA1F2]/5' 
                  }`}
                >
                  
                  <div className="shrink-0">
                    <img 
                      src={userPhoto} 
                      alt={userName} 
                      className="w-[46px] h-[46px] rounded-full object-cover bg-slate-700 border border-gray-800" 
                    />
                  </div>

                  
                  <div className="flex-1 flex flex-col justify-center">
                    
                    <div className="flex justify-between items-start">
                      <div className="text-[15px] text-gray-300">
                        <Link to={'/post-details/' + userName._id}>
                        <span className="font-bold text-white">{userName}</span> {actionText}
                        </Link>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-4">
                        <span className="text-[13px] text-gray-500">
                          {timeAgoShort(notif.createdAt)}
                        </span>
                        {!isCurrentlyRead && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#1DA1F2]"></div>
                        )}
                      </div>
                    </div>

                    {snippet && (
                      <div className="text-[14px] text-gray-400 mt-1 line-clamp-2">
                        {snippet}
                      </div>
                    )}

                    <div className="flex items-center gap-3 mt-3">
                      <Icon size={18} className={iconColor} fill={Icon === Heart ? "currentColor" : "none"} />
                      
                      {isCurrentlyRead ? (
                        <span className="text-[13px] font-bold text-green-500 flex items-center gap-1.5 transition-all">
                          <Check size={16} /> Read
                        </span>
                      ) : (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation(); 
                            markSingleReadMutation.mutate(notif._id || notif.id);
                          }}
                          disabled={markSingleReadMutation.isPending}
                          className="flex items-center gap-1.5 px-3 py-1 border border-[#1DA1F2] rounded-[8px] text-[#1DA1F2] text-[13px] font-bold hover:bg-[#1DA1F2]/10 transition-colors disabled:opacity-50"
                        >
                          <Check size={16} /> Mark as read
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};

export default NotificationsPage;