import { getAQI } from './src/services/aqiService.js';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  console.log('WAQI_TOKEN:', process.env.WAQI_TOKEN ? 'Present (starts with ' + process.env.WAQI_TOKEN.substring(0, 5) + ')' : 'MISSING');
  try {
    const data = await getAQI(5.6037, -0.1870);
    console.log('AQI Data:', data);
  } catch (err) {
    console.error('AQI Error Details:', err);
    console.error('Error Message:', err.message);
  }
}

test();
