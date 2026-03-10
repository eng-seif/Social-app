import React from 'react'

export default function PostContent({ post }) {
    return (
        <div>
            <div className="mb-3">
                <p className="text-sm text-gray-200 leading-relaxed">
                    {post.body}
                </p>
            </div>

            
            {post.image && (
                <div className="w-full h-64 sm:h-80 md:h-[400px] rounded-xl overflow-hidden border border-gray-800/50 mb-4">
                    <img
                        src={post.image}
                        alt="Post content"
                        className="w-full h-full object-cover"
                    />
                </div>
            )}                                                        
        </div>
    )
}
