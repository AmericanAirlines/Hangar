/* global window, fetch */
import React from 'react';
import { useFormik } from 'formik';
import { config } from '../api/config';

const SetupPage: React.FC = () => {
  const formik = useFormik({
    initialValues: {
      adminSecret: '',
      discordChannelIds: '',
      discordBotToken: '',
      slackBotToken: '',
      slackSigningSecret: '',
    },
    async onSubmit(values) {
      // TODO: Update all values in the database, and redirect to admin page
      // TODO: this button currently refreshes and redirects to the admin page. Razvan's redirect changes should cover this to redirect to login
      const res = await fetch('/api/config/bulk', {
        method: 'POST',
        body: JSON.stringify({
          configKeys: [
            'adminSecret',
            'discordChannelIds',
            'discordBotToken',
            'slackBotToken',
            'slackSigningSecret',
          ],
          configValues: [
            values.adminSecret,
            values.discordChannelIds,
            values.discordBotToken,
            values.slackBotToken,
            values.slackSigningSecret,
          ],
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // if (res.ok) {
      //   window.location.href = '/';
      //   // eslint-disable-next-line no-console
      //   console.log('received response');
      // } else {
      //   // eslint-disable-next-line no-console
      //   console.log('did not receive response');
      // }

      // window.location.href = '/';
    },
  });

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-4 offset-md-4">
          <h1 className="display-2 text-center">Setup</h1>
          <h4 className="display-6 text-center">Enter your respective values for the configuration items below, then press submit.</h4>
          <form onSubmit={formik.handleSubmit}>
            <div className="form-group">
              <label htmlFor="secret">adminSecret</label>
              <input
                id="adminSecret"
                type="password"
                placeholder="Shhh..."
                className={`form-control ${formik.errors.adminSecret ? 'is-invalid' : ''}`}
                value={formik.values.adminSecret}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {/* QUESTION: what is the 'htmlFor' below? Should I change these to match their respective content? */}
              <label htmlFor="discordChannelIds">discordChannelIds</label>
              <input
                id="discordChannelIds"
                placeholder="id1, id2, id3"
                className={`form-control ${formik.errors.discordChannelIds ? 'is-invalid' : ''}`}
                value={formik.values.discordChannelIds}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <label htmlFor="secret">discordBotToken</label>
              <input
                id="discordBotToken"
                placeholder="enter value..."
                className={`form-control ${formik.errors.discordBotToken ? 'is-invalid' : ''}`}
                value={formik.values.discordBotToken}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <label htmlFor="secret">slackBotToken</label>
              <input
                id="slackBotToken"
                placeholder="enter value..."
                className={`form-control ${formik.errors.slackBotToken ? 'is-invalid' : ''}`}
                value={formik.values.slackBotToken}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <label htmlFor="secret">slackSigningSecret</label>
              <input
                id="slackSigningSecret"
                placeholder="enter value..."
                className={`form-control ${formik.errors.slackSigningSecret ? 'is-invalid' : ''}`}
                value={formik.values.slackSigningSecret}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {/* QUESTION: What is this below? */}
              {/* <div className="invalid-feedback">{formik.errors.adminSecret}</div> */}
            </div>
            <button type="submit" className="btn btn-dark float-right">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetupPage;
