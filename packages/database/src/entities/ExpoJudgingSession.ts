import { Entity, EntityDTO } from '@mikro-orm/core';
import { JudgingSession } from './JudgingSession';

export type ExpoJudgingSessionDTO = EntityDTO<ExpoJudgingSession>;

@Entity()
export class ExpoJudgingSession extends JudgingSession {}
