export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly action: string | null = null,
  ) {
    super(message);
  }
}

