import { getSheetData } from '../../lib/sheets.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const promotions = await getSheetData();
    
    if (!promotions || promotions.length === 0) {
      return res.status(404).json({ 
        error: 'No se encontraron promociones',
        timestamp: new Date().toISOString()
      });
    }
    
    res.setHeader('Cache-Control', 's-maxage=3600');
    res.status(200).json({
      data: promotions,
      timestamp: new Date().toISOString(),
      count: promotions.length
    });
  } catch (error) {
    console.error('Error in API:', error);
    res.status(500).json({ 
      error: 'Error al obtener las promociones',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
} 