import z from 'zod';
import { validatePayload } from '../../src/utils/validatePayload';
import { createMockRequest } from '../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../testUtils/expressHelpers/createMockResponse';

describe('validatePayload', () => {
  it('validates a payload and returns it meaningfully', () => {
    const req = createMockRequest({ body: { someData: false } });
    const res = createMockResponse();
    const schema = z.object({
      someData: z.boolean(),
    });

    const { errorHandled, data } = validatePayload<typeof schema>({
      req: req as any,
      res: res as any,
      schema,
    });

    if (errorHandled) {
      throw new Error('Expected success and received error');
    }

    expect(data.someData).toEqual(false);
  });

  it('handles validation failure and returns a formatted error object', () => {
    const dataKeyName = 'someData';
    const req = createMockRequest({ body: { [dataKeyName]: 'false' } });
    const res = createMockResponse();
    const schema = z.object({
      someData: z.boolean(),
    });

    const { errorHandled } = validatePayload<typeof schema>({
      req: req as any,
      res: res as any,
      schema,
    });

    expect(errorHandled).toBe(true);
    expect(res.send).toBeCalledWith(
      expect.objectContaining({
        [dataKeyName]: expect.objectContaining({ _errors: ['Expected boolean, received string'] }),
      }),
    );
  });

  it('disallows unknown keys', () => {
    const unknownKeyName = 'someData';
    const req = createMockRequest({ body: { [unknownKeyName]: false } });
    const res = createMockResponse();
    const schema = z.object({});

    const { errorHandled } = validatePayload<typeof schema>({
      req: req as any,
      res: res as any,
      schema,
    });

    expect(errorHandled).toBe(true);
    expect(res.send).toBeCalledWith(
      expect.objectContaining({
        _errors: expect.arrayContaining([`Unrecognized key(s) in object: '${unknownKeyName}'`]),
      }),
    );
  });

  it('optionally validates provided data in addition to the request body', () => {
    const req = createMockRequest({ body: { someData: false } });
    const res = createMockResponse();
    const schema = z.object({
      someData: z.boolean(),
    });

    const { errorHandled, data } = validatePayload<typeof schema>({
      req: req as any,
      res: res as any,
      schema,
      data: { someData: true },
    });

    if (errorHandled) {
      throw new Error('Expected success and received error');
    }

    expect(data.someData).toEqual(true);
  });
});
