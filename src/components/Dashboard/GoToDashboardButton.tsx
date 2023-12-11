import React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

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
