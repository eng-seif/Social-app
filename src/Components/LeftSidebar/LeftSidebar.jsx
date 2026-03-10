import React from 'react';
import { Home, Compass, Earth, Bookmark } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export function LeftSidebar() {
    return (
        <div>
            <aside className="hidden lg:flex flex-col w-64 shrink-0 gap-8 sticky top-6 h-fit">
                
                <nav className="flex flex-col gap-2">
                    
                    
                    <NavLink 
                        to="/" 
                        end 
                        className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-full font-semibold transition-colors ${
                            isActive ? 'bg-[#15202B] text-white' : 'text-gray-400 hover:bg-[#15202B] hover:text-white'
                        }`}
                    >
                        <Home size={22} />
                        <span>Home Feed</span>
                    </NavLink>

                    
                    <NavLink 
                        to="/myposts"
                        className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-full font-medium transition-colors ${
                            isActive ? 'bg-[#15202B] text-white' : 'text-gray-400 hover:bg-[#15202B] hover:text-white'
                        }`}
                    >
                        <Compass size={22} />
                        <span>My Posts</span>
                    </NavLink>

                    
                    <NavLink 
                        to="/community" 
                        className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-full font-medium transition-colors justify-between ${
                            isActive ? 'bg-[#15202B] text-white' : 'text-gray-400 hover:bg-[#15202B] hover:text-white'
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            <Earth size={22} />
                            <span>Community</span>
                        </div>
                        
                       
                    </NavLink>

                    
                    <NavLink 
                        to="/saved-posts" 
                        className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-full font-medium transition-colors ${
                            isActive ? 'bg-[#15202B] text-white' : 'text-gray-400 hover:bg-[#15202B] hover:text-white'
                        }`}
                    >
                        <Bookmark size={22} />
                        <span>Saved</span>
                    </NavLink>
                    
                </nav>
            </aside>
        </div>
    );
}