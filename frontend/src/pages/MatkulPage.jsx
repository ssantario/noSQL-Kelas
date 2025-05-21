import { useState, useEffect } from 'react';
import { api } from '../services/api';

function MatkulPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    kode: '',
    sks: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [currentKode, setCurrentKode] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCourses();
  }, []);

  // Toast notification helper
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  // Filter and pagination logic
  const filteredCourses = courses.filter(course => 
    course.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.kode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstItem, indexOfFirstItem + itemsPerPage);
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await api.get('/matkul/getMatkul');
      setCourses(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch courses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'sks' ? parseInt(value, 10) : value
    });
  };

  const resetForm = () => {
    setFormData({
      nama: '',
      kode: '',
      sks: ''
    });
    setEditMode(false);
    setCurrentKode(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await api.put(`/matkul/updateMatkul/${currentKode}`, {
          name: formData.nama,
          sks: formData.sks
        });
        showToast('Course updated successfully');
      } else {
        await api.post('/matkul/addMatkul', formData);
        showToast('Course added successfully');
      }
      fetchCourses();
      resetForm();
      setShowForm(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'An error occurred', 'error');
      console.error(err);
    }
  };

  const handleEdit = (course) => {
    setFormData({
      nama: course.nama,
      kode: course.kode,
      sks: course.sks
    });
    setEditMode(true);
    setCurrentKode(course.kode);
    setShowForm(true);
  };

  const handleDelete = async (kode) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.delete(`/matkul/deleteMatkul/${kode}`);
        fetchCourses();
        showToast('Course deleted successfully');
      } catch (err) {
        setError('Failed to delete course');
        console.error(err);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Course Management</h1>
        <button 
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          {showForm ? 'Cancel' : 'Add New Course'}
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
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6 transition-all duration-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">{editMode ? 'Edit Course' : 'Add New Course'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Course Name</label>
                <input 
                  type="text" 
                  name="nama" 
                  value={formData.nama}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg bg-white border-gray-600"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Course Code</label>
                <input 
                  type="text" 
                  name="kode" 
                  value={formData.kode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg bg-white border-gray-600"
                  required
                  disabled={editMode}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Credits (SKS)</label>
                <input 
                  type="number" 
                  name="sks" 
                  value={formData.sks}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg bg-white border-gray-600"
                  required
                  min="1"
                  max="6"
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
            placeholder="Search by course name or code..."
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits (SKS)</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentCourses.length > 0 ? (
                    currentCourses.map((course) => (
                      <tr key={course.kode} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">{course.nama}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{course.kode}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{course.sks}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => handleEdit(course)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors duration-200"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(course.kode)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-200"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-gray-500" colSpan="4">
                        No courses found
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

export default MatkulPage;