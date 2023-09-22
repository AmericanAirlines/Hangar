/* eslint-disable max-lines */
import { ExpoJudgingSession } from '@hangar/database';
import { validatePayload } from '../../../src/utils/validatePayload';
import { createMockRequest } from '../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../testUtils/expressHelpers/createMockResponse';
import { getMock } from '../../testUtils/getMock';
import { post } from '../../../src/api/expoJudgingVote/post';

const validReqData = {
  currentProjectChosen: true,
  expoJudgingSessionId: '1',
};

const mockExpoJudgingSession = { id: '1' };
const mockExpoJudgingVote = { id: '1' };
const mockJudge: any = {
  id: '1',
  vote: jest.fn().mockResolvedValue(mockExpoJudgingVote),
  expoJudgingSessions: {
    getItems: jest.fn(() => [{ id: mockExpoJudgingSession.id }]),
  },
};

jest.mock('../../../src/utils/validatePayload');
const validatePayloadMock = getMock(validatePayload);

describe('ExpoJudgingVote', () => {
  it('should create a vote', async () => {
    const req = createMockRequest({ judge: mockJudge, body: validReqData });
    const res = createMockResponse();
    const { entityManager } = req;
    validatePayloadMock.mockReturnValueOnce({ errorHandled: false, data: validReqData } as any);
    entityManager.findOne.mockResolvedValueOnce(mockExpoJudgingSession);
    entityManager.populate.mockResolvedValueOnce(mockJudge);

    await post(req as any, res as any);

    expect(entityManager.findOne).toHaveBeenCalledWith(ExpoJudgingSession, {
      id: validReqData.expoJudgingSessionId,
    });
    expect(entityManager.populate).toHaveBeenCalledWith(req.judge, ['expoJudgingSessions']);
    expect(mockJudge.vote).toHaveBeenCalledWith({
      entityManager,
      currentProjectChosen: validReqData.currentProjectChosen,
      expoJudgingSession: mockExpoJudgingSession,
    });
    expect(res.send).toHaveBeenCalledWith(mockExpoJudgingVote);
  });

  it('should return 404 if the ExpoJudgingSession does not exist', async () => {
    const req = createMockRequest({ judge: mockJudge, body: validReqData });
    const res = createMockResponse();
    const { entityManager } = req;
    validatePayloadMock.mockReturnValueOnce({ errorHandled: false, data: validReqData } as any);

    await post(req as any, res as any);

    expect(entityManager.findOne).toHaveBeenCalledWith(ExpoJudgingSession, {
      id: validReqData.expoJudgingSessionId,
    });
    expect(entityManager.populate).not.toHaveBeenCalled();
    expect(mockJudge.vote).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(404);
  });

  it('should return 403 if the expoJudgingSessionId is not in the ExpoJudgingSessions of the Judge', async () => {
    const mockBody = {
      ...validReqData,
      expoJudgingSessionId: '2',
    };
    const req = createMockRequest({ judge: mockJudge, body: mockBody });
    const res = createMockResponse();
    const { entityManager } = req;
    validatePayloadMock.mockReturnValueOnce({ errorHandled: false, data: mockBody } as any);
    entityManager.findOne.mockResolvedValueOnce(mockExpoJudgingSession);
    entityManager.populate.mockResolvedValueOnce(mockJudge);

    await post(req as any, res as any);

    expect(entityManager.findOne).toHaveBeenCalledWith(ExpoJudgingSession, {
      id: mockBody.expoJudgingSessionId,
    });
    expect(entityManager.populate).toHaveBeenCalledWith(req.judge, ['expoJudgingSessions']);
    expect(mockJudge.vote).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });

  it('should return 400 if the payload is invalid', async () => {
    const req = createMockRequest({ judge: mockJudge, body: {} });
    const res = createMockResponse();
    const { entityManager } = req;
    validatePayloadMock.mockReturnValueOnce({ errorHandled: true, data: {} } as any);

    await post(req as any, res as any);

    expect(entityManager.findOne).not.toHaveBeenCalled();
    expect(entityManager.populate).not.toHaveBeenCalled();
    expect(mockJudge.vote).not.toHaveBeenCalled();
    expect(res.sendStatus).not.toHaveBeenCalled();
  });

  it('should return 500 if something goes wrong', async () => {
    const req = createMockRequest({ judge: mockJudge, body: validReqData });
    const res = createMockResponse();
    const { entityManager } = req;
    validatePayloadMock.mockReturnValueOnce({ errorHandled: false, data: validReqData } as any);
    entityManager.findOne.mockRejectedValueOnce(new Error('Oh no!'));

    await post(req as any, res as any);

    expect(entityManager.findOne).toHaveBeenCalledWith(ExpoJudgingSession, {
      id: validReqData.expoJudgingSessionId,
    });
    expect(entityManager.populate).not.toHaveBeenCalled();
    expect(mockJudge.vote).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(500);
  });
});
