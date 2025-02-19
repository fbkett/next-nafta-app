import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { 
  Container, 
  Typography, 
  Box, 
  Select, 
  MenuItem, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel
} from '@mui/material';

export default function Home() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    async function fetchPromotions() {
      try {
        setLoading(true);
        const response = await fetch('/api/promotions');
        console.log('Response status:', response.status);
        
        const result = await response.json();
        console.log('Data received:', result);
        
        if (!response.ok) {
          throw new Error(result.error || 'Error al cargar los datos');
        }
        
        setPromotions(result.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPromotions();
  }, []);

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('Error al inicializar AdSense:', err);
    }
  }, []);

  const filteredPromotions = filter === 'all' 
    ? promotions 
    : promotions.filter(p => p.estacion === filter);

  return (
    <Layout>
      <Head>
        <title>Promociones de Combustible</title>
        <meta name="description" content="Promociones de combustible en Argentina" />
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1281337810787269" 
          crossOrigin="anonymous">
        </script>
      </Head>

      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        <Box sx={{ mb: { xs: 2, md: 4 }, textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              color: 'primary.light',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' }
            }}
          >
            Promociones de Combustible
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'primary.main',
              fontSize: { xs: '1.25rem', sm: '1.5rem' }
            }}
          >
            Febrero 2025
          </Typography>
        </Box>

        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 2, md: 3 }, 
            mb: { xs: 2, md: 4 }, 
            background: 'linear-gradient(45deg, #1a2027 30%, #132f4c 90%)'
          }}
        >
          <FormControl fullWidth>
            <InputLabel>Filtrar por estación</InputLabel>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              label="Filtrar por estación"
            >
              <MenuItem value="all">Todas las estaciones</MenuItem>
              <MenuItem value="YPF">YPF</MenuItem>
              <MenuItem value="AXION">AXION</MenuItem>
              <MenuItem value="SHELL">SHELL</MenuItem>
            </Select>
          </FormControl>
        </Paper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : (
          <Paper elevation={3} sx={{ overflow: 'hidden' }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Estación</TableCell>
                    <TableCell>Día</TableCell>
                    <TableCell>Promoción</TableCell>
                    <TableCell align="right" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                      Descuento
                    </TableCell>
                    <TableCell align="right" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                      Tope Gasto
                    </TableCell>
                    <TableCell align="right" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                      Tope Dev.
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPromotions.map((promo, index) => (
                    <TableRow 
                      key={index}
                      sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                    >
                      <TableCell>{promo.estacion}</TableCell>
                      <TableCell>{promo.dia}</TableCell>
                      <TableCell>
                        {promo.promocion}
                        {/* Información adicional para móviles */}
                        <Box sx={{ display: { xs: 'block', sm: 'none' }, mt: 1, fontSize: '0.875rem' }}>
                          <div>{promo.descuento}% descuento</div>
                          <div>Tope: ${promo.topeGasto.toLocaleString()}</div>
                          <div>Dev: ${promo.topeDev.toLocaleString()}</div>
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                        {promo.descuento}%
                      </TableCell>
                      <TableCell align="right" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                        ${promo.topeGasto.toLocaleString()}
                      </TableCell>
                      <TableCell align="right" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                        ${promo.topeDev.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        <Paper 
          elevation={3} 
          sx={{ 
            mt: { xs: 2, md: 4 }, 
            p: 2, 
            background: 'linear-gradient(45deg, #1a2027 30%, #132f4c 90%)',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ 
            width: '100%', 
            overflow: 'auto', 
            display: 'flex', 
            justifyContent: 'center' 
          }}>
            <div className="adsbygoogle"
                 style={{ 
                   display: 'inline-block',
                   width: '728px',
                   height: '90px',
                   maxWidth: '100%'
                 }}
                 data-ad-client="ca-pub-1281337810787269"
                 data-ad-slot="TU_SLOT_ID"
                 data-ad-format="horizontal"
                 data-full-width-responsive="true">
            </div>
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
} 