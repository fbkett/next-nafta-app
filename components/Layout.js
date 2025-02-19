import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
      light: '#e3f2fd',
      dark: '#42a5f5',
    },
    secondary: {
      main: '#82b1ff',
    },
    background: {
      default: '#0a1929', // Fondo principal oscuro
      paper: '#1a2027',
    },
    text: {
      primary: '#ffffff',
      secondary: '#90caf9',
    },
  },
});

export default function Layout({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Esto resetea los estilos y aplica el fondo oscuro */}
      {children}
    </ThemeProvider>
  );
} 