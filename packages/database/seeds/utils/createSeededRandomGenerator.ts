import seedrandom from 'seedrandom';

function createSeededRandomGenerator(seed: string | undefined) {
  const rng = seedrandom(seed);

  return function unnamed() {
    return rng();
  };
}

export { createSeededRandomGenerator };
