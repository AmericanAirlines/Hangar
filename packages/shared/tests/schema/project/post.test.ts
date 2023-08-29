import { Schema } from '../../../src';
import { PostValidation } from '../../../src/schema/project';

const validProject = {
  name: 'Red Hat Hackers',
  description:
    'Some super cool project that has a long description that passes validation successfully',
  location: 'Outer Space',
};

describe('project post schema', () => {
  it('validates a matching object', () => {
    expect(Schema.project.post.safeParse(validProject).success).toBe(true);
  });

  it('validates a matching object without a location', () => {
    const projectWithoutLocation = { ...validProject } as Record<string, string>;
    delete projectWithoutLocation.location;

    expect(Schema.project.post.safeParse(projectWithoutLocation).success).toBe(true);
  });

  it('does not validate an object with an invalid name', () => {
    expect(
      Schema.project.post.safeParse({
        ...validProject,
        name: Array(PostValidation.MAX_NAME_LENGTH + 1).fill('A'),
      }).success,
    ).toBe(false);

    expect(
      Schema.project.post.safeParse({
        ...validProject,
        name: Array(PostValidation.MIN_NAME_LENGTH - 1).fill('A'),
      }).success,
    ).toBe(false);
  });

  it('does not validate an object with an invalid description', () => {
    expect(
      Schema.project.post.safeParse({
        ...validProject,
        description: Array(PostValidation.MAX_DESCRIPTION_LENGTH + 1).fill('A'),
      }).success,
    ).toBe(false);

    expect(
      Schema.project.post.safeParse({
        ...validProject,
        description: Array(PostValidation.MIN_DESCRIPTION_LENGTH - 1).fill('A'),
      }).success,
    ).toBe(false);
  });

  it('does not validate an object with an invalid location', () => {
    expect(
      Schema.project.post.safeParse({
        ...validProject,
        location: Array(PostValidation.MAX_LOCATION_LENGTH + 1).fill('A'),
      }).success,
    ).toBe(false);
  });
});
