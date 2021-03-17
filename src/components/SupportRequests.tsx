/* global fetch */
import React from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { SupportRequestType } from '../types/supportRequest';
import { DateTime } from 'luxon';
import { SUPPORT_NAME_KEY } from '../pages/support/[secret]';

export interface Team {
  id: number;
  createdAt: string;
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
      Object.keys(team).forEach((key) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        var val = (team as any)[key as keyof Team];
        // console.log(key);
        // console.log(val);
        if (key == 'createdAt') {
          // console.log('HELLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLo');
          // console.log(DateTime.fromISO((team as any)[key as keyof Team]).toRelative());
          // console.log((team as any)[key as keyof Team]);
          val = DateTime.fromISO((team as any)[key as keyof Team]);
        }
        if (Array.isArray(val)) {
          // eslint-disable-next-line no-param-reassign, @typescript-eslint/no-explicit-any
          ((team as unknown) as any)[key] = val.join(', ');
        }
      });
    });

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
      console.log('HELLLO');
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
      console.log(supportRequestId);
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

    columns = keys
      .sort((a, b) => a.localeCompare(b))
      .map((key) => ({
        name: toTitleCase(key),
        selector: key,
        sortable: true,
      })) as TableColumn[];

    columns = [
      {
        name: 'Name',
        selector: 'name',
        sortable: true,
        grow: 2,
        wrap: true,
      },
      {
        name: 'Type',
        selector: 'type',
        sortable: true,
        grow: 2,
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
        name: 'Created At',
        selector: 'createdAt',
        sortable: true,
        grow: 2,
        wrap: true,
      },
      {
        name: 'Action',
        cell: (row, index, column, id) => (
          <button className="btn btn-dark w-100 my-2" onClick={getSpecific(+id, row.type)}>
            Select
          </button>
        ),
      },
      {
        name: 'Action',
        cell: (row, index, column, id) => (
          <button className="btn btn-danger mr-2" onClick={abandonRequest(+id, row.movedToInProgressAt)}>
            No Show
          </button>
        ),
      },
      {
        name: 'Action',
        cell: (row, index, column, id) => (
          <button className="btn btn-success mr-2" onClick={closeRequest(+id)}>
            Complete
          </button>
        ),
      },
      {
        name: 'Action',
        cell: (row, index, column, id) => (
          <button className="btn btn-secondary" onClick={remindUser(+id, row.movedToInProgressAt)}>
            Remind
          </button>
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
        <div className="container px-0">
          <div className="row">
            <div className="col-12">
              {error ? <div className="alert alert-danger mt-3">There was an error fetching support data</div> : null}
              {teams.length > 0 ? (
                <DataTable columns={columns} data={teams} expandableRows expandableRowsComponent={<ExpandableRow />} />
              ) : (
                'No teams registered yet... check back soon!'
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
