import { Node } from '../../src/entities/Node';

class TestNode extends Node<TestNode> {
  field?: string;

  sensitive?: string;

  reference?: {
    id: string;
    isInitialized: () => boolean;
    getEntity: () => any;
    toSafeJSON: () => any;
  };

  sensitiveReference?: { id: string; isInitialized: () => boolean };

  getSafeKeys(): (keyof TestNode)[] {
    return ['field', 'reference'];
  }

  toJSON() {
    return {
      field: this.field,
      sensitive: this.sensitive,
      reference: this.reference,
      sensitiveReference: this.sensitiveReference,
    };
  }
}

const field = 'hello';
const sensitive = 'password123';
const mockedToSafeJSONReference = { id: 'safe-ref' };
const reference = {
  id: 'user123',
  otherKey: 'wow',
  isInitialized: () => true,
  getEntity: () => reference,
  toSafeJSON: jest.fn(() => mockedToSafeJSONReference),
};
const sensitiveReference = { id: 'admin123', otherKey: 'wow', isInitialized: () => true };

describe('Node', () => {
  it('sets extra fields to class that exist', () => {
    expect(new TestNode({ field }).field).toEqual(field);
    expect(new TestNode().field).toEqual(undefined);
  });

  it('toSafeJson changes initialized references to be just the id and removes keys not in SAFE_KEYS', () => {
    expect(
      new TestNode({ field, reference, sensitive, sensitiveReference }).toSafeJSON({} as any),
    ).toEqual({
      field,
      reference: { id: reference.id },
    });
  });

  it('toSafeJson with removeReferences set to false calls toSafeJSON on the entity', () => {
    const mockReq = { mockReq: 'mock' } as any;
    expect(
      new TestNode({ field, reference, sensitive, sensitiveReference }).toSafeJSON(mockReq, false),
    ).toEqual({
      field,
      reference: mockedToSafeJSONReference,
    });

    expect(reference.toSafeJSON).toHaveBeenCalledWith(mockReq, false);
  });
});
