/* globals localStorage, fetch */

import React from 'react';

interface Team {
  id: number;
  name: string;
  tableNumber: number;
  projectDescription: string;
}

const judge = (): JSX.Element => {
  const [error, setError] = React.useState<string | null>();
  const [loading, setLoading] = React.useState(true);
  const [judgeId, setJudgeId] = React.useState<string | null>('');
  const [isDoneJudging, setIsDoneJudging] = React.useState(false);
  const [currentTeam, setCurrentTeam] = React.useState<Team | null>(null);
  const [previousTeam, setPreviousTeam] = React.useState<Team | null>(null);

  React.useEffect(() => {
    let id = localStorage.getItem('judgeId');

    if (!id) {
      (async (): Promise<void> => {
        const res = await fetch('/api/judge', {
          method: 'POST',
        });

        if (!res.ok) setError('Problem creating judge');

        id = await res.text();

        setJudgeId(id);
      })();
    } else {
      setJudgeId(id);
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem('judgeId', judgeId);

    if (judgeId) {
      setLoading(true);

      (async (): Promise<void> => {
        const res = await fetch(`/api/judge/teams?id=${judgeId}`);

        if (!res.ok) setError('Problem fetching teams');

        const { currentTeam: cTeam, previousTeam: pTeam } = await res.json();

        if (cTeam) {
          setCurrentTeam(cTeam);
          if (pTeam) {
            setPreviousTeam(pTeam);
          } else {
            setPreviousTeam(null);
          }
        } else {
          setCurrentTeam(null);
          setPreviousTeam(null);
          setIsDoneJudging(true);
        }
        setLoading(false);
      })();
    }
  }, [judgeId]);

  return (
    <>
      <h1>Welcome Judge!</h1>
      {loading && <p>Loading ...</p>}
      {!loading && error && <p style={{ color: 'red' }}>{error}, refresh and try again</p>}
      {currentTeam && <p>{currentTeam.name}</p>}
      {previousTeam && <p>{previousTeam.name}</p>}
      {currentTeam && !previousTeam && <p>Once you've judged the current team, press continue</p>}
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
judge.getInitialProps = async (ctx: any): Promise<any> => {
  if (ctx.res && ctx.query.secret !== process.env.JUDGE_SECRET) {
    ctx.res.statusCode = 404;
    ctx.res.end('Not found');
    return {};
  }

  return { hi: 'hi' };
};

export default judge;
