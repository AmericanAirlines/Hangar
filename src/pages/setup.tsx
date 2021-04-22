/* global window, fetch */
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { config } from '../api/config';

const SetupPage: React.FC = () => {
  const SignupSchema = Yup.object().shape({
    adminSecret: Yup.string()
      .min(6, 'Too Short!')
      .max(20, 'Too Long!')
      .required('Required'),
    discordChannelIds: Yup.string(),
    discordBotToken: Yup.string(),
    slackBotToken: Yup.string(),
    slackSigningSecret: Yup.string(),
  });
  const formik = useFormik({
    initialValues: {
      secret: '',
      adminSecret: '',
      discordChannelIds: '',
      discordBotToken: '',
      slackBotToken: '',
      slackSigningSecret: '',
    },
    validationSchema: SignupSchema,
    async onSubmit(values) {
      // TODO: Update all values in the database, and redirect to admin page
      // QUESTION: Should I bundle the form data into multiple POST requests to the config api, or should I connect this entity directly to the database similarly to the ConfigItem?
      // console.log(values);
    },
  });

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1 className="display-2 text-center">Setup</h1>
          <h4 className="display-6 text-center font-weight-light">Enter your respective values for the configuration items below, then press submit. </h4>
          <h4 className="display-6 text-center">If using Slack, leave Discord fields blank. If using Discord, leave Slack fields blank. </h4>
          <form onSubmit={formik.handleSubmit}>
            <div className="form-group mt-3">
              <label htmlFor="secret">Enter the Admin Secret. Must be between 6-20 characters</label>
              <input
                id="adminSecret"
                type="password"
                placeholder="enter value..."
                className={`form-control ${formik.errors.adminSecret ? 'is-invalid' : ''}`}
                value={formik.values.adminSecret}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
              {/* QUESTION: what is the 'htmlFor' below? Should I change these to match their respective content? */}
            <div className="form-group">
              <label htmlFor="discordChannelIds">Discord: Enter Discord Channel ID. If multiple IDs, separate with a comma.</label>
              <input
                id="discordChannelIds"
                placeholder="id1, id2, id3"
                className={`form-control ${formik.errors.discordChannelIds ? 'is-invalid' : ''}`}
                value={formik.values.discordChannelIds}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            <div className="form-group">
              <label htmlFor="secret">Discord: Enter the Discord Bot Token</label>
              <input
                id="discordBotToken"
                placeholder="enter value..."
                className={`form-control ${formik.errors.discordBotToken ? 'is-invalid' : ''}`}
                value={formik.values.discordBotToken}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            <div className="form-group">
              <label htmlFor="secret">Slack: Enter the Slack Bot Token</label>
              <input
                id="slackBotToken"
                placeholder="enter value..."
                className={`form-control ${formik.errors.slackBotToken ? 'is-invalid' : ''}`}
                value={formik.values.slackBotToken}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            <div className="form-group">
              <label htmlFor="secret">Slack: Enter the Slack Signing Secret</label>
              <input
                id="slackSigningSecret"
                placeholder="enter value..."
                className={`form-control ${formik.errors.slackSigningSecret ? 'is-invalid' : ''}`}
                value={formik.values.slackSigningSecret}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              {/* QUESTION: What is this below? */}
              {/* <div className="invalid-feedback">{formik.errors.secret}</div> */}
            </div>
            <button type="submit" className="btn btn-primary btn-block mb-5">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetupPage;
