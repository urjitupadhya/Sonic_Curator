const BASE_URL = "http://localhost:3000";
const ADMIN_EMAIL = "kumarprem03591@gmail.com";
const ADMIN_PASSWORD = "AdminPassword123!";

async function createAdmin() {
  try {
    console.log("Step 1: Getting CSRF token...");
    
    const csrfRes = await fetch(`${BASE_URL}/api/auth/csrf`);
    const csrfData = await csrfRes.json();
    const csrfToken = csrfData.csrfToken || csrfData.token;
    const cookies = csrfRes.headers.get("set-cookie") || "";
    
    console.log("✅ CSRF Token obtained");

    console.log("Step 2: Creating account...");
    
    const signupRes = await fetch(`${BASE_URL}/api/auth/sign-up/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": cookies,
      },
      body: JSON.stringify({
        name: "Admin User",
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      }),
    });

    const signupData = await signupRes.json();

    if (signupRes.ok) {
      console.log("\n✅ Account created successfully!");
      console.log(`   Email:    ${ADMIN_EMAIL}`);
      console.log(`   Password: ${ADMIN_PASSWORD}`);
      console.log(`\n🔗 Login at: ${BASE_URL}`);
    } else {
      console.log("\nStatus:", signupRes.status);
      console.log("Response:", JSON.stringify(signupData, null, 2));
      
      if (signupData.message?.includes("already") || signupRes.status === 422) {
        console.log("ℹ️  Account already exists. Try logging in!");
      }
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

createAdmin();
