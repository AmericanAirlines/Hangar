import { EventDTO } from '@hangar/database';
import { Dayjs } from 'dayjs';
import { Node, SerializedNode } from './Node';
import { Pretty } from '../utilities/Pretty';

export type Event = Pretty<
  Omit<Node<EventDTO>, 'start' | 'end'> & {
    start: Dayjs;
    end: Dayjs;
  }
>;

export type SerializedEvent = Pretty<
  Omit<SerializedNode<Event>, 'start' | 'end'> & {
    start: string;
    end: string;
  }
>;
