import 'jest';
import { Config } from '../../entities/config';

/* eslint-disable no-await-in-loop */

xdescribe('config', () => {

  it('config items can be saved and retrieved', async () => {
    const item = new Config('something', 'something else');
    await item.save();
    const foundItem = await Config.findOneOrFail({ key: item.key });
    expect(foundItem).toEqual(item);
  });

  it('a config item with a boolean value can be retrieved as a boolean', async () => {
    const item = new Config('thisIsCool', 'true');
    await item.save();
    const toggleValue = await Config.findToggleForKey(item.key);
    expect(toggleValue).toEqual(true);
  });

  it('a non-existent toggle will be false', async () => {
    const toggleValue = await Config.findToggleForKey('non-existent toggle key');
    expect(toggleValue).toEqual(false);
  });

  it('retrieving a non-boolean toggle as a toggle will throw an error', async () => {
    const item = new Config('the meaning of life', '42');
    await item.save();
    await expect(Config.findToggleForKey(item.key)).rejects.toThrow();
  });
});
