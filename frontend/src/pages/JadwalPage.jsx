import { useState, useEffect } from 'react';
import { api } from '../services/api';

function JadwalPage() {
  const [jadwal, setJadwal] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const itemsPerPage = 10;
  const [formData, setFormData] = useState({
    courseCode: '',
    hari: '',
    waktuMulai: '',
    waktuSelesai: '',
    ruangan: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const daysOfWeek = [
    'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'
  ];
  
  const timeSlots = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  // Toast notification helper
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };
    // Helper function to parse time string into hours
  const parseTime = (timeStr) => {
    if (!timeStr) return 0;
    
    // Try to parse the time string, handling various formats
    try {
      const parts = timeStr.split(':');
      if (parts.length !== 2) {
        console.error('Invalid time format:', timeStr);
        return 0;
      }
      
      // Make sure we have valid numbers
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      
      if (isNaN(hours) || isNaN(minutes)) {
        console.error('Invalid time components:', timeStr, hours, minutes);
        return 0;
      }
      
      return hours + (minutes / 60);
    } catch (err) {
      console.error('Error parsing time:', timeStr, err);
      return 0;
    }
  };  // Helper function to check if a schedule is in a given time slot
  const isScheduleInTimeSlot = (schedule, day, timeSlot) => {
    // First check if days match (case insensitive comparison)
    if (schedule.hari.toLowerCase() !== day.toLowerCase()) {
      return false;
    }
    
    // Parse the jam field correctly
    const [startTime, endTime] = schedule.jam ? schedule.jam.split(' - ') : ['', ''];
    if (!startTime || !endTime) return false;
    
    // Convert all times to decimal hours for easier comparison
    const slotTime = parseTime(timeSlot);
    const scheduleStartTime = parseTime(startTime);
    const scheduleEndTime = parseTime(endTime);
    
    // For debugging
    console.log(`Checking schedule: ${schedule.kodeMatkul} on ${day} at ${timeSlot}`);
    console.log(`Schedule time: ${startTime} - ${endTime}`);
    console.log(`Slot time: ${slotTime}, Schedule start: ${scheduleStartTime}, Schedule end: ${scheduleEndTime}`);
    
    // Check if this time slot falls within schedule time range
    return slotTime >= scheduleStartTime && slotTime < scheduleEndTime;
  };
  
  // Helper function to get a schedule for a specific day and time slot
  const getScheduleForSlot = (day, timeSlot) => {
    return jadwal.find(schedule => isScheduleInTimeSlot(schedule, day, timeSlot));
  };
  // Helper function to get schedule duration in hours
  const getScheduleDuration = (schedule) => {
    if (!schedule || !schedule.jam) return 1;
    
    const [startTime, endTime] = schedule.jam.split(' - ');
    if (!startTime || !endTime) return 1;
    
    const start = parseTime(startTime);
    const end = parseTime(endTime);
    
    // Ensure duration is at least 1 hour and handle potential invalid calculations
    const duration = end - start;
    const finalDuration = isNaN(duration) || duration < 1 ? 1 : duration;
    
    // For debugging
    console.log(`Schedule ${schedule.kodeMatkul} duration: ${startTime} - ${endTime} = ${finalDuration} hours`);
    
    return finalDuration;
  };
  
  // Helper function to get row span for a schedule
  const getRowSpan = (schedule) => {
    return Math.max(1, Math.round(getScheduleDuration(schedule)));
  };  // Helper function to check if we should render the schedule in this cell
  // This prevents duplicate rendering of multi-hour schedules
  const shouldRenderSchedule = (schedule, timeSlot) => {
    if (!schedule || !schedule.jam) return false;
    
    const [startTime] = schedule.jam.split(' - ');
    // Extract hours and handle padded values like "07:00"
    const slotHour = parseInt(timeSlot.split(':')[0], 10);
    const scheduleStartHour = parseInt(startTime.split(':')[0], 10);
    
    // Check if we're at the schedule's starting hour
    const isStartingHour = slotHour === scheduleStartHour;
    
    // For debugging
    console.log(`Should render schedule ${schedule.kodeMatkul} at ${timeSlot}? ${isStartingHour}`);
    console.log(`slotHour: ${slotHour}, scheduleStartHour: ${scheduleStartHour}`);
    
    // Only render the schedule at its starting hour
    return isStartingHour;
  };
  
  const fetchCourses = async () => {
    try {
      const coursesRes = await api.get('/matkul/getMatkul');
      setCourses(coursesRes.data);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      showToast('Failed to load courses', 'error');
    }
  };    const fetchJadwal = async () => {
    setLoading(true);
    try {
      const jadwalRes = await api.get('/jadwal/getJadwal');
      if (jadwalRes && Array.isArray(jadwalRes.data)) {
        // Debug log the fetched data
        console.log('Fetched schedules:', jadwalRes.data);
        
        // Make sure each jadwal has the required fields for the calendar
        const validSchedules = jadwalRes.data.filter(item => {
          const isValid = item && 
                      item.hari && 
                      item.jam && 
                      item.jam.includes(' - ') &&  // Note: space before and after hyphen
                      item.kodeMatkul && 
                      item.ruang;
          
          if (!isValid) {
            console.warn('Invalid schedule item:', item);
            console.warn('Missing fields:', {
              hari: !item.hari,
              jam: !item.jam,
              jamFormat: item.jam && !item.jam.includes(' - '),
              kodeMatkul: !item.kodeMatkul,
              ruang: !item.ruang
            });
          }
          return isValid;
        });
        
        console.log('Valid schedules:', validSchedules);
        console.log('Schedule days:', validSchedules.map(s => s.hari));
        
        setJadwal(validSchedules);
        setError(null);
      } else {
        setJadwal([]);
        setError('Invalid response format from server');
        console.error('Invalid response format:', jadwalRes?.data);
      }
    } catch (err) {
      setJadwal([]);
      // Comprehensive error handling to avoid "cannot read property of undefined"
      let errorMessage = 'Failed to fetch schedules';
      
      if (err) {
        if (err.response && err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = `Error: ${err.message}`;
        }
      }
      
      setError(errorMessage);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchJadwal();
    fetchCourses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const resetForm = () => {
    setFormData({
      courseCode: '',
      hari: '',
      waktuMulai: '',
      waktuSelesai: '',
      ruangan: ''
    });
    setEditMode(false);
    setCurrentId(null);
  };  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Transform form data to match backend schema
      const jadwalData = {
        kodeMatkul: formData.courseCode,
        hari: formData.hari,
        jam: `${formData.waktuMulai} - ${formData.waktuSelesai}`,
        ruang: formData.ruangan
      };

      // Validate required fields
      if (!jadwalData.kodeMatkul || !jadwalData.hari || !jadwalData.jam || !jadwalData.ruang) {
        showToast('Please fill in all required fields', 'error');
        return;
      }

      let response;
      if (editMode) {
        response = await api.put(`/jadwal/updateJadwal/${currentId}`, jadwalData);
        showToast(response.data.message || 'Schedule updated successfully');
      } else {
        response = await api.post('/jadwal/addJadwal', jadwalData);
        showToast(response.data.message || 'Schedule added successfully');
      }
      
      // Only continue if we got a successful response
      if (response.data) {
        await fetchJadwal();
        resetForm();
        setShowForm(false);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          (err.response?.status === 400 ? 'Invalid input data' : 'An error occurred');
      showToast(errorMessage, 'error');
      console.error(err);
    }
  };
  
  const handleEdit = (schedule) => {
    // Split the jam field into waktuMulai and waktuSelesai
    const [waktuMulai = '', waktuSelesai = ''] = schedule.jam ? schedule.jam.split(' - ') : [];
    
    setFormData({
      courseCode: schedule.kodeMatkul,
      hari: schedule.hari,
      waktuMulai,
      waktuSelesai,
      ruangan: schedule.ruang
    });
    setEditMode(true);
    setCurrentId(schedule._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {        
        await api.delete(`/jadwal/deleteJadwal/${id}`);
        showToast('Schedule deleted successfully');
        fetchJadwal();
      } catch (err) {
        showToast('Failed to delete schedule', 'error');
        console.error(err);
      }
    }
  };

  // Filter and pagination logic for list view
  const filteredSchedules = jadwal.filter(schedule => {      
    const searchLower = searchQuery.toLowerCase();
    const course = courses.find(c => c.kode === schedule.kodeMatkul);
    return (
      schedule.ruang.toLowerCase().includes(searchLower) ||
      schedule.hari.toLowerCase().includes(searchLower) ||
      course?.nama.toLowerCase().includes(searchLower) ||
      schedule.kodeMatkul.toLowerCase().includes(searchLower)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSchedules = filteredSchedules.slice(indexOfFirstItem, indexOfFirstItem + itemsPerPage);
  const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage);
  // Render calendar view
  const renderCalendarView = () => {
    // Gunakan filteredSchedules agar calendar view juga mengikuti hasil pencarian
    // dan data yang sudah di-add
    return (
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full border border-gray-200 schedule-table">
          <thead>
            <tr>
              <th className="border border-gray-300 bg-gray-100 p-2 w-20">Time</th>
              {daysOfWeek.map(day => (
                <th key={day} className="border border-gray-300 bg-gray-100 p-2 font-medium">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((timeSlot, idx) => (
              <tr key={timeSlot} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="border border-gray-300 text-center py-2 font-medium">{timeSlot}</td>
                {daysOfWeek.map(day => {
                  // Ganti jadwal.find menjadi filteredSchedules.find agar jadwal yang sudah di-add dan sesuai filter muncul
                  const schedule = filteredSchedules.find(s => isScheduleInTimeSlot(s, day, timeSlot));
                  // Check if this cell should be skipped due to rowspan
                  const isCoveredByRowspan = filteredSchedules.some(s => {
                    if (s.hari.toLowerCase() !== day.toLowerCase()) return false;
                    const [startTime, endTime] = s.jam ? s.jam.split(' - ') : ['', ''];
                    if (!startTime || !endTime) return false;
                    const slotTime = parseTime(timeSlot);
                    const scheduleStartTime = parseTime(startTime);
                    const scheduleEndTime = parseTime(endTime);
                    return (
                      slotTime > scheduleStartTime &&
                      slotTime < scheduleEndTime &&
                      parseInt(timeSlot.split(':')[0], 10) !== parseInt(startTime.split(':')[0], 10)
                    );
                  });
                  if (schedule && shouldRenderSchedule(schedule, timeSlot)) {
                    const course = courses.find(c => c.kode === schedule.kodeMatkul);
                    const rowSpan = getRowSpan(schedule);
                    return (
                      <td
                        key={`${day}-${timeSlot}`}
                        className="border border-gray-300 p-1 relative"
                        rowSpan={rowSpan}
                      >
                        <div className="bg-blue-100 p-2 h-full rounded shadow-sm border-l-4 border-blue-500">
                          <div className="font-medium text-blue-800">{course?.nama || 'Unknown Course'}</div>
                          <div className="text-xs text-gray-600">{schedule.kodeMatkul}</div>
                          <div className="text-xs mt-1">
                            <span className="font-medium">Room:</span> {schedule.ruang}
                          </div>
                          <div className="text-xs">
                            <span className="font-medium">Time:</span> {schedule.jam}
                          </div>
                          <div className="absolute top-1 right-1 flex space-x-1">
                            <button
                              onClick={() => handleEdit(schedule)}
                              className="text-blue-600 hover:text-blue-800 text-xs"
                              title="Edit"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(schedule._id)}
                              className="text-red-600 hover:text-red-800 text-xs"
                              title="Delete"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </td>
                    );
                  } else if (isCoveredByRowspan) {
                    // Skip cell, covered by rowspan above
                    return null;
                  } else {
                    // Empty cell
                    return <td key={`${day}-${timeSlot}`} className="border border-gray-300"></td>;
                  }
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Render list view
  const renderListView = () => {
    return (
      <>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentSchedules.length > 0 ? (
                currentSchedules.map((schedule) => {
                  const course = courses.find(c => c.kode === schedule.kodeMatkul);
                  return (
                    <tr key={schedule._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium">{course?.nama || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{schedule.kodeMatkul}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{schedule.hari}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {schedule.jam}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{schedule.ruang}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleEdit(schedule)}
                          className="text-ui hover:text-ui-dark mr-4 transition-colors duration-200"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(schedule._id)}
                          className="text-red-600 hover:text-red-900 transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-gray-500" colSpan="5">
                    No schedules found
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
                  : 'bg-ui text-white hover:bg-ui-dark'
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
                  : 'bg-ui text-white hover:bg-ui-dark'
              } transition duration-200`}
            >
              Next
            </button>
          </div>
        )}
      </>
    );
  };
  // Add CSS styles for calendar
  useEffect(() => {
    // Add custom CSS for the calendar view
    const style = document.createElement('style');
    style.innerHTML = `
      .schedule-table td {
        min-width: 150px;
        height: 60px;
        position: relative;
      }
      .schedule-table th {
        min-width: 150px;
      }
    `;
    document.head.appendChild(style);
    
    // Cleanup function
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Schedule Management</h1>
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => {
              resetForm();
              if (!showForm) {
                // Refresh courses when opening form
                fetchCourses();
              }
              setShowForm(!showForm);
            }}
            className="bg-ui text-white px-4 py-2 rounded-lg hover:bg-ui-dark transition duration-200"
          >
            {showForm ? 'Cancel' : 'Add New Schedule'}
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
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">{editMode ? 'Edit Schedule' : 'Add New Schedule'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Course</label>
                <select 
                  name="courseCode" 
                  value={formData.courseCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                  required
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
                <label className="block text-gray-700 mb-2">Day</label>
                <select 
                  name="hari" 
                  value={formData.hari}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                  required
                >
                  <option value="">Select a day</option>
                  {daysOfWeek.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Start Time</label>
                <input 
                  type="time" 
                  name="waktuMulai" 
                  value={formData.waktuMulai}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">End Time</label>
                <input 
                  type="time" 
                  name="waktuSelesai" 
                  value={formData.waktuSelesai}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Room</label>
                <input 
                  type="text" 
                  name="ruangan" 
                  value={formData.ruangan}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                  required
                  placeholder="e.g., 2.1401"
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
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="bg-ui text-white px-4 py-2 rounded-lg hover:bg-ui-dark"
              >
                {editMode ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}      <div className="bg-white p-6 rounded-lg shadow-lg">
        {/* View Toggle */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg ${
                viewMode === 'list' 
                  ? 'bg-ui text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } transition duration-200`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-lg ${
                viewMode === 'calendar' 
                  ? 'bg-ui text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } transition duration-200`}
            >
              Calendar View
            </button>
          </div>
          
          {/* Search (only visible in list view) */}
          {viewMode === 'list' && (
            <div className="w-1/3">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-ui focus:border-transparent"
                placeholder="Search by course name, room, or day..."
              />
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ui"></div>
          </div>
        ) : (
          <>
            {viewMode === 'list' ? renderListView() : renderCalendarView()}
          </>
        )}
      </div>
    </div>
  );
}

export default JadwalPage;
