import React, { useState } from 'react';
import { Search, Users, UserPlus, UserCheck, X } from 'lucide-react';
import axios from 'axios';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export default function RightSidebar() {
    const [searchQuery, setSearchQuery] = useState('');
    
    const [followedUsers, setFollowedUsers] = useState([]);

    function getSuggestions() {
        return axios.get('https://route-posts.routemisr.com/users/suggestions?limit=50', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    }

    const { data: suggestionsData, isLoading } = useQuery({
        queryKey: ['followSuggestions'],
        queryFn: getSuggestions,
    });

    const suggestedFriends = suggestionsData?.data?.data?.suggestions || [];

    const filteredFriends = suggestedFriends.filter((friend) => {
        const query = searchQuery.toLowerCase();
        return (
            friend.name?.toLowerCase().includes(query) || 
            friend.username?.toLowerCase().includes(query)
        );
    });

    const toggleFollowMutation = useMutation({
        mutationFn: async ({ userId, isCurrentlyFollowing }) => {
            const url = `https://route-posts.routemisr.com/users/${userId}/follow`;
            const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };

            if (isCurrentlyFollowing) {
                return axios.delete(url, { headers });
            } else {
                return axios.put(url, {}, { headers });
            }
        },
        onError: (err, variables) => {
            toast.error("Failed to update follow status.");
            setFollowedUsers((prev) => 
                variables.isCurrentlyFollowing 
                    ? [...prev, variables.userId] 
                    : prev.filter(id => id !== variables.userId)
            );
        }
    });

    const handleFollowToggle = (userId) => {
        const isCurrentlyFollowing = followedUsers.includes(userId);
        
        if (isCurrentlyFollowing) {
            setFollowedUsers((prev) => prev.filter(id => id !== userId));
        } else {
            setFollowedUsers((prev) => [...prev, userId]);
        }

        toggleFollowMutation.mutate({ userId, isCurrentlyFollowing });
    };

    return (
        <div>
            <aside className="hidden xl:flex flex-col w-[300px] shrink-0 gap-6 sticky top-6 h-fit pb-6">

                
                <div className="bg-[#15202B] rounded-2xl p-5 border border-gray-800/50 shadow-sm">
                    
                    
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-white font-bold">
                            <Users size={18} className="text-[#1DA1F2]" />
                            <h2 className="text-md tracking-wide">Suggested Friends</h2>
                        </div>
                        <span className="bg-[#1C2732] text-gray-400 text-xs font-bold px-2.5 py-1 rounded-full border border-gray-800/50">
                            
                            {filteredFriends.length}
                        </span>
                    </div>

                    
                    <div className="relative mb-5">
                        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search friends..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#1C2732] text-white text-sm rounded-xl pl-9 pr-9 py-2.5 outline-none border border-transparent focus:border-[#1DA1F2]/50 transition-colors placeholder-gray-500"
                        />
                        
                        {searchQuery && (
                            <button 
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    
                    <div className="flex flex-col gap-3">
                        {isLoading ? (
                            <div className="text-center py-6 text-gray-500 text-sm">Loading suggestions...</div>
                        ) : filteredFriends.length > 0 ? (
                            // 4. Map over filteredFriends instead of suggestedFriends
                            filteredFriends.map((friend) => {
                                const isFollowing = followedUsers.includes(friend._id);

                                return (
                                    <div key={friend._id} className="flex flex-col gap-3 p-3 border border-gray-800/50 rounded-xl hover:bg-[#1C2732]/40 transition-colors">
                                        
                                        
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <img 
                                                    src={friend.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.name}&backgroundColor=475569`} 
                                                    alt={friend.name} 
                                                    className="w-10 h-10 rounded-full bg-slate-700 object-cover shrink-0" 
                                                />
                                                <div className="flex flex-col overflow-hidden pr-2">
                                                    <span className="text-sm font-bold text-gray-100 leading-tight truncate">{friend.name}</span>
                                                    <span className="text-xs text-gray-500 truncate">@{friend.username || 'user'}</span>
                                                </div>
                                            </div>
                                            
                                            <button 
                                                onClick={() => handleFollowToggle(friend._id)}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border shrink-0 ${
                                                    isFollowing 
                                                        ? 'bg-transparent text-gray-400 border-gray-600 hover:border-red-500 hover:text-red-500' 
                                                        : 'text-[#1DA1F2] bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 border-[#1DA1F2]/20'
                                                }`}
                                            >
                                                {isFollowing ? (
                                                    <>
                                                        <UserCheck size={14} />
                                                        Unfollow
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserPlus size={14} />
                                                        Follow
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        
                                        <div className="flex items-center gap-2">
                                            <span className="bg-[#1C2732] text-gray-400 text-[10px] font-semibold px-2 py-1 rounded-md border border-gray-800/50">
                                                {friend.followersCount || 0} followers
                                            </span>
                                            <span className="bg-[#1DA1F2]/10 text-[#1DA1F2] text-[10px] font-semibold px-2 py-1 rounded-md border border-[#1DA1F2]/20">
                                                {friend.mutualFollowersCount || 0} mutual
                                            </span>
                                        </div>

                                    </div>
                                );
                            })
                        ) : (
                            // 5. Empty state if search yields no results
                            <div className="text-center py-6 text-gray-500 text-sm">
                                {searchQuery ? "No users found." : "No suggestions right now."}
                            </div>
                        )}
                    </div>

                </div>

                
                <div className="flex flex-wrap gap-x-4 gap-y-2 px-2 text-xs text-gray-500 justify-center">
                    <a href="#" className="hover:underline hover:text-gray-300 transition-colors">Privacy</a>
                    <a href="#" className="hover:underline hover:text-gray-300 transition-colors">Terms</a>
                    <a href="#" className="hover:underline hover:text-gray-300 transition-colors">Guidelines</a>
                    <a href="#" className="hover:underline hover:text-gray-300 transition-colors">Cookies</a>
                    <span className="w-full text-center mt-1">© 2026 Social App Inc.</span>
                </div>

            </aside>
        </div>
    );
}