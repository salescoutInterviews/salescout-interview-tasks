import { google, sheets_v4 } from 'googleapis';
import axios from 'axios';
import { contactInfo } from '../about-me.js';

const getFormattedDate = (): string => {
    const now = new Date();
    const offset = 5 * 60 * 60 * 1000; 
    const localTime = new Date(now.getTime() + offset); 
    return localTime.toLocaleString().replace(/\//g, '.'); 
};

async function getGithubUserInfo(username: string): Promise<any> {
    try {
        const response = await axios.get(`https://api.github.com/users/${username}`);
        const { name, bio, email } = response.data;

        const socialLinks = bio.match(/https?:\/\/[^\s]+/g) || [];
        const tg = socialLinks.filter((link: string | string[]) => link.includes('t.me'));
        return { name, bio, email, tg };
    } catch (error) {
        console.error('Error fetching GitHub user info:', error);
        return { name: null, bio: null, email: null };
    }
}

async function updateSheet(prNumber: string, status: string, duration: string, userInfo: any): Promise<void> {
    if (status === 'failure') {
        return;
    }
    const auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS || ''),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets: sheets_v4.Sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = '1MpbbyrRWijeyqVMm3ZFxcZIzgxr0SzA-E3dXyP4VCLo';
    const range = 'Candidates!A:G';

    const values = [
        [
            prNumber,
            contactInfo.name || 'N/A',
            getFormattedDate(),
            status === 'success' ? '✅' : '❌',
            `${duration} c`,
            contactInfo.bio || 'N/A',
            contactInfo.email || 'N/A',
            contactInfo.phoneNumber || 'N/A',
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

const [,, prNumber, status, duration, username] = process.argv;

getGithubUserInfo(username)
    .then(userInfo => updateSheet(prNumber, status, duration, userInfo))
    .catch(err => console.error('Error:', err));
