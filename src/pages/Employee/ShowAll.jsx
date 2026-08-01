import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Avatar, Chip, IconButton } from '@mui/material';
import { UserPlus, Eye, ShieldCheck, Mail, Phone, Building2 } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import StatusChip from '../../components/ui/StatusChip';
import CustomModal from '../../components/ui/CustomModal';
import SignupModal from '../Authentications/SignupModal';
import EmployeeDetailsModal from './EmployeeDetailsModal';
import { fetchAllEmployees } from '../../services/api';

const ShowAll = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetchAllEmployees();
      setEmployees(res.data || []);
    } catch (err) {
      console.error('Error fetching employee list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleOpenAccountModal = (emp) => {
    setSelectedEmployee(emp);
    setSignupModalOpen(true);
  };

  const handleOpenDetails = (emp) => {
    setSelectedEmployeeDetails(emp);
    setDetailsModalOpen(true);
  };

  const updateWsAccount = (updatedEmp) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp._id === updatedEmp._id ? { ...emp, wsaccount: true } : emp))
    );
  };

  const columns = [
    {
      field: 'name',
      header: 'Employee Name',
      sortable: true,
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 700, width: 34, height: 34, fontSize: '0.85rem' }}>
            {(row.name || 'E')[0]}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {row.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.designation}
            </Typography>
          </Box>
        </Box>
      ),
    },
    { field: 'email', header: 'Email Address', sortable: true },
    {
      field: 'department',
      header: 'Department',
      sortable: true,
      render: (row) => <Chip label={row.department} size="small" variant="outlined" sx={{ fontWeight: 600 }} />,
    },
    {
      field: 'status',
      header: 'Status',
      render: (row) => <StatusChip status={row.status} />,
    },
    {
      field: 'wsaccount',
      header: 'Portal Access',
      render: (row) =>
        row.wsaccount ? (
          <Chip icon={<ShieldCheck size={14} />} label="Account Active" size="small" color="success" sx={{ fontWeight: 700 }} />
        ) : (
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => handleOpenAccountModal(row)}
            sx={{ borderRadius: '8px', fontSize: '0.75rem' }}
          >
            Create Login
          </Button>
        ),
    },
    {
      field: 'actions',
      header: 'Actions',
      render: (row) => (
        <Button
          size="small"
          variant="outlined"
          startIcon={<Eye size={14} />}
          onClick={() => handleOpenDetails(row)}
          sx={{ borderRadius: '8px' }}
        >
          View Profile
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
            Employee Directory & Workforce
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage employee profiles, designations, department tags, and portal login credentials.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<UserPlus size={18} />}
          onClick={() => navigate('/create-employee')}
          sx={{ borderRadius: '12px', py: 1, px: 2.5 }}
        >
          Add New Employee
        </Button>
      </Box>

      <DataTable
        title="Employee Roster"
        columns={columns}
        data={employees}
        loading={loading}
        searchPlaceholder="Search by name, email, department, or title..."
      />

      {signupModalOpen && (
        <SignupModal
          open={signupModalOpen}
          onClose={() => setSignupModalOpen(false)}
          employeeDetails={selectedEmployee}
          onAccountCreated={updateWsAccount}
        />
      )}

      {detailsModalOpen && (
        <EmployeeDetailsModal
          open={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          employeeDetails={selectedEmployeeDetails}
        />
      )}
    </Box>
  );
};

export default ShowAll;
