/* global fetch */
import React from 'react';
// import debounce from 'lodash/debounce';

export interface Config {
  key: string;
  value: 'simple-json'; // Change to simple-json
}

interface ConfigComponentProps { // What needs to be here?
  key: string;
  value: 'simple-json'; // Change to simple-json
}

export const ConfigComponent: React.FC<ConfigComponentProps> = () => { // Other components pass their props as params but I can't see any reason to do so here
  const [configItems, setConfigItems] = React.useState<Config[]>([]);
  const [error, setError] = React.useState(false);
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
          const temp = await res.json();
          setConfigItems(temp);

          // console.log(temp);
        } catch (err) {
          setError(true);
        }
      })(),
    );

    // Promise.all(promises).then(() => setLoading(false));
  }, [lastRefreshTimestamp]);

  const handleStringChange = (configItem) => async (): Promise<void> => {
    const newValue = configItem.value;

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

  const handleBooleanChange = (configItem) => async (): Promise<void> => {
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

  if (error) return <h4>Error loading, check the console</h4>;

  return (
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
                    type={typeof configItem.key === 'number' ? 'number' : 'text'} // TODO: Should check if it's a number first
                    style={{ flex: 1 }}
                    className="form-control"
                    id={configItem.key}
                    placeholder="Team name"
                    value={configItem.value === null ? 'This is null' : JSON.stringify(configItem.value)} // TODO: Make sure to change the val to a string for display
                    disabled={typeof configItem.value === 'boolean'} // TODO: Only disable for booleans
                    onChange={handleStringChange(configItem)} // TODO: make an onChange listener to save the changes for strings and numbers. Use debounce to delay instead of just using onBlur
                    />
                    <button type="button" style={{ flex: 0 }} className="btn btn-primary ml-2" onClick={handleBooleanChange(configItem)}>
                    {JSON.stringify(configItem.value) === '"true"' ? 'Disable' : 'Enable'}
                    </button>
                </div>
                </div>
            ))}
            </div>
        </div>
    </div>
  );
};
