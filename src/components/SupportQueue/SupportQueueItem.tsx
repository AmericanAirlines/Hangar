/* global fetch */
import React from 'react';
import { DateTime } from 'luxon';
import { SupportRequestType } from '../../types/supportRequest';

export interface RequestItem {
  id: number;
  name: string;
  type: SupportRequestType;
  movedToInProgressAt: string;
}

interface SupportQueueItemProps {
  secret: string;
  request: RequestItem;
  refetch: () => Promise<void>;
}

export const SupportQueueItem: React.FC<SupportQueueItemProps> = ({ secret, request, refetch }) => {
  const abandonRequest = (supportRequestId: number, movedToInProgressAt: string) => async (): Promise<void> => {
    const relativeTimeElapsedString = DateTime.fromISO(movedToInProgressAt).toRelative();
    await fetch('/api/supportRequest/abandonRequest', {
      method: 'POST',
      body: JSON.stringify({ supportRequestId, relativeTimeElapsedString }),
      headers: {
        'Content-Type': 'application/json',
        authorization: secret,
      },
    });

    await refetch();
  };

  const closeRequest = (supportRequestId: number) => async (): Promise<void> => {
    await fetch('/api/supportRequest/closeRequest', {
      method: 'POST',
      body: JSON.stringify({ supportRequestId }),
      headers: {
        'Content-Type': 'application/json',
        authorization: secret,
      },
    });

    await refetch();
  };

  return (
    <div className="card bg-light shadow mt-2">
      <div className="card-body">
        <h5 className="card-title">
          {request.name} <small className="text-muted">{DateTime.fromISO(request.movedToInProgressAt).toRelative()}</small>
        </h5>
        <p className="card-text">{request.type.replace(/([A-Z]+)/g, ' $1').trim()}</p>
        <button className="btn btn-danger mr-2" onClick={abandonRequest(request.id, request.movedToInProgressAt)}>
          No Show
        </button>
        <button className="btn btn-success" onClick={closeRequest(request.id)}>
          Complete
        </button>
      </div>
    </div>
  );
};
