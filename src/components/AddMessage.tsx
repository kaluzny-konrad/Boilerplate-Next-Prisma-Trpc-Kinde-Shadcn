import React from "react";
import { MessagesContext } from "./MessagesContext";

type Props = {};

export default function AddMessage({}: Props) {
  const { addMessage, isLoading, handleInputChange } = React.useContext(MessagesContext);

  return <div>
    <Textarea id="input" onChange={handleInputChange}>
    <button onClick={() => addMessage("test")}>Add</button>
  </div>;
}
