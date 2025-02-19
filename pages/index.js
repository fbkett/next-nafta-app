import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

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
    <div className={styles.container}>
      <Head>
        <title>Promociones de Combustible</title>
        <meta name="description" content="Promociones de combustible en Argentina" />
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1281337810787269" 
          crossOrigin="anonymous">
        </script>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Promociones de Combustible - Febrero 2025
        </h1>

        <div className={styles.filters}>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className={styles.select}
          >
            <option value="all">Todas las estaciones</option>
            <option value="YPF">YPF</option>
            <option value="AXION">AXION</option>
            <option value="SHELL">SHELL</option>
          </select>
        </div>

        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Cargando promociones...</p>
          </div>
        ) : (
          <>
            {error && <p className={styles.error}>Error: {error}</p>}
            
            {!loading && !error && (
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Estación</th>
                      <th>Día</th>
                      <th>Promoción</th>
                      <th>Descuento</th>
                      <th>Tope Gasto</th>
                      <th>Tope Devolución</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPromotions.map((promo, index) => (
                      <tr key={index}>
                        <td>{promo.estacion}</td>
                        <td>{promo.dia}</td>
                        <td>{promo.promocion}</td>
                        <td>{promo.descuento}%</td>
                        <td>${promo.topeGasto.toLocaleString()}</td>
                        <td>${promo.topeDev.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        <div className={styles.adSpaceFooter}>
          <ins className="adsbygoogle"
               style={{ 
                 display: 'inline-block',
                 width: '728px',
                 height: '90px'
               }}
               data-ad-client="ca-pub-1281337810787269"
               data-ad-slot="TU_SLOT_ID"
               data-ad-format="horizontal"
               data-full-width-responsive="false"></ins>
        </div>
      </main>
    </div>
  );
} 