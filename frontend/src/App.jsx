import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { api } from './services/api';
import logoUI from './assets/logoui.png';
import MahasiswaPage from './pages/MahasiswaPage';
import MatkulPage from './pages/MatkulPage';
import EnrollmentPage from './pages/EnrollmentPage';
import JadwalPage from './pages/JadwalPage';

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-white text-ui shadow-sm'
          : 'text-white hover:bg-ui-dark'
      }`}
    >
      {children}
    </Link>
  );
}

function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-ui shadow-lg' : 'bg-ui/95'
    }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">          <Link to="/" className="flex items-center space-x-2">
            <img src={logoUI} alt="UI Logo" className="w-8 h-8" />
            <h1 className="text-xl text-white font-bold">SIRSAK UI</h1>
          </Link>
          <div className="flex space-x-2">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/mahasiswa">Students</NavLink>
            <NavLink to="/matkul">Courses</NavLink>
            <NavLink to="/enrollment">Enrollments</NavLink>
            <NavLink to="/jadwal">Schedule</NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 pt-20 pb-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/mahasiswa" element={<MahasiswaPage />} />
            <Route path="/matkul" element={<MatkulPage />} />
            <Route path="/enrollment" element={<EnrollmentPage />} />
            <Route path="/jadwal" element={<JadwalPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function HomePage() {
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    enrollments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [studentsRes, coursesRes, enrollmentsRes] = await Promise.all([
          api.get('/mahasiswa/getMahasiswa'),
          api.get('/matkul/getMatkul'),
          api.get('/enrollments/getAllEnrollments')
        ]);
        setStats({
          students: studentsRes.data.length,
          courses: coursesRes.data.length,
          enrollments: enrollmentsRes.data.length
        });
        setError(null);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Manage Students',
      description: 'Add, update, and manage student information. Keep track of student details, academic progress, and more.',
      icon: (
        <svg className="w-12 h-12 text-ui mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      to: '/mahasiswa'
    },
    {
      title: 'Manage Courses',
      description: 'Create and manage course offerings, set credit hours, and organize academic curriculum efficiently.',
      icon: (
        <svg className="w-12 h-12 text-ui mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      to: '/matkul'
    },
    {
      title: 'Manage Enrollments',
      description: 'Handle course enrollments, track student registrations, and manage academic records seamlessly.',
      icon: (
        <svg className="w-12 h-12 text-ui mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      to: '/enrollment'
    },
    {
      title: 'Manage Schedule',
      description: 'Organize and manage course schedules, class timings, and room assignments effectively.',
      icon: (
        <svg className="w-12 h-12 text-ui mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      to: '/jadwal'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to SIRSAK UI
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Sistem Informasi Akademis Universitas Indonesia
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 justify-center">
        {cards.map((card, index) => (
          <Link
            key={index}
            to={card.to}
            className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center"
          >
            <div className="text-center flex flex-col items-center">
              {card.icon}
              <h2 className="text-xl font-semibold mb-3 text-gray-800">{card.title}</h2>
              <p className="text-gray-600">{card.description}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-16 bg-ui-light/20 border border-ui-light p-8 rounded-xl">
        <h2 className="text-2xl font-semibold text-ui-dark mb-4">Quick Stats</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-600 mb-2">Total Students</h3>
            {loading ? (
              <div className="animate-pulse h-9 bg-gray-200 rounded"></div>
            ) : (
              <p className="text-3xl font-bold text-ui">{stats.students}</p>
            )}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-600 mb-2">Active Courses</h3>
            {loading ? (
              <div className="animate-pulse h-9 bg-gray-200 rounded"></div>
            ) : (
              <p className="text-3xl font-bold text-ui">{stats.courses}</p>
            )}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-600 mb-2">Enrollments</h3>
            {loading ? (
              <div className="animate-pulse h-9 bg-gray-200 rounded"></div>
            ) : (
              <p className="text-3xl font-bold text-ui">{stats.enrollments}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;