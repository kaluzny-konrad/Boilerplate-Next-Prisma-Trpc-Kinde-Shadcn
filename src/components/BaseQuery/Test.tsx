"use client";

import React from "react";
import { trpc } from "@/app/_trpc/client";

type Props = {};

export default function Test({}: Props) {
  const { data: test, isLoading } = trpc.getTest.useQuery();

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>{test ? <p>{test}</p> : <p>There is no text.</p>}</>
      )}
    </div>
  );
}
