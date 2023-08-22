import { Request, Response } from 'express';
import z, { Schema, ZodObject, ZodRawShape, ZodSchema } from 'zod';
import { logger } from './logger';

type ValidatePayloadArgs = {
  req: Request;
  res: Response;
  schema: ZodObject<ZodRawShape>;
  data?: Record<any, any>;
};

type ValidatePayloadError = {
  errorHandled: true;
  data: undefined;
};
type ValidatedPayload<Schema extends ZodSchema> = {
  data: z.infer<Schema>;
  errorHandled: false;
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
export const validatePayload: <T extends Schema>(
  args: ValidatePayloadArgs,
) => ValidatePayloadResponse<T> = ({ req, res, schema, data }: ValidatePayloadArgs) => {
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
    return { errorHandled: true, data: undefined };
  }

  return { data: result.data, errorHandled: false };
};
