import { z } from 'zod';

export const ContractionSchema = z.object({
  id: z.string(),
  startTime: z.number().nonnegative(),
  endTime: z.number().nonnegative().nullable(),
});

export const ContractionSetSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  contractions: z.array(ContractionSchema),
  createdAt: z.number().nonnegative(),
});

export const ContractionsArraySchema = z.array(ContractionSchema);
export const SetsArraySchema = z.array(ContractionSetSchema);

export type ValidatedContraction = z.infer<typeof ContractionSchema>;
export type ValidatedContractionSet = z.infer<typeof ContractionSetSchema>;

export function validateContractions(data: unknown): ValidatedContraction[] {
  if (data === null || data === undefined) {
    return [];
  }
  return ContractionsArraySchema.parse(data);
}

export function validateSets(data: unknown): ValidatedContractionSet[] {
  if (data === null || data === undefined) {
    return [];
  }
  return SetsArraySchema.parse(data);
}
