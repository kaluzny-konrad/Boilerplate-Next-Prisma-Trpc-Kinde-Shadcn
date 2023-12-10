'use client'

import { trpc } from "@/app/_trpc/client";
import React from "react";

type Props = {};

export default function Test({}: Props) {
  const { data: test, isLoading } = trpc.getTest.useQuery();

  return <div>{test ? <div>{test}</div> : null}</div>;
}
