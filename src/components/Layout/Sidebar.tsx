import React from 'react';
import { 
  Home, 
  BookOpen, 
  FileText, 
  BarChart3, 
  Settings, 
  Users,
  Upload,
  GraduationCap,
  X,
  PlusCircle,
  UserCheck,
  Baby,
  ClipboardList
} from 'lucide-react';
import { User } from '../../types';

interface SidebarProps {
  user: User;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  user, 
  activeTab, 
  onTabChange, 
  isOpen, 
  onClose 
}) => {
  const getMenuItems = () => {
    const commonItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'courses', label: 'Courses', icon: BookOpen },
      { id: 'assignments', label: 'Assignments', icon: FileText },
    ];

    const roleSpecificItems = {
      student: [
        { id: 'grades', label: 'My Grades', icon: BarChart3 },
        { id: 'progress', label: 'Progress', icon: GraduationCap },
      ],
      teacher: [
        { id: 'add-grades', label: 'Add Grades', icon: PlusCircle },
        { id: 'gradebook', label: 'Gradebook', icon: BarChart3 },
        { id: 'students', label: 'Students', icon: Users },
        { id: 'my-subjects', label: 'My Subjects', icon: BookOpen },
        { id: 'resources', label: 'Resources', icon: Upload },
      ],
      parent: [
        { id: 'children', label: 'My Children', icon: Baby },
        { id: 'progress-reports', label: 'Progress Reports', icon: ClipboardList },
        { id: 'meetings', label: 'Meetings', icon: UserCheck },
      ],
      admin: [
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    };

    return [...commonItems, ...roleSpecificItems[user.role]];
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-sm border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
          <span className="text-lg font-semibold text-gray-900">Menu</span>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  onClose();
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left
                  transition-all duration-200 hover:scale-[1.02]
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200 shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'
                  }
                `}
              >
                <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        {/* User Role Badge */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className={`px-3 py-2 rounded-lg text-center text-sm font-medium ${
            user.role === 'student' ? 'bg-blue-100 text-blue-800' :
            user.role === 'teacher' ? 'bg-emerald-100 text-emerald-800' :
            user.role === 'parent' ? 'bg-amber-100 text-amber-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Portal
          </div>
        </div>
      </div>
    </>
  );
};