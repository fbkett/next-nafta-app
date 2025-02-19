import { google } from 'googleapis';

export async function getAuthSheets() {
  try {
    // Verificar y loguear las variables de entorno (sin mostrar valores sensibles)
    console.log('Verificando variables de entorno...');
    console.log('GOOGLE_CLIENT_EMAIL exists:', !!process.env.GOOGLE_CLIENT_EMAIL);
    console.log('GOOGLE_PRIVATE_KEY exists:', !!process.env.GOOGLE_PRIVATE_KEY);
    console.log('SHEET_ID exists:', !!process.env.SHEET_ID);
    console.log('SHEET_ID value:', process.env.SHEET_ID); // Este no es sensible, podemos mostrarlo

    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.SHEET_ID) {
      throw new Error('Faltan variables de entorno requeridas');
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file',
      ],
    });

    console.log('Autenticación configurada correctamente');
    const sheets = google.sheets({ version: 'v4', auth });
    return { auth, sheets };
  } catch (error) {
    console.error('Error en getAuthSheets:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    throw error;
  }
}

export async function getSheetData() {
  try {
    console.log('Starting getSheetData...');
    console.log('Spreadsheet ID:', process.env.SPREADSHEET_ID);
    
    const target = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
    const jwt = new google.auth.JWT(
      process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      null,
      // Reemplazamos el salto de línea codificado en la variable de entorno
      process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
      target
    );

    const sheets = google.sheets({ version: 'v4', auth: jwt });
    
    // Primero obtener información sobre las hojas disponibles
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
    });
    
    const availableSheets = spreadsheet.data.sheets.map(sheet => sheet.properties.title);
    console.log('Available sheets:', availableSheets);

    // Usar el nombre de la primera hoja si existe
    const sheetName = availableSheets[0];
    if (!sheetName) {
      throw new Error('No sheets found in the spreadsheet');
    }

    console.log('Using sheet:', sheetName);
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: `${sheetName}!A1:F`, // Cambiado a A1 para incluir los headers
    });

    console.log('Raw response:', response.data);
    const rows = response.data.values;
    
    if (!rows || rows.length === 0) {
      console.log('No rows found in sheet');
      return [];
    }

    console.log('Number of rows found:', rows.length);
    console.log('Headers:', rows[0]);
    console.log('First data row:', rows[1]);

    // Saltamos la primera fila (headers) y convertimos el resto en objetos
    return rows.slice(1).map((row) => ({
      estacion: row[0],
      dia: row[1],
      promocion: row[2],
      descuento: parseInt(row[3]),
      topeGasto: parseInt(row[4]),
      topeDev: parseInt(row[5])
    }));

  } catch (err) {
    console.error('Detailed error:', {
      message: err.message,
      stack: err.stack,
      details: err.response?.data
    });
    throw err;
  }
}