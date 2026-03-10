import { BarChart2, LinkIcon } from 'lucide-react'
import React from 'react'

export default function PostStats({ post }) {
    return (
        <div>
            <div className="flex justify-between items-center text-gray-400 text-sm">
                <button className="flex items-center gap-2 hover:text-[#1DA1F2] transition-colors">
                    <BarChart2 size={16} />
                    {post.likesCount || 0} likes
                </button>
                <button className="flex items-center gap-2 hover:text-[#1DA1F2] transition-colors">
                    <LinkIcon size={16} />
                    {post.commentsCount || 'No'} comments
                </button>
            </div>
        </div>
    )
}
