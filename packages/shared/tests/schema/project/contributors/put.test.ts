import { v4 } from 'uuid';
import { Schema } from '../../../../src';

const validPut = {
    projectId: '1',
    inviteCode: `${v4()}`,
};

describe('project contributors put schema', () => {
    it('validates a matching object', () => {
        expect(Schema.project.contributors.put.safeParse(validPut).success).toBe(true);
    });

    it('does not validate an object with an invalid projectId', () => {
        expect(
            Schema.project.contributors.put.safeParse({
                ...validPut,
                projectId: 1,
            }).success,
        ).toBe(false);
    });

    it('does not validate an object with an invalid inviteCode', () => {
        expect(
            Schema.project.contributors.put.safeParse({
                ...validPut,
                inviteCode: `${v4()}-junk`,
            }).success,
        ).toBe(false);
    });
});