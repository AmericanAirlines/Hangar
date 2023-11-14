import { Schema } from '../../../src';

const validProject = {
  name: 'Coders Hub',
  description: 'Where coding meets coffee, creating chaos and laughter on line code at a time!',
  location: 'cloud 9 3/4',
  repoUrl: 'https://github.com/',
};

describe('project post schema', () => {
  it('validates matching object', () => {
    expect(Schema.project.post.safeParse(validProject).success).toBe(true);
  });

  it('validates a matching object without a location', () => {
    const projectWithoutLocation = { ...validProject } as Record<string, string>;
    delete projectWithoutLocation.location;

    expect(Schema.project.post.safeParse(projectWithoutLocation).success).toBe(true);
  });
});
