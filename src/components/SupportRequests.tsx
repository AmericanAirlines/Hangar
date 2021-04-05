/* global fetch */
/* global window */
/* global alert */
/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/display-name */

import React, { ReactElement } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { DateTime } from 'luxon';
import { SupportRequestType } from '../types/supportRequest';
import { SUPPORT_NAME_KEY } from '../pages/support/[secret]';

export interface Team {
  id: number;
  createdAt: string;
  created: string;
  updatedAt: Date;
  movedToInProgressAt: Date;
  slackId: string;
  name: string;
  supportName: string;
  status: string;
  type: SupportRequestType;
  syncHash: string;
}

interface SupportRequestsProps {
  secret: string;
}

let columns: TableColumn[] = [];

function toTitleCase(text: string): string {
  return text.replace(/([A-Z])/g, ' $1').replace(/^./, (firstChar) => firstChar.toUpperCase());
}

const ExpandableRow: React.FC<{ data?: Team }> = (props) => (
  <div className="py-2 px-3">
    <p className="mb-1">Description</p>
    <p style={{ fontSize: 12 }}>{props.data?.createdAt ?? '¯\\_(ツ)_/¯'}</p>
  </div>
);

export const SupportRequests: React.FC<SupportRequestsProps> = ({ secret }) => {
  const [error, setError] = React.useState(false);
  const [teams, setTeams] = React.useState<Team[]>([]);
  const [message, setMessage] = React.useState('');

  const timeoutRef = React.useRef<NodeJS.Timeout>(null);

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

    await fetchValues();
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

    await fetchValues();
  };

  const remindUser = (supportRequestId: number, movedToInProgressAt: string) => async (): Promise<void> => {
    const relativeTimeElapsedString = DateTime.fromISO(movedToInProgressAt).toRelative();
    await fetch('/api/supportRequest/remindUser', {
      method: 'POST',
      body: JSON.stringify({ supportRequestId, relativeTimeElapsedString }),
      headers: {
        'Content-Type': 'application/json',
        authorization: secret,
      },
    });

    await fetchValues();
  };

  const getSpecific = (supportRequestId: number, requestType: SupportRequestType) => async (): Promise<void> => {
    setMessage('');
    if (!window.localStorage.getItem(SUPPORT_NAME_KEY)) {
      alert('Please set your name first'); // eslint-disable-line no-alert
      return;
    }

    const res = await fetch('/api/supportRequest/getSpecific', {
      method: 'PATCH',
      body: JSON.stringify({
        supportName: window.localStorage.getItem(SUPPORT_NAME_KEY),
        requestType,
        supportRequestId,
      }),
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

  const fetchValues = async (): Promise<void> => {
    const res = await fetch('/api/supportRequest/getAll', { headers: { authorization: secret } });

    if (!res.ok) {
      setError(true);
      return;
    }

    const teamData: Team[] = await res.json();
    const keys = Object.keys(teamData[0] ?? {}).filter(
      (key) => !['id', 'createdAt', 'updatedAt', 'movedToInProgressAt', 'slackId', 'name', 'supportName', 'status', 'type', 'syncHash'].includes(key),
    );

    teamData.forEach((team: Team) => {
      team.created = team.createdAt ? DateTime.fromISO(team.createdAt).toRelative() : '';
      Object.keys(team).forEach((key) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const val = (team as any)[key as keyof Team];

        if (Array.isArray(val)) {
          // eslint-disable-next-line no-param-reassign, @typescript-eslint/no-explicit-any
          ((team as unknown) as any)[key] = val.join(', ');
        }
      });
    });

    teamData.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    columns = keys
      .sort((a, b) => a.localeCompare(b))
      .map((key) => ({
        name: toTitleCase(key),
        selector: key,
        sortable: true,
      })) as TableColumn[];

    columns = [
      {
        name: 'ID',
        selector: 'id',
        sortable: true,
        grow: 1,
        wrap: true,
      },
      {
        name: 'Name',
        selector: 'name',
        sortable: true,
        grow: 1,
        wrap: true,
      },
      {
        name: 'Type',
        selector: 'type',
        sortable: true,
        grow: 4,
        wrap: true,
      },
      {
        name: 'Status',
        selector: 'status',
        sortable: true,
        grow: 2,
        wrap: true,
      },
      {
        name: 'Created',
        selector: 'created',
        sortable: true,
        grow: 3,
        wrap: true,
      },
      {
        name: 'Assignee',
        selector: 'supportName',
        sortable: true,
        grow: 2,
        wrap: true,
      },
      {
        name: 'Action',
        grow: 4,
        cell: (row, index, column, id): ReactElement =>
          row.status === 'InProgress' && row.supportName === window.localStorage.getItem(SUPPORT_NAME_KEY) ? (
            <div>
              <button
                className="btn btn-danger my-1 w-100 btn-sm"
                style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
                onClick={abandonRequest(+id, row.movedToInProgressAt)}
              >
                No Show
              </button>
              <button className="btn btn-success w-100 btn-sm" style={{ display: 'inline-block', whiteSpace: 'nowrap' }} onClick={closeRequest(+id)}>
                Complete
              </button>
              <button
                className="btn btn-secondary my-1 w-100 btn-sm"
                style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
                onClick={remindUser(+id, row.movedToInProgressAt)}
              >
                Remind
              </button>
            </div>
          ) : row.status === 'Pending' ? (
            <button
              className="btn btn-dark w-100 my-1 btn-sm"
              style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
              onClick={getSpecific(+id, row.type)}
            >
              Assign to me
            </button>
          ) : (
            <></>
          ),
      },
    ];

    setTeams(teamData);

    timeoutRef.current = setTimeout(fetchValues, 60000);
  };

  React.useEffect(() => {
    fetchValues();

    return (): void => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="font-weight-normal">Support Requests</h2>
        {message !== '' ? <div className="alert alert-info mt-3">{message}</div> : null}
        <div className="container px-0">
          <div className="row">
            <div className="col-12">
              {error ? <div className="alert alert-danger mt-3">There was an error fetching support data</div> : null}
              {teams.length > 0 ? (
                <DataTable columns={columns} data={teams} expandableRows expandableRowsComponent={<ExpandableRow />} />
              ) : (
                'No requests yet... check back soon!'
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
