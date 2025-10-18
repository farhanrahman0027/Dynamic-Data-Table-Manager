'use client';

import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setSearchQuery } from '@/lib/store/tableSlice';

const SearchBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.table.searchQuery);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(event.target.value));
  };

  return (
    <TextField
      fullWidth
      placeholder="Search all fields..."
      value={searchQuery}
      onChange={handleSearchChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
      }}
      variant="outlined"
      size="medium"
    />
  );
};

export default SearchBar;
