"use client";

import React from "react";
import { useIntersection } from "@mantine/hooks";
import { format } from "date-fns";
import { Loader2Icon } from "lucide-react";
import { trpc } from "@/app/_trpc/client";
import { InfQueryMessagesContext } from "@/components/InfiniteQueryMessage/InfQueryMessagesContext";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = {};

export default function InfQueryAllMessages({}: Props) {
  const { isLoading: isAskingMessage } = React.useContext(
    InfQueryMessagesContext
  );

  const { data, isLoading, fetchNextPage } =
    trpc.getInfiniteQueryMessages.useInfiniteQuery(
      {
        limit: INFINITE_QUERY_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        keepPreviousData: true,
      }
    );

  const messages = data?.pages.flatMap((page) => page.messages) ?? [];

  const loadingMessage = {
    createdAt: new Date().toISOString(),
    id: "loading",
    text: (
      <span className="flex items-center justify-center h-full">
        <Loader2Icon className="w-4 h-4 animate-spin" />
      </span>
    ),
    userId: null,
  };

  const combinedMessages = [
    ...(isLoading ? [loadingMessage] : []),
    ...messages,
  ];

  const lastMessageRef = React.useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({
    root: lastMessageRef.current,
    threshold: 1,
  });

  React.useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage, isAskingMessage]);

  return (
    <div>
      <h1>AllMessages:</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {combinedMessages != undefined && combinedMessages?.length > 0 ? (
            <>
              <Table>
                <TableCaption>A list of recent messages.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Id</TableHead>
                    <TableHead>Text</TableHead>
                    <TableHead>CreatedAt</TableHead>
                    <TableHead>UserId</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {combinedMessages?.reverse().map((message) => (
                    <TableRow key={message.id} ref={ref}>
                      <TableCell>{message.id}</TableCell>
                      <TableCell>{message.text}</TableCell>
                      <TableCell>
                        {format(new Date(message.createdAt), "HH:mm")}
                      </TableCell>
                      <TableCell>
                        {message.userId ? "logged" : "anonim"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          ) : (
            <p>There is no messages.</p>
          )}
        </>
      )}
    </div>
  );
}
