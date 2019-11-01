/* globals localStorage, fetch */

import React from 'react';

export default (): JSX.Element => {
  const [error, setError] = React.useState<string | null>();
  const [judgeId, setJudgeId] = React.useState<string | null>('');

  React.useEffect(() => {
    let id = localStorage.getItem('judgeId');

    if (!id) {
      (async (): Promise<void> => {
        const res = await fetch('/api/judge', {
          method: 'POST',
        });

        if (!res.ok) setError('Problem creating judge');

        id = await res.text();
      })();
    }

    setJudgeId(id);
  }, []);

  React.useEffect(() => {
    localStorage.setItem('judgeId', judgeId);
  }, [judgeId]);

  return (
    <>
      <h1>Welcome Judge!</h1>
      {error && <p style={{ color: 'red' }}>{error}, refresh and try again</p>}
    </>
  );
};
