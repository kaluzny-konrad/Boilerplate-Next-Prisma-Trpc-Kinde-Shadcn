import { trpc } from "@/app/_trpc/client";
import { Message } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { randomUUID } from "crypto";
import React from "react";

type MessageContextType = {
  addMessage: (message: string) => void;
  message: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
};

export const MessagesContext = React.createContext<MessageContextType>({
  addMessage: () => {},
  message: "",
  handleInputChange: () => {},
  isLoading: false,
});

interface Props {
  children: React.ReactNode;
}

export const MessagesContextProvider = ({ children }: Props) => {
  const [message, setMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const utils = trpc.useUtils();
  const backupMessage = React.useRef("");

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await fetch(`/api/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.body;
    },
    onMutate: async ({ message }) => {
      setIsLoading(true);
      backupMessage.current = message;
      setMessage("");

      await utils.getPublicAllMessages.cancel();
      const previousMessages = utils.getPublicAllMessages.getData() ?? [];

      const newMessage = {
        id: randomUUID(),
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
        text: message,
        userId: null,
      };

      utils.getPublicAllMessages.setData(undefined, (old) => {
        const oldMessages = old ?? [];
        return [...oldMessages, newMessage];
      });

      return { previousMessages };
    },
    onSuccess: async (stream) => {
      setIsLoading(false);
      if (!stream) return;

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accResponse = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        accResponse += chunkValue;

        utils.getPublicAllMessages.setData(undefined, (old) => {
          const oldMessages = old ?? [];
          return [...oldMessages, JSON.parse(accResponse)];
        });
      }
    },
    onError: async (err, newMessage, context) => {
      setIsLoading(false);
      setMessage(backupMessage.current);
      utils.getPublicAllMessages.setData(
        undefined,
        context?.previousMessages ?? []
      );
    },
    onSettled: async () => {
      setIsLoading(false);
      await utils.getPublicAllMessages.invalidate();
    },
  });

  const addMessage = (message: string) => {
    sendMessage({ message });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  return (
    <MessagesContext.Provider
      value={{
        addMessage,
        message,
        handleInputChange,
        isLoading,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};
