/* global fetch */
import React from 'react';
import { debounce } from 'lodash';

export interface Config {
  key: string;
  value: string; // For later use: value?: string | number | boolean | null;
}

interface ConfigComponentProps { // What needs to be here?
  secret: string; // only if we need auth here
  configItem: Config;
}

export const ConfigComponent: React.FC<ConfigComponentProps> = ({ secret, configItem }) => {
  const [value, setValue] = React.useState(configItem.value);

  const update = async (): Promise<void> => {
    console.log('Update');
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        body: JSON.stringify({
          configKey: configItem.key,
          configValue: value,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error();
      }
    } catch (err) {
      throw new Error();
    }
  };

  const debouncedUpdate = debounce(update, 500);

  React.useEffect(() => {
    console.log('Value changed');
    debouncedUpdate();
  }, [value]);

  const handleBooleanChange = () => async (): Promise<void> => {
    const newValue = value === 'true' ? 'false' : 'true'; // For future use: const newValue = !value;
    setValue(newValue);
  };

  const handleChange = (event) => async (): Promise<void> => {
    setValue(event.target.value);
    console.log(event.target.value);
  };

  const configType = typeof value;

  switch (configType) {
    case 'string':
      return (
        <div key={configItem.key} className="form-group mb-2">
          <label htmlFor={configItem.key} className="mr-3">
            {configItem.key}
          </label>
          <div style={{ display: 'flex' }}>
            <input
              type="text"
              style={{ flex: 1 }}
              className="form-control"
              id={configItem.key}
              placeholder="Team name"
              value={value}
              onInput={(e) => setValue(e.target.value)}
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>
      );
    case 'boolean':
      return (
        <div key={configItem.key} className="form-group mb-2">
          <label htmlFor={configItem.key} className="mr-3">
            {configItem.key}
          </label>
          <div style={{ display: 'flex' }}>
            <input
              type="text"
              style={{ flex: 1 }}
              className="form-control"
              id={configItem.key}
              placeholder="Team name"
              value={value} // Will be toString(value) when this is a real bool
              disabled
            />
            <button type="button" style={{ flex: 0 }} className="btn btn-primary ml-2" onClick={handleBooleanChange()}>
              {value === 'true' ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>
      );
    case 'number':
      return <h4>I am a number</h4>;
    default:
      return <h4>Probably null</h4>;
  }
};
