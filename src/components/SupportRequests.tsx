/* global fetch */
import React from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { SupportRequestType } from '../types/supportRequest';
import { DateTime } from 'luxon';

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
        const val = key == 'createdAt' ? DateTime.fromISO((team as any)[key as keyof Team]).toRelative() : (team as any)[key as keyof Team];
        // console.log(key);
        // console.log(val);
        // if (key == 'createdAt') {
        //   console.log('HELLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLo');
        //   // console.log(DateTime.fromISO((team as any)[key as keyof Team]).toRelative());
        //   console.log((team as any)[key as keyof Team]);
        //   val = DateTime.fromISO((team as any)[key as keyof Team]);
        // }
        if (Array.isArray(val)) {
          // eslint-disable-next-line no-param-reassign, @typescript-eslint/no-explicit-any
          ((team as unknown) as any)[key] = val.join(', ');
        }
      });
    });

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
        name: 'createdAt',
        selector: 'createdAt',
        sortable: true,
        grow: 2,
        wrap: true,
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
