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
<<<<<<< HEAD
  // TODO: Retrieve all teams
=======
    // TODO: Retrieve all teams
>>>>>>> 8caaddb071a595e2037e66a1470eaa0091692af2
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
