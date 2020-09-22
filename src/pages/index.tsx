/* global fetch, window, alert */
import React from 'react';
import { NextComponentType } from 'next';
import { DateTime } from 'luxon';
import { useFormik } from 'formik';

interface Request {
  id: number;
  name: string;
  type: string;
  movedToInProgressAt: string;
}

interface Result {
  name: string;
  numberOfIdeaPitches: number;
  numberOfTechSupportSessions: number;
  score: number;
  bonusPointsAwarded: number;
  finalScore: number;
}

const ADMIN_NAME_KEY = 'adminName';

const AdminPage: NextComponentType = () => {
  const [lastUpdateEpoch, setLastUpdateEpoch] = React.useState(Date.now());
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [counts, setCounts] = React.useState({ ideaCount: 0, technicalCount: 0 });
  const [requests, setRequests] = React.useState<Request[]>([]);
  const [lastPop, setLastPop] = React.useState<null | { userNotified: boolean; supportRequest: Request }>(null);
  const [results, setResults] = React.useState<Result[]>([]);
  const formik = useFormik({
    initialValues: {
      adminName: '',
    },
    onSubmit({ adminName }) {
      window.localStorage.setItem(ADMIN_NAME_KEY, adminName.trim());
    },
  });

  async function getAndSetCount(): Promise<void> {
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
  }

  React.useEffect(() => {
    formik.setFieldValue('adminName', window.localStorage.getItem(ADMIN_NAME_KEY));

    const timer = setInterval(() => {
      setLastUpdateEpoch(Date.now());
    }, 10000);

    return (): void => {
      clearInterval(timer);
    };
  }, []);

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

    promises.push(getAndSetCount());

    promises.push(
      (async (): Promise<void> => {
        const res = await fetch('/api/judging/results');

        if (!res.ok) {
          setError(true);
          return;
        }

        try {
          setResults(await res.json());
        } catch (err) {
          setError(true);
        }
      })(),
    );

    Promise.all(promises).then(() => setLoading(false));
  }, [lastUpdateEpoch]);

  const getNext = async (): Promise<void> => {
    if (!window.localStorage.getItem(ADMIN_NAME_KEY)) {
      alert('Please set your name first'); // eslint-disable-line no-alert
      return;
    }

    const res = await fetch('/api/supportRequest/getNext', {
      method: 'POST',
      body: JSON.stringify({ adminName: window.localStorage.getItem(ADMIN_NAME_KEY) }),
      headers: {
        'Content-Type': 'application/json',
      },
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

  const abandonRequest = (supportRequestId: number, movedToInProgressAt: string) => async (): Promise<void> => {
    const relativeTimeElapsedString = DateTime.fromISO(movedToInProgressAt).toRelative();
    await fetch('/api/supportRequest/abandonRequest', {
      method: 'POST',
      body: JSON.stringify({ supportRequestId, relativeTimeElapsedString }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    try {
      if(counts.technicalCount + counts.ideaCount === 0){getAndSetCount()};
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
      if(counts.technicalCount + counts.ideaCount === 0){getAndSetCount()};
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
        <div className="col-12 col-md-6">
          <h1>Hello, Admin 👋</h1>
        </div>
        <div className="col-12 col-md-6">
          <form className="form-inline float-md-right" onSubmit={formik.handleSubmit}>
            <div className="form-group ml-sm-3 mr-3 mb-2">
              <label htmlFor="adminName" className="mr-3">
                Your Name
              </label>
              <input
                type="text"
                className="form-control"
                id="adminName"
                placeholder="Your name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.adminName}
              />
            </div>
            <button type="submit" className="btn btn-primary mb-2">
              Save
            </button>
          </form>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="font-weight-normal">Support Queue</h2>
              <button className="btn btn-dark w-100 mt-4" onClick={getNext} disabled={counts.ideaCount + counts.technicalCount === 0}>
                Get Next in Queue ({counts.ideaCount + counts.technicalCount})
              </button>
              {lastPop && (
                <div className="alert alert-info mt-3">
                  {
                  (lastPop.supportRequest !== null) ?  
                    (lastPop.userNotified
                      ? `${lastPop.supportRequest.name} has been notified to come over`
                      : `There was a problem notifying ${lastPop.supportRequest.name}, send them a message and tell them you're ready for them`)
                    : 'It appears you are trying to access a support request that does not exist!'}
                </div>
              )}
              {requests.length === 0 ? (
                <div className="alert alert-info mt-3">None in progress, press button to get the next one ☝️</div>
              ) : (
                requests.map((request) => (
                  <div key={request.id} className="card bg-light shadow mt-2">
                    <div className="card-body">
                      <h5 className="card-title">
                        {request.name} <small className="text-muted">{DateTime.fromISO(request.movedToInProgressAt).toRelative()}</small>
                      </h5>
                      <p className="card-text">{request.type === 'TechnicalSupport' ? 'Technical Support' : 'Idea Pitch'}</p>
                      <button className="btn btn-danger mr-2" onClick={abandonRequest(request.id, request.movedToInProgressAt)}>
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
              {results.length === 0 && <div className="alert alert-info mt-3">Not enough votes to calculate results 🤔</div>}
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Team Score</th>
                    <th>Bonus Points</th>
                    <th>Final Score</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result.name}>
                      <td>{result.name}</td>
                      <td>{result.score.toFixed(1)}</td>
                      <td>{result.bonusPointsAwarded.toFixed(0)}</td>
                      <td>{result.finalScore.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
