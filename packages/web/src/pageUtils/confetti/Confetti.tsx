import React, { useEffect, useState } from 'react';
import { rng, Vector } from './utils';
import { Confetto } from './Confetto';

type ConfettiProps = {
  tick?: number;
  velocity?: Vector;
  right?: boolean;
  zAxisClamp?: number;
};

type CannonProps = {
  delay?: number;
  right?: boolean;
};

export const Confetti: React.FC<ConfettiProps> = (p) => {
  // manage quantity, bounds, and offsets
  const [{ quantity, xSpread, xOffset, ySpread, yOffset, zSpread, zOffset }] = useState(() => ({
    quantity: window.innerWidth / 40,
    xSpread: window.innerWidth / 6,
    xOffset: window.innerWidth / 80,
    ySpread: window.innerHeight / 7,
    yOffset: window.innerHeight / 7,
    zSpread: 5,
    zOffset: 1,
  }));
  return !quantity ? (
    <></>
  ) : (
    <>
      {new Array(Math.round(quantity)).fill(1).map((x, i) => {
        const key = x + i;
        return (
          <Confetto
            key={key}
            {...{
              ...p,
              tick: 50,
              velocity: {
                x: rng(xOffset, xSpread),
                y: rng(yOffset, ySpread),
                z: rng(0, zSpread * 10) / 100 - zOffset,
              },
            }}
          />
        );
      })}
    </>
  );
};
export const useConfetti = () => {
  const [key, setKey] = useState(0);
  const trigger = React.useCallback(() => setKey((t) => t + 1), []);
  return [trigger, (p: ConfettiProps) => (!key ? <></> : <Confetti {...{ ...p, key }} />)] as [
    () => void,
    React.FC<ConfettiProps>,
  ];
};

export const Cannon: React.FC<CannonProps> = ({ delay, ...p }) => {
  const [trigger, confetti] = useConfetti();
  useEffect(() => {
    setTimeout(() => {
      if (trigger) {
        trigger();
      }
    }, delay);
  }, [delay, trigger]);
  return confetti(p);
};

export const useCannons = ({ stagger = 1000, quantity = 4 }) => {
  const [[, cannons], setCannons] = useState([0, new Array(quantity).fill(undefined)]);
  const handleFire = () => {
    setCannons(([count, Cannons]) => [
      count + quantity,
      Cannons.map((c, i) => {
        const key = count * i;
        return <Cannon key={key} {...{ delay: stagger * i, right: i % 2 === 0 }} />;
      }),
    ]);
  };
  return [handleFire, cannons];
};
