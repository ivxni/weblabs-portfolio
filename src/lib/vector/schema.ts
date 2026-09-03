import { z } from 'zod';

export const vectorMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z
    .string()
    .trim()
    .min(1, 'Eine leere Nachricht kann nicht gesendet werden.')
    .max(1200, 'Die Nachricht darf höchstens 1.200 Zeichen lang sein.'),
});

export const vectorRequestSchema = z
  .object({
    messages: z.array(vectorMessageSchema).min(1).max(8),
  })
  .superRefine(({ messages }, context) => {
    if (messages.at(-1)?.role !== 'user') {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['messages'],
        message: 'Die letzte Nachricht muss vom Nutzer stammen.',
      });
    }

    const totalLength = messages.reduce((sum, message) => sum + message.content.length, 0);
    if (totalLength > 6000) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['messages'],
        message: 'Der Gesprächsverlauf ist zu lang.',
      });
    }
  });

export type VectorMessage = z.infer<typeof vectorMessageSchema>;
export type VectorRequest = z.infer<typeof vectorRequestSchema>;
