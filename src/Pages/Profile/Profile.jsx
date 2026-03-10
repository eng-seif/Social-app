import React, { useState, useContext } from 'react';
import { 
  Camera, 
  Users, 
  Mail, 
  UserCheck, 
  FileText, 
  Bookmark,
  Code,
  Maximize2
} from 'lucide-react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../../context/AuthContext.jsx'; 
import PostCard from '../../Components/post/PostCard';
import SkeletonComponent from './../../Components/skelton/Skelton'; 
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const { userData } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');

  
  const { data: profileData, isLoading: isProfileLoading, isError: isProfileError } = useQuery({
    queryKey: ['myProfile'], 
    queryFn: () => axios.get('https://route-posts.routemisr.com/users/profile-data', {
      headers: { token }
    }),
  });

  const user = profileData?.data?.data?.user || profileData?.data?.user || {};

  
  const { data: postsData, isLoading: isPostsLoading, refetch: refetchPosts } = useQuery({
    queryKey: ['user-profile', userData?._id],
    queryFn: () => axios.get('https://route-posts.routemisr.com/users/' + userData?._id + '/posts', {
      headers: { 'Authorization': `Bearer ${token}` }
    }),
    enabled: !!userData?._id, 
  });

  const userPosts = postsData?.data?.data?.posts || [];

  
  const uploadPhotoMutation = useMutation({
    mutationFn: (formData) => axios.put('https://route-posts.routemisr.com/users/upload-photo', formData, {
      headers: {
        'token': token,
        'Content-Type': 'multipart/form-data'
      }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['myProfile']);
      queryClient.invalidateQueries(['user-profile']);
      queryClient.invalidateQueries(['postdata']); 
      toast.success("Profile photo updated successfully!");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to upload photo.");
    }
  });

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('photo', file); 
      uploadPhotoMutation.mutate(formData);
    }
  };

  
  const uploadCoverMutation = useMutation({
    mutationFn: (formData) => axios.put('https://route-posts.routemisr.com/users/upload-cover', formData, {
      headers: {
        'token': token,
        'Content-Type': 'multipart/form-data'
      }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['myProfile']);
      toast.success("Cover photo updated!");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Cover photo upload is not supported by API yet.");
    }
  });

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('cover', file);
      uploadCoverMutation.mutate(formData);
    }
  };

  
  if (isProfileLoading) {
    return (
      <div className="min-h-screen bg-[#0B1014] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-700 border-t-[#1DA1F2] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isProfileError) {
    return (
      <div className="min-h-screen bg-[#0B1014] flex items-center justify-center">
        <div className="text-red-400">Failed to load profile data.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1014] text-white font-sans flex flex-col items-center py-8 px-4">
      
      
      <div className="w-full max-w-5xl bg-[#15202B] rounded-2xl overflow-hidden shadow-lg border border-gray-800/50">
        
        
        <div 
          className="h-48 md:h-64 relative border-b border-gray-800/50 bg-cover bg-center group"
          style={{ 
            backgroundImage: user.cover ? `url(${user.cover})` : 'linear-gradient(to right, #1a2a3a, #15202B, #0B1014)'
          }}
        >
          
          <label className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 hover:bg-black/80 text-white text-sm font-semibold py-2 px-4 rounded-lg backdrop-blur-md transition-all border border-white/10 cursor-pointer opacity-0 group-hover:opacity-100">
            {uploadCoverMutation.isPending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Camera size={16} />
            )}
            {user.cover ? 'Change cover' : 'Add cover'}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleCoverUpload} 
              disabled={uploadCoverMutation.isPending} 
            />
          </label>
        </div>

        
        <div className="px-6 md:px-10 pb-8 relative">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 -mt-16 md:-mt-20">
            
            
            <div className="flex flex-col gap-4">
              
              
              <div className="relative w-32 h-32 shrink-0 group mt-2">
                <div className="w-full h-full rounded-full border-4 border-[#15202B] bg-[#1C2732] overflow-hidden">
                  <img 
                    src={user.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || 'placeholder'}`} 
                    alt="Profile Avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>

                
                <div className="absolute -bottom-2 -right-3 flex items-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    

                  
                  <label className="w-12 h-12 rounded-full bg-[#1DA1F2] text-white shadow-[0_4px_12px_rgba(29,161,242,0.4)] flex items-center justify-center hover:bg-[#1a8cd8] transition-colors cursor-pointer z-20">
                    {uploadPhotoMutation.isPending ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Camera size={20} strokeWidth={2.5} />
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handlePhotoUpload} 
                      disabled={uploadPhotoMutation.isPending} 
                    />
                  </label>

                </div>
              </div>

              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-white tracking-wide">{user.name || 'User Name'}</h1>
                <span className="text-gray-400 text-sm mb-3">@{user.username || 'username'}</span>
                
                <div className="flex items-center gap-2 w-fit bg-[#1DA1F2]/10 text-[#1DA1F2] px-3 py-1.5 rounded-full text-xs font-semibold border border-[#1DA1F2]/20">
                  <Users size={14} />
                  Route Posts member
                </div>
              </div>
            </div>

            
            <div className="flex gap-3 md:gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <div className="bg-[#1C2732] border border-gray-800/50 rounded-xl p-4 flex-1 md:w-[120px] flex flex-col items-center justify-center gap-1 shadow-sm">
                <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Followers</span>
                <span className="text-2xl font-bold text-white">{user.followersCount || 0}</span>
              </div>
              
              <div className="bg-[#1C2732] border border-gray-800/50 rounded-xl p-4 flex-1 md:w-[120px] flex flex-col items-center justify-center gap-1 shadow-sm">
                <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Following</span>
                <span className="text-2xl font-bold text-white">{user.followingCount || 0}</span>
              </div>
              
              <div className="bg-[#1C2732] border border-gray-800/50 rounded-xl p-4 flex-1 md:w-[120px] flex flex-col items-center justify-center gap-1 shadow-sm">
                <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Bookmarks</span>
                <span className="text-2xl font-bold text-white">{user.bookmarksCount || 0}</span>
              </div>
            </div>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <div className="bg-[#1C2732] border border-gray-800/50 rounded-xl p-6 flex flex-col gap-4 shadow-sm">
              <h2 className="text-sm font-bold text-white mb-2">About</h2>
              
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <Mail size={18} className="text-gray-500" />
                <span>{user.email || 'No email provided'}</span>
              </div>
              
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <UserCheck size={18} className="text-gray-500" />
                <span>Active on Route Posts</span>
              </div>

              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <Code size={18} className="text-gray-500" />
                <span>Full-Stack Developer</span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-[#1C2732] border border-gray-800/50 rounded-xl p-6 flex flex-col shadow-sm h-full justify-center">
                <span className="text-[10px] font-bold text-[#1DA1F2] tracking-wider uppercase mb-1">My Posts</span>
                <span className="text-2xl font-bold text-white">{userPosts?.length || 0}</span>
              </div>

              <div className="bg-[#1C2732] border border-gray-800/50 rounded-xl p-6 flex flex-col shadow-sm h-full justify-center">
                <span className="text-[10px] font-bold text-[#1DA1F2] tracking-wider uppercase mb-1">Saved Posts</span>
                <span className="text-2xl font-bold text-white">{user.bookmarksCount || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      <div className="w-full max-w-5xl bg-[#15202B] rounded-2xl mt-6 border border-gray-800/50 p-3 flex justify-between items-center shadow-sm overflow-x-auto">
        <div className="flex gap-2">
          
          
          <button 
            onClick={() => setActiveTab('posts')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'posts' 
                ? 'bg-[#1C2732] text-white border border-gray-700/50' 
                : 'text-gray-400 hover:text-white hover:bg-[#1C2732]/50'
            }`}
          >
            <FileText size={16} className={activeTab === 'posts' ? "text-[#1DA1F2]" : ""} />
            My Posts
          </button>
          
          
          <button 
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'saved' 
                ? 'bg-[#1C2732] text-white border border-gray-700/50' 
                : 'text-gray-400 hover:text-white hover:bg-[#1C2732]/50'
            }`}
          >
            <Bookmark size={16} className={activeTab === 'saved' ? "text-[#1DA1F2]" : ""} />
            Saved
          </button>
        </div>
      </div>

      
      <div className="w-full max-w-5xl mt-6 flex flex-col gap-6 pb-20">
        
        
        {activeTab === 'posts' && (
          isPostsLoading ? (
            <>
              <SkeletonComponent />
              <SkeletonComponent />
            </>
          ) : userPosts?.length > 0 ? (
            userPosts.map((post) => (
              <PostCard key={post._id} post={post} callBack={refetchPosts} from="profile" />
            ))
          ) : (
            <div className="bg-[#15202B] rounded-2xl p-10 text-center text-gray-500 border border-gray-800/50 shadow-sm">
              You haven't posted anything yet. 
            </div>
          )
        )}

        
        {activeTab === 'saved' && (
          <div className="bg-[#15202B] rounded-2xl p-10 text-center text-gray-500 border border-gray-800/50 shadow-sm">
            Saved posts coming soon...
          </div>
        )}

      </div>

    </div>
  );
};

export default ProfilePage;