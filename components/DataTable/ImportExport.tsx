'use client';

import React, { useRef, useState } from 'react';
import { Button, Box, Alert, Snackbar } from '@mui/material';
import { Upload, Download } from '@mui/icons-material';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setData, TableRow } from '@/lib/store/tableSlice';

const ImportExport: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data, columns } = useAppSelector((state) => state.table);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        try {
          if (results.errors.length > 0) {
            setError(`CSV parsing errors: ${results.errors[0].message}`);
            return;
          }

          const importedData: TableRow[] = results.data.map((row: any, index: number) => ({
            id: row.id || `imported-${Date.now()}-${index}`,
            name: row.name || '',
            email: row.email || '',
            age: parseInt(row.age) || 0,
            role: row.role || '',
            department: row.department || '',
            location: row.location || '',
            ...row,
          }));

          if (importedData.length === 0) {
            setError('No valid data found in CSV file');
            return;
          }

          dispatch(setData(importedData));
          setSuccess(`Successfully imported ${importedData.length} rows`);
        } catch (err) {
          setError('Failed to process CSV file. Please check the format.');
        }
      },
      error: (err: any) => {
        setError(`Failed to read CSV file: ${err.message}`);
      },
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExport = () => {
    try {
      const visibleColumns = columns.filter((col) => col.visible);

      const exportData = data.map((row) => {
        const exportRow: any = {};
        visibleColumns.forEach((col) => {
          exportRow[col.label] = row[col.id] ?? '';
        });
        return exportRow;
      });

      const csv = Papa.unparse(exportData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `table-export-${new Date().toISOString().split('T')[0]}.csv`);
      setSuccess('CSV file exported successfully');
    } catch (err) {
      setError('Failed to export CSV file');
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleImport}
          style={{ display: 'none' }}
        />
        <Button
          variant="outlined"
          startIcon={<Upload />}
          onClick={() => fileInputRef.current?.click()}
        >
          Import CSV
        </Button>
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={handleExport}
          disabled={data.length === 0}
        >
          Export CSV
        </Button>
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ImportExport;
