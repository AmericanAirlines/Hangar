/* eslint-disable no-nested-ternary */
/* global window */
import React from 'react';
import { useFormik } from 'formik';
import { NextPage } from 'next';
import { RegisteredTeamsList } from '../../components/RegisteredTeamsList';
import { SupportRequests } from '../../components/SupportRequests';

interface Request {
  id: number;
  name: string;
  type: string;
  movedToInProgressAt: string;
}

export const SUPPORT_NAME_KEY = 'supportName';

const support: NextPage<{ secret: string }> = (props): JSX.Element => {
  const formik = useFormik({
    initialValues: {
      supportName: '',
    },
    onSubmit({ supportName }) {
      window.localStorage.setItem(SUPPORT_NAME_KEY, supportName.trim());
    },
  });

  React.useEffect(() => {
    formik.setFieldValue('supportName', window.localStorage.getItem(SUPPORT_NAME_KEY));
  }, []);

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-12 col-md-6">
          <h1>Support Dashboard</h1>
        </div>
        <div className="col-12 col-md-6">
          <form className="form-inline float-md-right" onSubmit={formik.handleSubmit}>
            <div className="form-group ml-sm-3 mr-3 mb-2">
              <label htmlFor="supportName" className="mr-3">
                Your Name
              </label>
              <input
                type="text"
                className="form-control"
                id="supportName"
                placeholder="Your name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.supportName}
              />
            </div>
            <button type="submit" className="btn btn-primary mb-2">
              Save
            </button>
          </form>
        </div>
      </div>
      <div className="row">
        <div className="col-12 mt-2">
          <SupportRequests secret={props.secret} />
        </div>

        <div className="col-12 mt-2">
          <RegisteredTeamsList secret={props.secret} />
        </div>
      </div>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
support.getInitialProps = async (ctx: any): Promise<any> => ({
  secret: ctx.query.secret,
});

export default support;
