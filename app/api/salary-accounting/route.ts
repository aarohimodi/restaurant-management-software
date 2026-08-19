import { connectDB } from "@/lib/db";

import { calculateSalary } from "@/lib/salary/calculateSalary";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const staffId = searchParams.get("staffId");
    const month = Number(searchParams.get("month"));
    const year = Number(searchParams.get("year"));

    if (!staffId || !month || !year) {
      return Response.json({
        success: false,
        message: "Missing required fields",
      });
    }
    const result = await calculateSalary({
      staffId,
      month,
      year,
    });
    if (!result.success) {
      return Response.json(result);
    }

    return Response.json(result);
  } catch (error) {
    console.error(error);

    return Response.json({
      success: false,
      message: "Something went wrong",
    });
  }
}
