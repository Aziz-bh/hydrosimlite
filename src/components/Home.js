import React from 'react';
import { Link } from 'react-router-dom';
import { FaTools, FaWater, FaTachometerAlt, FaDraftingCompass } from 'react-icons/fa';

function Home() {
  const tools = [
    {
      title: "Manning Calculator",
      description: "Compute open-channel flow using the Manning formula for different shapes.",
      to: "/manning",
      icon: <FaWater size={32} color="#fff" />
    },
    {
      title: "Darcy-Weisbach Calculator",
      description: "Estimate pipe head loss and identify flow regimes using the Darcy-Weisbach equation.",
      to: "/darcy",
      icon: <FaTachometerAlt size={32} color="#fff" />
    },
    {
      title: "Hazen-Williams Calculator",
      description: "Perform empirical head loss calculations based on roughness coefficients.",
      to: "/hazen",
      icon: <FaTools size={32} color="#fff" />
    },
    {
      title: "Channel Design Tool",
      description: "Design channel or pipe dimensions and explore optimal hydraulic solutions.",
      to: "/design",
      icon: <FaDraftingCompass size={32} color="#fff" />
    }
  ];

  return (
    <div className="container text-center py-5">
      <h1 className="display-4 mb-3 text-primary font-weight-bold">Welcome to HydroSimLite</h1>
      <p className="lead text-muted mb-5">A lightweight tool for essential hydraulic calculations and design simulations.</p>

      <div className="row">
        {tools.map((tool, index) => (
          <div className="col-md-6 mb-4" key={index}>
            <div className="card card-modern h-100 border-0">
              <div className="card-body d-flex flex-column align-items-center">
                <div className="icon-glow mb-3 d-flex align-items-center justify-content-center">
                  {tool.icon}
                </div>
                <h5 className="card-title font-weight-bold">{tool.title}</h5>
                <p className="card-text text-muted">{tool.description}</p>
                <Link to={tool.to} className="btn btn-primary btn-sm rounded-pill px-4 mt-2">
                  Go
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
