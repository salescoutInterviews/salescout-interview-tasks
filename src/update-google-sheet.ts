// update-google-sheet.ts
import { google, sheets_v4 } from 'googleapis';
import * as fs from 'fs';

async function updateSheet(prNumber: string, status: string, duration: string): Promise<void> {
    const auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS || ''),
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets: sheets_v4.Sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = 'your-sheet-id';
    const range = 'Sheet1!A:D'; // Где будет вставлена информация

    const values = [
        [prNumber, status, duration, new Date().toLocaleString()]
    ];

    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: spreadsheetId,
            range: range,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: values
            }
        });
        console.log('Google Sheet updated successfully!');
    } catch (error) {
        console.error('Failed to update Google Sheet:', error);
    }
}

// Получаем аргументы командной строки
const [,, prNumber, status, duration] = process.argv;

// Вызываем функцию
updateSheet(prNumber, status, duration)
    .catch(err => console.error('Error:', err));
