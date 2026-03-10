import React, { useState, useContext, useEffect } from 'react';
import { MessageSquare, Share2, ThumbsUp } from 'lucide-react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';

export default function PostReactions({ post }) {
    const { userData } = useContext(AuthContext);
    const queryClient = useQueryClient();
    

    const initialIsLiked = post?.likes?.some(
        (like) => like === userData?._id || like._id === userData?._id
    );

    const [isLiked, setIsLiked] = useState(initialIsLiked);

    useEffect(() => {
        setIsLiked(initialIsLiked);
    }, [initialIsLiked]);

    const toggleLikeMutation = useMutation({
        mutationFn: async () => {
            const postId = post?._id || post?.id;
            const url = `https://route-posts.routemisr.com/posts/${postId}/like`;
            const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
            return axios.put(url, {}, { headers });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hamada'] });
            queryClient.invalidateQueries({ queryKey: ['userPosts'] });
        },
        onError: (error) => {
            // Revert the color and force a refresh if the internet fails
            setIsLiked(!isLiked);
            queryClient.invalidateQueries({ queryKey: ['hamada'] });
            toast.error(`Failed: ${error.response?.data?.message || "Could not update like."}`);
        }
    });

    const handleLikeClick = () => {
        if (!userData) return toast.error("Please log in to like posts.");
        if (!post) return toast.error("Post data is missing!");

        const currentlyLiked = isLiked;
        const increment = currentlyLiked ? -1 : 1;

        setIsLiked(!currentlyLiked);

        queryClient.setQueriesData({}, (oldData) => {
            if (!oldData || !oldData.data) return oldData;

            const newData = JSON.parse(JSON.stringify(oldData));

            let postsArray = null;
            if (Array.isArray(newData?.data?.posts)) postsArray = newData.data.posts;
            else if (Array.isArray(newData?.data?.data?.posts)) postsArray = newData.data.data.posts;
            else if (Array.isArray(newData?.data?.data)) postsArray = newData.data.data;

            if (postsArray) {
                const targetPost = postsArray.find(p => (p._id || p.id) === (post._id || post.id));
                if (targetPost) {
                    targetPost.likesCount = Math.max(0, (targetPost.likesCount || 0) + increment);
                }
            }
            return newData;
        });

        toggleLikeMutation.mutate();
    };

    return (
        <div>
            <div className="flex items-center justify-between border-t border-gray-800/50 pt-2 mt-4">

                
                <button
                    onClick={handleLikeClick}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-colors text-sm font-medium ${isLiked
                            ? 'text-[#1DA1F2] bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20'
                            : 'text-gray-400 hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10'
                        }`}
                >
                    <ThumbsUp size={18} className={isLiked ? "fill-current" : ""} />
                    <span>Like</span>
                </button>

                
                <button
                    onClick={() => setshow(true)}

                    className="flex-1 flex items-center justify-center gap-2 text-gray-400 hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10 py-2 rounded-xl transition-colors text-sm font-medium">
                    <MessageSquare size={18} />
                    <span>Comment</span>
                </button>

                
                <button className="flex-1 flex items-center justify-center gap-2 text-gray-400 hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10 py-2 rounded-xl transition-colors text-sm font-medium">
                    <Share2 size={18} />
                    <span>Share</span>
                </button>

            </div>
        </div>
    );
}