import { Grid } from '@material-ui/core';
import React from 'react';
import styles from './open-source-footer.module.scss';

const OpenSourceFooter = (): JSX.Element => (
  <div className={styles.footer}>
    <Grid container spacing={5} alignItems='center' justify='center'>
      <Grid item>
        <span className={styles['footer-text']}>Hangar is an open source project created my American Airlines.<br />
          <a className={styles['footer-text']} href='https://github.com/AmericanAirlines/Hangar/issues/new/choose'
             target='_blank' rel="noreferrer"> Suggest a feature or report a bug</a>
        </span>
      </Grid>
      <Grid item>
        <p>
          <a href='https://github.com/AmericanAirlines/Hangar' target='_blank' rel="noreferrer">
            <img alt='GitHub Repo stars'
                 src='https://img.shields.io/github/stars/AmericanAirlines/Hangar?label=Github&style=social' />
          </a>
        </p>
      </Grid>
    </Grid>
  </div>
);

export default OpenSourceFooter;
