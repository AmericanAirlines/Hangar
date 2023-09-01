/* eslint-disable max-lines */
import { Entity, Property, Ref, ManyToOne, EntityDTO } from '@mikro-orm/core';
import { EntityManager as em } from '@mikro-orm/postgresql';
import { ConstructorValues } from '../types/ConstructorValues';
import { Project } from './Project';
import { Node } from './Node';
import { scoreVotes, ProjectResult, ProjectScore } from '../entitiesUtils/scoreVotes';
import { ExpoJudgingSession } from './ExpoJudgingSession';

const shuffle = (arr: any) => arr.sort(() => Math.random() - 0.5);

export const insufficientVoteCountError = 'InsufficientVoteCount';

type NormalizedScore = number[];
type NormalizedScores = { [id: string]: NormalizedScore };

export type ExpoJudgingVoteDTO = EntityDTO<ExpoJudgingVote>;

export type ExpoJudgingVoteConstructorValues = ConstructorValues<ExpoJudgingVote>;

@Entity()
export class ExpoJudgingVote extends Node<ExpoJudgingVote> {
  @ManyToOne({ entity: () => Project, ref: true })
  previousProject: Ref<Project>;

  @ManyToOne({ entity: () => Project, ref: true })
  currentProject: Ref<Project>;

  @Property({ columnType: 'boolean' })
  currentProjectChosen: boolean;

  @ManyToOne({ entity: () => ExpoJudgingSession, ref: true })
  judgingSession: Ref<ExpoJudgingSession>;

  constructor({
    previousProject,
    currentProject,
    currentProjectChosen,
    judgingSession,
  }: ExpoJudgingVoteConstructorValues) {
    super();

    this.previousProject = previousProject;
    this.currentProject = currentProject;
    this.currentProjectChosen = currentProjectChosen;
    this.judgingSession = judgingSession;
  }

  static async tabulate({ entityManager }: { entityManager: em }): Promise<ProjectResult[]> {
    const allVotes = await entityManager.find(ExpoJudgingVote, {});
    const projects = await entityManager.find(Project, {});
    const numProjects = projects.length;

    // Initialize score keeping
    const initialScores: { [id: string]: ProjectScore }[] = [];

    // Use a designated percent of the votes for calibration
    const avgNumVotesPerProject = numProjects ? allVotes.length / numProjects : 0;
    const percentOfVotesToUseForCalibration = 0.2;
    const percentBasedCalibrationVotes = Math.round(
      percentOfVotesToUseForCalibration * avgNumVotesPerProject,
    );
    // Use percentOfVotesToUseForCalibration percent of the votes OR 2, whichever is bigger
    const votesNeededForCalibration = Math.max(percentBasedCalibrationVotes, 2);

    // If the number of calibration votes is >= 50% of the votes for the project; throw error
    if (avgNumVotesPerProject === 0 || votesNeededForCalibration / avgNumVotesPerProject >= 0.75) {
      const error = new Error('Insufficient vote count for judging');
      error.name = insufficientVoteCountError;
      throw error;
    }

    // Pass over the data in random order to obtain an unbiased baseline
    const randomJudgingIterations = 20;
    for (let j = 0; j < randomJudgingIterations; j += 1) {
      // Randomize order to prevent bias based on vote ordering
      initialScores.push(
        this.scoreVotes(votesNeededForCalibration, shuffle([...allVotes]), shuffle([...projects])),
      );
    }

    // Average scores from all passes
    const normalizedScores: NormalizedScores = {};
    Object.values(initialScores).forEach((scores) => {
      Object.values(scores).forEach((projectScore) => {
        normalizedScores[projectScore.id] = normalizedScores[projectScore.id]
          ? [...(normalizedScores[projectScore.id] as NormalizedScore), projectScore.score]
          : [projectScore.score];
      });
    });

    const trimmedMeanScores: { [id: string]: number } = {};
    const percentOfOutliersToRemove = 0.2;
    const outliersToRemoveFromEachSide = Math.max(
      Math.floor(percentOfOutliersToRemove * randomJudgingIterations) / 2,
      1,
    );
    for (let i = 0; i < Object.keys(normalizedScores).length; i += 1) {
      const projectId = Object.keys(normalizedScores)[i];
      if (projectId) {
        const sortedScores = (normalizedScores[projectId] || []).sort();
        // Remove outlier(s) from front
        sortedScores.splice(0, outliersToRemoveFromEachSide);
        // Remove outlier(s) from end
        sortedScores.splice(
          sortedScores.length - outliersToRemoveFromEachSide,
          outliersToRemoveFromEachSide,
        );

        let sum = 0;
        sortedScores.forEach((score) => {
          sum += score;
        });
        trimmedMeanScores[projectId] = sum / sortedScores.length;
      }
    }

    const orderedProjects = projects.sort((a: Project, b: Project) =>
      (trimmedMeanScores[a.id] as number) > (trimmedMeanScores[b.id] as number) ? -1 : 1,
    );

    const projectResults: ProjectResult[] = [];

    orderedProjects.forEach((scoredProject) => {
      const matchingProject = projects.find((project) => project.id === scoredProject.id);
      if (matchingProject) {
        projectResults.push({
          id: matchingProject.id,
          name: matchingProject.name,
          score: trimmedMeanScores[scoredProject.id] as number,
        });
      }
    });

    return projectResults;
  }

  static scoreVotes = scoreVotes;
}
