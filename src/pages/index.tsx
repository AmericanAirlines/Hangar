/* global fetch */
import React from 'react';
import { NextComponentType } from 'next';
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

    promises.push(
      (async (): Promise<void> => {
        const res = await fetch('/api/config');

        if (!res.ok) {
          setError(true);
          return;
        }

        try {
          setConfigItems(await res.json());
        } catch (err) {
          setError(true);
        }
      })(),
    );

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

  const handleChange = (configItem: Config) => async (): Promise<void> => { // TODO: Rename to something like handleBooleanChange bc only used for boolean button
    const newValue = configItem.value === 'true' ? 'false' : 'true'; // TODO: Change to just flip real booleans instead of strings

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        body: JSON.stringify({
          configKey: configItem.key,
          configValue: newValue,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error();
      }

      const newConfigItem: Config = await res.json();

      const items = [...configItems];
      const index = items.findIndex((i) => i.key === newConfigItem.key);
      items[index] = newConfigItem;
      setConfigItems(items);
    } catch (err) {
      setError(true);
    }
  };

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
        <div className="col-12 col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="font-weight-normal">Config Items</h2>
              {configItems.length === 0 && <div className="alert alert-info mt-3">No config items to display 🤔</div>}

              {configItems.map((configItem) => (
                <div key={configItem.key} className="form-group mb-2">
                  <label htmlFor={configItem.key} className="mr-3">
                    {configItem.key}
                  </label>
                  <div style={{ display: 'flex' }}>
                    <input
                      type="text" // TODO: Should check if it's a number first
                      style={{ flex: 1 }}
                      className="form-control"
                      id={configItem.key}
                      placeholder="Team name"
                      value={configItem.value} // TODO: Make sure to change the val to a string for display
                      disabled // TODO: Only disable for booleans
                      // TODO: make an onChange listener to save the changes for strings and numbers. Use debounce to delay instead of just using onBlur
                    />
                    <button type="button" style={{ flex: 0 }} className="btn btn-primary ml-2" onClick={handleChange(configItem)}> // Remove for strings and numbers
                      {configItem.value === 'true' ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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
