export default defineEventHandler(async (_event) => {
  await new Promise<void>((resolve) => setTimeout(resolve, 2000));

  // return sendError(
  //   _event,
  //   createError({
  //     statusCode: 500,
  //     statusMessage: "Internal Server error",
  //   })
  // );

  return [
    {
      id: 1,
      title: "Learn Nuxt",
      done: false,
    },
    {
      id: 2,
      title: "Learn Vue",
      done: false,
    },
  ];
});
