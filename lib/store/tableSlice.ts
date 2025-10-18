import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TableRow {
  id: string;
  name: string;
  email: string;
  age: number;
  role: string;
  department?: string;
  location?: string;
  [key: string]: any;
}

export interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  sortable: boolean;
}

export interface TableState {
  data: TableRow[];
  columns: ColumnConfig[];
  searchQuery: string;
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc';
  page: number;
  rowsPerPage: number;
  editingRowId: string | null;
  theme: 'light' | 'dark';
}

const defaultColumns: ColumnConfig[] = [
  { id: 'name', label: 'Name', visible: true, sortable: true },
  { id: 'email', label: 'Email', visible: true, sortable: true },
  { id: 'age', label: 'Age', visible: true, sortable: true },
  { id: 'role', label: 'Role', visible: true, sortable: true },
  { id: 'department', label: 'Department', visible: false, sortable: true },
  { id: 'location', label: 'Location', visible: false, sortable: true },
];

const defaultData: TableRow[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', age: 28, role: 'Developer', department: 'Engineering', location: 'New York' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', age: 32, role: 'Designer', department: 'Design', location: 'San Francisco' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', age: 45, role: 'Manager', department: 'Management', location: 'Chicago' },
  { id: '4', name: 'Alice Williams', email: 'alice@example.com', age: 26, role: 'Developer', department: 'Engineering', location: 'Boston' },
  { id: '5', name: 'Charlie Brown', email: 'charlie@example.com', age: 35, role: 'Analyst', department: 'Analytics', location: 'Seattle' },
  { id: '6', name: 'Diana Prince', email: 'diana@example.com', age: 29, role: 'Designer', department: 'Design', location: 'Los Angeles' },
  { id: '7', name: 'Eve Davis', email: 'eve@example.com', age: 31, role: 'Developer', department: 'Engineering', location: 'Austin' },
  { id: '8', name: 'Frank Miller', email: 'frank@example.com', age: 38, role: 'Manager', department: 'Management', location: 'Denver' },
  { id: '9', name: 'Grace Lee', email: 'grace@example.com', age: 27, role: 'Analyst', department: 'Analytics', location: 'Portland' },
  { id: '10', name: 'Henry Wilson', email: 'henry@example.com', age: 42, role: 'Developer', department: 'Engineering', location: 'Phoenix' },
  { id: '11', name: 'Iris Taylor', email: 'iris@example.com', age: 30, role: 'Designer', department: 'Design', location: 'Miami' },
  { id: '12', name: 'Jack Anderson', email: 'jack@example.com', age: 33, role: 'Manager', department: 'Management', location: 'Atlanta' },
];

const loadStateFromLocalStorage = (): Partial<TableState> => {
  if (typeof window === 'undefined') return {};

  try {
    const savedColumns = localStorage.getItem('tableColumns');
    const savedTheme = localStorage.getItem('tableTheme');

    return {
      columns: savedColumns ? JSON.parse(savedColumns) : defaultColumns,
      theme: savedTheme === 'dark' ? 'dark' : 'light',
    };
  } catch (error) {
    return {};
  }
};

const initialState: TableState = {
  data: defaultData,
  columns: defaultColumns,
  searchQuery: '',
  sortColumn: null,
  sortDirection: 'asc',
  page: 0,
  rowsPerPage: 10,
  editingRowId: null,
  theme: 'light',
  ...loadStateFromLocalStorage(),
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<TableRow[]>) => {
      state.data = action.payload;
    },
    addRow: (state, action: PayloadAction<TableRow>) => {
      state.data.push(action.payload);
    },
    updateRow: (state, action: PayloadAction<TableRow>) => {
      const index = state.data.findIndex(row => row.id === action.payload.id);
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },
    deleteRow: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter(row => row.id !== action.payload);
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.page = 0;
    },
    setSorting: (state, action: PayloadAction<{ column: string; direction: 'asc' | 'desc' }>) => {
      state.sortColumn = action.payload.column;
      state.sortDirection = action.payload.direction;
    },
    toggleSortDirection: (state, action: PayloadAction<string>) => {
      if (state.sortColumn === action.payload) {
        state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortColumn = action.payload;
        state.sortDirection = 'asc';
      }
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setRowsPerPage: (state, action: PayloadAction<number>) => {
      state.rowsPerPage = action.payload;
      state.page = 0;
    },
    toggleColumnVisibility: (state, action: PayloadAction<string>) => {
      const column = state.columns.find(col => col.id === action.payload);
      if (column) {
        column.visible = !column.visible;
        if (typeof window !== 'undefined') {
          localStorage.setItem('tableColumns', JSON.stringify(state.columns));
        }
      }
    },
    addColumn: (state, action: PayloadAction<{ id: string; label: string }>) => {
      const exists = state.columns.find(col => col.id === action.payload.id);
      if (!exists) {
        state.columns.push({
          id: action.payload.id,
          label: action.payload.label,
          visible: true,
          sortable: true,
        });
        if (typeof window !== 'undefined') {
          localStorage.setItem('tableColumns', JSON.stringify(state.columns));
        }
      }
    },
    setEditingRowId: (state, action: PayloadAction<string | null>) => {
      state.editingRowId = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem('tableTheme', state.theme);
      }
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('tableTheme', state.theme);
      }
    },
  },
});

export const {
  setData,
  addRow,
  updateRow,
  deleteRow,
  setSearchQuery,
  setSorting,
  toggleSortDirection,
  setPage,
  setRowsPerPage,
  toggleColumnVisibility,
  addColumn,
  setEditingRowId,
  toggleTheme,
  setTheme,
} = tableSlice.actions;

export default tableSlice.reducer;
