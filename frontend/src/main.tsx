import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import { createTheme, ThemeProvider } from "@mui/material";
import { Toaster } from 'react-hot-toast';
import './index.css'
import App from './App.tsx'
import {SessionProvider }from './context/SessionProvider.tsx'

const theme = createTheme({
  typography: {
    fontFamily: 'Roboto, sans-serif',
    allVariants: { color: '#fff' },
  },
  palette: {
    background: {
      default: '#121212', // Set your desired background color here
    },
  },
});


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SessionProvider>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
      <Toaster />
        <App />
      </BrowserRouter>
    </ThemeProvider>
    </SessionProvider>
  </StrictMode>,
)
