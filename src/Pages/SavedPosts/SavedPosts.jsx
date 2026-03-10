import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Bookmark, BookmarkX } from 'lucide-react';

import { LeftSidebar } from '../../Components/LeftSidebar/LeftSidebar';
import RightSidebar from '../../Components/RightSidebar/RightSidebar';
import PostCard from '../../Components/post/postCard';
import SkeletonComponent from '../../Components/skelton/Skelton';

export default function SavedPosts() {
    const token = localStorage.getItem('token');

    
    function getSavedPosts() {
        return axios.get('https://route-posts.routemisr.com/users/bookmarks', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['saved-posts'],
        queryFn: getSavedPosts,
    });

    
    
    const postsArray = data?.data?.data?.bookmarks || data?.data?.bookmarks || data?.data?.data?.posts || data?.data?.posts || [];

    return (
        <div className="min-h-screen bg-[#0B1014] text-white font-sans flex justify-center mx-auto">
            <div className="w-full max-w-7xl flex gap-6 px-4 py-6">

                
                <LeftSidebar />

                
                <main className="flex-1 max-w-2xl w-full flex flex-col gap-6">

                    
                    <div className="bg-[#15202B] rounded-2xl p-6 shadow-sm border border-gray-800/50 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#1C2732] flex items-center justify-center shrink-0">
                            <Bookmark size={24} className="text-[#1DA1F2]" fill="#1DA1F2" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-wide">Saved Posts</h1>
                            <p className="text-gray-400 text-sm mt-1">Everything you've bookmarked to read later.</p>
                        </div>
                    </div>

                    
                    {isLoading ? (
                        <>
                            <SkeletonComponent />
                            <SkeletonComponent />
                            <SkeletonComponent />
                        </>
                    ) : isError ? (
                        <div className="bg-[#15202B] rounded-2xl p-6 shadow-sm border border-red-900/50 text-center">
                            <span className="text-red-400 text-sm font-medium">Something went wrong while fetching your bookmarks.</span>
                            <button onClick={() => refetch()} className="block mx-auto mt-2 text-[#1DA1F2] hover:underline text-xs">
                                Try Again
                            </button>
                        </div>
                    ) : postsArray?.length > 0 ? (
                        postsArray.map((post) => (
                            
                            
                            <PostCard key={post._id} post={post} callBack={refetch} from='saved' />
                        ))
                    ) : (
                        <div className="bg-[#15202B] rounded-2xl p-12 shadow-sm border border-gray-800/50 text-center flex flex-col items-center gap-3">
                            <div className="w-16 h-16 rounded-full bg-[#1C2732] flex items-center justify-center text-gray-500 mb-2">
                                <BookmarkX size={32} />
                            </div>
                            <span className="text-gray-300 font-bold text-lg">No saved posts yet</span>
                            <span className="text-sm text-gray-500 max-w-sm">
                                When you see something you want to remember, click the bookmark icon to save it here.
                            </span>
                        </div>
                    )}

                </main>

                
                <RightSidebar />

            </div>
        </div>
    );
}