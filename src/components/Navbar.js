import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  return (
    <div className="card card-nav-pills card-plain">
      <div className="card-header card-header-danger">
        <div className="nav-pills-navigation">
          <div className="nav-pills-wrapper">
            <ul className="nav nav-pills nav-pills-danger justify-content-center">
              <li className="nav-item">
                <Link
                  className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${location.pathname === '/manning' ? 'active' : ''}`}
                  to="/manning"
                >
                  Calculateur de Manning
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${location.pathname === '/darcy' ? 'active' : ''}`}
                  to="/darcy"
                >
                  Darcy-Weisbach Calculator
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${location.pathname === '/hazen' ? 'active' : ''}`}
                  to="/hazen"
                >
                  Hazen-Williams Calculator
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${location.pathname === '/design' ? 'active' : ''}`}
                  to="/design"
                >
                  Channel Design Tool
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
