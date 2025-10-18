'use client';

import React, { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  IconButton,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import { Edit, Delete, Save, Cancel } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  setPage,
  setRowsPerPage,
  toggleSortDirection,
  deleteRow,
  setEditingRowId,
  updateRow,
  TableRow as TableRowType,
} from '@/lib/store/tableSlice';
import DeleteConfirmDialog from './DeleteConfirmDialog';

const DataTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    data,
    columns,
    searchQuery,
    sortColumn,
    sortDirection,
    page,
    rowsPerPage,
    editingRowId,
  } = useAppSelector((state) => state.table);

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [rowToDelete, setRowToDelete] = React.useState<string | null>(null);
  const [editedData, setEditedData] = React.useState<Partial<TableRowType>>({});

  const visibleColumns = useMemo(
    () => columns.filter((col) => col.visible),
    [columns]
  );

  const filteredAndSortedData = useMemo(() => {
    let filtered = data;

    if (searchQuery) {
      filtered = data.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];

        if (aVal == null) return 1;
        if (bVal == null) return -1;

        let comparison = 0;
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          comparison = aVal - bVal;
        } else {
          comparison = String(aVal).localeCompare(String(bVal));
        }

        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  }, [data, searchQuery, sortColumn, sortDirection]);

  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredAndSortedData.slice(start, start + rowsPerPage);
  }, [filteredAndSortedData, page, rowsPerPage]);

  const handleSort = (columnId: string) => {
    dispatch(toggleSortDirection(columnId));
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setRowsPerPage(parseInt(event.target.value, 10)));
  };

  const handleDeleteClick = (id: string) => {
    setRowToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (rowToDelete) {
      dispatch(deleteRow(rowToDelete));
      setRowToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleEditClick = (row: TableRowType) => {
    dispatch(setEditingRowId(row.id));
    setEditedData(row);
  };

  const handleCancelEdit = () => {
    dispatch(setEditingRowId(null));
    setEditedData({});
  };

  const handleSaveEdit = () => {
    if (editingRowId && editedData) {
      dispatch(updateRow({ ...editedData, id: editingRowId } as TableRowType));
      dispatch(setEditingRowId(null));
      setEditedData({});
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: field === 'age' ? Number(value) || 0 : value,
    }));
  };

  if (visibleColumns.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No columns selected. Please enable columns from Manage Columns.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper} elevation={2}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              {visibleColumns.map((column) => (
                <TableCell key={column.id}>
                  {column.sortable ? (
                    <TableSortLabel
                      active={sortColumn === column.id}
                      direction={sortColumn === column.id ? sortDirection : 'asc'}
                      onClick={() => handleSort(column.id)}
                    >
                      <strong>{column.label}</strong>
                    </TableSortLabel>
                  ) : (
                    <strong>{column.label}</strong>
                  )}
                </TableCell>
              ))}
              <TableCell align="right">
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length + 1} align="center">
                  <Typography variant="body1" color="text.secondary" sx={{ py: 4 }}>
                    No data available
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => {
                const isEditing = editingRowId === row.id;
                return (
                  <TableRow
                    key={row.id}
                    hover={!isEditing}
                    sx={{
                      '&:nth-of-type(odd)': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    {visibleColumns.map((column) => (
                      <TableCell key={column.id}>
                        {isEditing ? (
                          <TextField
                            size="small"
                            type={column.id === 'age' ? 'number' : 'text'}
                            value={editedData[column.id] ?? ''}
                            onChange={(e) => handleFieldChange(column.id, e.target.value)}
                            error={column.id === 'age' && isNaN(Number(editedData[column.id]))}
                            helperText={
                              column.id === 'age' && isNaN(Number(editedData[column.id]))
                                ? 'Must be a number'
                                : ''
                            }
                            fullWidth
                          />
                        ) : (
                          row[column.id]
                        )}
                      </TableCell>
                    ))}
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        {isEditing ? (
                          <>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={handleSaveEdit}
                              title="Save"
                            >
                              <Save />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="default"
                              onClick={handleCancelEdit}
                              title="Cancel"
                            >
                              <Cancel />
                            </IconButton>
                          </>
                        ) : (
                          <>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEditClick(row)}
                              title="Edit"
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteClick(row.id)}
                              title="Delete"
                            >
                              <Delete />
                            </IconButton>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredAndSortedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

export default DataTable;
