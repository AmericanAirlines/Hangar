import { Dayjs } from 'dayjs';
import { Pretty } from '../utilities/Pretty';

type NodeDTO = {
  createdAt: Date;
  updatedAt: Date;
};

export type Node<T extends NodeDTO> = Pretty<
  Omit<T, 'createdAt' | 'updatedAt'> & {
    createdAt: Dayjs;
    updatedAt: Dayjs;
  }
>;

export type SerializedNode<T extends NodeDTO | Node<NodeDTO>> = Pretty<
  Omit<T, 'createdAt' | 'updatedAt'> & {
    createdAt: string;
    updatedAt: string;
  }
>;
