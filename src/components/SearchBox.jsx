import React from 'react';
import { TextField, Box } from '@mui/material';

const SearchBar = ({ searchQuery, onSearchChange }) => {
  return (
    <Box mb={4}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search Tasks"
        label="Search"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </Box>
  );
};

export default SearchBar;
