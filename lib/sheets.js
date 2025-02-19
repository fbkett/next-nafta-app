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
    
    // Verificar variables de entorno
    if (!process.env.GOOGLE_SHEETS_CLIENT_EMAIL) {
      throw new Error('GOOGLE_SHEETS_CLIENT_EMAIL no está configurado');
    }
    if (!process.env.GOOGLE_SHEETS_PRIVATE_KEY) {
      throw new Error('GOOGLE_SHEETS_PRIVATE_KEY no está configurado');
    }
    if (!process.env.SPREADSHEET_ID) {
      throw new Error('SPREADSHEET_ID no está configurado');
    }

    console.log('Spreadsheet ID:', process.env.SPREADSHEET_ID);
    
    const target = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
    const jwt = new google.auth.JWT(
      process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
      target
    );

    console.log('JWT creado, intentando conectar con Google Sheets...');
    const sheets = google.sheets({ version: 'v4', auth: jwt });
    
    console.log('Obteniendo información de la hoja...');
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
    });
    
    const availableSheets = spreadsheet.data.sheets.map(sheet => sheet.properties.title);
    console.log('Available sheets:', availableSheets);

    const sheetName = availableSheets[0];
    if (!sheetName) {
      throw new Error('No sheets found in the spreadsheet');
    }

    console.log('Using sheet:', sheetName);
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: `${sheetName}!A1:F`,
    });

    const rows = response.data.values;
    
    if (!rows || rows.length === 0) {
      console.log('No rows found in sheet');
      return [];
    }

    console.log('Number of rows found:', rows.length);

    return rows.slice(1).map((row) => ({
      estacion: row[0],
      dia: row[1],
      promocion: row[2],
      descuento: parseInt(row[3]),
      topeGasto: parseInt(row[4]),
      topeDev: parseInt(row[5])
    }));

  } catch (err) {
    console.error('Error detallado en sheets.js:', {
      message: err.message,
      stack: err.stack,
      code: err.code,
      details: err.response?.data,
      auth: {
        hasClientEmail: !!process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        hasPrivateKey: !!process.env.GOOGLE_SHEETS_PRIVATE_KEY,
        hasSpreadsheetId: !!process.env.SPREADSHEET_ID
      }
    });
    throw err;
  }
}