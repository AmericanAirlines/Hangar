import React from 'react';

export interface Config {
  key: string;
  value: string | number | boolean | null;
}

interface ConfigItemProps {
  item: Config;
  onChange: (configItem: Config) => void;
}

export const ConfigItem: React.FC<ConfigItemProps> = ({ item, onChange }) => {
  const [inputValue, setInputValue] = React.useState(item.value?.toString() ?? '');

  React.useEffect(() => {
    setInputValue(item.value?.toString() ?? '');
  }, [item.value]);

  if (typeof item.value === 'boolean') {
    return (
      <div key={item.key} className="form-group mb-2">
        <label htmlFor={item.key} className="mr-3">
          {item.key}
        </label>
        <div style={{ display: 'flex' }}>
          <button
            type="button"
            style={{ flex: 1 }}
            className="btn btn-primary"
            onClick={(): void => {
              onChange({
                key: item.key,
                value: !item.value,
              });
            }}
          >
            {item.value ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div key={item.key} className="form-group mb-2">
      <label htmlFor={item.key} className="mr-3">
        {item.key}
      </label>
      <div style={{ display: 'flex' }}>
        <input
          type={typeof item.value === 'number' ? 'number' : 'text'} // TODO: Double check text input type
          style={{ flex: 1 }}
          className="form-control"
          id={item.key}
          placeholder="Team name"
          onBlur={(): void => {
            let newValue: string | number = inputValue;

            if (typeof item.value === 'number') {
              newValue = parseFloat(newValue);
              if (Number.isNaN(newValue)) {
                newValue = 0;
              }
            }

            onChange({
              key: item.key,
              value: newValue,
            });
          }}
          onChange={(event): void => {
            setInputValue(event.target.value);
          }}
          value={inputValue}
        />
      </div>
    </div>
  );
};
