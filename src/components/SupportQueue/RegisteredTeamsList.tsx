/* global fetch */
import React from 'react';
// import { DateTime } from 'luxon';

export interface Team {
  id: number;
  name: string;
}

interface RegisteredTeamsListProps {
  secret: string;
}

export const RegisteredTeamsList: React.FC<RegisteredTeamsListProps> = ({ secret }) => {
  //const fetchValues = async (): Promise<void> => {
  // TODO: Retrieve all teams
  //};

  // React.useEffect(() => {
  //   fetchValues();

  //   return (): void => {
  //     // if (timeoutRef.current) {
  //     //   clearTimeout(timeoutRef.current);
  //     // }
  //   };
  // }, []);

  return (
    <div>
      <h2 className="font-weight-normal">Registered Teams</h2>
      <span>WAT</span>
    </div>
  );
};
