import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.FAST2SMS_API_KEY;
const number = '8608724931';
const otp = '9988';

console.log('Testing Fast2SMS with API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NONE');

async function testFast2SMS() {
  // Method 1: GET Query String
  try {
    const url1 = `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&route=otp&variables_values=${otp}&flash=0&numbers=${number}`;
    console.log('\nMethod 1 (GET):', url1);
    const res1 = await fetch(url1);
    const data1 = await res1.json();
    console.log('Response 1:', data1);
  } catch (e) {
    console.log('Error 1:', e.message);
  }

  // Method 2: POST JSON
  try {
    console.log('\nMethod 2 (POST):');
    const res2 = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        route: 'otp',
        variables_values: otp,
        numbers: number,
      }),
    });
    const data2 = await res2.json();
    console.log('Response 2:', data2);
  } catch (e) {
    console.log('Error 2:', e.message);
  }

  // Method 3: Quick Transactional Route (q)
  try {
    const url3 = `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&route=q&message=${encodeURIComponent(`Your Midnight Fuel OTP is ${otp}`)}&flash=0&numbers=${number}`;
    console.log('\nMethod 3 (Quick Transactional):', url3);
    const res3 = await fetch(url3);
    const data3 = await res3.json();
    console.log('Response 3:', data3);
  } catch (e) {
    console.log('Error 3:', e.message);
  }
}

testFast2SMS();
