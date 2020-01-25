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
      setLastUpdateEpoch(Date.now());
    } catch (err) {
      setError(true);
    }
  };

  const closeRequest = (supportRequestId: number) => async (): Promise<void> => {
    const res = await fetch('/api/supportRequest/closeRequest', {
      method: 'POST',
      body: JSON.stringify({ supportRequestId }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      setError(true);
      return;
    }

    try {
      setLastUpdateEpoch(Date.now());
    } catch (err) {
      setError(true);
    }
  };

  if (loading) return null;

  if (error) return <h4>Error loading, check the console</h4>;

  return (
    <div className="container mt-4">
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
              {requests.length === 0 ? (
                <div className="alert alert-info mt-3">None in progress, press button to get the next one ☝️</div>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">In Progress Age</th>
                      <th scope="col">Type</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((request) => (
                      <tr key={request.id}>
                        <td>{request.name}</td>
                        <td>{DateTime.fromISO(request.movedToInProgressAt).toRelative()}</td>
                        <td>{request.type}</td>
                        <td>
                          <button className="btn btn-danger" onClick={closeRequest(request.id)}>
                            Close
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
