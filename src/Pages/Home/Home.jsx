import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { LeftSidebar } from '../../Components/LeftSidebar/LeftSidebar';
import RightSidebar from '../../Components/RightSidebar/RightSidebar';
import PostCard from '../../Components/post/PostCard';
import AddEditPost from '../../Components/post/AddEditPost';
import SkeletonComponent from '../../Components/skelton/Skelton';

export default function Home() {

  function getAllPosts() {
    return axios.get('https://route-posts.routemisr.com/posts/feed?only=following', {
      params: {
        limit: 14,
        page: 1,

      },
      headers: {
        // Keeping your token header setup
        token: localStorage.getItem('token')
      }
    });
  }

  // Grab 'refetch' so we can pass it to child components to update the feed on demand
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['postdata'],
    queryFn: getAllPosts,
  });

  // Safely extract posts from the nested Axios/React-Query response
  const postsArray = data?.data?.posts || data?.data?.data?.posts || [];

  return (
    <div className="min-h-screen bg-[#0B1014] text-white font-sans flex justify-center">
      
      <div className="w-full max-w-7xl flex gap-6 px-4 py-6">

        
        <LeftSidebar />


        
        <main className="flex-1 max-w-2xl w-full flex flex-col gap-6">

          
          <AddEditPost />

          
          {isLoading ? (
            // Render 3 skeletons stacked on top of each other to fill the screen
            <>
              <SkeletonComponent />
              <SkeletonComponent />
              <SkeletonComponent />
            </>
          ) : isError ? (
            // ... rest of your code ? (
            // 2. ERROR STATE
            <div className="bg-[#15202B] rounded-2xl p-6 shadow-sm border border-red-900/50 text-center">
              <span className="text-red-400 text-sm font-medium">Something went wrong while fetching posts.</span>
              <button onClick={() => refetch()} className="block mx-auto mt-2 text-[#1DA1F2] hover:underline text-xs">
                Try Again
              </button>
            </div>

          ) : postsArray?.length > 0 ? (
            // 3. SUCCESS STATE (Render Posts)
            postsArray.map((post) => (
              // Note: Passed 'refetch' instead of 'getAllPosts'
              <PostCard key={post._id} post={post} callBack={refetch} from='home' />
            ))

          ) : (
            // 4. EMPTY STATE
            <div className="bg-[#15202B] rounded-2xl p-8 shadow-sm border border-gray-800/50 text-center text-gray-500">
              No posts to show right now. Be the first to post!
            </div>
          )}

        </main>

        
        <RightSidebar />

      </div>
    </div>
  );
};