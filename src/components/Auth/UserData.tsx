import React from "react";
import {
  LogoutLink,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
import AuthLinks from "@/components/Auth/AuthLinks";

type Props = {};

export default async function UserData({}: Props) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <div>
      {user ? (
        <>
          <div>{user.email}</div>
          <LogoutLink>Sign out</LogoutLink>
        </>
      ) : (
        <>
          <AuthLinks />
        </>
      )}
    </div>
  );
}
