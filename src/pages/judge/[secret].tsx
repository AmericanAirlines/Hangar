/* globals localStorage, fetch */

import React from 'react';

interface Team {
  id: number;
  name: string;
  tableNumber: number;
  projectDescription: string;
}

const judge = (): JSX.Element => {
  const [startJudging, setStartJudging] = React.useState(false);
  const [error, setError] = React.useState<string | null>();
  const [loading, setLoading] = React.useState(true);
  const [judgeId, setJudgeId] = React.useState<string | null>('');
  const [currentTeam, setCurrentTeam] = React.useState<Team | null>(null);
  const [previousTeam, setPreviousTeam] = React.useState<Team | null>(null);

  const firstTeam = !!currentTeam && !previousTeam;
  const doneJudging = !currentTeam && !previousTeam;

  React.useEffect(() => {
    if (!startJudging) return;

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
  }, [startJudging]);

  React.useEffect(() => {
    if (!startJudging) return;

    localStorage.setItem('judgeId', judgeId);

    if (judgeId) {
      setLoading(true);

      (async (): Promise<void> => {
        const res = await fetch(`/api/judge/teams?id=${judgeId}`);

        if (!res.ok) {
          setError('Problem fetching teams');
          setLoading(false);
          return;
        }

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
        }
        setLoading(false);
      })();
    }
  }, [judgeId]);

  const voteHandler = (currentTeamChosen?: boolean) => async (): Promise<void> => {
    setLoading(true);

    const res = await fetch('/api/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentTeamChosen, id: judgeId }),
    });

    if (!res.ok) {
      setError('Problem fetching teams');
      setLoading(false);
      return;
    }

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
    }
    setLoading(false);
  };

  const skipHandler = () => async (): Promise<void> => {
    setLoading(true);

    const res = await fetch('/api/skip', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: judgeId }),
    });

    if (!res.ok) {
      setError('Problem fetching teams');
      setLoading(false);
      return;
    }

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
    }
    setLoading(false);
  };

  if (!startJudging) {
    return (
      <div className="text-center mt-5">
        <img className="mb-4" src="/logo.png" />
        <h4 className="text-center">Make sure to open this in a browser (not through an app)</h4>
        <button className="btn btn-primary" onClick={(): void => setStartJudging(true)}>
          Start Judging
        </button>
      </div>
    );
  }

  if (loading) {
    return <h1>Loading</h1>;
  }

  if (doneJudging) {
    return (
      <>
        <h1 style={{ marginTop: 50 }} className="text-center">
          Congratulations!
        </h1>
        <h4 className="text-center">You are a supreme judger</h4>
        <h5 className="text-center">You&apos;re done with judging</h5>
        <h6 className="text-center">Thanks</h6>
      </>
    );
  }

  return (
    <div className="container-fluid text-center">
      <h1>Welcome Judge!</h1>
      {error && <p style={{ color: 'red' }}>{error}, refresh and try again</p>}
      {currentTeam && (
        <div className="alert alert-info text-left" role="alert">
          <h3>Current Team</h3>
          <h4>{currentTeam.name}</h4>
          <p>
            <strong>Location: {currentTeam.tableNumber}</strong>
          </p>
          <p>{currentTeam.projectDescription}</p>
        </div>
      )}
      {previousTeam && (
        <div className="alert alert-info text-left" role="alert">
          <h3>Previous Team</h3>
          <h4>{previousTeam.name}</h4>
          <p>
            <strong>Location: {previousTeam.tableNumber}</strong>
          </p>
          <p>{previousTeam.projectDescription}</p>
        </div>
      )}
      {firstTeam && <h3>Once you&apos;ve judged the current team, press continue</h3>}
      {firstTeam && (
        <button type="button" className="btn btn-primary btn-lg" onClick={voteHandler()}>
          Next Team
        </button>
      )}
      {!firstTeam && (
        <>
          <h3>Which team was better?</h3>
          <div className="btn-group" role="group">
            <button type="button" className="btn btn-primary" onClick={voteHandler(false)}>
              Previous Team
            </button>
            <button type="button" className="btn btn-default" onClick={skipHandler()}>
              Skip Team
            </button>
            <button type="button" className="btn btn-primary" onClick={voteHandler(true)}>
              Current Team
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
judge.getInitialProps = async (ctx: any): Promise<any> => ({
  secret: ctx.query.secret,
});

export default judge;
