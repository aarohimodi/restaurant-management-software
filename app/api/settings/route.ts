import { connectDB } from "@/lib/db";
import Settings from "@/models/Settings";

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const existingSettings = await Settings.findOne();
    if (existingSettings) {
      await Settings.findByIdAndUpdate(existingSettings._id, body, {
        new: true,
        runValidators: true,
      });
    } else {
      await Settings.create(body);
    }
    return Response.json({
      success: true,
      message: existingSettings
        ? "Settings updated successfully"
        : "Setting Saved Successfully",
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const settings = await Settings.findOne();
    return Response.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      },
    );
  }
}
