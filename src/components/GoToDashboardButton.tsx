import React from "react";
import { buttonVariants } from "./ui/button";
import Link from "next/link";

type Props = {};

export default function GoToDashboardButton({}: Props) {
  return (
    <Link
      href="/dashboard"
      className={buttonVariants({
        size: "sm",
        variant: "ghost"
      })}
    >
      Go to Dashboard (logged only)
    </Link>
  );
}
