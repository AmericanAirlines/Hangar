/* global fetch, window, alert */
import React from 'react';
import { SUPPORT_NAME_KEY } from '../../pages/support/[secret]';
import { SupportRequestType } from '../../types/supportRequest';
import { RequestItem, SupportQueueItem } from './SupportQueueItem';

interface SupportQueueProps {
  title: string;
  secret: string;
  options: Array<{
    name: string;
    requestType: SupportRequestType;
  }>;
}

export const SupportQueue: React.FC<SupportQueueProps> = ({ title, secret, options }) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [inProgress, setInProgress] = React.useState<RequestItem[]>([]);
  const [counts, setCounts] = React.useState(
    options.reduce((acc, option) => ({ ...acc, [option.requestType]: 0 }), {} as Record<SupportRequestType, number>),
  );

  const requestTypes = options.map((o) => o.requestType);

  const timeoutRef = React.useRef<NodeJS.Timeout>(null);
  const fetchValues = async (): Promise<void> => {
    const promises: Array<Promise<void>> = [];

    promises.push(
      (async (): Promise<void> => {
        const res = await fetch('/api/supportRequest/getInProgress', { headers: { authorization: secret } });

        if (!res.ok) {
          throw new Error();
        }

        setInProgress(await res.json());
      })(),
    );

    promises.push(
      (async (): Promise<void> => {
        const res = await fetch('/api/supportRequest/getCount', { headers: { authorization: secret } });

        if (!res.ok) {
          throw new Error();
        }

        setCounts(await res.json());
      })(),
    );

    await Promise.all(promises).catch(() => {
      setError(true);
    });

    if (loading) setLoading(false);

    timeoutRef.current = setTimeout(fetchValues, 10000);
  };
  React.useEffect(() => {
    fetchValues();

    return (): void => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getNext = async (requestType: SupportRequestType): Promise<void> => {
    setMessage('');

    if (!window.localStorage.getItem(SUPPORT_NAME_KEY)) {
      alert('Please set your name first'); // eslint-disable-line no-alert
      return;
    }

    const res = await fetch('/api/supportRequest/getNext', {
      method: 'POST',
      body: JSON.stringify({ supportName: window.localStorage.getItem(SUPPORT_NAME_KEY), requestType }),
      headers: {
        'Content-Type': 'application/json',
        authorization: secret,
      },
    });

    if (!res.ok) {
      setError(true);
      return;
    }

    try {
      const data = await res.json();

      if (!data.supportRequest) {
        setMessage('It appears you are trying to access a support request that does not exist!');
      } else if (!data.userNotified) {
        setMessage(`There was a problem notifying ${data.supportRequest.name}, send them a direct message in Discord.`);
      } else if (data.supportRequest.type === SupportRequestType.JobChat) {
        setMessage(`${data.supportRequest.name} has been sent a link and should join soon!`);
      } else {
        setMessage(`The team has been notified, go join the ${data.supportRequest.name} voice channel in Discord!`);
      }

      await fetchValues();
    } catch (err) {
      setError(true);
    }
  };

  const getButtonWidth = (idx: number, length: number): string => {
    if (length > 1 && (idx % 2 === 1 || idx !== length - 1)) {
      return 'col-6';
    }

    return 'col-12';
  };

  return (
    <div className="card">
      <div className="card-body">
        {error ? <div className="alert alert-error mt-3">There was an error fetching data for the queue</div> : null}
        <h2 className="font-weight-normal">{title}</h2>
        <div className="container px-0">
          <div className="row">
            {options.map((option, idx) => (
              <div key={option.requestType} className={getButtonWidth(idx, options.length)}>
                <button className="btn btn-dark w-100 my-2" onClick={() => getNext(option.requestType)} disabled={counts[option.requestType] === 0}>
                  Get Next {option.name} ({counts[option.requestType]})
                </button>
              </div>
            ))}
          </div>
        </div>
        {message !== '' ? <div className="alert alert-info mt-3">{message}</div> : null}
        {loading ? <h4 className="font-weight-normal">Loading</h4> : null}
        {inProgress.length === 0 ? (
          <div className="alert alert-info mt-3">None in progress, get started when you're ready ☝️</div>
        ) : (
          inProgress
            .filter((request) => requestTypes.includes(request.type))
            .map((request) => <SupportQueueItem key={request.id} request={request} refetch={fetchValues} secret={secret} />)
        )}
      </div>
    </div>
  );
};
