import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Public Pages
import { Home } from './pages/public/Home';
import { About } from './pages/public/About';
import { Team } from './pages/public/Team';
import { DepartmentDetail } from './pages/public/DepartmentDetail';
import { MemberProfile } from './pages/public/MemberProfile';
import { Events } from './pages/public/Events';
import { Leaderboard } from './pages/public/Leaderboard';
import { Login } from './pages/public/Login';
import { ForgotPassword } from './pages/public/ForgotPassword';

// Portal Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { MemberManagement } from './pages/admin/MemberManagement';
import { DepartmentManagement } from './pages/admin/DepartmentManagement';
import { TaskManagement } from './pages/admin/TaskManagement';
import { SubmissionsReview } from './pages/admin/SubmissionsReview';
import { Analytics } from './pages/admin/Analytics';

// Member Portal Pages
import { MemberDashboard } from './pages/dashboard/MemberDashboard';
import { MyProfile } from './pages/dashboard/MyProfile';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-dark-bg text-gray-100 selection:bg-gfg-500 selection:text-white">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/team" element={<Team />} />
              <Route path="/team/:deptSlug" element={<DepartmentDetail />} />
              <Route path="/members/:id" element={<MemberProfile />} />
              <Route path="/events" element={<Events />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Admin Management Portal Protected Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['PRESIDENT', 'VICE_PRESIDENT', 'COORDINATOR', 'LEAD']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/members"
                element={
                  <ProtectedRoute allowedRoles={['PRESIDENT', 'VICE_PRESIDENT', 'COORDINATOR']}>
                    <MemberManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/departments"
                element={
                  <ProtectedRoute allowedRoles={['PRESIDENT', 'VICE_PRESIDENT', 'COORDINATOR', 'LEAD']}>
                    <DepartmentManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/tasks"
                element={
                  <ProtectedRoute allowedRoles={['PRESIDENT', 'VICE_PRESIDENT', 'COORDINATOR', 'LEAD']}>
                    <TaskManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/submissions"
                element={
                  <ProtectedRoute allowedRoles={['PRESIDENT', 'VICE_PRESIDENT', 'COORDINATOR', 'LEAD']}>
                    <SubmissionsReview />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <ProtectedRoute allowedRoles={['PRESIDENT', 'VICE_PRESIDENT', 'COORDINATOR']}>
                    <Analytics />
                  </ProtectedRoute>
                }
              />

              {/* Member Dashboard Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <MemberDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/profile"
                element={
                  <ProtectedRoute>
                    <MyProfile />
                  </ProtectedRoute>
                }
              />

              {/* Fallback Catch-All */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
