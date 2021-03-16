/* global fetch */
import React from 'react';
import { NextComponentType } from 'next';
import { ConfigComponent } from '../components/ConfigComponent';
// TODO: Add debounce import for string and number onChange

interface Result {
  name: string;
  numberOfIdeaPitches: number;
  numberOfTechSupportSessions: number;
  score: number;
  bonusPointsAwarded: number;
  finalScore: number;
}

interface Config {
  key: string;
  value: string;
}

const AdminPage: NextComponentType = () => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [configItems, setConfigItems] = React.useState<Config[]>([]);
  const [results, setResults] = React.useState<Result[]>([]);
  const [lastRefreshTimestamp, setLastRefreshTimestamp] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setLastRefreshTimestamp(Date.now());
    }, 10000);

    return (): void => {
      clearInterval(interval);
    };
  }, []);

  React.useEffect(() => {
    const promises: Promise<void>[] = [];

    // promises.push(
    //   (async (): Promise<void> => {
    //     const res = await fetch('/api/config');

    //     if (!res.ok) {
    //       setError(true);
    //       return;
    //     }

    //     try {
    //       setConfigItems(await res.json());
    //     } catch (err) {
    //       setError(true);
    //     }
    //   })(),
    // );

    promises.push(
      (async (): Promise<void> => {
        const res = await fetch('/api/judging/results');

        if (!res.ok) {
          setError(true);
          return;
        }

        try {
          setResults(await res.json());
        } catch (err) {
          setError(true);
        }
      })(),
    );

    Promise.all(promises).then(() => setLoading(false));
  }, [lastRefreshTimestamp]);



  if (loading) return null;

  if (error) return <h4>Error loading, check the console</h4>;

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-12 col-md-6">
          <h1>Hello, Admin 👋</h1>
        </div>
      </div>
      <div className="row">
        <ConfigComponent></ConfigComponent>
        <div className="col-12 col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="font-weight-normal">Judge Results</h2>
              {results.length === 0 && <div className="alert alert-info mt-3">Not enough votes to calculate results 🤔</div>}
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Team Score</th>
                    <th>Bonus Points</th>
                    <th>Final Score</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result.name}>
                      <td>{result.name}</td>
                      <td>{result.score.toFixed(1)}</td>
                      <td>{result.bonusPointsAwarded.toFixed(0)}</td>
                      <td>{result.finalScore.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
