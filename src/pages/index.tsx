/* global fetch */
import React from 'react';
import { NextComponentType } from 'next';
import { DateTime } from 'luxon';
import { SupportRequest } from '../entities/supportRequest';

interface Request extends Omit<SupportRequest, 'movedToInProgressAt'> {
  movedToInProgressAt: string;
}

const AdminPage: NextComponentType = () => {
  const [lastUpdateEpoch, setLastUpdateEpoch] = React.useState(Date.now());
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [counts, setCounts] = React.useState({ ideaCount: 0, technicalCount: 0 });
  const [requests, setRequests] = React.useState<Request[]>([]);
  const [lastPop, setLastPop] = React.useState<null | { userNotified: boolean; supportRequest: Request }>(null);

  React.useEffect(() => {
    const promises: Promise<void>[] = [];

    promises.push(
      (async (): Promise<void> => {
        const res = await fetch('/api/supportRequest/getInProgress');

        if (!res.ok) {
          setError(true);
          return;
        }

        try {
          setRequests(await res.json());
        } catch (err) {
          setError(true);
        }
      })(),
    );

    promises.push(
      (async (): Promise<void> => {
        const res = await fetch('/api/supportRequest/getCount');

        if (!res.ok) {
          setError(true);
          return;
        }

        try {
          setCounts(await res.json());
        } catch (err) {
          setError(true);
        }
      })(),
    );

    Promise.all(promises).then(() => setLoading(false));
  }, [lastUpdateEpoch]);

  const popQueue = async (): Promise<void> => {
    const res = await fetch('/api/supportRequest/getNext', {
      method: 'POST',
    });

    if (!res.ok) {
      setError(true);
      return;
    }

    try {
      setLastPop(await res.json());
      setLastUpdateEpoch(Date.now());
    } catch (err) {
      setError(true);
    }
  };

  const abandonRequest = (supportRequestId: number) => async (): Promise<void> => {
    await fetch('/api/supportRequest/abandonRequest', {
      method: 'POST',
      body: JSON.stringify({ supportRequestId }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    try {
      setLastUpdateEpoch(Date.now());
    } catch (err) {
      setError(true);
    }
  };

  const closeRequest = (supportRequestId: number) => async (): Promise<void> => {
    await fetch('/api/supportRequest/closeRequest', {
      method: 'POST',
      body: JSON.stringify({ supportRequestId }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    try {
      setLastUpdateEpoch(Date.now());
    } catch (err) {
      setError(true);
    }
  };

  if (loading) return null;

  if (error) return <h4>Error loading, check the console</h4>;

  return (
    <div className="container-fluid mt-4">
      <div className="row mb-4">
        <div className="col">
          <h1>Hello, Admin 👋</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="font-weight-normal">Support Queue</h2>
              <button className="btn btn-dark w-100 mt-4" onClick={popQueue}>
                Get Next in Queue ({counts.ideaCount + counts.technicalCount})
              </button>
              {lastPop && (
                <div className="alert alert-info mt-3">
                  {lastPop.userNotified
                    ? `${lastPop.supportRequest.name} has been notified to come over`
                    : `There was a problem notifying ${lastPop.supportRequest.name}, send them a message and tell them you&apos;re ready for them`}
                </div>
              )}
              {requests.length === 0 ? (
                <div className="alert alert-info mt-3">None in progress, press button to get the next one ☝️</div>
              ) : (
								requests.map((request) => (
									<div key={request.id} className="card bg-light shadow mt-2">
										<div className="card-body">
											<h5 className="card-title">{request.name} <small className="text-muted">{DateTime.fromISO(request.movedToInProgressAt).toRelative()}</small></h5>
											<p className="card-text">{request.type}</p>
											<button className="btn btn-warning mr-2" onClick={abandonRequest(request.id)}>
												No Show
											</button>
											<button className="btn btn-success" onClick={closeRequest(request.id)}>
												Complete
											</button>
										</div>
									</div>
								))
              )}
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="font-weight-normal">Judge Results</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
