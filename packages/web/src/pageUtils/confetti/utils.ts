export const rng = (lb: number, ub: number) => Math.floor(Math.random() * ub) + lb;

export const randomColor = () => `#${rng(0, 16777215).toString(16)}`;

export const rotateRandomly = (rot: number[]) => rot.map((r, i) => rng(-1, i === 3 ? 360 : 3));

export const randomShape = () => ({
  width: rng(8, 15),
  height: rng(5, 12),
  backgroundColor: randomColor(),
});

export const mapPositionToCss = ([k, v]: [string, number]) => [
  { x: 'left', y: 'bottom', z: 'scale' }[k],
  Math.floor(v * 10) / 10 + (k === 'z' ? '' : `px`),
];

export const applyGravity = (pos: { x: number; y: number; z: number }) => ({
  y: pos.y - 20,
  x: pos.x + rng(-40, 81),
  z: pos.z + rng(-1, 3) / 10,
});

export const applyVelocity = (
  pos: { x: number; y: number; z: number },
  vel: { x: number; y: number; z: number },
) =>
  Object.entries(pos)
    .map(([k, v]: [string, number]) => [k, (10 * (v + vel[k as keyof typeof vel])) / 10])
    .reduce((a, [k, v]) => ({ ...a, [k as keyof typeof a]: v }), {});

export const reduceVelocity = ({ x, y, z }: { x: number; y: number; z: number }) =>
  Object.entries({ x: x * 0.8, y: y * 0.7, z })
    .map(([k, v]: [string, number]) => [k, Math.floor(10 * v) / 10])
    .reduce((a, [k, v]) => ({ ...a, [k as keyof typeof a]: (v as number) > 0 ? v : 0 }), {});

export const nextFrame = (args: {
  position: React.MutableRefObject<{ x: number; y: number; z: number }>;
  velocity: React.MutableRefObject<{ x: number; y: number; z: number } | {}>;
  rotation: React.MutableRefObject<number[]>;
}) => {
  const { position, velocity, rotation } = args;
  if (Object.values(velocity.current).some((x) => (x as number) > 0)) {
    position.current = applyVelocity(
      position.current,
      velocity.current as { x: number; y: number; z: number },
    ) as { x: number; y: number; z: number };
  }

  if (!((velocity.current as { y: number }).y > 0) && position.current.y > 0) {
    position.current = applyGravity(position.current);
  }

  velocity.current = reduceVelocity(velocity.current as { x: number; y: number; z: number });
  rotation.current = rotateRandomly(rotation.current);
};
