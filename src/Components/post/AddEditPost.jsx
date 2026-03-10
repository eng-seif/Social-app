import React, { useState, useContext } from 'react';
import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { Image as ImageIcon, Smile, X } from 'lucide-react';
import EmojiPicker, { Theme, EmojiStyle } from 'emoji-picker-react';


import { AuthContext } from '../../context/AuthContext';

export default function AddEditPost({ getAllPosts }) {
    
    const { userData } = useContext(AuthContext);
    
    const [postContent, setPostContent] = useState('');
    const [postImage, setPostImage] = useState(null);
    const [imgPreview, setImgPreview] = useState(null);

    
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    
    const onEmojiClick = (emojiObject) => {
        setPostContent(prevText => prevText + emojiObject.emoji);
    };

    function handleUploadImage(e) {
        const file = e.target.files[0];
        if (file) {
            setPostImage(file);
            setImgPreview(URL.createObjectURL(file));
        }
    }

    function handleResetImg() {
        setImgPreview(null);
        setPostImage(null);
    }

    function cancleAction() {
        handleResetImg();
        setPostContent('');
    }

    function addPost() {
        const formData = new FormData();
        if (postImage) {
            formData.append('image', postImage);
        }
        if (postContent) {
            formData.append('body', postContent);
        }

        return axios.post('https://route-posts.routemisr.com/posts', formData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    }

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: addPost,
        onSuccess: () => {
            queryClient.invalidateQueries(['hamada']);
            queryClient.invalidateQueries(['postdata']); 

            if (getAllPosts) {
                getAllPosts();
            }

            toast.success("Post created successfully!");
            cancleAction();
        },
        onError: (err) => {
            console.error(err.response);
            toast.error(err.response?.data?.message || "Failed to create post");
        }
    });

    return (
        <div className="bg-[#15202B] rounded-2xl p-4 shadow-sm border border-gray-800/50 mb-6">

            
            <div className="flex gap-4">
                
                
                <img
                    src={userData?.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.name || 'User'}`}
                    alt="Your Avatar"
                    className="w-10 h-10 rounded-full bg-[#1C2732] object-cover shrink-0 border border-gray-800/50"
                />

                
                <div className="flex-1 flex flex-col gap-3 pt-1">
                    <Textarea
                        color="white"
                        minRows={1}
                        placeholder="Share something with your friends..."
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        classNames={{
                            input: "text-white placeholder-gray-400 text-[15px]",
                            inputWrapper: "bg-[#1C2732] data-[hover=true]:bg-[#1C2732] group-data-[focus=true]:bg-[#1C2732] border-none rounded-xl shadow-none focus-within:ring-1 focus-within:ring-[#1DA1F2]/50 transition-all min-h-[44px]",
                        }}
                    />
                    
                    {imgPreview && (
                        <div className="relative w-fit">
                            <img
                                src={imgPreview}
                                className="max-h-64 rounded-xl border border-gray-700 object-cover shadow-sm"
                                alt="Post preview"
                            />
                            <button
                                onClick={handleResetImg}
                                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black text-white rounded-full backdrop-blur-sm transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            
            <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-800/50">

                
                <div className="flex items-center gap-2 pl-[56px]"> 
                    
                    <label className="p-2 text-gray-400 hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10 rounded-full transition-colors cursor-pointer">
                        <div>
                            <ImageIcon size={20} />
                        </div>
                        <input onChange={handleUploadImage} hidden type="file" accept="image/*" />
                    </label>
                    
                    <div className="relative inline-block">
                        <button
                            type="button"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="p-2 flex items-center justify-center text-gray-400 hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10 rounded-full transition-colors cursor-pointer"
                        >
                            <Smile size={20} />
                        </button>

                        
                        {showEmojiPicker && (
                            <div className="absolute top-[120%] left-0 z-50 shadow-2xl">
                                <EmojiPicker
                                    onEmojiClick={onEmojiClick}
                                    theme={Theme.DARK} 
                                    emojiStyle={EmojiStyle.APPLE} 
                                    searchPlaceHolder="Search"
                                    previewConfig={{ showPreview: false }} 
                                    skinTonesDisabled={false}
                                />
                            </div>
                        )}
                    </div>
                </div>

                
                <div className="flex items-center gap-3">
                    
                    {(postContent || imgPreview) && (
                        <button
                            type="button"
                            onClick={cancleAction}
                            disabled={isPending}
                            className="text-gray-400 hover:text-white text-sm font-semibold px-3 py-1.5 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => mutate()}
                        disabled={isPending || (!postContent.trim() && !postImage)}
                        className="bg-[#1DA1F2] hover:bg-[#1A8CD8] disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold text-sm px-6 py-2 rounded-full transition-colors shadow-sm flex items-center gap-2"
                    >
                        {isPending ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </div>

        </div>
    );
}