"use client";

import { trpc } from "@/app/_trpc/client";
import React from "react";

type Props = {};

export default function AllMessages({}: Props) {
  const { data: messages, isLoading } = trpc.getPublicAllMessages.useQuery();

  return (
    <div>
      <h1>AllMessages:</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {messages != undefined && messages?.length > 0 ? (
            <>
              {messages?.map((message) => (
                <div key={message.id} className="flex">
                  <p>{message.id}</p>
                  <p>{message.text}</p>
                </div>
              ))}
            </>
          ) : (
            <p>There is no messages.</p>
          )}
        </>
      )}
    </div>
  );
}
