import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const adminEmail = "kumarprem03591@gmail.com";
  const adminPassword = "AdminPassword123!";

  try {
    console.log("Attempting to create admin account:", adminEmail);
    
    // Better Auth 0.3.0 server-side API call
    const result = await auth.api.signUpEmail({
      body: {
        name: "Admin User",
        email: adminEmail,
        password: adminPassword,
      },
    });

    return NextResponse.json({
      success: true,
      message: "✅ Admin created successfully!",
      user: result.user
    });
  } catch (err: any) {
    console.error("Setup Error:", err);
    
    // If it already exists, that's also a success for our purpose
    if (err.message?.includes("already exists") || err.status === 422) {
      return NextResponse.json({
        success: true,
        message: "Admin already exists. You can login now."
      });
    }

    return NextResponse.json({
      success: false,
      error: err.message,
      details: "Check server logs for full error"
    }, { status: 500 });
  }
}
