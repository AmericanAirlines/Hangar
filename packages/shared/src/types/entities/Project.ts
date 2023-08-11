import { ProjectDTO } from '@hangar/database'
import { Dayjs } from 'dayjs';

export type Project = Omit<ProjectDTO, 'createdAt'|'updatedAt'> & {
    createdAt: Dayjs
    updatedAt: Dayjs
}

export type SerializedProject = Omit<Project, 'createdAt'|'updatedAt'> & {
    createdAt: string
    updatedAt: string
}
