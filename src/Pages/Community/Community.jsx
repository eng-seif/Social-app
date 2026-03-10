import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { LeftSidebar } from '../../Components/LeftSidebar/LeftSidebar';
import RightSidebar from '../../Components/RightSidebar/RightSidebar';
import PostCard from '../../Components/post/PostCard';
import AddEditPost from '../../Components/post/AddEditPost';
import SkeletonComponent from '../../Components/skelton/Skelton';

export default function Community() {

    function getAllPosts() {
        return axios.get('https://route-posts.routemisr.com/posts', {
            params: {
                limit: 14,
                page: 1,
            },
            headers: {
                token: localStorage.getItem('token')
            }
        });
    }

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['community-posts'], 
        queryFn: getAllPosts,
    });

    const postsArray = data?.data?.posts || data?.data?.data?.posts || [];

    return (
        <div className="min-h-screen bg-[#0B1014] text-white font-sans flex justify-center">
            <div className="w-full max-w-7xl flex gap-6 px-4 py-6">

                
                <LeftSidebar />

                
                <main className="flex-1 max-w-2xl w-full flex flex-col gap-6">

                    <AddEditPost />

                    {isLoading ? (
                        <>
                            <SkeletonComponent />
                            <SkeletonComponent />
                            <SkeletonComponent />
                        </>
                    ) : isError ? (
                        <div className="bg-[#15202B] rounded-2xl p-6 shadow-sm border border-red-900/50 text-center">
                            <span className="text-red-400 text-sm font-medium">Something went wrong while fetching posts.</span>
                            <button onClick={() => refetch()} className="block mx-auto mt-2 text-[#1DA1F2] hover:underline text-xs">
                                Try Again
                            </button>
                        </div>
                    ) : postsArray?.length > 0 ? (
                        postsArray.map((post) => (
                            <PostCard key={post._id} post={post} callBack={refetch} from='community' />
                        ))
                    ) : (
                        <div className="bg-[#15202B] rounded-2xl p-8 shadow-sm border border-gray-800/50 text-center text-gray-500">
                            No posts to show right now. Be the first to post!
                        </div>
                    )}

                </main>

                
                <RightSidebar />

            </div>
        </div>
    );
}