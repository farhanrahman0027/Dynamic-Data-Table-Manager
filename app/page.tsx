'use client';

import React, { useState } from 'react';
import { Box, Container, Typography, Button, IconButton, Stack, Chip } from '@mui/material';
import { ViewColumn, Brightness4, Brightness7, TableChart } from '@mui/icons-material';
import DataTable from '@/components/DataTable/DataTable';
import SearchBar from '@/components/DataTable/SearchBar';
import ManageColumnsModal from '@/components/DataTable/ManageColumnsModal';
import ImportExport from '@/components/DataTable/ImportExport';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { toggleTheme } from '@/lib/store/tableSlice';

export default function Home() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.table.theme);
  const data = useAppSelector((state) => state.table.data);
  const [manageColumnsOpen, setManageColumnsOpen] = useState(false);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <TableChart sx={{ fontSize: 40, color: 'primary.main' }} />
              <Box>
                <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 0.5 }}>
                  Dynamic Data Table Manager
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Chip
                    label={`${data.length} rows`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label="Redux Toolkit"
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                  <Chip label="Material UI" size="small" color="info" variant="outlined" />
                </Stack>
              </Box>
            </Stack>
            <IconButton onClick={() => dispatch(toggleTheme())} color="inherit" size="large">
              {theme === 'light' ? <Brightness4 /> : <Brightness7 />}
            </IconButton>
          </Stack>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ xs: 'stretch', sm: 'center' }}
            justifyContent="space-between"
          >
            <Box sx={{ flex: 1, maxWidth: { sm: 500 } }}>
              <SearchBar />
            </Box>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <ImportExport />
              <Button
                variant="contained"
                startIcon={<ViewColumn />}
                onClick={() => setManageColumnsOpen(true)}
              >
                Manage Columns
              </Button>
            </Stack>
          </Stack>
        </Box>

        <DataTable />

        <ManageColumnsModal
          open={manageColumnsOpen}
          onClose={() => setManageColumnsOpen(false)}
        />
      </Container>
    </Box>
  );
}
