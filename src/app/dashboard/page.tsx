import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

type Props = {};

export default async function page({}: Props) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user?.id) {
    return redirect('auth-callback?origin=dashboard')
  }

  return <div>page</div>;
}
