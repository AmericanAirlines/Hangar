import { Request, Response } from 'express';
import z, { ZodObject, ZodRawShape, ZodSchema } from 'zod';
import { logger } from './logger';

type ValidatePayloadArgs<T extends ZodObject<ZodRawShape>> = {
  req: Request;
  res: Response;
  schema: T;
  data?: Record<any, any>;
};

type ValidatePayloadError = {
  errorHandled: true;
  data?: undefined;
};
type ValidatedPayload<Schema extends ZodSchema> = {
  data: z.infer<Schema>;
  errorHandled?: undefined;
};

type ValidatePayloadResponse<Schema extends ZodSchema> =
  | ValidatePayloadError
  | ValidatedPayload<Schema>;

/**
 * A validator method designed to validate the payload from a request, evaluate it based on provided schema,
 * handle the error response on validation failure, and then return the processed payload on success.
 * @param req Express `Request` object - the original req object for the request
 * @param res Express `Response` object - the original response object for the request
 * @param schema Zod `Schema` - the schema to use for validation
 * @param data An optional data object to combine with the request's body
 */
export const validatePayload: <T extends ZodObject<ZodRawShape>>(
  args: ValidatePayloadArgs<T>,
) => ValidatePayloadResponse<T> = ({ req, res, schema, data }) => {
  const { body = {} } = req;
  const result = schema.strict().safeParse({ ...body, ...data });

  if (!result.success) {
    const { error } = result;
    const formattedErrorObject = error.format();

    logger.debug(
      `Payload validation failure (${req.method} - ${req.originalUrl})`,
      formattedErrorObject,
    );

    res.status(400).send(formattedErrorObject);
    return { errorHandled: true };
  }

  return { data: result.data };
};
