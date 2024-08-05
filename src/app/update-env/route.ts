import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import { exec } from 'child_process';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { envData } = req.body;
    const envPath = path.resolve(process.cwd(), '.env');

    try {
      // Write new environment variables to .env file
      fs.writeFileSync(envPath, envData, 'utf8');

      // Restart the server
      exec('pm2 restart server.js', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error restarting server: ${error.message}`);
          return res.status(500).json({ success: false, error: error.message });
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return res.status(500).json({ success: false, error: stderr });
        }
        console.log(`Server restarted successfully: ${stdout}`);
        res.status(200).json({ success: true, message: 'Server restarted successfully' });
      });
    } catch (error) {
      console.error('Error updating .env file:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
