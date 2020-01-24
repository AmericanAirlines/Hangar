/* global window, fetch */
import React from 'react';
import { useFormik } from 'formik';

const LoginPage: React.FC = () => {
  const formik = useFormik({
    initialValues: {
      secret: '',
    },
    async onSubmit(values) {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ secret: values.secret }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        formik.setFieldError('secret', 'Incorrect secret');
        return;
      }

      window.location.href = '/';
    },
  });

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-4 offset-md-4">
          <h1 className="display-2 text-center">🤫</h1>
          <form onSubmit={formik.handleSubmit}>
            <div className="form-group">
              <label htmlFor="secret">Admin Secret</label>
              <input
                id="secret"
                type="password"
                placeholder="Shhh..."
                className={`form-control ${formik.errors.secret ? 'is-invalid' : ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <small className="form-text text-muted">This was set during configuration</small>
              <div className="invalid-feedback">{formik.errors.secret}</div>
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

export default LoginPage;
