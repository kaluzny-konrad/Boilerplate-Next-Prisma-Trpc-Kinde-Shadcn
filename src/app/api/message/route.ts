import { db } from "@/db";
import { SendMessageValidator } from "@/lib/validators/SendMessageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { message } = SendMessageValidator.parse(body);

  await new Promise((resolve) => setTimeout(resolve, 2000));
  if (message === "err")
    return new NextResponse("Message was not saved.", { status: 400 });

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const createdMessage = await db.message.create({
    data: {
      text: message,
      userId: user?.id,
    },
  });

  return new NextResponse(
    JSON.stringify({
      message: createdMessage,
    }),
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );
};
