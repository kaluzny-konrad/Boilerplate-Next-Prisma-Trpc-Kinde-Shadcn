import React from "react";
import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/server";

type Props = {};

export default function AuthLinks({}: Props) {
  return (
    <div>
      <LoginLink>Sign in</LoginLink>

      <RegisterLink>Sign up</RegisterLink>
    </div>
  );
}
