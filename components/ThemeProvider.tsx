'use client';

import React, { useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useAppSelector } from '@/lib/store/hooks';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProviderWrapper: React.FC<ThemeProviderProps> = ({ children }) => {
  const mode = useAppSelector((state) => state.table.theme);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? '#0F766E' : '#14B8A6',
            light: mode === 'light' ? '#14B8A6' : '#2DD4BF',
            dark: mode === 'light' ? '#0D9488' : '#0F766E',
          },
          secondary: {
            main: mode === 'light' ? '#DC2626' : '#F87171',
            light: mode === 'light' ? '#EF4444' : '#FCA5A5',
            dark: mode === 'light' ? '#B91C1C' : '#DC2626',
          },
          background: {
            default: mode === 'light' ? '#F8FAFC' : '#0F172A',
            paper: mode === 'light' ? '#FFFFFF' : '#1E293B',
          },
          text: {
            primary: mode === 'light' ? '#1E293B' : '#F1F5F9',
            secondary: mode === 'light' ? '#475569' : '#94A3B8',
          },
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h4: {
            fontWeight: 700,
            letterSpacing: '-0.02em',
          },
          h6: {
            fontWeight: 600,
          },
          button: {
            textTransform: 'none',
            fontWeight: 500,
          },
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                padding: '8px 16px',
              },
              contained: {
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none',
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              head: {
                fontWeight: 600,
                backgroundColor: mode === 'light' ? '#F1F5F9' : '#334155',
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProviderWrapper;
