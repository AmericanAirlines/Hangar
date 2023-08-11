import { UserDTO,
    ProjectDTO,
    EventDTO,
    PrizeDTO,
    JudgeDTO,
    JudgingVoteDTO,
    AppConfigDTO
} from '@hangar/shared';
import { Dayjs } from 'dayjs';

export type User = Omit<UserDTO, 'createdAt'|'updatedAt'> & {
    createdAt: Dayjs
    updatedAt: Dayjs
}

export type SerializedUser = Omit<User, 'createdAt'|'updatedAt'> & {
    createdAt: string
    updatedAt: string
}

export type Project = Omit<ProjectDTO, 'createdAt'|'updatedAt'> & {
    createdAt: Dayjs
    updatedAt: Dayjs
}

export type SerializedProject = Omit<Project, 'createdAt'|'updatedAt'> & {
    createdAt: string
    updatedAt: string
}

export type Event = Omit<EventDTO, 'createdAt'|'updatedAt'|'start'|'end'> & {
    createdAt: Dayjs
    updatedAt: Dayjs
    start: Dayjs
    end: Dayjs
}

export type SerializedEvent = Omit<Event, 'createdAt'|'updatedAt'|'start'|'end'> & {
    createdAt: string
    updatedAt: string
    start: string
    end: string
}

export type Prize = Omit<PrizeDTO, 'createdAt'|'updatedAt'> & {
    createdAt: Dayjs
    updatedAt: Dayjs
}

export type SerializedPrize = Omit<Prize, 'createdAt'|'updatedAt'> & {
    createdAt: string
    updatedAt: string
}

export type Judge = Omit<JudgeDTO, 'createdAt'|'updatedAt'> & {
    createdAt: Dayjs
    updatedAt: Dayjs
}

export type SerializedJudge = Omit<Judge, 'createdAt'|'updatedAt'> & {
    createdAt: string
    updatedAt: string
}

export type JudgingVote = Omit<JudgingVoteDTO, 'createdAt'|'updatedAt'> & {
    createdAt: Dayjs
    updatedAt: Dayjs
}

export type SerializedJudgingVote = Omit<JudgingVote, 'createdAt'|'updatedAt'> & {
    createdAt: string
    updatedAt: string
}

export type AppConfig = Omit<AppConfigDTO, 'createdAt'|'updatedAt'> & {
    createdAt: Dayjs
    updatedAt: Dayjs
}

export type SerializedAppConfig = Omit<AppConfig, 'createdAt'|'updatedAt'> & {
    createdAt: string
    updatedAt: string
}
