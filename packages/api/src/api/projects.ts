import { Router } from 'express';
import logger from '../logger';
import { Project } from '../entities/Project';

export const projects = Router();

projects.get('/', async (req, res) => {
  try {
    if (!req.userEntity.isAdmin) {
      res.sendStatus(403);
      return;
    }

    const allProjects = await req.entityManager.find(
      Project,
      {},
      { orderBy: { createdAt: 'ASC' } },
    );

    res.status(200).send(allProjects);
  } catch (error) {
    const errorMsg = 'Uh oh, looks like there was an issue fetching the list of projects!';
    logger.error(`${errorMsg}: `, error);
    res.status(500).send(errorMsg);
  }
});

projects.post('/', async (req, res) => {
  try {
    const { name, description, tableNumber } = req.body;

    const newProject = new Project({
      name,
      description,
      tableNumber,
      user: req.userEntity.toReference(),
    });

    await req.entityManager.persistAndFlush(newProject);

    res.status(200).send(newProject);
  } catch (error) {
    const errorMsg = 'Uh oh, looks like there was an issue creating a new project!';
    logger.error(`${errorMsg}: `, error);
    res.status(500).send(errorMsg);
  }
});

projects.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name = '',
      description = '',
      tableNumber,
    } = req.body as Record<string, string | undefined>;

    const project = await req.entityManager.findOne(Project, id);

    if (!project) {
      res.sendStatus(404);
      return;
    }

    project.name = name;
    project.description = description;
    project.tableNumber = tableNumber;

    await req.entityManager.flush();

    res.status(200).send(project);
  } catch (error) {
    const errorMsg = 'Uh oh, looks like there was an issue updating the project!';
    logger.error(`${errorMsg}: `, error);
    res.status(500).send(errorMsg);
  }
});
