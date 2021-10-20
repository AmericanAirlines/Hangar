import { Router } from 'express';
import { Video } from '../entities/Video';
import logger from '../logger';

export const videos = Router();

videos.get('', async (req, res) => {
  try {
    const videosList = await req.entityManager.find(Video, {});

    res.status(200).send(videosList);
  } catch (error) {
    logger.error('There was an issue geting all videos: ', error);
    res.status(500).send('There was an issue geting all videos');
  }
});

videos.get('/:videoId', async (req, res) => {
  const { videoId } = req.params;

  try {
    // Check if videoId is in the expected format
    if (Number.isNaN(Number(videoId))) {
      res.status(400).send(`"${videoId}" is not a valid id, it must be a number.`);
      return;
    }

    const video = await req.entityManager.findOne(Video, { id: videoId });

    if (!video) {
      res.sendStatus(404);
      return;
    }

    res.status(200).send(video);
  } catch (error) {
    logger.error(`There was an issue geting video "${videoId}"`, error);
    res.status(500).send(`There was an issue geting video "${videoId}"`);
  }
});
