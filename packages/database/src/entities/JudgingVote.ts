import { Entity, Property , EntityManager as ems , Ref } from '@mikro-orm/core';
import { EntityManager as em, EntityRepository } from '@mikro-orm/postgresql'
// import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { ConstructorValues } from '../utils/types';
// import shuffle from 'shuffle-array';
import { Project } from './Project';
import { Node } from './Node';

const shuffle = (arr:any) =>
    arr.sort(()=>Math.random()-0.5)

export const insufficientVoteCountError = 'InsufficientVoteCount';

interface ProjectScore {
    id: string;
    score: number;
}

export interface ProjectResult extends ProjectScore {
    name: string;
}
export type JudgingVoteConstructorValues = ConstructorValues<JudgingVote>

@Entity()
export class JudgingVote extends Node<JudgingVote> {
    // constructor({previousProject, currentProject, currentProjectChosen}:{previousProject: number, currentProject: number, currentProjectChosen: boolean}) {
    constructor({previousProject, currentProject, currentProjectChosen}:JudgingVoteConstructorValues) {
        super();

        this.previousProject = previousProject;
        this.currentProject = currentProject;
        this.currentProjectChosen = currentProjectChosen;
    }

    // @PrimaryGeneratedColumn()
    // id: number;

    @Property({ ref: true})
    previousProject: Ref<Project>;

    @Property({ ref: true})
    currentProject: Ref<Project>;

    @Property({ columnType: 'boolean'})
    currentProjectChosen: boolean;

    static async tabulate({entityManager}:{entityManager:em}): Promise<ProjectResult[]> {
        const allVotes = await entityManager.find(JudgingVote, {});
        const projects = await entityManager.find(Project, {});
        const numProjects = projects.length;

        // Initialize score keeping
        const initialScores: { [id: string]: ProjectScore }[] = [];

        // Use a designated percent of the votes for calibration
        const avgNumVotesPerProject = numProjects ? allVotes.length / numProjects : 0;
        const percentOfVotesToUseForCalibration = 0.2;
        const percentBasedCalibrationVotes = Math.round(percentOfVotesToUseForCalibration * avgNumVotesPerProject);
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
            initialScores.push(this.scoreVotes(votesNeededForCalibration, shuffle([...allVotes]), shuffle([...projects])));
        }

        // Average scores from all passes
        const normalizedScores: { [id: string]: number[] } = {};
        Object.values(initialScores).forEach((scores) => {
            Object.values(scores).forEach((projectScore) => {
                // check?  (normalizedScores[projectScore.id]||[])
                normalizedScores[projectScore.id] = normalizedScores[projectScore.id] ? [...(normalizedScores[projectScore.id]||[]), projectScore.score] : [projectScore.score];
            });
        });

        const trimmedMeanScores: { [id: string]: number } = {};
        const percentOfOutliersToRemove = 0.2;
        const outliersToRemoveFromEachSide = Math.max(Math.floor(percentOfOutliersToRemove * randomJudgingIterations) / 2, 1);
        for (let i = 0; i < Object.keys(normalizedScores).length; i += 1) {
            const projectId = Object.keys(normalizedScores)[i];
            if (projectId){
                const sortedScores = (normalizedScores[projectId]||[]).sort();
                // Remove outlier(s) from front
                sortedScores.splice(0, outliersToRemoveFromEachSide);
                // Remove outlier(s) from end
                sortedScores.splice(sortedScores.length - outliersToRemoveFromEachSide, outliersToRemoveFromEachSide);

                let sum = 0;
                sortedScores.forEach((score) => {
                    sum += score;
                });
                trimmedMeanScores[projectId] = sum / sortedScores.length;
            }
        }

        // check? ||0
        const orderedProjects = projects.sort((a: Project, b: Project) => ((trimmedMeanScores[a.id]||0 > (trimmedMeanScores[b.id]||0)) ? -1 : 1));

        const projectResults: ProjectResult[] = [];

        orderedProjects.forEach((scoredProject) => {
            const matchingProject = projects.find((project) => project.id === scoredProject.id);
            if (matchingProject)
                projectResults.push({
                    id: matchingProject.id,
                    name: matchingProject.name,
                    score: trimmedMeanScores[scoredProject.id]||0,
                });
        });

        return projectResults;
    }

    static scoreVotes(
        votesNeededForCalibration: number,
        votes: JudgingVote[],
        projects: Project[],
        calibrationScoreImpact = 150,
    ): { [id: string]: ProjectScore } {
        // Reference corresponding scores dictionary
        const scores: { [id: string]: ProjectScore } = {};

        let minScore = Number.POSITIVE_INFINITY;
        let maxScore = Number.NEGATIVE_INFINITY;

        const calibrationCount: { [id: string]: number } = {};
        let calibrationComplete = false;
        const remainingVotes = [...votes];

        // Iterate over all votes
        for (let i = 0; i < votes.length; i += 1) {
            if (!calibrationComplete) {
                // Not all projects have been calibrated
                // Select the project with the lowest calibration count
                const project = projects.sort((projectA, projectB) => ((calibrationCount[projectA.id] || 0) <= (calibrationCount[projectB.id] || 0) ? -1 : 1))[0];
                if (project){
                    // Retrieve all remaining votes where the selected project is evaluated
                    const projectVotes = remainingVotes.filter((voteToCompare) => voteToCompare.currentProject.id === project.id || voteToCompare.previousProject.id === project.id);

                    // Sort project votes by the project with the lowest calibration count
                    
                    const vote = projectVotes.sort((a, b) => {
                        const otherProjectIdA = a.currentProject.id !== project.id ? a.currentProject.id : a.previousProject.id;
                        const otherProjectIdB = b.currentProject.id !== project.id ? b.currentProject.id : b.previousProject.id;
                        
                        return (calibrationCount[otherProjectIdA] || 0) <= (calibrationCount[otherProjectIdB] || 0) ? -1 : 1;
                    })[0];
                    if (vote){
                        // Get project details for other project
                        const otherProjectId = vote.currentProject.id !== project.id ? vote.currentProject.id : vote.previousProject.id;
                        const otherProject = projects.find((projectToCompare) => projectToCompare.id === otherProjectId);
                        if (otherProject){
                            // Remove that vote from the remaining votes
                            remainingVotes.splice(votes.indexOf(vote), 1);

                            // Increment calibration counts for both projects
                            calibrationCount[project.id] = (calibrationCount[project.id] ?? 0) + 1;
                            calibrationCount[otherProject.id] = (calibrationCount[otherProject.id] ?? 0)+ 1;

                            // CALIBRATION SCORING
                            const projectScore = scores[project.id] || { id: project.id, score: 0 };
                            const otherProjectScore = scores[otherProject.id] || { id: otherProject.id, score: 0 };

                            // Apply score impact based on vote outcome
                            const currentProjectScoreImpact = vote.currentProjectChosen ? calibrationScoreImpact : -calibrationScoreImpact;
                            projectScore.score += currentProjectScoreImpact;
                            otherProjectScore.score += -currentProjectScoreImpact;

                            // Update scores for both projects
                            scores[project.id] = projectScore;
                            scores[otherProject.id] = otherProjectScore;

                            // Check to see if all projects have been calibrated
                            const allProjectsAreInCalibration = Object.keys(calibrationCount).length === projects.length;
                            const allProjectsAreCalibrated = !Object.values(calibrationCount).some((value) => value < votesNeededForCalibration);
                            if (allProjectsAreInCalibration && allProjectsAreCalibrated) {
                                calibrationComplete = true;
                                // Update min/max score for traditional scoring
                                const calibratedScores = Object.values(scores);
                                for (let j = 0; j < calibratedScores.length; j += 1) {
                                    // check? calibratedScores?.[j]?.score||0
                                    minScore = Math.min(minScore, calibratedScores?.[j]?.score||0);
                                    maxScore = Math.max(maxScore, calibratedScores?.[j]?.score||0);
                                }
                            }
                        }
                    }
                }
            } else {
                const vote = remainingVotes.shift();
                if (vote){
                    const currentProjectId = vote.currentProject.id;
                    const previousProjectId = vote.previousProject.id;
                    if (currentProjectId && previousProjectId){
                        const currentProjectScore = scores[currentProjectId];
                        const previousProjectScore = scores[previousProjectId];
                        if (currentProjectScore && previousProjectScore){
                            // ELO SCORING - both projects have been calibrated and have an ELO score
                            // In order to determine differential between scores, "shift" minScore to 0, If...
                            //   Positive min: shift is negative
                            //   Negative min: shift is positive (double negative)
                            //   Zero min: shift is zero (-1 * 0 = 0)
                            const normalizationShift = -minScore;
                            const normalizedMaxScore = maxScore + normalizationShift;

                            // Calculate project percentiles using the normalizationShift and normalizedMaxScore
                            // If min and max are equal, normalized max will be 0; replace percentile with 0 to allow for max impact
                            const currentProjectPercentile = (currentProjectScore.score + normalizationShift) / normalizedMaxScore || 0;
                            const previousProjectPercentile = (previousProjectScore.score + normalizationShift) / normalizedMaxScore || 0;

                            // Determine whether the scoreImpact should be positive or negative
                            // Current Project Advantage: potential positive decreases, potential negative increases
                            const advantageCoeficient = currentProjectPercentile > previousProjectPercentile ? -1 : 1;
                            const currentProjectScoreImpact = advantageCoeficient * Math.round(100 * Math.abs(currentProjectPercentile - previousProjectPercentile));
                            const previousProjectScoreImpact = -advantageCoeficient * Math.round(100 * Math.abs(currentProjectPercentile - previousProjectPercentile));

                            // Apply score impact based on vote outcome
                            currentProjectScore.score += (vote.currentProjectChosen ? 100 : -100) + currentProjectScoreImpact;
                            previousProjectScore.score += (vote.currentProjectChosen ? -100 : 100) + previousProjectScoreImpact;

                            // Update scores for both projects
                            scores[currentProjectId] = currentProjectScore;
                            scores[previousProjectId] = previousProjectScore;

                            // Update min and max score
                            const rawScores = Object.values(scores).map((score) => score.score);
                            maxScore = Math.max(...rawScores);
                            minScore = Math.min(...rawScores);
                        }
                    }
                }
            }
        }

        // Normalized score from 0 to 100
        for (let i = 0; i < Object.keys(scores).length; i += 1) {
            const projectId = Object.keys(scores)[i];
            if (projectId){
                const score = scores[projectId]?.score;
                if (score){
                    // Shift min score to zero, shift max score by an equal amount, get the normalized score
                    //   as a percent of the max
                    const normalizedScore = ((score - minScore) / (maxScore - minScore)) * 100;
                    if(!scores?.[projectId])
                        continue
                    // scores[projectId].score = normalizedScore;
                }
            }
        }

        return scores;
    }
}