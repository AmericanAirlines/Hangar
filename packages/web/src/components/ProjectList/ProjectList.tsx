import React from 'react';
import { Project } from '@hangar/shared';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { UnorderedList } from '@chakra-ui/react';
import { ProjectCard } from './ProjectCard';

dayjs.extend(isBetween);

export const ProjectsList: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const nextProjectCardRef = React.useRef<HTMLLIElement>(null);

  React.useEffect(() => {
    nextProjectCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  return (
    <UnorderedList variant="card" spacing={5} m={0}>
      {projects.map((project) => (
        <ProjectCard {...{ project }} key={`project-${project.id}`} />
      ))}
    </UnorderedList>
  );
};
