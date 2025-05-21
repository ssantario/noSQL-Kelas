import { useState, useEffect } from 'react';
import { api } from '../services/api';

function EnrollmentPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    npm: '',
    courseCode: '',
    grade: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentEnrollments, setStudentEnrollments] = useState([]);
  const [studentView, setStudentView] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);    try {      const [enrollmentsRes, studentsRes, coursesRes] = await Promise.all([
        api.get('/enrollments/getAllEnrollments'),
        api.get('/mahasiswa/getMahasiswa'),
        api.get('/matkul/getMatkul')
      ]);
      
      setEnrollments(enrollmentsRes.data);
      setStudents(studentsRes.data);
      setCourses(coursesRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };  const fetchStudentEnrollments = async (npm) => {
    try {
      const response = await api.get(`/enrollments/getEnrollmentByNPM/${npm}`);
      setStudentEnrollments(response.data);
      setStudentView(true);
    } catch (err) {
      setError('Failed to fetch student enrollments');
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const resetForm = () => {
    setFormData({
      npm: '',
      courseCode: '',
      grade: ''
    });
    setEditMode(false);
    setCurrentId(null);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {      if (editMode) {
        await api.put(`/enrollments/updateEnrollment/${currentId}`, {
          npm: formData.npm,
          courseCode: formData.courseCode,
          grade: formData.grade || null
        });
        showToast('Enrollment updated successfully');
      } else {
        await api.post('/enrollments/addEnrollment', formData);
        showToast('Enrollment added successfully');
      }
      fetchAllData();
      resetForm();
      setShowForm(false);
      
      // Refresh student enrollments if in student view
      if (studentView && selectedStudent) {
        fetchStudentEnrollments(selectedStudent.npm);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'An error occurred', 'error');
      console.error(err);
    }
  };

  const handleEdit = (enrollment) => {
    setFormData({
      npm: enrollment.npm,
      courseCode: enrollment.courseCode,
      grade: enrollment.grade || ''
    });
    setEditMode(true);
    setCurrentId(enrollment._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this enrollment?')) {      try {
        await api.delete(`/enrollments/deleteEnrollment/${id}`);
        fetchAllData();
        showToast('Enrollment deleted successfully');
        
        // Refresh student enrollments if in student view
        if (studentView && selectedStudent) {
          fetchStudentEnrollments(selectedStudent.npm);
        }
      } catch (err) {
        showToast('Failed to delete enrollment', 'error');
        console.error(err);
      }
    }
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setCurrentPage(1); // Reset pagination when switching student
    fetchStudentEnrollments(student.npm);
    showToast(`Viewing enrollments for ${student.name}`);
  };

  // Toast notification helper
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  // Filter and pagination logic
  const filteredEnrollments = enrollments.filter(enrollment => {
    const searchLower = searchQuery.toLowerCase();
    return (
      enrollment.user?.name?.toLowerCase().includes(searchLower) ||
      enrollment.npm?.toLowerCase().includes(searchLower) ||
      enrollment.course?.nama?.toLowerCase().includes(searchLower) ||
      enrollment.courseCode?.toLowerCase().includes(searchLower)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEnrollments = filteredEnrollments.slice(indexOfFirstItem, indexOfFirstItem + itemsPerPage);
  const totalPages = Math.ceil(filteredEnrollments.length / itemsPerPage);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Enrollment Management</h1>
        <div className="space-x-2">
          <button 
            onClick={() => {
              setStudentView(false);
              setSelectedStudent(null);
              setCurrentPage(1);
              fetchAllData();
            }}
            className={`px-4 py-2 rounded-lg transition duration-200 ${
              !studentView 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            All Enrollments
          </button>
          <button 
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
          >
            {showForm ? 'Cancel' : 'Add New Enrollment'}
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-500 ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {toast.message}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6 transition-all duration-200">
          <h2 className="text-xl font-semibold mb-4">{editMode ? 'Edit Enrollment' : 'Add New Enrollment'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Student</label>
                <select 
                  name="npm" 
                  value={formData.npm}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg bg-gray-200"
                  required
                  disabled={editMode}
                >
                  <option value="">Select a student</option>
                  {students.map((student) => (
                    <option key={student.npm} value={student.npm}>
                      {student.name} ({student.npm})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Course</label>
                <select 
                  name="courseCode" 
                  value={formData.courseCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg bg-gray-200"
                  required
                  disabled={editMode}
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.kode} value={course.kode}>
                      {course.nama} ({course.kode}) - {course.sks} SKS
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Grade (Optional)</label>
                <select 
                  name="grade" 
                  value={formData.grade}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg bg-gray-200"
                >
                  <option value="">No grade yet</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                type="button" 
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {editMode ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      {!studentView && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">View by Student</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {students.map((student) => (
              <div 
                key={student.npm} 
                className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 cursor-pointer transition duration-200"
                onClick={() => handleStudentSelect(student)}
              >
                <h3 className="font-medium">{student.name}</h3>
                <p className="text-sm text-gray-600">NPM: {student.npm}</p>
                <p className="text-sm text-gray-600">Department: {student.jurusan}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-lg">
        {/* Search Bar */}
        <div className="mb-6">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={studentView ? "Search student's enrollments..." : "Search enrollments by student name, NPM, or course..."}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : studentView ? (
          <>
            <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-100">
              <h2 className="text-lg font-medium text-blue-800">
                Enrollments for {selectedStudent?.name} ({selectedStudent?.npm})
              </h2>
              <p className="text-sm text-blue-600">
                Department: {selectedStudent?.jurusan} | GPA: {selectedStudent?.IPK} | Semester: {selectedStudent?.semester}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {studentEnrollments.length > 0 ? (
                    studentEnrollments.map((enrollment) => (
                      <tr key={enrollment._id}>
                        <td className="px-6 py-4 whitespace-nowrap">{enrollment.courseCode}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{enrollment.course?.nama || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{enrollment.course?.sks || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {enrollment.grade || 'Not graded yet'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => handleEdit(enrollment)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(enrollment._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-center" colSpan="6">
                        No enrollments found for this student
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentEnrollments.length > 0 ? (
                    currentEnrollments.map((enrollment) => (
                      <tr key={enrollment._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {enrollment.user ? (
                            <div>
                              <div className="font-medium">{enrollment.user.name}</div>
                              <div className="text-sm text-gray-500">{enrollment.npm}</div>
                            </div>
                          ) : (
                            enrollment.npm
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {enrollment.course ? (
                            <div>
                              <div className="font-medium">{enrollment.course.nama}</div>
                              <div className="text-sm text-gray-500">{enrollment.courseCode} - {enrollment.course.sks} SKS</div>
                            </div>
                          ) : (
                            enrollment.courseCode
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {enrollment.grade || 'Not graded yet'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => handleEdit(enrollment)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(enrollment._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-center" colSpan="5">No enrollments found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex justify-between items-center">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  } transition duration-200`}
                >
                  Previous
                </button>
                <span className="text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === totalPages 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  } transition duration-200`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default EnrollmentPage;