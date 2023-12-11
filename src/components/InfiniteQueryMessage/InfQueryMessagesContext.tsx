import React from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";

type InfQueryMessagesContextType = {
  addMessage: (message: string) => void;
  message: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
};

export const InfQueryMessagesContext =
  React.createContext<InfQueryMessagesContextType>({
    addMessage: () => {},
    message: "",
    handleInputChange: () => {},
    isLoading: false,
  });

interface Props {
  children: React.ReactNode;
}

export const InfQueryMessagesContextProvider = ({ children }: Props) => {
  const [message, setMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const utils = trpc.useUtils();
  const backupMessage = React.useRef("");
  const optimisticMessageId = "optimistic-message";

  const { toast } = useToast();

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

      await utils.getInfiniteQueryMessages.cancel();
      const previousMessages = utils.getInfiniteQueryMessages.getInfiniteData();

      const optimisticMessage = {
        id: optimisticMessageId,
        text: backupMessage.current,
        createdAt: new Date().toISOString(),
        userId: null,
      };

      utils.getInfiniteQueryMessages.setInfiniteData(
        { limit: INFINITE_QUERY_LIMIT },
        (old) => {
          if (!old) {
            return {
              pages: [],
              pageParams: [],
            };
          }

          let newPages = [...old.pages];
          let latestPage = newPages[0]!;
          latestPage.messages = [...latestPage.messages, optimisticMessage];

          newPages[0] = latestPage;

          return { ...old, pages: newPages };
        }
      );

      let newPreviousMessages =
        previousMessages?.pages.flatMap((page) => page.messages) ?? [];

      return { previousMessages: newPreviousMessages };
    },
    onSuccess: async (newMessage) => {
      if (!newMessage)
        return toast({
          title: "Message was not added",
          description: "Try again later",
          variant: "destructive",
        });

      utils.getInfiniteQueryMessages.setInfiniteData(
        { limit: INFINITE_QUERY_LIMIT },
        (old) => {
          if (!old) {
            return {
              pages: [],
              pageParams: [],
            };
          }

          let updatedPages = old.pages.map((page) => {
            let updatedMessages = page.messages.map((message) => {
              if (message.id === optimisticMessageId) {
                return {
                  ...message,
                  id: newMessage.id,
                };
              }
              return message;
            });
            return {
              ...page,
              messages: updatedMessages,
            };
          });

          return {
            ...old,
            pages: updatedPages,
          };
        }
      );
    },
    onError: async (error, newMessage, context) => {
      setMessage(backupMessage.current);
      utils.getInfiniteQueryMessages.setInfiniteData(
        { limit: INFINITE_QUERY_LIMIT },
        (old) => {
          if (!old) {
            return {
              pages: [],
              pageParams: [],
            };
          }

          let newPages = [...old.pages];
          let latestPage = newPages[0]!;
          const previousMessages = context?.previousMessages ?? [];
          latestPage.messages = [...previousMessages];

          newPages[0] = latestPage;

          return { ...old, pages: newPages };
        }
      );

      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          return toast({
            title: "There was a problem sending your message",
            description: "Please refresh this page and try again later",
            variant: "destructive",
          });
        }
      }
    },
    onSettled: async () => {
      console.log("onSettled");
      setIsLoading(false);
      await utils.getInfiniteQueryMessages.invalidate();
    },
  });

  const addMessage = (message: string) => {
    sendMessage({ message });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  return (
    <InfQueryMessagesContext.Provider
      value={{
        addMessage,
        message,
        handleInputChange,
        isLoading,
      }}
    >
      {children}
    </InfQueryMessagesContext.Provider>
  );
};
