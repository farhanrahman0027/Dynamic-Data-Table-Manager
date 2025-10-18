'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { toggleColumnVisibility, addColumn } from '@/lib/store/tableSlice';

interface ManageColumnsModalProps {
  open: boolean;
  onClose: () => void;
}

const ManageColumnsModal: React.FC<ManageColumnsModalProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const columns = useAppSelector((state) => state.table.columns);
  const [newColumnId, setNewColumnId] = useState('');
  const [newColumnLabel, setNewColumnLabel] = useState('');

  const handleToggleColumn = (columnId: string) => {
    dispatch(toggleColumnVisibility(columnId));
  };

  const handleAddColumn = () => {
    if (newColumnId.trim() && newColumnLabel.trim()) {
      dispatch(
        addColumn({
          id: newColumnId.toLowerCase().replace(/\s+/g, '_'),
          label: newColumnLabel,
        })
      );
      setNewColumnId('');
      setNewColumnLabel('');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Manage Columns</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Show/Hide Columns
          </Typography>
          <FormGroup>
            {columns.map((column) => (
              <FormControlLabel
                key={column.id}
                control={
                  <Checkbox
                    checked={column.visible}
                    onChange={() => handleToggleColumn(column.id)}
                  />
                }
                label={column.label}
              />
            ))}
          </FormGroup>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Add New Column
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Column ID"
              value={newColumnId}
              onChange={(e) => setNewColumnId(e.target.value)}
              placeholder="e.g., salary"
              size="small"
              fullWidth
              helperText="Lowercase, no spaces (will auto-format)"
            />
            <TextField
              label="Column Label"
              value={newColumnLabel}
              onChange={(e) => setNewColumnLabel(e.target.value)}
              placeholder="e.g., Salary"
              size="small"
              fullWidth
            />
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={handleAddColumn}
              disabled={!newColumnId.trim() || !newColumnLabel.trim()}
              fullWidth
            >
              Add Column
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManageColumnsModal;
