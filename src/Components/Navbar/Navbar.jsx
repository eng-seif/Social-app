import React, { useState } from 'react';
import { Bell, House, Menu, User, X } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    
    const token = localStorage.getItem('token');
    const isLoggedIn = Boolean(token);

    
    const { data: notificationsData } = useQuery({
        queryKey: ['notifications'],
        queryFn: () => axios.get('https://route-posts.routemisr.com/users/notifications', { 
            headers: { 'Authorization': `Bearer ${token}` } 
        }),
        enabled: isLoggedIn, 
        refetchInterval: 30000, 
    });

    
    const notificationsArray = notificationsData?.data?.data?.notifications || notificationsData?.data?.notifications || [];
    
    
    
    const unreadNotificationsCount = notificationsArray.filter(n => !n.isRead).length || notificationsArray.length || 0;

    return (
        <nav className="relative flex items-center justify-between px-6 py-4 bg-[#0F1419] border-b border-gray-800 font-sans">
            
            <div className="flex items-center gap-3 z-10">
                <div className="w-5 h-5 bg-[#00BFFF] rounded-full shadow-[0_0_10px_rgba(0,191,255,0.4)]"></div>
                <span className="text-white text-xl font-bold tracking-wide">
                    Social app
                </span>
            </div>

            
            <div className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <NavLink to="/" className={({ isActive }) => `flex items-center font-bold text-sm transition-colors ${isActive ? 'text-[#00BFFF]' : 'text-gray-400 hover:text-white'}`}>
                    <House size={16} className="mr-1.5" /> 
                    <span>Home</span>
                </NavLink>
                
                <NavLink to="/Profile" className={({ isActive }) => `flex items-center font-medium text-sm transition-colors ${isActive ? 'text-[#00BFFF]' : 'text-gray-400 hover:text-white'}`}>
                    <User size={16} className="mr-1.5" /> 
                    <span>Profile</span>
                </NavLink>
                
                
                <NavLink to="/Notifications" className={({ isActive }) => `flex items-center font-medium text-sm transition-colors ${isActive ? 'text-[#00BFFF]' : 'text-gray-400 hover:text-white'}`}>
                    <Bell size={16} className="mr-1.5" /> 
                    <span>Notifications</span>
                    {unreadNotificationsCount > 0 && (
                        <span className="ml-1.5 bg-[#1DA1F2] text-white text-[10px] font-bold px-1.5 py-[1px] rounded-full shadow-sm">
                            {unreadNotificationsCount}
                        </span>
                    )}
                </NavLink>
            </div>

            
            <div className="flex items-center gap-4 z-10">
                {isLoggedIn ? (
                    <>
                        <button className="hidden sm:block bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-bold text-sm py-2 px-5 rounded-full shadow-[0_0_15px_rgba(29,161,242,0.3)] transition-all">
                            Create Circle
                        </button>

                        <div className="flex justify-end">
                            <Dropdown placement="bottom-end">
                                <DropdownTrigger>
                                    <Avatar
                                        isBordered
                                        as="button"
                                        className="transition-transform"
                                        color="secondary"
                                        name="Seif El Din"
                                        size="sm"
                                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Seif&backgroundColor=475569"
                                    />
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Profile Actions" variant="flat">
                                    <DropdownItem key="profile">
                                        <Link to="/Profile" className='block'>My Profile</Link>
                                    </DropdownItem>
                                    <DropdownItem key="settings">
                                        <Link to="/Settings" className='block'>
                                            My Settings
                                        </Link>
                                    </DropdownItem>
                                    <DropdownItem key="logout" color="danger" className='text-red-500'>
                                        <Link
                                            to="/login"
                                            className='block'
                                            onClick={() => localStorage.removeItem('token')}
                                        >
                                            Log Out
                                        </Link>
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </>
                ) : (
                    <Link to="/login" className='text-white font-bold text-sm py-2 px-5 rounded-full bg-[#1DA1F2] hover:bg-[#1a8cd8] transition-all'>
                        Login
                    </Link>
                )}

                <button
                    className="md:hidden text-gray-400 hover:text-white transition-colors ml-2"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-[#0F1419] border-b border-gray-800 flex flex-col p-4 gap-4 md:hidden z-50 shadow-lg">
                    <NavLink to="/" className={({ isActive }) => `font-bold text-base transition-colors p-2 rounded flex items-center ${isActive ? 'text-[#00BFFF] bg-gray-800' : 'text-white hover:text-[#00BFFF] hover:bg-gray-800'}`}>
                        <House size={18} className="mr-2" /> Home
                    </NavLink>
                    
                    <NavLink to="/Profile" className={({ isActive }) => `font-medium text-base transition-colors p-2 rounded flex items-center ${isActive ? 'text-[#00BFFF] bg-gray-800' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                        <User size={18} className="mr-2" /> Profile
                    </NavLink>
                    
                    
                    <NavLink to="/Notifications" className={({ isActive }) => `flex items-center justify-between font-medium text-base transition-colors p-2 rounded ${isActive ? 'text-[#00BFFF] bg-gray-800' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                        <div className="flex items-center">
                            <Bell size={18} className="mr-2" />
                            <span>Notifications</span>
                        </div>
                        {unreadNotificationsCount > 0 && (
                            <span className="bg-[#1DA1F2] text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                {unreadNotificationsCount}
                            </span>
                        )}
                    </NavLink>

                    {isLoggedIn && (
                        <button className="sm:hidden bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-bold text-sm py-3 px-5 rounded-full mt-2 transition-all w-full text-center">
                            Create Circle
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
}