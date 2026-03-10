import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { LeftSidebar } from '../../Components/LeftSidebar/LeftSidebar';
import RightSidebar from '../../Components/RightSidebar/RightSidebar';
import PostCard from '../../Components/post/PostCard';
import SkeletonComponent from '../../Components/skelton/Skelton';
import { AuthContext } from '../../context/AuthContext';
import AddEditPost from '../../Components/post/AddEditPost';

export default function MyPosts() {
    
    const { userData } = useContext(AuthContext);

    
    function getUserPosts() {
        return axios.get(`https://route-posts.routemisr.com/users/${userData?._id}/posts`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    }

    
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['my-posts', userData?._id],
        queryFn: getUserPosts,
        enabled: !!userData?._id, 
    });

    
    const postsArray = data?.data?.posts || data?.data?.data?.posts || [];

    return (
        <div className="min-h-screen bg-[#0B1014] text-white font-sans flex justify-center">
            <div className="w-full max-w-7xl flex gap-6 px-4 py-6">

                
                <LeftSidebar />

                
                <main className="flex-1 max-w-2xl w-full flex flex-col gap-6">

                    
                    <AddEditPost />

                    
                    {isLoading || !userData ? (
                        <>
                            <SkeletonComponent />
                            <SkeletonComponent />
                            <SkeletonComponent />
                        </>
                    ) : isError ? (
                        <div className="bg-[#15202B] rounded-2xl p-6 shadow-sm border border-red-900/50 text-center">
                            <span className="text-red-400 text-sm font-medium">Something went wrong while fetching your posts.</span>
                            <button onClick={() => refetch()} className="block mx-auto mt-2 text-[#1DA1F2] hover:underline text-xs">
                                Try Again
                            </button>
                        </div>
                    ) : postsArray?.length > 0 ? (
                        postsArray.map((post) => (
                            <PostCard key={post._id} post={post} callBack={refetch} from='myposts' />
                        ))
                    ) : (
                        <div className="bg-[#15202B] rounded-2xl p-10 shadow-sm border border-gray-800/50 text-center flex flex-col items-center gap-2">
                            <span className="text-gray-400 font-medium">You haven't posted anything yet!</span>
                            <span className="text-sm text-gray-500">Head over to the Home Feed to share your first thought.</span>
                        </div>
                    )}

                </main>

                
                <RightSidebar />

            </div>
        </div>
    );
}