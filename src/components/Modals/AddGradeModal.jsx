import { useState, useEffect } from 'react';
import { X, Award, User, BookOpen } from 'lucide-react';
import axios from 'axios';

const AddGradeModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    assignmentId: '',
    submissionId: '',
    score: '',
    feedback: ''
  });
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAssignments();
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.assignmentId) {
      fetchAssignmentDetails();
    }
  }, [formData.assignmentId]);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/assignments');
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const fetchAssignmentDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/assignments/${formData.assignmentId}`);
      setSelectedAssignment(response.data);
      setSubmissions(response.data.submissions || []);
    } catch (error) {
      console.error('Error fetching assignment details:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.put(
        `http://localhost:5000/api/assignments/${formData.assignmentId}/submissions/${formData.submissionId}/grade`,
        {
          score: parseInt(formData.score),
          feedback: formData.feedback
        }
      );

      alert('Grade added successfully!');
      onClose();
      // Reset form
      setFormData({
        assignmentId: '',
        submissionId: '',
        score: '',
        feedback: ''
      });
      setSelectedAssignment(null);
      setSubmissions([]);
    } catch (error) {
      console.error('Error adding grade:', error);
      alert('Error adding grade. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedSubmission = submissions.find(sub => sub._id === formData.submissionId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Add Grade</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignment *
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  name="assignmentId"
                  value={formData.assignmentId}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select an assignment</option>
                  {assignments.map(assignment => (
                    <option key={assignment._id} value={assignment._id}>
                      {assignment.title} - {assignment.class?.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedAssignment && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">{selectedAssignment.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{selectedAssignment.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Max Score: {selectedAssignment.maxScore}</span>
                  <span>Due: {new Date(selectedAssignment.dueDate).toLocaleDateString()}</span>
                  <span>Submissions: {submissions.length}</span>
                </div>
              </div>
            )}

            {submissions.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Submission *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    name="submissionId"
                    value={formData.submissionId}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a submission</option>
                    {submissions.filter(sub => !sub.grade || sub.grade.score === undefined).map(submission => (
                      <option key={submission._id} value={submission._id}>
                        {submission.student?.name} - Submitted {new Date(submission.submittedAt).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {selectedSubmission && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Submission Details</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Student: {selectedSubmission.student?.name}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Submitted: {new Date(selectedSubmission.submittedAt).toLocaleString()}
                </p>
                {selectedSubmission.textSubmission && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700">Text Submission:</p>
                    <p className="text-sm text-gray-600 mt-1 p-2 bg-white rounded border">
                      {selectedSubmission.textSubmission}
                    </p>
                  </div>
                )}
                {selectedSubmission.files && selectedSubmission.files.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700">Files:</p>
                    <ul className="text-sm text-gray-600 mt-1">
                      {selectedSubmission.files.map((file, index) => (
                        <li key={index}>{file.originalName}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Score *
                </label>
                <div className="relative">
                  <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name="score"
                    value={formData.score}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter score"
                    min="0"
                    max={selectedAssignment?.maxScore || 100}
                    required
                  />
                </div>
                {selectedAssignment && (
                  <p className="text-sm text-gray-500 mt-1">
                    Out of {selectedAssignment.maxScore} points
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade Preview
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg">
                  {formData.score && selectedAssignment ? (
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold">
                        {Math.round((formData.score / selectedAssignment.maxScore) * 100)}%
                      </span>
                      <span className="text-gray-600">
                        ({formData.score}/{selectedAssignment.maxScore})
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-400">Enter score to see grade</span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feedback
              </label>
              <textarea
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Provide feedback to the student..."
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isLoading || !formData.assignmentId || !formData.submissionId || !formData.score}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Adding Grade...' : 'Add Grade'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGradeModal;