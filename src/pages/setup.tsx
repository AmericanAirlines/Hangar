/* global window, fetch */
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const SetupPage: React.FC = () => {
  const SignupSchema = Yup.object().shape({
    adminSecret: Yup.string()
      .min(6, 'Too Short!')
      .max(20, 'Too Long!')
      .required('Admin Secret Required'),
    discordChannelIds: Yup.string(),
    discordBotToken: Yup.string(),
    slackBotToken: Yup.string(),
    slackSigningSecret: Yup.string(),
  });
  const formik = useFormik({
    initialValues: {
      adminSecret: '',
      discordChannelIds: '',
      discordBotToken: '',
      slackBotToken: '',
      slackSigningSecret: '',
    },
    validationSchema: SignupSchema,
    async onSubmit(values) {
      if ((values.discordBotToken || values.discordChannelIds) && (values.slackBotToken || values.slackSigningSecret)) {
        formik.setErrors({ discordChannelIds: 'Only choose Discord or Slack', discordBotToken: 'Only choose Discord or Slack', slackBotToken: 'Only choose Discord or Slack', slackSigningSecret: 'Only choose Discord or Slack' });
      } else {
        const res = await fetch('/api/config/bulk', {
          method: 'POST',
          body: JSON.stringify({
            inputConfig: values,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) {
          throw new Error();
        }
        window.location.href = '/';
      }
    },
  });

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1 className="display-2 text-center">Setup</h1>
          <h4 className="display-6 text-center font-weight-light">Enter your respective values for the configuration items below, then press submit. </h4>
          <h4 className="display-6 text-center">If using Slack, leave Discord fields blank. </h4>
          <h4 className="display-6 text-center">If using Discord, leave Slack fields blank. </h4>
          <form onSubmit={formik.handleSubmit}>
            <div className="form-group mt-3">
              <label htmlFor="adminSecret">Enter the Admin Secret. Must be between 6-20 characters</label>
              <input
                id="adminSecret"
                type="password"
                placeholder="enter value..."
                className={`form-control ${formik.errors.adminSecret ? 'is-invalid' : ''}`}
                value={formik.values.adminSecret}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <p className="text-danger">{formik.errors.adminSecret}</p>
            </div>
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
              <p className="text-danger">{formik.errors.discordChannelIds}</p>
            </div>
            <div className="form-group">
              <label htmlFor="discordBotToken">Discord: Enter the Discord Bot Token</label>
              <input
                id="discordBotToken"
                placeholder="enter value..."
                className={`form-control ${formik.errors.discordBotToken ? 'is-invalid' : ''}`}
                value={formik.values.discordBotToken}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <p className="text-danger">{formik.errors.discordBotToken}</p>
            </div>
            <div className="form-group">
              <label htmlFor="slackBotToken">Slack: Enter the Slack Bot Token</label>
              <input
                id="slackBotToken"
                placeholder="enter value..."
                className={`form-control ${formik.errors.slackBotToken ? 'is-invalid' : ''}`}
                value={formik.values.slackBotToken}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <p className="text-danger">{formik.errors.slackBotToken}</p>
            </div>
            <div className="form-group">
              <label htmlFor="slackSigningSecret">Slack: Enter the Slack Signing Secret</label>
              <input
                id="slackSigningSecret"
                placeholder="enter value..."
                className={`form-control ${formik.errors.slackSigningSecret ? 'is-invalid' : ''}`}
                value={formik.values.slackSigningSecret}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <p className="text-danger">{formik.errors.slackSigningSecret}</p>
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
