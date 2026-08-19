import { connectDB } from "@/lib/db";
import Cashbook from "@/models/Cashbook";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = await request.json();
    const { staff, amount, remarks } = body;
    const cashbook = await Cashbook.findById(id);
    if (!cashbook) {
      return Response.json(
        {
          success: false,
          message: "Entry not found",
        },
        {
          status: 404,
        },
      );
    }
    cashbook.staff = staff || null;
    cashbook.amount = amount;
    cashbook.remarks = remarks;
    await cashbook.save();
    return Response.json({
      success: true,
      message: "Entry updated successfully",
    });
  } catch (error) {
    console.error(error);

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

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const cashbook = await Cashbook.findById(id);
    if (!cashbook) {
      return Response.json(
        {
          success: false,
          message: "Entry not found",
        },
        {
          status: 404,
        },
      );
    }
    cashbook.isDeleted = true;
    await cashbook.save();
    return Response.json({
      success: true,
      message: "Entry deleted successfully",
    });
  } catch (error) {
    console.error(error);

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
