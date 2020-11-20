/* eslint-disable no-nested-ternary */
/* global fetch, window, alert */
import React from 'react';
import { DateTime } from 'luxon';
import { useFormik } from 'formik';
import { NextPage } from 'next';

interface Request {
  id: number;
  name: string;
  type: string;
  movedToInProgressAt: string;
}

const SUPPORT_NAME_KEY = 'supportName';

const support: NextPage<{ secret: string }> = (props): JSX.Element => {
  const [lastUpdateEpoch, setLastUpdateEpoch] = React.useState(Date.now());
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [counts, setCounts] = React.useState({ ideaCount: 0, technicalCount: 0 });
  const [requests, setRequests] = React.useState<Request[]>([]);
  const [lastPop, setLastPop] = React.useState<null | { userNotified: boolean; supportRequest: Request }>(null);
  const formik = useFormik({
    initialValues: {
      supportName: '',
    },
    onSubmit({ supportName }) {
      window.localStorage.setItem(SUPPORT_NAME_KEY, supportName.trim());
    },
  });

  async function getAndSetCount(): Promise<void> {
    const res = await fetch('/api/supportRequest/getCount', { headers: { authorization: props.secret } });
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
    formik.setFieldValue('supportName', window.localStorage.getItem(SUPPORT_NAME_KEY));

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
        const res = await fetch('/api/supportRequest/getInProgress', { headers: { authorization: props.secret } });

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

    Promise.all(promises).then(() => setLoading(false));
  }, [lastUpdateEpoch]);

  const getNext = async (): Promise<void> => {
    if (!window.localStorage.getItem(SUPPORT_NAME_KEY)) {
      alert('Please set your name first'); // eslint-disable-line no-alert
      return;
    }

    const res = await fetch('/api/supportRequest/getNext', {
      method: 'POST',
      body: JSON.stringify({ supportName: window.localStorage.getItem(SUPPORT_NAME_KEY) }),
      headers: {
        'Content-Type': 'application/json',
        authorization: props.secret,
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
      if (counts.technicalCount + counts.ideaCount === 0) {
        getAndSetCount();
      }
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
        authorization: props.secret,
      },
    });

    try {
      if (counts.technicalCount + counts.ideaCount === 0) {
        getAndSetCount();
      }
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
          <h1>Support Dashboard</h1>
        </div>
        <div className="col-12 col-md-6">
          <form className="form-inline float-md-right" onSubmit={formik.handleSubmit}>
            <div className="form-group ml-sm-3 mr-3 mb-2">
              <label htmlFor="supportName" className="mr-3">
                Your Name
              </label>
              <input
                type="text"
                className="form-control"
                id="supportName"
                placeholder="Your name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.supportName}
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
                  {lastPop.supportRequest !== null
                    ? lastPop.userNotified
                      ? `${lastPop.supportRequest.name} has been notified to come over`
                      : `There was a problem notifying ${lastPop.supportRequest.name}, send them a message and tell them you're ready for them`
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
      </div>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
support.getInitialProps = async (ctx: any): Promise<any> => {
  if (ctx.res && ctx.query.secret !== process.env.SUPPORT_SECRET) {
    ctx.res.statusCode = 404;
    ctx.res.end('Not found');
  }

  return {
    secret: process.env.SUPPORT_SECRET,
  };
};

export default support;
