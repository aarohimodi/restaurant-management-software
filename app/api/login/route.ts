import bcrypt from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required.",
        },
        {
          status: 400,
        },
      );
    }
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Email or Password.",
        },
        {
          status: 400,
        },
      );
    }
    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: "Your account is inactive.",
        },
        {
          status: 400,
        },
      );
    }
    console.log("1");
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    console.log("2");
    if (!isPasswordMatched) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Email or Password.",
        },
        {
          status: 400,
        },
      );
    }
    console.log("3");
    // generate token

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      },
    );
    console.log("TOOKKKEEENNN", token);
    console.log("4");
    const response = NextResponse.json({
      success: true,
      message: "Login Successful.",
    });

    // save token
    response.cookies.set("token", token, {
      httpOnly: true,
    });
    console.log("helloooo", response.cookies.get("token"));
    console.log("5");
    return response;
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      {
        status: 500,
      },
    );
  }
}
