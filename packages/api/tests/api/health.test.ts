import { health } from '../../src/api/health';
import { testHandler } from '../testUtils/testHandler';

describe('health', () => {
  it('returns ok true', async () => {
    const { body } = await testHandler(health).get('').expect(200);

    expect(body).toEqual({ ok: true });
  });
});
