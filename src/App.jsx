import React, { useState, useEffect, Suspense } from 'react';
import { Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, clearUser } from './redux/slices/userSlice';
import { CustomThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import SkeletonLoader from './components/ui/SkeletonLoader';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import EmployeeSidebar from './components_employee/SidebarEmployee';

// Lazy Loaded Pages
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Employees = React.lazy(() => import('./pages/EmployeeAddPage'));
const EmployeeManagement = React.lazy(() => import('./pages/EmployeeManagement'));
const ShowAll = React.lazy(() => import('./pages/Employee/ShowAll'));
const EditEmployee = React.lazy(() => import('./pages/Employee/EditEmployee'));
const LeaveTrack = React.lazy(() => import('./pages/leaves/leaveDetails'));
const StatusCheck = React.lazy(() => import('./pages/Employee/EmployeeStatus'));
const GrandLeave = React.lazy(() => import('./pages/leaves/grandLeave'));
const CreateTask = React.lazy(() => import('./pages/TaskAddPage'));
const TaskManagement = React.lazy(() => import('./pages/TaskManagement'));
const TaskDetailPage = React.lazy(() => import('./pages/TaskDetailPage'));
const ShowAllTasks = React.lazy(() => import('./pages/Tasks/ShowAllTasks'));
const PendingTasks = React.lazy(() => import('./pages/Tasks/pendingTasks'));
const CompltedTaks = React.lazy(() => import('./pages/Tasks/CompletedTasks'));
const UpdateTask = React.lazy(() => import('./pages/Tasks/EditTask'));
const Profile = React.lazy(() => import('./components/Profile'));

// Auth
const Login = React.lazy(() => import('./pages/Authentications/Login'));
const Register = React.lazy(() => import('./pages/Authentications/Register'));

// Employee
const DashboardEmployee = React.lazy(() => import('./pages_employee/DashboardEmployee'));
const TaskManagementEmployee = React.lazy(() => import('./pages_employee/TaskManagementEmployee'));
const NewTasks = React.lazy(() => import('./pages_employee/Tasks/NewTasks'));
const ReqLeave = React.lazy(() => import('./pages_employee/Leaves/reqLeave'));
const LeaveManagement = React.lazy(() => import('./pages_employee/LeaveManagement'));
const CheckLeaveStatus = React.lazy(() => import('./pages_employee/Leaves/checkLeaveStatus'));
const PendingTasksEmp = React.lazy(() => import('./pages_employee/Tasks/PendingTaks'));
const CompletedTasksEmp = React.lazy(() => import('./pages_employee/Tasks/CompletedTasks'));

// New V2 Modules
const AttendanceManagement = React.lazy(() => import('./pages/AttendanceManagement'));
const OrganizationView = React.lazy(() => import('./pages/OrganizationView'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openSidebar, setOpenSidebar] = useState(true);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    const userData = localStorage.getItem('user');

    if (loggedIn === 'true' && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        dispatch(setUser(parsedUser));
        setIsLoggedIn(true);
      } catch (err) {
        console.error(err);
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('authToken');
      }
    }
    setLoading(false);
  }, [dispatch]);

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    dispatch(clearUser());
  };

  if (loading) {
    return (
      <CustomThemeProvider>
        <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <SkeletonLoader type="card" count={1} />
        </Box>
      </CustomThemeProvider>
    );
  }

  return (
    <CustomThemeProvider>
      <SocketProvider>
        <Router>
          {isLoggedIn && <Navbar onLogout={handleLogout} openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />}

          <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
            {isLoggedIn && user?.role === 'admin' && (
              <Sidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
            )}

            {isLoggedIn && user?.role === 'employee' && (
              <EmployeeSidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
            )}

            <Box
              sx={{
                flexGrow: 1,
                width: '100%',
                overflowX: 'hidden',
                p: 0,
              }}
            >
              <Suspense
                fallback={
                  <Box sx={{ p: 4 }}>
                    <SkeletonLoader type="card" count={4} />
                  </Box>
                }
              >
                <Routes>
                  {/* Public Auth Routes */}
                  <Route
                    path="/login"
                    element={!isLoggedIn ? <Login onLogin={handleLogin} /> : <Navigate to="/" replace />}
                  />
                  <Route
                    path="/register"
                    element={!isLoggedIn ? <Register /> : <Navigate to="/" replace />}
                  />

                  {/* ADMIN ROUTES */}
                  {isLoggedIn && user?.role === 'admin' && (
                    <>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/create-employee" element={<Employees />} />
                      <Route path="/employee-management" element={<EmployeeManagement />} />
                      <Route path="/show-all" element={<ShowAll />} />
                      <Route path="/edit" element={<EditEmployee />} />
                      <Route path="/status" element={<StatusCheck />} />
                      <Route path="/grand-leave" element={<GrandLeave />} />
                      <Route path="/leave-track" element={<LeaveTrack />} />
                      <Route path="/leave-management" element={<LeaveTrack />} />
                      <Route path="/create-task" element={<CreateTask />} />
                      <Route path="/task-management" element={<TaskManagement />} />
                      <Route path="/task-detail/:id" element={<TaskDetailPage />} />
                      <Route path="/show-all-tasks" element={<ShowAllTasks />} />
                      <Route path="/pending-tasks" element={<PendingTasks />} />
                      <Route path="/completed-tasks" element={<CompltedTaks />} />
                      <Route path="/update-task" element={<UpdateTask />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/attendance-management" element={<AttendanceManagement />} />
                      <Route path="/organization" element={<OrganizationView />} />
                      <Route path="/settings" element={<SettingsPage />} />
                    </>
                  )}

                  {/* EMPLOYEE ROUTES */}
                  {isLoggedIn && user?.role === 'employee' && (
                    <>
                      <Route path="/" element={<DashboardEmployee />} />
                      <Route path="/task-management" element={<TaskManagementEmployee />} />
                      <Route path="/task-detail/:id" element={<TaskDetailPage />} />
                      <Route path="/new-tasks" element={<NewTasks />} />
                      <Route path="/leave-management" element={<LeaveManagement />} />
                      <Route path="/req-leave" element={<ReqLeave />} />
                      <Route path="/leave-status" element={<CheckLeaveStatus />} />
                      <Route path="/pending-tasks" element={<PendingTasksEmp />} />
                      <Route path="/completed-tasks" element={<CompletedTasksEmp />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/attendance-management" element={<AttendanceManagement />} />
                      <Route path="/organization" element={<OrganizationView />} />
                      <Route path="/settings" element={<SettingsPage />} />
                    </>
                  )}

                  {/* Catch-all Fallback */}
                  <Route
                    path="*"
                    element={isLoggedIn ? <Navigate to="/" replace /> : <Navigate to="/login" replace />}
                  />
                </Routes>
              </Suspense>
            </Box>
          </Box>
        </Router>
      </SocketProvider>
    </CustomThemeProvider>
  );
}

export default App;