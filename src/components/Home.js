import React from 'react';
import { Link } from 'react-router-dom';
import { FaTools, FaWater, FaTachometerAlt, FaDraftingCompass } from 'react-icons/fa';

function Home() {
  const tools = [
    {
      title: "Calculateur de Manning",
      description: "Calculez l’écoulement à surface libre dans différents types de canaux à l’aide de la formule de Manning.",
      to: "/manning",
      icon: <FaWater size={32} color="#fff" />
    },
    {
      title: "Calculateur Darcy-Weisbach",
      description: "Estimez la perte de charge dans les conduites et identifiez le régime d’écoulement avec l’équation de Darcy-Weisbach.",
      to: "/darcy",
      icon: <FaTachometerAlt size={32} color="#fff" />
    },
    {
      title: "Calculateur Hazen-Williams",
      description: "Effectuez des calculs empiriques de perte de charge selon les coefficients de rugosité.",
      to: "/hazen",
      icon: <FaTools size={32} color="#fff" />
    },
    {
      title: "Outil de dimensionnement de canal",
      description: "Dimensionnez un canal ou une conduite et explorez des solutions hydrauliques optimales.",
      to: "/design",
      icon: <FaDraftingCompass size={32} color="#fff" />
    }
  ];

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
    <div className="container text-center py-5">
<h1 className="display-4 mb-3 text-primary font-weight-bold">
  Bienvenue sur HydroSimLite
</h1>
<p className="lead text-muted mb-5">
  Un outil léger pour les calculs hydrauliques essentiels et les simulations de conception.
</p>
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
                  Decouvrir 
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="row mt-5">
  <div className="col-lg-10 mx-auto">
 
        <h2 className="text-primary font-weight-bold mb-3">
          À propos de HydroSimLite
        </h2>
        <p>
          <strong>HydroSimLite</strong> est une application web de simulation hydraulique simplifiée, pensée comme un outil pédagogique accessible pour les étudiants et ingénieurs débutants en hydraulique. Elle permet d’effectuer rapidement les calculs hydrauliques courants sans recourir à des logiciels complexes.
        </p>
        <p>
          Ce projet a été conçu et développé par <strong>Fedi Mouelhi</strong> (Master Eaux et Environnement Côtier) et <strong>Med Aziz Ben Hmida</strong> (étudiant en informatique).
        </p>
        <h5 className="mt-4 mb-2 font-weight-bold text-secondary">Architecture technique</h5>
        <ul className="list-unstyled text-left">
          <li>
            <strong>Frontend&nbsp;:</strong> React.js (ES6+), Bootstrap 4/5, CSS
          </li>
          <li>
            <strong>Visualisations&nbsp;:</strong> Recharts (LineChart, etc.)
          </li>
          <li>
            <strong>Export&nbsp;:</strong> PDF (jsPDF), CSV (PapaParse)
          </li>
          <li>
            <strong>Déploiement&nbsp;:</strong> Netlify
          </li>
        </ul>
        <h5 className="mt-4 mb-2 font-weight-bold text-secondary">Fonctionnalités principales</h5>
        <ul className="list-unstyled text-left">
          <li>Calculs de débit dans différents types de canaux (rectangulaires, trapézoïdaux, circulaires) via la formule de Manning-Strickler</li>
          <li>Estimation des pertes de charge par Darcy-Weisbach et Hazen-Williams</li>
          <li>Dimensionnement de canaux et de conduites avec recommandations</li>
          <li>Visualisations interactives des résultats</li>
          <li>Export des calculs et graphiques en PDF ou CSV</li>
        </ul>
        <h5 className="mt-4 mb-2 font-weight-bold text-secondary">Philosophie du projet</h5>
        <p>
          L’application privilégie une interface intuitive, la rigueur scientifique et la modularité du code. La structure logicielle, basée sur des composants réutilisables et des fonctions pures, garantit la maintenabilité et l’évolutivité du projet. Tout a été pensé pour permettre une extension future (nouvelles fonctionnalités, modules pédagogiques, internationalisation...).
        </p>
        <hr className="my-4"/>
        <div className="text-muted small">
          Projet réalisé par&nbsp;
          <strong>Fedi Mouelhi</strong> et <strong>Med Aziz Ben Hmida</strong> — Avril 2025
        </div>
      </div>
    </div>
  </div>
</div>
</div>
  );
}

export default Home;
