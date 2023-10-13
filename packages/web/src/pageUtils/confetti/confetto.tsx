import { rng, randomShape, mapPositionToCss, nextFrame } from './utils';
import { useEffect, useRef, useState } from 'react';

type ConfettoProps = {
  tick?: number;
  velocity?: { x: number; y: number; z: number };
  right?: boolean;
  zAxisClamp?: number;
};

type ConfettoPosition = {
  left: string;
  bottom: string;
  scale: number;
};

export const Confetto: React.FC<ConfettoProps> = ({
  tick = 1000,
  velocity: initialVelocity,
  right,
  zAxisClamp = 1.3,
}) => {
  // state management
  const [shape] = useState(randomShape),
    [, advance] = useState(0),
    position = useRef({ x: 0, y: 0, z: rng(0, 20) / 10 }),
    velocity = useRef(initialVelocity || { x: 0, y: 0, z: 0 }),
    rotation = useRef([0, 0, 0, 0]);

  // animation loop
  useEffect(() => {
    const next = () => {
      if (!(velocity.current.y > 0) && !(position.current.y > 0)) {
        clearTimeout(id);
        return;
      }

      nextFrame({ position, velocity, rotation });
      advance((t) => t + 1);

      id = setTimeout(next, tick);
    };
    let id = setTimeout(next, tick);
    return () => clearTimeout(id);
  }, []);

  // css
  const biezer = velocity.current.y > 0 ? 'ease-out' : 'linear',
    frameDuration = velocity.current.y > 0 ? tick : 250,
    { left, bottom, scale } = Object.entries(position.current)
      .map(mapPositionToCss)
      .reduce((a, [k, v]) => ({ ...a, [k as string]: v }), {} as ConfettoPosition);

  const clampedScale = Math.min(Math.max(scale, -zAxisClamp), zAxisClamp),
    style = {
      ...shape,
      position: 'fixed',
      bottom,
      ...(right ? { right: left } : { left }),
      perspective: 1000,
      backfaceVisibility: 'hidden',
      transition: `all ${frameDuration}ms ${biezer}`,
      opacity: position.current.y > 200 ? 1 : position.current.y / 800,
      transform: `scale(${clampedScale}) rotate3d(${rotation.current.join(', ')}deg)`,
      transformStyle: 'preserve-3d',
    } as React.CSSProperties;

  // render
  return position.current.y > 0 && <div {...{ style }} />;
};
