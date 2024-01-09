import { Config } from '@hangar/shared';
import { Router } from 'express';
import { slack } from '../../../../src/api/auth/callback/slack';
import { pingfed } from '../../../../src/api/auth/callback/pingfed';

jest.mock('../../../../src/api/auth/callback/slack', () => ({})); // TODO: Investigate why this requires a blank factory
jest.mock('../../../../src/api/auth/callback/pingfed', () => ({}));
jest.mock('@hangar/shared');
jest.mock('express');

describe('callback router registrations', () => {
  describe('slack router', () => {
    it('registers the slack callback router', async () => {
      Config.Auth.method = 'slack';
      const mockRouter = { use: jest.fn() };
      Router.prototype.constructor.mockReturnValueOnce(mockRouter);

      await jest.isolateModulesAsync(async () => {
        await import('../../../../src/api/auth/callback');
        expect(mockRouter.use).toHaveBeenCalledWith('/slack', slack);
      });
    });
  });

  describe('pingfed router', () => {
    it('registers the pingfed callback router', async () => {
      Config.Auth.method = 'pingfed';
      const mockRouter = { use: jest.fn() };
      Router.prototype.constructor.mockReturnValueOnce(mockRouter);

      await jest.isolateModulesAsync(async () => {
        await import('../../../../src/api/auth/callback');
        expect(mockRouter.use).toHaveBeenCalledWith('/pingfed', pingfed);
      });
    });
  });
});
