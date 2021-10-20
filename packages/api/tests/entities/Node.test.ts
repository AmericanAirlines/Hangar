import { Node } from '../../src/entities/Node';

describe('Node', () => {
  it('sets extra fields to class that exist', async () => {
    class TestNode extends Node<TestNode> {
      field?: string;
    }

    const field = 'hello';

    expect(new TestNode({ field }).field).toEqual(field);
    expect(new TestNode().field).toEqual(undefined);
  });
});
