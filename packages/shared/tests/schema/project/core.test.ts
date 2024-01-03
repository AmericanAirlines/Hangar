import { Schema } from '../../../src';
import { validation } from '../../../src/schema/project';

const validProject = {
  name: 'Coders Hub',
  description: 'Where coding meets coffee, creating chaos and laughter on line code at a time!',
  location: 'cloud 9 3/4',
  repoUrl: 'https://github.com/',
};

describe('project put schema', () => {
  it('validates matching object', () => {
    expect(Schema.project.core.safeParse(validProject).success).toBe(true);
  });

  it('validates a matching object without a location', () => {
    const projectWithoutLocation = { ...validProject } as Record<string, string>;
    delete projectWithoutLocation.location;

    expect(Schema.project.core.safeParse(projectWithoutLocation).success).toBe(true);
  });

  it('trims relevant fields', () => {
    const project = {
      ...validProject,
      location: 'somewhere',
      name: 'someone',
      description: ' something something dark side ',
    };
    const result = Schema.project.core.safeParse(project);

    if (!result.success) throw new Error(result.error.toString());

    const { description, name, location } = result.data;
    expect(description).toBe(project.description.trim());
    expect(name).toBe(project.name.trim());
    expect(location).toBe(project.location.trim());
  });

  it('does not validate an object with an invalid name', () => {
    expect(
      Schema.project.core.safeParse({
        ...validProject,
        name: Array(validation.MAX_NAME_LENGTH + 1).fill('A'),
      }).success,
    ).toBe(false);

    expect(
      Schema.project.core.safeParse({
        ...validProject,
        name: Array(validation.MIN_NAME_LENGTH - 1).fill('A'),
      }).success,
    ).toBe(false);
  });

  it('does not validate an object with an invalid description', () => {
    expect(
      Schema.project.core.safeParse({
        ...validProject,
        description: Array(validation.MAX_DESCRIPTION_LENGTH + 1).fill('A'),
      }).success,
    ).toBe(false);

    expect(
      Schema.project.core.safeParse({
        ...validProject,
        description: Array(validation.MIN_DESCRIPTION_LENGTH - 1).fill('A'),
      }).success,
    ).toBe(false);
  });

  it('does not validate an object with an invalid location', () => {
    expect(
      Schema.project.core.safeParse({
        ...validProject,
        location: Array(validation.MAX_LOCATION_LENGTH + 1).fill('A'),
      }).success,
    ).toBe(false);
  });

  it('does not validates an invalid repoUrl', () => {
    expect(
      Schema.project.core.safeParse({
        ...validProject,
        repoUrl: 'https://google.com',
      }).success,
    ).toBe(false);
  });

  it('coerces empty location strings to undefined', () => {
    const result = Schema.project.core.safeParse({
      ...validProject,
      location: ' ',
    });

    if (!result.success) throw new Error(result.error.toString());

    expect(result.data.location).toBeUndefined();
  });

  it('correctly validates location strings', () => {
    const result = Schema.project.core.safeParse(validProject);

    if (!result.success) throw new Error(result.error.toString());

    expect(result.data.location).toBe(validProject.location);
  });
});
