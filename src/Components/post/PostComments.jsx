import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Input, Button, Spinner } from '@heroui/react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { MoreHorizontal, Pencil, Trash2, Image as ImageIcon, Smile, X } from 'lucide-react';
import EmojiPicker, { Theme, EmojiStyle } from 'emoji-picker-react';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';




const CommentItem = ({ comment, postId, userData, onRefresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(comment.content);
  const [showMenu, setShowMenu] = useState(false);
  
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyValue, setReplyValue] = useState('');
  
  const [replies, setReplies] = useState([]);
  const [showReplies, setShowReplies] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);

  const token = localStorage.getItem('token');
  const headers = { 'Authorization': `Bearer ${token}` };

  
  const myId = userData?._id || userData?.id;
  const creatorId = comment?.commentCreator?._id || comment?.commentCreator?.id || comment?.commentCreator;
  
  
  const isMyComment = Boolean(myId && creatorId && String(myId) === String(creatorId));

  
  const handleEdit = async () => {
    if (!editValue.trim()) return;
    try {
      await axios.put(`https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id || comment.id}`, 
        { content: editValue }, 
        { headers }
      );
      toast.success("Comment updated!");
      setIsEditing(false);
      onRefresh(); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    }
  };

  
  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id || comment.id}`, { headers });
      toast.success("Comment deleted");
      setIsDeleteModalOpen(false);
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

  
  const fetchReplies = async () => {
    if (showReplies) {
      setShowReplies(false); 
      return;
    }
    setLoadingReplies(true);
    try {
      const res = await axios.get(`https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id || comment.id}/replies`, { headers });
      setReplies(res.data.data?.replies || res.data?.replies || []);
      setShowReplies(true);
    } catch (err) {
      toast.error("Could not load replies");
    } finally {
      setLoadingReplies(false);
    }
  };

  
  const handleAddReply = async () => {
    if (!replyValue.trim()) return;
    try {
      await axios.post(`https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id || comment.id}/replies`, 
        { content: replyValue }, 
        { headers }
      );
      toast.success("Reply added!");
      setReplyValue('');
      setShowReplyInput(false);
      
      setShowReplies(false); 
      fetchReplies(); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add reply");
    }
  };

  return (
    <>
      
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#15202B] border border-gray-800/50 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-2">Delete Comment</h2>
            <p className="text-gray-400 text-sm mb-6">Are you sure you want to delete this comment? This action cannot be undone.</p>
            
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="px-5 py-2 text-gray-400 hover:text-white font-medium transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-6 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-bold rounded-full transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? <Spinner size="sm" color="current" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 w-full mb-2">
        <div className="flex gap-3">
          
          
          <img
            className="rounded-full w-9 h-9 object-cover shrink-0 bg-slate-700 mt-1 border border-gray-800"
            src={comment.commentCreator?.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.commentCreator?.name}`}
            alt={comment.commentCreator?.name}
          />

          <div className="flex flex-col w-full">
            
            
            <div className="flex items-start gap-2 relative">
              <div className="bg-[#1C2732] rounded-2xl px-4 py-2.5 w-fit max-w-[90%] shadow-sm border border-gray-800/30">
                <h3 className="text-[13px] font-bold text-white mb-0.5">{comment.commentCreator?.name}</h3>
                
                {isEditing ? (
                  <div className="flex flex-col gap-2 mt-2">
                    <textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      autoFocus
                      className="bg-[#0B1014] text-white p-2 rounded-lg text-sm border border-gray-700 w-full min-w-[200px] outline-none"
                      rows={2}
                    />
                    <div className="flex gap-2 justify-end">
                      <button type="button" onClick={() => setIsEditing(false)} className="text-xs text-gray-400 hover:text-white">Cancel</button>
                      <button type="button" onClick={handleEdit} className="text-xs text-[#1DA1F2] font-bold">Save</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[14px] text-gray-300 whitespace-pre-wrap">{comment.content}</p>
                    
                    {comment.image && (
                      <img 
                        src={comment.image} 
                        alt="Comment attachment" 
                        className="max-h-[250px] w-fit rounded-xl border border-gray-700/50 object-cover mt-1" 
                      />
                    )}
                  </div>
                )}
              </div>

              
              {isMyComment && !isEditing && (
                <div className="relative">
                  <button type="button" onClick={() => setShowMenu(!showMenu)} className="p-2 text-gray-500 hover:text-white hover:bg-[#1C2732] rounded-full transition-colors mt-2">
                    <MoreHorizontal size={18} />
                  </button>
                  
                  {showMenu && (
                    <div className="absolute left-full ml-1 top-2 w-32 bg-[#15202B] rounded-xl shadow-xl border border-gray-800 py-1 z-50">
                      <button type="button" onClick={() => { setIsEditing(true); setShowMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-200 hover:bg-gray-800 transition-colors">
                        <Pencil size={14} /> Edit
                      </button>
                      <button type="button" onClick={() => { setIsDeleteModalOpen(true); setShowMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-gray-800 transition-colors">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            
            {!isEditing && (
              <div className="flex items-center gap-4 mt-1.5 ml-3 text-[12px] font-bold text-gray-500">
                <button type="button" onClick={() => setShowReplyInput(!showReplyInput)} className="hover:text-white transition-colors">Reply</button>
                <button type="button" onClick={fetchReplies} className="hover:text-[#1DA1F2] transition-colors">
                  {loadingReplies ? 'Loading...' : showReplies ? 'Hide replies' : 'View replies'}
                </button>
              </div>
            )}

            
            {showReplyInput && (
              <div className="mt-3 ml-4 flex gap-2 items-start max-w-[85%] bg-[#15202B] p-2.5 rounded-2xl border border-gray-800/50 focus-within:border-[#1DA1F2]/50 transition-colors">
                <textarea
                  value={replyValue}
                  onChange={(e) => setReplyValue(e.target.value)}
                  placeholder="Write a reply..."
                  autoFocus
                  className="w-full bg-transparent text-white placeholder-gray-500 text-sm resize-none outline-none min-h-[40px]"
                  rows={1}
                />
                <Button type="button" size="sm" onPress={handleAddReply} isDisabled={!replyValue.trim()} className="bg-[#1DA1F2] text-white rounded-full h-8 text-[11px] font-bold min-w-0 px-4 mt-auto">
                  Post
                </Button>
              </div>
            )}

            
            {showReplies && (
              <div className="mt-3 ml-4 border-l-2 border-gray-800/50 pl-4 flex flex-col gap-3">
                {replies.length === 0 ? (
                  <span className="text-xs text-gray-500">No replies yet.</span>
                ) : (
                  replies.map(reply => (
                    <div key={reply._id || reply.id} className="flex gap-2">
                      <img
                        className="rounded-full w-7 h-7 object-cover shrink-0 bg-slate-700 mt-1"
                        src={reply.commentCreator?.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.commentCreator?.name}`}
                        alt="avatar"
                      />
                      <div className="bg-[#1C2732]/70 rounded-2xl px-3 py-2 w-fit max-w-[95%]">
                        <h3 className="text-[12px] font-bold text-white">{reply.commentCreator?.name}</h3>
                        <p className="text-[13px] text-gray-300 leading-snug">{reply.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
};





export default function PostComments({ post, from, callBack }) {
  const [commentBody, setCommentBody] = useState('');
  const [commentImage, setCommentImage] = useState(null); 
  const [imgPreview, setImgPreview] = useState(null); 
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); 
  const [isPosting, setIsPosting] = useState(false);
  
  const token = localStorage.getItem('token');
  const { userData } = useContext(AuthContext);
  const postId = post?.id || post?._id;

  
  const { data: commentsData, refetch: refetchComments } = useQuery({
    queryKey: ['post-comments', postId],
    queryFn: () => axios.get(`https://route-posts.routemisr.com/posts/${postId}/comments?page=1&limit=50`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),
    enabled: from === 'details' && !!postId, 
  });

  const visibleComments = commentsData?.data?.data?.comments || commentsData?.data?.comments || [];

  
  const onEmojiClick = (emojiObject) => {
    setCommentBody(prev => prev + emojiObject.emoji);
  };

  
  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    if (file) {
        setCommentImage(file);
        setImgPreview(URL.createObjectURL(file));
    }
  };

  const handleResetImg = () => {
      setImgPreview(null);
      setCommentImage(null);
  };

  
  const handleAddComment = async () => {
    if (!commentBody.trim() && !commentImage) return; 
    setIsPosting(true);
    
    try {
      
      const formData = new FormData();
      if (commentBody) formData.append('content', commentBody);
      if (commentImage) formData.append('image', commentImage); 
      
      await axios.post(`https://route-posts.routemisr.com/posts/${postId}/comments`, 
        formData, 
        { headers: { 'Authorization': `Bearer ${token}` } } 
      );
      
      toast.success("Comment posted!");
      setCommentBody('');
      handleResetImg(); 
      refetchComments(); 
      if (callBack) callBack(); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post comment");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="border-t border-gray-800/50 pt-4 mt-2">
      
      
      <div className="flex flex-col gap-4">
        
        {from === 'details' ? (
          /* --- DETAILS PAGE: Render ALL comments --- */
          visibleComments.length > 0 ? (
            visibleComments.map((comment) => (
              <CommentItem 
                key={comment._id || comment.id} 
                comment={comment} 
                postId={postId} 
                userData={userData} 
                onRefresh={() => { refetchComments(); if(callBack) callBack(); }} 
              />
            ))
          ) : (
            <div className="text-center text-gray-500 text-sm py-2">Be the first to comment!</div>
          )

        ) : (
          /* --- HOME FEED: Render TOP comment only --- */
          <>
            {post.topComment && (
              <CommentItem 
                comment={post.topComment} 
                postId={postId} 
                userData={userData} 
                onRefresh={() => { if(callBack) callBack(); }} 
              />
            )}
            
            {post.commentsCount > 0 && (
                <Link 
                  className="block text-[14px] font-bold text-gray-400 hover:text-white transition-colors mt-1 px-12" 
                  to={`/post-details/${postId}`}
                >
                  View all {post.commentsCount} comments
                </Link>
            )}
          </>
        )}
      </div>

      
      <div className="mt-5 flex gap-3">
        
        <img 
          src={userData?.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.name || 'User'}`} 
          alt="You" 
          className="w-10 h-10 rounded-full object-cover shrink-0 bg-slate-700 border border-gray-800"
        />
        
        
        <div className="flex-1 bg-[#15202B] border border-gray-800/50 rounded-2xl p-4 transition-all focus-within:border-[#1DA1F2]/50 focus-within:ring-1 focus-within:ring-[#1DA1F2]/20 shadow-sm flex flex-col">
          <textarea
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            placeholder="Add a comment..."
            className="w-full bg-transparent text-white placeholder-gray-500 text-[15px] resize-none outline-none min-h-[40px]"
            rows={1}
          />
          
          
          {imgPreview && (
              <div className="relative w-fit mt-2 mb-2">
                  <img
                      src={imgPreview}
                      className="max-h-32 rounded-xl border border-gray-700 object-cover shadow-sm"
                      alt="Comment preview"
                  />
                  <button
                      onClick={handleResetImg}
                      className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black text-white rounded-full backdrop-blur-sm transition-colors"
                  >
                      <X size={14} />
                  </button>
              </div>
          )}

          <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-800/50">
            
            
            <div className="flex gap-2 text-gray-500 relative">
              
              
              <label className="p-2 hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] rounded-full transition-colors cursor-pointer">
                <ImageIcon size={18} />
                <input onChange={handleUploadImage} hidden type="file" accept="image/*" />
              </label>

              
              <div className="relative inline-block">
                <button 
                  type="button" 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] rounded-full transition-colors"
                >
                  <Smile size={18} />
                </button>
                
                
                {showEmojiPicker && (
                    <div className="absolute bottom-[120%] left-0 z-50 shadow-2xl">
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
            
            
            <Button 
              type="button"
              size="sm"
              onPress={handleAddComment} 
              isDisabled={(commentBody.trim() === '' && !commentImage) || isPosting}
              className="bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-bold rounded-full h-8 px-6 text-[13px] disabled:opacity-50 transition-colors"
            >
              {isPosting ? <Spinner size="sm" color="white" /> : 'Post'}
            </Button>

          </div>
        </div>
      </div>

    </div>
  );
}