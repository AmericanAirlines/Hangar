import { EventDTO } from '@hangar/database'
import { Dayjs } from 'dayjs';

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
