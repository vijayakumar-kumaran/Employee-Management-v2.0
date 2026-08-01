import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";

const EmployeeDetailsModal = ({ open, onClose, employeeDetails }) => {
  if (!employeeDetails) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle align="center">Employee Details</DialogTitle>
      <DialogContent>
        {/* Table Container for better structure */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Detail</strong></TableCell>
                <TableCell><strong>Info</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Phone Number</TableCell>
                <TableCell>{employeeDetails.phoneNumber}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Aadhaar Number</TableCell>
                <TableCell>{employeeDetails.aadhaarNumber}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Gender</TableCell>
                <TableCell>{employeeDetails.gender}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Address</TableCell>
                <TableCell>{employeeDetails.address}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeDetailsModal;
