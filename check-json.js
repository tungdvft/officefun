import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Xác định thư mục hiện tại
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Thư mục chứa file JSON
const jsonDir = path.join(__dirname, 'data/personal-day');

async function checkJsonFiles() {
  try {
    const files = await fs.readdir(jsonDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    for (const file of jsonFiles) {
      const filePath = path.join(jsonDir, file);
      try {
        const content = await fs.readFile(filePath, 'utf8');
        JSON.parse(content); // Thử parse JSON
        console.log(`${file}: Valid JSON`);
      } catch (error) {
        console.error(`${file}: Invalid JSON - ${error.message}`);
      }
    }
  } catch (err) {
    console.error('Error reading directory:', err.message);
  }
}

checkJsonFiles();