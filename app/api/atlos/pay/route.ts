import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { merchantId, orderId, orderAmount } = await request.json();

    // Verify the environment variables
    const atlosApiSecret = process.env.ATLOS_API_SECRET;
    if (!atlosApiSecret) {
      throw new Error("ATLOS_API_SECRET environment variable not set.");
    }

    // Implement your payment processing logic here
    // This is a placeholder, replace with your actual implementation
    console.log("Processing payment:", { merchantId, orderId, orderAmount });

    // Replace this with your actual payment processing logic
    const paymentResult = {
      success: true,
      message: "Payment processed successfully!",
    };

    return NextResponse.json(paymentResult);
  } catch (error: any) {
    console.error("Error processing payment:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}