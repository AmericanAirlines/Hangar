/* globals localStorage, fetch */

import React from 'react';

interface Team {
  id: number;
  name: string;
  tableNumber: number;
  projectDescription: string;
}

interface JudgeTeam {
  away: boolean;
  currentTeam: Team;
  previousTeam: Team;
}

const judge = (): JSX.Element => {
  const [startJudging, setStartJudging] = React.useState(false);
  const [error, setError] = React.useState<string | null>();
  const [loading, setLoading] = React.useState(true);
  const [judgeId, setJudgeId] = React.useState<string | null>('');
  const [currentTeam, setCurrentTeam] = React.useState<Team | null>(null);
  const [previousTeam, setPreviousTeam] = React.useState<Team | null>(null);
  const [away, setAway] = React.useState(false);

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

        const judgeTeam: JudgeTeam = await res.json();

        handleJudgeTeam(judgeTeam);
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

    const judgeTeam: JudgeTeam = await res.json();

    handleJudgeTeam(judgeTeam);
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

    const judgeTeam: JudgeTeam = await res.json();

    handleJudgeTeam(judgeTeam);
    setLoading(false);
  };

  const takeBreak = () => async (): Promise<void> => {
    setLoading(true);

    const res = await fetch('/api/break', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: judgeId }),
    });

    if (!res.ok) {
      setError('Problem taking break');
      setLoading(false);
      return;
    }

    const { success } = await res.json();
    setAway(success);
    setLoading(false);
  }

  const resumeJudging = () => async (): Promise<void> => {
    setLoading(true);

    const res = await fetch('/api/resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: judgeId }),
    });

    if (!res.ok) {
      setError('Problem resuming');
      setLoading(false);
      return;
    }

    const judgeTeam: JudgeTeam = await res.json();

    handleJudgeTeam(judgeTeam);
    setLoading(false);
  }

  const handleJudgeTeam = (judgeTeam: JudgeTeam): void => {
    if (judgeTeam.currentTeam) {
      setCurrentTeam(judgeTeam.currentTeam);
      if (judgeTeam.previousTeam) {
        setPreviousTeam(judgeTeam.previousTeam);
      } else {
        setPreviousTeam(null);
      }
    } else {
      setCurrentTeam(null);
      setPreviousTeam(null);
    }
    setAway(judgeTeam.away);
  }

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

  if (away) {
    return (
      <>
        <h1>Taking a break!</h1>
        <div className="btn-toolbar justify-content-around" role="toolbar">
          <div className="btn-group" role="group">
            <button type="button" className="btn btn-primary" onClick={resumeJudging()}>
              Resume Judging
            </button>
          </div>
        </div>
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
          <div className="btn-toolbar mb-3 justify-content-around" role="toolbar">
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
          </div>
          <div className="btn-toolbar mb-3 justify-content-around" role="toolbar">
            <div className="btn-group" role="group">
              <button type="button" className="btn btn-primary" onClick={takeBreak()}>
                Take a break
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
judge.getInitialProps = async (ctx: any): Promise<any> => {
  if (ctx.res && ctx.query.secret !== process.env.JUDGE_SECRET) {
    ctx.res.statusCode = 404;
    ctx.res.end('Not found');
  }

  return {};
};

export default judge;
