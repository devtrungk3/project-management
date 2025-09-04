import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
const theme = createTheme({
  typography: {
    fontFamily: '"Fire Code", monospace',
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <App />
        <ToastContainer />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
