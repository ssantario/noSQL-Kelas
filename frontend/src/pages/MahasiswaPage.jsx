import { useState, useEffect } from 'react';
import { api } from '../services/api';

function MahasiswaPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    npm: '',
    jurusan: '',
    IPK: '',
    semester: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [currentNPM, setCurrentNPM] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const itemsPerPage = 10;

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await api.get('/mahasiswa/getMahasiswa');
      setStudents(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch students');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'IPK' || name === 'semester' ? parseFloat(value) : value
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      npm: '',
      jurusan: '',
      IPK: '',
      semester: ''
    });
    setEditMode(false);
    setCurrentNPM(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await api.put(`/mahasiswa/updateMahasiswa/${currentNPM}`, formData);
        showToast('Student updated successfully');
      } else {
        await api.post('/mahasiswa/addMahasiswa', formData);
        showToast('Student added successfully');
      }
      fetchStudents();
      resetForm();
      setShowForm(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'An error occurred', 'error');
      console.error(err);
    }
  };

  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      npm: student.npm,
      jurusan: student.jurusan,
      IPK: student.IPK,
      semester: student.semester
    });
    setEditMode(true);
    setCurrentNPM(student.npm);
    setShowForm(true);
  };

  const handleDelete = async (npm) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await api.delete(`/mahasiswa/deleteMahasiswa/${npm}`);
        fetchStudents();
        showToast('Student deleted successfully');
      } catch (err) {
        showToast('Failed to delete student', 'error');
        console.error(err);
      }
    }
  };

  // Toast notification helper
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  // Filter and pagination logic
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.npm.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.jurusan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfFirstItem + itemsPerPage);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Student Management</h1>
        <button 
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          {showForm ? 'Cancel' : 'Add New Student'}
        </button>
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
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">{editMode ? 'Edit Student' : 'Add New Student'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg bg-white border-gray-600"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">NPM (Student ID)</label>
                <input 
                  type="text" 
                  name="npm" 
                  value={formData.npm}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg bg-white border-gray-600"
                  required
                  disabled={editMode}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Department</label>
                <input 
                  type="text" 
                  name="jurusan" 
                  value={formData.jurusan}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg bg-white border-gray-600"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">GPA (IPK)</label>
                <input 
                  type="number" 
                  name="IPK" 
                  value={formData.IPK}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg bg-white border-gray-600"
                  required
                  step="0.01"
                  min="0"
                  max="4"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Semester</label>
                <input 
                  type="number" 
                  name="semester" 
                  value={formData.semester}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg bg-white border-gray-600"
                  required
                  min="1"
                  max="14"
                />
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

      <div className="bg-white p-6 rounded-lg shadow-lg">
        {/* Search Bar */}
        <div className="mb-6">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search by name, NPM, or department..."
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NPM</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GPA</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentStudents.length > 0 ? (
                    currentStudents.map((student) => (
                      <tr key={student.npm} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{student.npm}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{student.jurusan}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{student.IPK}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{student.semester}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => handleEdit(student)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors duration-200"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(student.npm)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-200"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-gray-500" colSpan="6">
                        No students found
                      </td>
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

export default MahasiswaPage;