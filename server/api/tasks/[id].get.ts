import { eq } from "drizzle-orm";
import { z } from "zod";
import db from "~/lib/db";
import { tasks } from "~/lib/db/schema";
import { IdParamsSchema } from "../../../lib/utils/constants";

export default defineEventHandler(async (event) => {
	const result = await getValidatedRouterParams(event, IdParamsSchema.safeParse);

	if (!result.success) {
		return sendError(event, createError({
			statusCode: 422,
			statusMessage: "Invalid id",
		}));
	}

	const task = await db.query.tasks.findFirst({
		where: eq(tasks.id, result.data.id),
	});

	if (!task) {
		return sendError(event, createError({
			statusCode: 404,
			statusMessage: "Task not found",
		}));
	}

	return task;
});
