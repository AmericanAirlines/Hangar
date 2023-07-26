import { Node } from '../../src/entities/Node';

class TestNode extends Node<TestNode> {
  field?: string;
}

describe('Node', () => {
  it('sets extra fields to class that exist', async () => {
    const field = 'hello';

    expect(new TestNode({ field }).field).toEqual(field);
    expect(new TestNode().field).toEqual(undefined);
  });
});
