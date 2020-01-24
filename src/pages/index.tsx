import React from 'react';
import { NextComponentType } from 'next';

const AdminPage: NextComponentType = () => (
  <div className="container mt-4">
    <div className="row mb-4">
      <div className="col">
        <h1>Hello, Admin 👋</h1>
      </div>
    </div>
    <div className="row">
      <div className="col-12 col-md-6">
        <div className="card">
          <div className="card-body">
            <h2 className="font-weight-normal">Support Queue</h2>
            <div className="alert alert-warning" role="alert">
              Only a single person should operate each queue at a time
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-6">
        <div className="card">
          <div className="card-body">
            <h2 className="font-weight-normal">Judge Results</h2>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AdminPage;
