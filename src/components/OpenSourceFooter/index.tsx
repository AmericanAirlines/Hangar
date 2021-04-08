import React from 'react';

const OpenSourceFooter = (): JSX.Element => (
  <footer style={{
    position: 'fixed',
    left: 0,
    bottom: 0,
    width: '100%',
    padding: '12px 0',
    color: '#4B4B4D',
    backgroundColor: '#E1E2E6',
    borderTop: '1px solid #B3B3B3',
  }}>
    <div className='container d-flex justify-content-between align-items-center'>
      <div>
        Hangar is an open source project created by American Airlines.<br />
        <a href='https://github.com/AmericanAirlines/Hangar/issues/new/choose'
           target='_blank' rel='noreferrer noopener'>Suggest a feature or report a bug</a>
      </div>
      <div>
        <a href='https://github.com/AmericanAirlines/Hangar' target='_blank' rel='noreferrer noopener'>
          <img alt='GitHub Repo stars' width='125'
               src='https://img.shields.io/github/stars/AmericanAirlines/Hangar.svg?label=Github&style=social' />
        </a>
      </div>
    </div>
  </footer>
);

export default OpenSourceFooter;
