// using native fetch

async function debugAuth() {
  console.log("1. Fetching CSRF token...");
  const csrfRes = await fetch("http://localhost:3000/api/auth/csrf");
  const csrfData = await csrfRes.json();
  const csrfToken = csrfData.csrfToken;

  const setCookie = csrfRes.headers.get('set-cookie');
  const sessionCookie = setCookie ? setCookie.split(',').map(c => c.split(';')[0]).join('; ') : '';

  console.log("CSRF Token:", csrfToken);
  console.log("Initial Cookies:", sessionCookie);

  console.log("\n2. Attempting Login...");
  const loginRes = await fetch("http://localhost:3000/api/auth/callback/credentials", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": sessionCookie,
    },
    body: new URLSearchParams({
      email: "agent_new@example.com",
      password: "password123",
      csrfToken: csrfToken,
      callbackUrl: "http://localhost:3000/dashboard",
      json: "true"
    }),
  });

  const loginData = await loginRes.json();
  console.log("Login Response:", loginData);

  const setCookie2 = loginRes.headers.get('set-cookie');
  console.log("New Cookies after login:", setCookie2);

  let finalCookies = sessionCookie;
  if (setCookie2) {
    finalCookies = setCookie2.split(',').map(c => c.split(';')[0]).join('; ');
  }

  console.log("\n3. Fetching Session...");
  const sessionRes = await fetch("http://localhost:3000/api/auth/session", {
    headers: {
      "Cookie": finalCookies,
    }
  });

  const sessionData = await sessionRes.json();
  console.log("Session Data:", JSON.stringify(sessionData, null, 2));

  console.log("\n4. Testing /api/upload...");
  const uploadsRes = await fetch("http://localhost:3000/api/upload", {
    headers: {
      "Cookie": finalCookies,
    }
  });
  console.log("Uploads Response Status:", uploadsRes.status);
  if (!uploadsRes.ok) {
    console.log("Uploads Response:", await uploadsRes.text());
  } else {
    console.log("Uploads Data:", await uploadsRes.json());
  }
}

debugAuth().catch(console.error);
