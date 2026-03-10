import React, { useState, useContext } from 'react';
import { MoreHorizontal, Bookmark, Pencil, Trash2, AlertTriangle, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../../context/AuthContext';

export default function PostHeader({ post, from, callBack }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editContent, setEditContent] = useState('');

    const queryClient = useQueryClient();
    const { userData } = useContext(AuthContext);
    const isMyPost = userData?._id === post?.user?._id;

    
    const deleteMutation = useMutation({
        mutationFn: () => {
            const postId = post._id || post.id;
            return axios.delete(`https://route-posts.routemisr.com/posts/${postId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
        },
        onSuccess: () => {
            toast.success("Post deleted successfully!");
            setIsDeleteModalOpen(false);
            if (callBack) callBack();
            queryClient.invalidateQueries(['user-profile']);
            queryClient.invalidateQueries(['postdata']);
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to delete post");
            setIsDeleteModalOpen(false);
        }
    });

    const openDeleteModal = () => {
        setIsDeleteModalOpen(true);
        setIsMenuOpen(false);
    };

    const confirmDelete = () => {
        deleteMutation.mutate();
    };

    
    const editMutation = useMutation({
        mutationFn: (newContent) => {
            const postId = post._id || post.id;
            const formData = new FormData();
            formData.append('body', newContent);

            return axios.put(`https://route-posts.routemisr.com/posts/${postId}`, formData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
        },
        onSuccess: () => {
            toast.success("Post updated successfully!");
            setIsEditModalOpen(false);
            if (callBack) callBack();
            queryClient.invalidateQueries(['user-profile']);
            queryClient.invalidateQueries(['postdata']);
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to update post");
        }
    });

    const openEditModal = () => {
        setEditContent(post?.body || '');
        setIsEditModalOpen(true);
        setIsMenuOpen(false);
    };

    return (
        <div>
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <img
                        src={post.user?.photo || "https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder"}
                        alt={post.user?.name}
                        className="w-10 h-10 rounded-full bg-slate-200 object-cover"
                    />
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-gray-100">{post.user?.name}</span>
                            <span className="text-gray-500 text-xs">• 2h ago</span>
                            <span className="text-[10px] font-bold text-orange-500 border border-orange-500/50 px-2 py-0.5 rounded-full ml-1">
                                {post.privacy === 'public' ? 'Public' : post.privacy === 'friends' ? 'Friends' : 'Only Me'}
                            </span>
                        </div>
                        <span className="text-gray-500 text-xs">
                            @{post.user?.name?.replace(/\s+/g, '').toLowerCase()}
                        </span>
                    </div>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-1 hover:bg-[#1DA1F2]/10 rounded-full transition-colors text-gray-500 hover:text-white"
                    >
                        <MoreHorizontal size={16} />
                    </button>

                    
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-[#1e2939] rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-[#273549] py-2 z-50 overflow-hidden">
                            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[15px] font-medium text-gray-200 hover:bg-[#273549] transition-colors text-left">
                                <Bookmark size={18} className="text-slate-500" />
                                Save post
                            </button>

                            {isMyPost && (
                                <>
                                    <button
                                        onClick={openEditModal}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-[15px] font-medium text-gray-200 hover:bg-[#273549] transition-colors text-left"
                                    >
                                        <Pencil size={18} className="text-slate-500" />
                                        Edit post
                                    </button>

                                    <button
                                        onClick={openDeleteModal}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-[15px] font-medium text-red-500 hover:bg-[#273549] transition-colors text-left"
                                    >
                                        <Trash2 size={18} className="text-red-500" />
                                        Delete post
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-[#15202B] border border-gray-800/50 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">Edit Post</h2>

                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full bg-[#1C2732] text-white border border-gray-700/50 rounded-xl p-4 min-h-[120px] focus:outline-none focus:border-[#1DA1F2]/50 transition-colors"
                            placeholder="What do you want to change?"
                        />

                        <div className="flex justify-end gap-3 mt-5">
                            <button
                                type="button" 
                                onClick={() => setIsEditModalOpen(false)}
                                disabled={editMutation.isPending}
                                className="px-5 py-2 text-gray-400 hover:text-white font-medium transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button" 
                                onClick={() => editMutation.mutate(editContent)}
                                disabled={editMutation.isPending || !editContent.trim()}
                                className="px-6 py-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-bold rounded-full transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                            >
                                {editMutation.isPending ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 font-sans">
                    <div className="bg-white rounded-[16px] w-full max-w-[440px] shadow-2xl overflow-hidden">
                        
                        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
                            <h2 className="text-[16px] font-bold text-gray-900">Confirm action</h2>
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        
                        <div className="p-5 flex items-start gap-4">
                            <div className="p-2.5 bg-red-50 rounded-full shrink-0 mt-0.5">
                                <AlertTriangle size={22} className="text-[#e11d48]" />
                            </div>
                            <div>
                                <h3 className="text-[15px] font-bold text-gray-900 mb-1">Delete this post?</h3>
                                <p className="text-[14px] text-gray-500 leading-snug">
                                    This post will be permanently removed from your profile and feed.
                                </p>
                            </div>
                        </div>

                        
                        <div className="px-5 pb-5 pt-2 flex justify-end gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                disabled={deleteMutation.isPending}
                                className="px-5 py-2 bg-white border border-gray-300 text-gray-700 font-bold rounded-[8px] hover:bg-gray-50 transition-colors text-[14px]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={deleteMutation.isPending}
                                className="px-5 py-2 bg-[#e11d48] hover:bg-[#be123c] text-white font-bold rounded-[8px] transition-colors shadow-sm disabled:opacity-50 text-[14px]"
                            >
                                {deleteMutation.isPending ? 'Deleting...' : 'Delete post'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}