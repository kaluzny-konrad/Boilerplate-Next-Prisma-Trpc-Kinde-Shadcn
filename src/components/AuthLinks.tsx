import React from "react";
import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { buttonVariants } from "./ui/button";

type Props = {};

export default function AuthLinks({}: Props) {
  return (
    <div className="flex gap-2">
      <LoginLink
        className={buttonVariants({
          size: "sm",
        })}
      >
        Sign in
      </LoginLink>

      <RegisterLink
        className={buttonVariants({
          variant: "ghost",
          size: "sm",
        })}
      >
        Sign up
      </RegisterLink>
    </div>
  );
}
