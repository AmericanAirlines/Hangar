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
const mockJudge:any = {
    id: '1',
    vote: jest.fn().mockResolvedValue(mockExpoJudgingVote),
    expoJudgingSessions:{
        getItems:jest.fn(()=>[{id:mockExpoJudgingSession.id}])
    }
};

jest.mock('../../../src/utils/validatePayload');
const validatePayloadMock = getMock(validatePayload);

describe('ExpoJudgingVote', () => {
    it ('should create a vote', async () => {
      const req = createMockRequest({judge:mockJudge,body:validReqData});
      const res = createMockResponse();
      const { entityManager } = req;
      validatePayloadMock.mockReturnValueOnce({ errorHandled: false, data:validReqData } as any);
      entityManager.findOne.mockResolvedValueOnce(mockExpoJudgingSession);
      entityManager.populate.mockResolvedValueOnce(mockJudge);
      
      await post(req as any, res as any);
      
      expect(entityManager.findOne).toHaveBeenCalledWith(ExpoJudgingSession, { id: validReqData.expoJudgingSessionId });
      expect(entityManager.populate).toHaveBeenCalledWith(req.judge, ['expoJudgingSessions']);
      expect(mockJudge.vote).toHaveBeenCalledWith({
        entityManager,
        currentProjectChosen: validReqData.currentProjectChosen,
        judgingSession: mockExpoJudgingSession,
      });
      expect(res.send).toHaveBeenCalledWith(mockExpoJudgingVote);
    });
});