import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container text-center">
      <h1 className="mb-4">Welcome to HydroSimLite</h1>
      <p className="lead">An easy-to-use tool for common hydraulic calculations and simulations.</p>

      <div className="row">
        {/* Manning Calculator Card */}
        <div className="col-md-6 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Manning Calculator</h5>
              <p className="card-text">Compute open-channel flow (discharge, velocity) using the Manning formula for various channel shapes.</p>
              <Link to="/manning" className="btn btn-primary">Go</Link>
            </div>
          </div>
        </div>
        {/* Darcy-Weisbach Calculator Card */}
        <div className="col-md-6 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Darcy-Weisbach Calculator</h5>
              <p className="card-text">Estimate head loss in pipes using the Darcy-Weisbach equation and determine flow regime (laminar/turbulent).</p>
              <Link to="/darcy" className="btn btn-primary">Go</Link>
            </div>
          </div>
        </div>
        {/* Hazen-Williams Calculator Card */}
        <div className="col-md-6 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Hazen-Williams Calculator</h5>
              <p className="card-text">Empirical head loss calculation for pipes using the Hazen-Williams formula with selectable roughness coefficients.</p>
              <Link to="/hazen" className="btn btn-primary">Go</Link>
            </div>
          </div>
        </div>
        {/* Channel Design Tool Card */}
        <div className="col-md-6 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Channel Design Tool</h5>
              <p className="card-text">Design optimal channel or pipe dimensions for a target flow, and compare multiple design solutions.</p>
              <Link to="/design" className="btn btn-primary">Go</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Home;
