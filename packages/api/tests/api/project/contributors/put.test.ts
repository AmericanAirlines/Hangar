import { Project } from '@hangar/database';
import { put } from '../../../../src/api/project/contributors/put';
import { createMockRequest } from '../../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../../testUtils/expressHelpers/createMockResponse';
import { getMock } from '../../../testUtils/getMock';
import { validatePayload } from '../../../../src/utils/validatePayload';

jest.mock('../../../../src/utils/validatePayload');
const validatePayloadMock = getMock(validatePayload);
const validPayload = { projectId: '1', inviteCode: '00000000-0000-0000-0000-000000000000' };
const mockUser = { id: '1' };

describe('project contributors put endpoint', () => {
    it('should add a contributor to a project and return a projects contributors', async () => {

        validatePayloadMock.mockReturnValueOnce({ errorHandled: false, data:validPayload } as any);
        const req = createMockRequest({user:mockUser, ...validPayload} as any);
        const res = createMockResponse();
        const mockProject = { inviteCode: validPayload.inviteCode, contributors: { add: jest.fn() } };
        req.entityManager.findOneOrFail.mockResolvedValueOnce(mockProject);
        req.entityManager.findOneOrFail.mockResolvedValueOnce(req.user);

        await put(req as any, res as any);

        expect(req.entityManager.findOneOrFail).toHaveBeenCalledTimes(2);
        expect(mockProject.contributors.add).toBeCalledWith(req.user);
        expect(req.entityManager.persist).toBeCalledWith(mockProject);
        expect(res.send).toHaveBeenCalledWith(mockProject);
    });

    it('should return 404 if the invite code is invalid', async () => {
        validatePayloadMock.mockReturnValueOnce({ errorHandled: false, data:validPayload } as any);
        const req = createMockRequest({user:mockUser, ...validPayload} as any);
        const res = createMockResponse();
        const mockProject = { inviteCode: 'invalid', contributors: { add: jest.fn() } };
        req.entityManager.findOneOrFail.mockResolvedValueOnce(mockProject);

        await put(req as any, res as any);

        expect(req.entityManager.findOneOrFail).toBeCalledWith(Project, { id: validPayload.projectId });
        expect(mockProject.contributors.add).not.toBeCalled();
        expect(req.entityManager.persist).not.toBeCalled();
        expect(res.sendStatus).toHaveBeenCalledWith(404);
    });

    it('should return 409 if the user is already a contributor', async () => {
        validatePayloadMock.mockReturnValueOnce({ errorHandled: false, data:validPayload } as any);
        const req = createMockRequest({user:mockUser, ...validPayload} as any);
        const res = createMockResponse();
        const mockProject = { inviteCode: validPayload.inviteCode, contributors: { add: jest.fn() } };
        req.entityManager.findOneOrFail.mockResolvedValueOnce(mockProject);
        (req.entityManager.transactional as jest.Mock).mockRejectedValueOnce({ name: 'NotFoundError' });

        await put(req as any, res as any);

        expect(req.entityManager.findOneOrFail).toBeCalledWith(Project, { id: validPayload.projectId });
        expect(mockProject.contributors.add).not.toBeCalled();
        expect(req.entityManager.persist).not.toBeCalled();
        expect(res.sendStatus).toHaveBeenCalledWith(409);
    });

    it('should return 423 if the row lock could not be obtained', async () => {
        validatePayloadMock.mockReturnValueOnce({ errorHandled: false, data:validPayload } as any);
        const req = createMockRequest({user:mockUser, ...validPayload} as any);
        const res = createMockResponse();
        const mockProject = { inviteCode: validPayload.inviteCode, contributors: { add: jest.fn() } };
        req.entityManager.findOneOrFail.mockResolvedValueOnce(mockProject);
        req.entityManager.transactional.mockRejectedValueOnce({ code: '55P03' });

        await put(req as any, res as any);

        expect(req.entityManager.findOneOrFail).toBeCalledWith(Project, { id: validPayload.projectId });
        expect(mockProject.contributors.add).not.toBeCalled();
        expect(req.entityManager.persist).not.toBeCalled();
        expect(res.sendStatus).toHaveBeenCalledWith(423);
    });

    it('should return 500 something else goes wrong', async () => {
        validatePayloadMock.mockReturnValueOnce({ errorHandled: false, data:validPayload } as any);
        const req = createMockRequest({user:mockUser, ...validPayload} as any);
        const res = createMockResponse();
        const mockProject = { inviteCode: validPayload.inviteCode, contributors: { add: jest.fn() } };
        req.entityManager.findOneOrFail.mockResolvedValueOnce(mockProject);
        req.entityManager.transactional.mockRejectedValueOnce(new Error('Oh no!'));

        await put(req as any, res as any);

        expect(req.entityManager.findOneOrFail).toBeCalledWith(Project, { id: validPayload.projectId });
        expect(mockProject.contributors.add).not.toBeCalled();
        expect(req.entityManager.persist).not.toBeCalled();
        expect(res.sendStatus).toHaveBeenCalledWith(500);
    });

    it('bails if a validation error occurs', async () => {
        validatePayloadMock.mockReturnValueOnce({ errorHandled: true });
        const req = createMockRequest();
        const res = createMockResponse();

        await put(req as any, res as any);

        expect(validatePayloadMock).toBeCalledTimes(1);
    });

    it('should return 404 if the project does not exist', async () => {
        validatePayloadMock.mockReturnValueOnce({ errorHandled: false, data:validPayload } as any);
        const req = createMockRequest({user:mockUser, ...validPayload} as any);
        const res = createMockResponse();
        req.entityManager.findOneOrFail.mockResolvedValueOnce({ ...validPayload, inviteCode:'2'});
        req.entityManager.findOneOrFail.mockRejectedValueOnce({ name: 'NotFoundError' });

        await put(req as any, res as any);

        expect(req.entityManager.findOneOrFail).toBeCalledWith(Project, { id: validPayload.projectId });
        expect(res.sendStatus).toHaveBeenCalledWith(404);
    });
});
