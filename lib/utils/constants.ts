import z from "zod";

export const IdParamsSchema = z.object({
	id: z.coerce.number(),
});
