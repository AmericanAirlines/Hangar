import React from 'react';
import styles from './open-source-footer.module.scss';

const OpenSourceFooter = (): JSX.Element => (
  <div className={styles.footer}>
    <div className='container d-flex justify-content-between align-items-center'>
      <div>
        Hangar is an open source project created by American Airlines.<br />
        <a href='https://github.com/AmericanAirlines/Hangar/issues/new/choose'
           target='_blank' rel='noreferrer'>Suggest a feature or report a bug</a>
      </div>
      <div>
        <a href='https://github.com/AmericanAirlines/Hangar' target='_blank' rel='noreferrer'>
          <img alt='GitHub Repo stars' width="125"
               src='https://img.shields.io/github/stars/AmericanAirlines/Hangar.svg?label=Github&style=social' />
        </a>
      </div>
    </div>
  </div>
);

export default OpenSourceFooter;
