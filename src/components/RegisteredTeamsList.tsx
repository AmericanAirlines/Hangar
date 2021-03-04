/* global fetch */
import React from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';

export interface Team {
  id: number;
  name: string;
  members: string[];
  tableNumber: number;
  projectDescription: string;
}

interface RegisteredTeamsListProps {
  secret: string;
}

let columns: TableColumn[] = [];

function toTitleCase(text: string): string {
  return text.replace(/([A-Z])/g, ' $1').replace(/^./, (firstChar) => firstChar.toUpperCase());
}

const ExpandableRow: React.FC<{ data?: Team }> = (props) => (
  <div className="py-2 px-3">
    <p className="mb-1">Description</p>
    <p style={{ fontSize: 12 }}>{props.data?.projectDescription ?? '¯\\_(ツ)_/¯'}</p>
  </div>
);

export const RegisteredTeamsList: React.FC<RegisteredTeamsListProps> = ({ secret }) => {
  const [error, setError] = React.useState(false);
  const [teams, setTeams] = React.useState<Team[]>([]);

  const timeoutRef = React.useRef<NodeJS.Timeout>(null);

  const fetchValues = async (): Promise<void> => {
    const res = await fetch('/api/team/getAll', { headers: { authorization: secret } });

    if (!res.ok) {
      setError(true);
      return;
    }

    const teamData: Team[] = await res.json();
   
    const keys = Object.keys(teamData[0] ?? {}).filter((key) => !['id', 'name', 'members', 'tableNumber', 'projectDescription'].includes(key));
    teamData.forEach((team: Team) => {
      Object.keys(team).forEach((key) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const val = (team as any)[key as keyof Team];
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
        name: 'Channel Name',
        selector: 'channelName',
        sortable: true,
        grow: 2,
        wrap: true,
      },
      {
        name: 'Members',
        selector: 'members',
        sortable: false,
        grow: 2,
        wrap: true,
      },
      {
        name: 'Table Number',
        selector: 'tableNumber',
        sortable: true,
      },
      {
        name: 'Active Judge Count',
        selector: 'activeJudgeCount',
        sortable: true,
      },
      {
        name: 'Judge Visits',
        selector: 'judgeVisits',
        sortable: true,
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
        <h2 className="font-weight-normal">Registered Teams</h2>
        <div className="container px-0">
          <div className="row">
            <div className="col-12">
              {error ? <div className="alert alert-danger mt-3">There was an error fetching team data</div> : null}
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
