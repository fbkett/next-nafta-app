import { getSheetData } from '../../lib/sheets';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    console.log('API: Iniciando solicitud...');
    console.log('Variables de entorno presentes:', {
      hasClientEmail: !!process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      hasPrivateKey: !!process.env.GOOGLE_SHEETS_PRIVATE_KEY,
      hasSpreadsheetId: !!process.env.SPREADSHEET_ID,
      spreadsheetId: process.env.SPREADSHEET_ID // Este es seguro mostrarlo
    });

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
    console.error('Error detallado en API:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      code: error.code,
      response: error.response?.data
    });

    return res.status(500).json({ 
      error: 'Error al obtener las promociones',
      details: {
        message: error.message,
        code: error.code,
        type: error.name
      }
    });
  }
} 