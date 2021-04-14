import 'jest';
import { Config } from '../../entities/config';

const configFindOneSpy = jest.spyOn(Config, 'findOne');

describe('config findToggleForKey util', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('will throw an error for an item that cannot be found if throw is enabled', async () => {
    configFindOneSpy.mockResolvedValueOnce(null);
    await expect(Config.getValueAs('adminSecret', 'string', true)).rejects.toThrow();
  });

  it('will return null for an item that cannot be found if throw is disabled', async () => {
    configFindOneSpy.mockResolvedValueOnce(null);
    await expect(Config.getValueAs('adminSecret', 'string', false)).resolves.toEqual(null);
  });

  it('will throw an error for an item with a null value if throw is enabled', async () => {
    const mockConfig = new Config('adminSecret', null);
    configFindOneSpy.mockResolvedValueOnce(mockConfig);
    await expect(Config.getValueAs('adminSecret', 'string', true)).rejects.toThrow();
  });

  it('will throw an error for an item with an incorrect valueType if throw is enabled', async () => {
    const mockConfig = new Config('adminSecret', 123);
    configFindOneSpy.mockResolvedValueOnce(mockConfig);
    await expect(Config.getValueAs('adminSecret', 'string', true)).rejects.toThrow();
  });

  it('will return null for an item with an incorrect valueType if throw is disabled', async () => {
    const mockConfig = new Config('adminSecret', 123);
    configFindOneSpy.mockResolvedValueOnce(mockConfig);
    await expect(Config.getValueAs('adminSecret', 'string', false)).resolves.toEqual(null);
  });

  it('will return the value for an item if te valueType is correct', async () => {
    const mockConfig = new Config('adminSecret', 123);
    configFindOneSpy.mockResolvedValueOnce(mockConfig);
    await expect(Config.getValueAs('adminSecret', 'number', true)).resolves.toEqual(mockConfig.value);
  });
});
