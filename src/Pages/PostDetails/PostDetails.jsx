import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
    ArrowLeft,
    Heart,
    MessageSquare,
    Share2,
    Bookmark
} from "lucide-react";

import Loader from "../../Components/Loader/Loader";
import PostHeader from "../../Components/post/PostHeader";
import PostComments from "../../Components/post/PostComments"; 
import { AuthContext } from "../../context/AuthContext";

export default function PostDetails() {
    const { postId } = useParams();
    const queryClient = useQueryClient();
    const { userData } = useContext(AuthContext);
    const token = localStorage.getItem('token');

    const [postDetails, setPostDetails] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false); 

    
    function getPostDetails() {
        axios.get(`https://route-posts.routemisr.com/posts/${postId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        }).then((res) => {
            if (res.data.success) {
                const post = res.data.data.post;
                setPostDetails(post);
                
                
                setIsLiked(post.likes?.some(l => l === userData?._id || l._id === userData?._id));
                
                
                
                setIsBookmarked(
                    post.isBookmarked || 
                    post.bookmarks?.some(b => b === userData?._id || b._id === userData?._id) || 
                    false
                );
            }
        }).catch((err) => console.log(err.response));
    }

    useEffect(() => {
        getPostDetails();
    }, [postId]);

    useEffect(() => {
        if (postDetails) document.title = `Post by ${postDetails?.user?.name}`;
    }, [postDetails]);

    
    
    
    const toggleLikeMutation = useMutation({
        mutationFn: () => axios.put(`https://route-posts.routemisr.com/posts/${postId}/like`, {}, {
            headers: { "Authorization": `Bearer ${token}` }
        }),
        onSuccess: () => {
            getPostDetails(); 
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
            getPostDetails(); 
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

    
    if (!postDetails) {
        return <div className="min-h-screen bg-[#0B1014] flex items-center justify-center"><Loader /></div>;
    }

    return (
        <div className="min-h-screen bg-[#0B1014] text-white pt-8 pb-16 px-4 font-sans flex justify-center">
            <div className="w-full max-w-3xl flex flex-col gap-6">

                
                <div className="flex items-center gap-3 text-sm text-gray-400 font-medium mb-2">
                    <Link to="/" className="hover:text-white flex items-center gap-2 transition-colors">
                        <ArrowLeft size={16} /> Back to Feed
                    </Link>
                    <span>|</span>
                    <span className="text-[#1DA1F2]">Community</span>
                    <span>/</span>
                    <span className="text-gray-200 font-bold">Post Details</span>
                </div>

                
                <div className="bg-[#15202B] rounded-[24px] border border-gray-800/50 p-6 sm:p-8 shadow-lg relative overflow-hidden">
                    
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-[#1DA1F2]/30 to-transparent blur-sm"></div>

                    <PostHeader post={postDetails} from="details" callBack={() => window.location.replace('/')} />

                    <div className="mt-5 mb-6">
                        <p className="text-[18px] sm:text-[22px] font-bold text-gray-100 leading-snug mb-5 whitespace-pre-wrap">
                            {postDetails.body}
                        </p>

                        {postDetails.image && (
                            <img 
                                src={postDetails.image} 
                                alt="Post content" 
                                className="w-full rounded-[16px] border border-gray-800/50 object-cover max-h-[500px]" 
                            />
                        )}
                    </div>

                    
                    <div className="flex items-center justify-between pt-5 border-t border-gray-800/50">
                        <div className="flex items-center gap-4 sm:gap-6">
                            
                            
                            <button
                                onClick={handleLike}
                                className={`flex items-center gap-2 font-bold text-[14px] px-3 py-1.5 rounded-full transition-colors ${
                                    isLiked ? 'text-red-500 bg-red-500/10' : 'text-gray-400 hover:text-red-500 hover:bg-red-500/10'
                                }`}
                            >
                                <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                                {postDetails.likesCount || 0} Likes
                            </button>
                            
                            
                            <div className="flex items-center gap-2 text-[#1DA1F2] font-bold text-[14px]">
                                <MessageSquare size={18} />
                                {postDetails.commentsCount || 0} Comments
                            </div>
                            
                            
                            <button className="flex items-center gap-2 text-gray-400 hover:text-white font-bold text-[14px] transition-colors">
                                <Share2 size={18} />
                                Share
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
                </div>

                
                <div className="mt-4 flex flex-col gap-2 px-2">
                    <h3 className="text-[18px] font-bold text-white mb-2">
                        Discussion <span className="text-gray-500 font-normal text-[16px]">({postDetails.commentsCount || 0})</span>
                    </h3>

                    <PostComments post={postDetails} from="details" callBack={getPostDetails} />
                    
                </div>

            </div>
        </div>
    );
}