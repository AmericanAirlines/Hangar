import { localRedirect } from '../../../../../../src/api/auth/callback/slack/utils/localRedirect';
import { logger } from '../../../../../../src/utils/logger';
import { createMockRequest } from '../../../../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../../../../testUtils/expressHelpers/createMockResponse';
import { mockEnv } from '../../../../../testUtils/mockEnv';

const loggerWarnSpy = jest.spyOn(logger, 'warning');

describe('localRedirect util', () => {
  it('only affects development environments', () => {
    mockEnv({ nodeEnv: 'production' });
    const mockReq = createMockRequest();
    const mockRes = createMockResponse();
    const mockNext = jest.fn();

    localRedirect(mockReq as any, mockRes as any, mockNext);

    expect(mockNext).toBeCalledTimes(1);
    expect(mockRes.redirect).not.toBeCalled();
  });

  it('logs a warning and redirects with a code', () => {
    mockEnv({ nodeEnv: 'development' });
    const mockReq = createMockRequest({
      query: {
        code: 'test-code',
      },
    });
    const mockRes = createMockResponse();
    const mockNext = jest.fn();

    localRedirect(mockReq as any, mockRes as any, mockNext);

    expect(mockNext).not.toBeCalled();
    expect(mockRes.redirect).toBeCalledTimes(1);
    expect(loggerWarnSpy).toBeCalledTimes(1);
    expect(mockRes.redirect.mock.calls[0][0]).toEqual(
      expect.stringContaining(`code=${mockReq.query.code}`),
    );
  });

  it('calls next when a redirect has already occurred', () => {
    mockEnv({ nodeEnv: 'development' });
    const mockReq = createMockRequest({ query: { wasRedirected: 'true' } });
    const mockRes = createMockResponse();
    const mockNext = jest.fn();

    localRedirect(mockReq as any, mockRes as any, mockNext);

    expect(mockNext).toBeCalledTimes(1);
    expect(mockRes.redirect).not.toBeCalled();
  });
});
