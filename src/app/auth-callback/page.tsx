"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { trpc } from "@/app/_trpc/client";

type Props = {};

export default function page({}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  trpc.authCallback.useQuery(undefined, {
    onSuccess: (isSuccess) => {
      console.log("isSuccess", isSuccess);
      if (isSuccess) {
        router.push(origin ? `/${origin}` : "/dashboard");
      }
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        router.push("/sign-in");
      }
    },
    retry: 3,
    retryDelay: 1000,
  });

  return <div>Syncing account...</div>;
}
