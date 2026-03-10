import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageSquare, Share2, Bookmark } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import PostHeader from './PostHeader'; 
import PostComments from './PostComments'; 
import { AuthContext } from '../../context/AuthContext'; 

export default function PostCard({ post, callBack, from }) {
    const queryClient = useQueryClient();
    const token = localStorage.getItem('token');
    const { userData } = useContext(AuthContext);

    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);

    
    useEffect(() => {
        if (post && userData) {
            
            setIsLiked(post.likes?.some(l => l === userData?._id || l._id === userData?._id));
            
            
            setIsBookmarked(
                post.isBookmarked || 
                post.bookmarks?.some(b => b === userData?._id || b._id === userData?._id) || 
                false
            );
        }
    }, [post, userData]);

    const postId = post._id || post.id;

    

    
    const toggleLikeMutation = useMutation({
        mutationFn: () => axios.put(`https://route-posts.routemisr.com/posts/${postId}/like`, {}, {
            headers: { "Authorization": `Bearer ${token}` }
        }),
        onSuccess: () => {
            if (callBack) callBack();
            queryClient.invalidateQueries(['postdata']);
        },
        onError: () => {
            setIsLiked(!isLiked); 
            toast.error("Could not update like.");
        }
    });

    const handleLike = () => {
        setIsLiked(!isLiked); 
        toggleLikeMutation.mutate();
    };

    
    const toggleBookmarkMutation = useMutation({
        mutationFn: () => axios.put(`https://route-posts.routemisr.com/posts/${postId}/bookmark`, {}, {
            headers: { "Authorization": `Bearer ${token}` }
        }),
        onSuccess: () => {
            if (callBack) callBack();
            queryClient.invalidateQueries(['postdata']);
            queryClient.invalidateQueries(['myProfile']); 
            toast.success(isBookmarked ? "Post removed from bookmarks" : "Post saved!");
        },
        onError: () => {
            setIsBookmarked(!isBookmarked); 
            toast.error("Could not update bookmark.");
        }
    });

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked); 
        toggleBookmarkMutation.mutate();
    };

    return (
        <div className="bg-[#15202B] rounded-[20px] border border-gray-800/50 p-5 sm:p-6 shadow-sm flex flex-col gap-4">
            
            
            <PostHeader post={post} callBack={callBack} from={from} />

            
            <div className="flex flex-col gap-4 mt-1">
                <p className="text-[15px] sm:text-[16px] text-gray-200 leading-relaxed whitespace-pre-wrap">
                    {post.body}
                </p>
                
                {post.image && (
                    <img 
                        src={post.image} 
                        alt="Post content" 
                        className="w-full rounded-2xl border border-gray-800/50 object-cover max-h-[500px]" 
                    />
                )}
            </div>

            
            <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-800/50">
                <div className="flex items-center gap-2 sm:gap-4">
                    
                    
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 font-bold text-[13px] sm:text-[14px] px-3 py-1.5 rounded-full transition-colors ${
                            isLiked ? 'text-red-500 bg-red-500/10' : 'text-gray-400 hover:text-red-500 hover:bg-red-500/10'
                        }`}
                    >
                        <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                        {post.likesCount || 0} Likes
                    </button>
                    
                    
                    <Link to={`/post-details/${postId}`} className="flex items-center gap-2 text-gray-400 hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10 px-3 py-1.5 rounded-full font-bold text-[13px] sm:text-[14px] transition-colors">
                        <MessageSquare size={18} />
                        {post.commentsCount || 0} Comments
                    </Link>
                    
                    
                    <button className="flex items-center gap-2 text-gray-400 hover:text-white font-bold text-[13px] sm:text-[14px] transition-colors px-3 py-1.5 rounded-full hover:bg-gray-800/50">
                        <Share2 size={18} />
                        <span className="hidden sm:inline">Share</span>
                    </button>
                </div>

                
                <button 
                    onClick={handleBookmark}
                    disabled={toggleBookmarkMutation.isPending}
                    className={`transition-colors p-2 rounded-full hover:bg-[#1DA1F2]/10 ${
                        isBookmarked ? 'text-[#1DA1F2]' : 'text-gray-400 hover:text-[#1DA1F2]'
                    }`}
                >
                    <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
                </button>
            </div>

            
            <PostComments post={post} from={from} callBack={callBack} />

        </div>
    );
}