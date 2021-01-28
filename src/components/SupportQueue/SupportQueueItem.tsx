/* global fetch */
import React from 'react';
import { DateTime } from 'luxon';
import { SupportRequestType } from '../../types/supportRequest';

export interface RequestItem {
  id: number;
  name: string;
  supportName: string;
  type: SupportRequestType;
  movedToInProgressAt: string;
}

interface SupportQueueItemProps {
  secret: string;
  supportName: string;
  request: RequestItem;
  refetch: () => Promise<void>;
}

export const SupportQueueItem: React.FC<SupportQueueItemProps> = ({ secret, supportName, request, refetch }) => {
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
    <div className={`card shadow mt-2 ${request.supportName === supportName ? 'bg-primary text-light' : 'bg-light'}`}>
      <div className="card-body">
        <h5 className="card-title">
          {request.name} <small style={{ opacity: 0.7 }}>{DateTime.fromISO(request.movedToInProgressAt).toRelative()}</small>
        </h5>
        {request.supportName ? (
          <p>
            Request Owner: <span style={{ fontWeight: 'bold' }}>{request.supportName}</span>
          </p>
        ) : null}
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
