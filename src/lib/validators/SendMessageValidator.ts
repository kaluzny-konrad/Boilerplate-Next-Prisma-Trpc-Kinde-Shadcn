import { z } from "zod";

export const SendMessageValidator = z.object({
  message: z.string(),
});
