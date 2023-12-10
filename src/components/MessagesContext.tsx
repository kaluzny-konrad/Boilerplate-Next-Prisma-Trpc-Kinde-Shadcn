import { trpc } from "@/app/_trpc/client";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import axios, { AxiosError } from "axios";
import { Message } from "@prisma/client";

type MessageContextType = {
  addMessage: (message: string) => void;
  message: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
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
  const optimisticMessageId = "optimistic-message";

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await axios.post("/api/message", {
        message,
      });

      return response.data.message;
    },
    onMutate: async ({ message }) => {
      backupMessage.current = message;
      setIsLoading(true);
      setMessage("");

      await utils.getPublicAllMessages.cancel();
      const previousMessages = utils.getPublicAllMessages.getData() ?? [];

      const optimisticMessage = {
        id: optimisticMessageId,
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
        text: message,
        userId: null,
      };

      utils.getPublicAllMessages.setData(undefined, (old) => {
        const oldMessages = old ?? [];
        return [...oldMessages, optimisticMessage];
      });

      return { previousMessages };
    },
    onSuccess: async (newMessage) => {
      utils.getPublicAllMessages.setData(undefined, (old) => {
        let oldMessages = old ?? [];

        oldMessages = oldMessages.filter(
          (message) => message.id !== optimisticMessageId
        );

        return [...oldMessages, newMessage];
      });
    },
    onError: async (error, newMessage, context) => {
      setMessage(backupMessage.current);
      utils.getPublicAllMessages.setData(
        undefined,
        context?.previousMessages ?? []
      );

      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          alert("Try again later");
        }
      }
    },
    onSettled: async () => {
      setIsLoading(false);
      await utils.getPublicAllMessages.invalidate();
    },
  });

  const addMessage = (message: string) => {
    sendMessage({ message });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
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
