import fs from 'fs';
import path from 'path';

const BASE_URL = "http://localhost:3000";

function getCookies(res) {
  if (res.headers.getSetCookie) {
    return res.headers.getSetCookie().map(c => c.split(';')[0]).join('; ');
  }
  const setCookie = res.headers.get("set-cookie");
  if (!setCookie) return "";
  return setCookie.split(',').map(c => c.split(';')[0]).join('; ');
}

async function testUpload(fileName, cookies) {
  const filePath = path.resolve('test_data', fileName);
  if (!fs.existsSync(filePath)) {
    console.error(`File ${filePath} does not exist.`);
    return;
  }
  
  const fileStats = fs.statSync(filePath);
  console.log(`Testing upload of ${fileName} (${(fileStats.size / (1024 * 1024)).toFixed(2)} MB)...`);

  const formData = new FormData();
  const fileData = fs.readFileSync(filePath);
  const blob = new Blob([fileData], { type: 'text/csv' });
  formData.append('file', blob, fileName);

  const start = Date.now();
  const uploadRes = await fetch(`${BASE_URL}/api/upload`, {
    method: 'POST',
    headers: {
      'Cookie': cookies,
    },
    body: formData,
  });

  const duration = Date.now() - start;
  const result = await uploadRes.json();
  
  if (uploadRes.ok) {
    console.log(`✅ Upload Success in ${duration}ms! Result:`, result);
  } else {
    console.error(`❌ Upload Failed in ${duration}ms. Error:`, result);
  }
}

async function run() {
  const user = {
    name: "Tester",
    email: `tester_${Date.now()}@example.com`,
    password: "Password123!",
    confirmPassword: "Password123!",
  };

  await fetch(`${BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  const csrfRes = await fetch(`${BASE_URL}/api/auth/csrf`);
  let cookies = getCookies(csrfRes);
  const csrfToken = (await csrfRes.json()).csrfToken;

  const loginRes = await fetch(`${BASE_URL}/api/auth/callback/credentials`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": cookies,
    },
    body: new URLSearchParams({
      email: user.email,
      password: user.password,
      csrfToken,
      json: "true",
    }),
    redirect: "manual",
  });
  
  const loginCookies = getCookies(loginRes);
  if (loginCookies) cookies = cookies ? `${cookies}; ${loginCookies}` : loginCookies;

  await testUpload('valid.csv', cookies);
  console.log('-----------------------------');
  await testUpload('big_file_100k.csv', cookies);
  console.log('-----------------------------');
  // Only test 100k for speed, but will do 300k if needed.
}

run().catch(console.error);
