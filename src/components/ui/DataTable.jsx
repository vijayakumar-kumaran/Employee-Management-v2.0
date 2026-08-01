import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TextField,
  InputAdornment,
  TablePagination,
  Button,
  Typography,
} from '@mui/material';
import { Search, FileSpreadsheet, ArrowUpDown } from 'lucide-react';
import SkeletonLoader from './SkeletonLoader';
import EmptyState from './EmptyState';

const DataTable = ({
  columns = [],
  rows,
  data,
  loading = false,
  title,
  searchPlaceholder = 'Search records...',
  actionButton,
  emptyTitle = 'No records available',
  emptyDescription = 'No data matched your search parameters.',
}) => {
  const tableData = rows || data || [];
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  // Filtering
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return tableData;
    const q = searchQuery.toLowerCase();

    return tableData.filter((row) =>
      columns.some((col) => {
        const val = col.renderCell
          ? null
          : col.accessor
          ? col.accessor(row)
          : row[col.field];
        return val != null && val.toString().toLowerCase().includes(q);
      })
    );
  }, [tableData, searchQuery, columns]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortField, sortOrder]);

  const paginatedData = useMemo(() => {
    return sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleExportCSV = () => {
    if (!tableData.length) return;
    const headers = columns.map((col) => col.headerName || col.header).join(',');
    const exportRows = filteredData.map((row) =>
      columns
        .map((col) => {
          const val = col.accessor ? col.accessor(row) : row[col.field];
          return `"${(val || '').toString().replace(/"/g, '""')}"`;
        })
        .join(',')
    );

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...exportRows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${(title || 'export').toLowerCase().replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Paper elevation={0} sx={{ width: '100%', overflow: 'hidden', border: '1px solid', borderColor: 'divider', borderRadius: '20px' }}>
      <Box sx={{ p: 2.5, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        {title && (
          <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
            {title} ({filteredData.length})
          </Typography>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1, justifyContent: 'flex-end' }}>
          <TextField
            size="small"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
            placeholder={searchPlaceholder}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} color="#9ca3af" />
                  </InputAdornment>
                ),
                sx: { borderRadius: '10px' },
              },
            }}
            sx={{ maxWidth: 300 }}
          />

          <Button
            variant="outlined"
            size="small"
            startIcon={<FileSpreadsheet size={16} />}
            onClick={handleExportCSV}
            sx={{ borderRadius: '10px', height: 40, fontWeight: 700 }}
          >
            Export CSV
          </Button>

          {actionButton}
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ p: 3 }}>
          <SkeletonLoader type="table" rows={rowsPerPage} />
        </Box>
      ) : paginatedData.length === 0 ? (
        <Box sx={{ p: 3 }}>
          <EmptyState title={emptyTitle} description={emptyDescription} />
        </Box>
      ) : (
        <>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: 'action.hover' }}>
                  {columns.map((col, idx) => (
                    <TableCell
                      key={col.field || idx}
                      sx={{ fontWeight: 800, cursor: col.sortable ? 'pointer' : 'default', py: 1.8 }}
                      onClick={() => col.sortable && handleSort(col.field)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {col.headerName || col.header}
                        {col.sortable && <ArrowUpDown size={14} style={{ opacity: 0.6 }} />}
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row, rIdx) => (
                  <TableRow
                    key={row._id || rIdx}
                    hover
                    sx={{ transition: 'background-color 0.15s ease', '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    {columns.map((col, cIdx) => (
                      <TableCell key={col.field || cIdx}>
                        {col.renderCell
                          ? col.renderCell({ row })
                          : col.render
                          ? col.render(row)
                          : col.accessor
                          ? col.accessor(row)
                          : row[col.field]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={sortedData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </>
      )}
    </Paper>
  );
};

export default DataTable;
