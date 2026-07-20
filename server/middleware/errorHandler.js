import { ZodError } from "zod";

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) return next(error);

  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Please correct the highlighted fields.",
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (error?.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid record ID.",
    });
  }

  if (error?.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "A record with this value already exists.",
    });
  }

  const status = Number(error.status || error.statusCode || 500);
  const message =
    status >= 500
      ? "Something went wrong on the server. Please try again."
      : error.message;

  if (status >= 500) console.error(error);

  return res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && status >= 500
      ? { detail: error.message }
      : {}),
  });
};
