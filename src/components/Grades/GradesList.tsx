import React from 'react';
import { TrendingUp, Award, Calendar, BarChart3 } from 'lucide-react';
import { Grade } from '../../types';

interface GradesListProps {
  grades: Grade[];
}

export const GradesList: React.FC<GradesListProps> = ({ grades }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-100 text-green-800 border-green-200';
    if (percentage >= 80) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (percentage >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (percentage >= 60) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const averageGrade = grades.reduce((sum, grade) => sum + grade.percentage, 0) / grades.length;
  const highestGrade = Math.max(...grades.map(g => g.percentage));
  const lowestGrade = Math.min(...grades.map(g => g.percentage));

  const gradeDistribution = {
    A: grades.filter(g => g.percentage >= 90).length,
    B: grades.filter(g => g.percentage >= 80 && g.percentage < 90).length,
    C: grades.filter(g => g.percentage >= 70 && g.percentage < 80).length,
    D: grades.filter(g => g.percentage >= 60 && g.percentage < 70).length,
    F: grades.filter(g => g.percentage < 60).length,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Grades</h1>
        <p className="text-gray-600">Track your academic performance across all courses</p>
      </div>

      {/* Grade Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{averageGrade.toFixed(1)}%</span>
          </div>
          <h3 className="font-semibold text-gray-900">Overall Average</h3>
          <p className="text-sm text-gray-600 mt-1">Across all assignments</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{highestGrade}%</span>
          </div>
          <h3 className="font-semibold text-gray-900">Highest Grade</h3>
          <p className="text-sm text-gray-600 mt-1">Best performance</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-amber-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{grades.length}</span>
          </div>
          <h3 className="font-semibold text-gray-900">Total Assignments</h3>
          <p className="text-sm text-gray-600 mt-1">Graded so far</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{lowestGrade}%</span>
          </div>
          <h3 className="font-semibold text-gray-900">Lowest Grade</h3>
          <p className="text-sm text-gray-600 mt-1">Room for improvement</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Grade Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Grade Distribution</h2>
          
          <div className="space-y-4">
            {Object.entries(gradeDistribution).map(([letter, count]) => (
              <div key={letter} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                    letter === 'A' ? 'bg-green-100 text-green-800' :
                    letter === 'B' ? 'bg-blue-100 text-blue-800' :
                    letter === 'C' ? 'bg-yellow-100 text-yellow-800' :
                    letter === 'D' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {letter}
                  </div>
                  <span className="font-medium text-gray-900">{letter} Grade</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{count}</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        letter === 'A' ? 'bg-green-500' :
                        letter === 'B' ? 'bg-blue-500' :
                        letter === 'C' ? 'bg-yellow-500' :
                        letter === 'D' ? 'bg-orange-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${(count / grades.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Grades List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">All Grades</h2>
          
          <div className="space-y-4">
            {grades.map((grade) => (
              <div key={grade.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{grade.assignment}</h3>
                  <p className="text-sm text-gray-600 mt-1">{formatDate(grade.date)}</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">{grade.score}</span>
                      <span className="text-gray-500">/ {grade.maxScore}</span>
                    </div>
                    <p className="text-sm text-gray-600">{grade.percentage.toFixed(1)}%</p>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full border text-sm font-semibold ${getGradeColor(grade.percentage)}`}>
                    {grade.letterGrade}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};