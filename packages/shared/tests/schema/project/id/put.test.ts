import { Schema } from '../../../../src';
import { PutValidation } from '../../../../src/schema/project/id';

const validProject = {
  name: 'Code Crafters Hub',
  description: 'Where coding meets coffee, creating chaos and laughter on line code at a time!',
  location: 'cloud 9 3/4',
  repoUrl: 'https://github.com/',
};

describe('project put schema', () => {
  it('validates matching object', () => {
    expect(Schema.project.id.put.safeParse(validProject).success).toBe(true);
  });

  it('validates a matching object without a location', () => {
    const projectWithoutLocation = { ...validProject } as Record<string, string>;
    delete projectWithoutLocation.location;

    expect(Schema.project.id.put.safeParse(projectWithoutLocation).success).toBe(true);
  });

  it('trims relevant field', () => {
    const project = {
      ...validProject,
      location: 'somewhere',
      name: 'someone',
      description: 'something something dark side',
    };
    const result = Schema.project.id.put.safeParse(project);

    if (!result.success) throw new Error(result.error.toString());

    const { description, name, location } = result.data;
    expect(description).toBe(project.description.trim());
    expect(name).toBe(project.name.trim());
    expect(location).toBe(project.location.trim());
  });

  it('does not validate an object with an invalid name', () => {
    expect(
      Schema.project.id.put.safeParse({
        ...validProject,
        name: Array(PutValidation.MAX_NAME_LENGTH + 1).fill('A'),
      }).success,
    ).toBe(false);

    expect(
      Schema.project.id.put.safeParse({
        ...validProject,
        name: Array(PutValidation.MIN_NAME_LENGTH - 1).fill('A'),
      }).success,
    ).toBe(false);
  });

  it('does not validate an object with an invalid description', () => {
    expect(
      Schema.project.id.put.safeParse({
        ...validProject,
        description: Array(PutValidation.MAX_DESCRIPTION_LENGTH + 1).fill('A'),
      }).success,
    ).toBe(false);

    expect(
      Schema.project.id.put.safeParse({
        ...validProject,
        description: Array(PutValidation.MIN_DESCRIPTION_LENGTH - 1).fill('A'),
      }).success,
    ).toBe(false);
  });

  it('does not validate an object with an invalid location', () => {
    expect(
      Schema.project.id.put.safeParse({
        ...validProject,
        location: Array(PutValidation.MAX_LOCATION_LENGTH + 1).fill('A'),
      }).success,
    ).toBe(false);
  });

  it('does not validates an invalid repoUrl', () => {
    expect(
      Schema.project.id.put.safeParse({
        ...validProject,
        repoUrl: 'https://google.com',
      }).success,
    ).toBe(false);
  });
});
