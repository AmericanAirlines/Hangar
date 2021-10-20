// add tests to ensure videos are being returned properly
import { videos } from '../../src/api/videos';
import { Video } from '../../src/entities/Video';
import logger from '../../src/logger';
import { testHandler } from '../testUtils/testHandler';

// Video object mocks
interface MockVideo {
  id: string;
  title: string;
  durationInSeconds: number;
  url: string;
}

const video1: MockVideo = {
  id: '1',
  title: 'video1',
  durationInSeconds: 102,
  url: 'www.test.org',
};

const video2: MockVideo = {
  id: '2',
  title: 'video2',
  durationInSeconds: 1109,
  url: 'www.test2.org',
};

const loggerSpy = jest.spyOn(logger, 'error').mockImplementation();

describe('/videos', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('returns all videos', async () => {
    const expectedVideos = [video1, video2];
    const handler = testHandler(videos);
    handler.entityManager.find.mockResolvedValue(expectedVideos);

    // result responds with 200 Status
    const { body } = await handler.get('/').expect(200);

    // result contains all videos
    expect(body).toEqual(expect.arrayContaining(expectedVideos));
  });

  it('propererly errors with a 500 and logs', async () => {
    const handler = testHandler(videos);
    handler.entityManager.find.mockRejectedValue(new Error('Something is broken'));

    // result responds with 500 Status
    const { text } = await handler.get('/').expect(500);

    // result contains all videos
    expect(text).toEqual('There was an issue geting all videos');

    // logger should be called
    expect(loggerSpy).toBeCalledTimes(1);
  });
});

describe('/videos/:videoId', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });
  it('returns a specific video', async () => {
    const handler = testHandler(videos);
    handler.entityManager.findOne.mockResolvedValueOnce(video1);

    const { body } = await handler.get('/1').expect(200);

    expect(body).toEqual(video1);
    expect(handler.entityManager.findOne).toHaveBeenCalledWith(Video, { id: '1' });
  });

  it('propererly returns with a 400 when a video ID not a number', async () => {
    const handler = testHandler(videos);
    handler.entityManager.findOne.mockResolvedValueOnce(video1);

    await handler.get('/one').expect(400);
  });

  it('propererly returns with a 404 when a video is not found', async () => {
    const handler = testHandler(videos);
    handler.entityManager.findOne.mockResolvedValueOnce(null);

    await handler.get('/1').expect(404);
  });

  it('propererly errors with a 500 and logs', async () => {
    const handler = testHandler(videos);
    handler.entityManager.findOne.mockRejectedValueOnce(new Error('Something is broken'));

    const { text } = await handler.get('/1').expect(500);

    expect(text).toEqual('There was an issue geting video "1"');

    expect(loggerSpy).toBeCalledTimes(1);
  });
});
