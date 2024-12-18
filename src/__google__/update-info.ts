import { google, sheets_v4 } from 'googleapis';
import axios from 'axios';

async function getGithubUserInfo(username: string): Promise<any> {
    try {
        const response = await axios.get(`https://api.github.com/users/${username}`);
        const { name, bio, email } = response.data;
        return { name, bio, email };
    } catch (error) {
        console.error('Error fetching GitHub user info:', error);
        return { name: null, bio: null, email: null };
    }
}

async function updateSheet(prNumber: string, status: string, duration: string, userInfo: any): Promise<void> {
    const auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS || ''),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets: sheets_v4.Sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = '1MpbbyrRWijeyqVMm3ZFxcZIzgxr0SzA-E3dXyP4VCLo';
    const range = 'Sheet1!A:F'; // Добавьте новые колонки для имени, bio и email

    const values = [
        [
            prNumber,
            status,
            duration,
            new Date().toLocaleString(),
            userInfo.name || 'N/A',
            userInfo.bio || 'N/A',
            userInfo.email || 'N/A',
        ],
    ];

    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: spreadsheetId,
            range: range,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values },
        });
        console.log('Google Sheet updated successfully!');
    } catch (error) {
        console.error('Failed to update Google Sheet:', error);
    }
}

// Получаем аргументы командной строки
const [,, prNumber, status, duration, username] = process.argv;

// Вызываем функции
getGithubUserInfo(username)
    .then(userInfo => updateSheet(prNumber, status, duration, userInfo))
    .catch(err => console.error('Error:', err));
