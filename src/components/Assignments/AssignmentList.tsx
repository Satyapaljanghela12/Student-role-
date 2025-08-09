import React, { useState } from 'react';
import { Calendar, Clock, FileText, Filter, Search } from 'lucide-react';
import { Assignment } from '../../types';

interface AssignmentListProps {
  assignments: Assignment[];
  onAssignmentClick: (assignment: Assignment) => void;
}

export const AssignmentList: React.FC<AssignmentListProps> = ({
  assignments,
  onAssignmentClick
}) => {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'overdue'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusInfo = (assignment: Assignment) => {
    const daysUntil = getDaysUntilDue(assignment.dueDate);
    
    if (daysUntil < 0) {
      return {
        label: 'Overdue',
        color: 'bg-red-100 text-red-800',
        urgency: 'high'
      };
    } else if (daysUntil <= 1) {
      return {
        label: 'Due Soon',
        color: 'bg-amber-100 text-amber-800',
        urgency: 'medium'
      };
    } else if (daysUntil <= 7) {
      return {
        label: 'Due This Week',
        color: 'bg-blue-100 text-blue-800',
        urgency: 'low'
      };
    } else {
      return {
        label: 'Upcoming',
        color: 'bg-green-100 text-green-800',
        urgency: 'low'
      };
    }
  };

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.course.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (filter === 'all') return true;
    
    const daysUntil = getDaysUntilDue(assignment.dueDate);
    
    if (filter === 'upcoming') return daysUntil >= 0;
    if (filter === 'overdue') return daysUntil < 0;
    
    return true;
  });

  const getTypeIcon = (type: string) => {
    const iconClass = "w-4 h-4";
    switch (type) {
      case 'essay': return <FileText className={iconClass} />;
      case 'quiz': return <Clock className={iconClass} />;
      case 'project': return <FileText className={iconClass} />;
      default: return <FileText className={iconClass} />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Assignments</h1>
        <p className="text-gray-600">Manage your coursework and stay on track</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="all">All Assignments</option>
            <option value="upcoming">Upcoming</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAssignments.map((assignment) => {
          const statusInfo = getStatusInfo(assignment);
          
          return (
            <div
              key={assignment.id}
              onClick={() => onAssignmentClick(assignment)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer hover:border-blue-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  {getTypeIcon(assignment.type)}
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {assignment.type}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {assignment.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {assignment.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-4">
                  <span className="font-medium text-blue-600">{assignment.course}</span>
                  <span>{assignment.points} points</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Due {formatDate(assignment.dueDate)}</span>
                </div>
                
                {statusInfo.urgency === 'high' && (
                  <div className="flex items-center gap-1 text-red-600 text-sm font-medium">
                    <Clock className="w-4 h-4" />
                    <span>Overdue</span>
                  </div>
                )}
                
                {statusInfo.urgency === 'medium' && (
                  <div className="flex items-center gap-1 text-amber-600 text-sm font-medium">
                    <Clock className="w-4 h-4" />
                    <span>{Math.abs(getDaysUntilDue(assignment.dueDate))} day{getDaysUntilDue(assignment.dueDate) !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                  <span>Submissions</span>
                  <span>{assignment.submissions}/45 students</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(assignment.submissions / 45) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAssignments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
          <p className="text-gray-500">
            {searchTerm 
              ? "Try adjusting your search terms or filters" 
              : "No assignments match the current filter"
            }
          </p>
        </div>
      )}
    </div>
  );
};