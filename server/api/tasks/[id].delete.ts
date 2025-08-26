import { eq } from "drizzle-orm";
import db from "../../../lib/db";
import { IdParamsSchema } from "../../../lib/utils/constants";
import { tasks } from "../../../lib/db/schema";

export default defineEventHandler(async (event) => {
  const result = await getValidatedRouterParams(event, IdParamsSchema.safeParse);

  if (!result.success) {
    return sendError(event, createError({
      statusCode: 422,
      statusMessage: "Invalid id",
    }));
  }

  try {
    const [deletedTask] = await db.delete(tasks)
      .where(eq(tasks.id, result.data.id))
      .returning();

    if (!deletedTask) {
      return sendError(event, createError({
        statusCode: 404,
        statusMessage: "Task not found"
      }));
    }

    return sendNoContent(event);
  } catch (err) {
    console.error("Database error during task deletion:", err);
    
    return sendError(event, createError({
      statusCode: 500,
      statusMessage: "Internal Server Error"
    }));
  }
});