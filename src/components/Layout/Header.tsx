import React from 'react';
import { Bell, User, Menu, Search, GraduationCap } from 'lucide-react';
import { User as UserType } from '../../types';

interface HeaderProps {
  user: UserType;
  onToggleSidebar: () => void;
  unreadNotifications: number;
  onNotificationsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  user, 
  onToggleSidebar, 
  unreadNotifications,
  onNotificationsClick 
}) => {
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">EduPortal</h1>
            <p className="text-xs text-gray-500 -mt-1">Learning Management System</p>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses, assignments..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 transition-all duration-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onNotificationsClick}
          className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105"
        >
          <Bell className="w-5 h-5 text-gray-600" />
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse shadow-lg">
              {unreadNotifications > 9 ? '9+' : unreadNotifications}
            </span>
          )}
        </button>

        <div className="flex items-center gap-3 ml-2 pl-3 border-l border-gray-200">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-100 hover:ring-blue-200 transition-all duration-200"
          />
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-blue-600 capitalize font-medium">{user.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};