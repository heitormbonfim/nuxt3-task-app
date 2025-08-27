import { eq } from "drizzle-orm";
import { z } from "zod";
import { IdParamsSchema } from "../../../lib/utils/constants";
import db from "~/lib/db";
import { tasks } from "~/lib/db/schema";

const UpdateTaskSchema = z.object({
	title: z.string().min(1, "Title cannot be empty").optional(),
	done: z.boolean().optional(),
});

export default defineEventHandler(async (event) => {
	const idResult = await getValidatedRouterParams(event, IdParamsSchema.safeParse);
	if (!idResult.success) {
		throw createError({ statusCode: 422, statusMessage: "Invalid id" });
	}

	const body = await readBody(event);
	const bodyResult = UpdateTaskSchema.safeParse(body);
	if (!bodyResult.success) {
		throw createError({ statusCode: 422, statusMessage: "Invalid request body" });
	}

	const { title, done } = bodyResult.data;

	if (title === undefined && done === undefined) {
		throw createError({ statusCode: 400, statusMessage: "No fields provided for update" });
	}

	try {
		const [updatedTask] = await db.update(tasks)
			.set({
				...(title !== undefined && { title }),
				...(done !== undefined && { done }),
				updatedAt: Date.now(),
			})
			.where(eq(tasks.id, idResult.data.id))
			.returning();

		if (!updatedTask) {
			throw createError({ statusCode: 404, statusMessage: "Task not found" });
		}

		return updatedTask;
	}
	catch (error) {
		console.error("Database update error:", error);
		throw createError({ statusCode: 500, statusMessage: "Internal Server Error" });
	}
});
