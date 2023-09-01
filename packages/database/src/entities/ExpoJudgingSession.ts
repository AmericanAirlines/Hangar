import { Entity } from '@mikro-orm/core';
import { JudgingSession } from './JudgingSession';

@Entity()
export class ExpoJudgingSession extends JudgingSession {}
