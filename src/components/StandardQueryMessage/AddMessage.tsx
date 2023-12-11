"use client";

import React from "react";
import { MessagesContext } from "@/components/StandardQueryMessage/MessagesContext";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Props = {};

export default function AddMessage({}: Props) {
  const { addMessage, isLoading, handleInputChange, message } =
    React.useContext(MessagesContext);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  return (
    <div>
      <Textarea
        rows={1}
        autoFocus
        placeholder="Enter your question..."
        ref={textareaRef}
        value={message}
        onChange={handleInputChange}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            addMessage(message);
            textareaRef.current?.focus();
          }
        }}
        className="mb-2"
      />
      <Button
        onClick={() => {
          addMessage(message);
          textareaRef.current?.focus();
        }}
        disabled={isLoading}
        aria-label="send message"
      >
        Add
      </Button>
    </div>
  );
}
