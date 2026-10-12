
import { useState } from "react";
import ParallelCoordinates from "./visualizations/mourtada/ParallelCoordinates";
import "./App.css";

const visualizations = [
  {
    id: "mourtada",
    number: "01",
    title: "Identification des profils suspects",
    description:
      "Explorer les relations entre les caractéristiques des transactions et identifier les profils associés à la fraude.",
    technique: "Coordonnées parallèles",
    ready: true,
  },
  {
    id: "member2",
    number: "02",
    title: "Visualisation 2",
    description: "Visualisation à intégrer par le deuxième membre.",
    technique: "À définir",
    ready: false,
  },
  {
    id: "member3",
    number: "03",
    title: "Visualisation 3",
    description: "Visualisation à intégrer par le troisième membre.",
    technique: "À définir",
    ready: false,
  },
  {
    id: "member4",
    number: "04",
    title: "Visualisation 4",
    description: "Visualisation à intégrer par le quatrième membre.",
    technique: "À définir",
    ready: false,
  },
  {
    id: "member5",
    number: "05",
    title: "Visualisation 5",
    description: "Visualisation à intégrer par le cinquième membre.",
    technique: "À définir",
    ready: false,
  },
];

function App() {
  const [activeVisualization, setActiveVisualization] = useState(null);

  const selected = visualizations.find(
    (item) => item.id === activeVisualization
  );

  if (selected) {
    return (
      <main className="dashboard">
        <header className="dashboard-navigation">
          <button
            type="button"
            className="back-button"
            onClick={() => setActiveVisualization(null)}
          >
            ← Retour à l'accueil
          </button>
          <span>Visualisation {selected.number} / 05</span>
        </header>

        <section className="visualization-page">
          {selected.id === "mourtada" ? (
            <ParallelCoordinates />
          ) : (
            <div className="placeholder-page">
              <span className="placeholder-icon">◈</span>
              <h1>{selected.title}</h1>
              <p>Cette visualisation sera intégrée prochainement.</p>
            </div>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <span className="dashboard-label">
          PROJET DE VISUALISATION D'INFORMATIONS
        </span>

        <h1>Exploration des fraudes bancaires</h1>

        <p>
          Un tableau de bord interactif permettant d'explorer les
          transactions bancaires, de comprendre leurs caractéristiques
          et d'identifier les comportements suspects.
        </p>

        <div className="dashboard-meta">
          <span>20 000 transactions</span>
          <span>5 visualisations</span>
          <span>D3.js</span>
        </div>
      </header>

      <section className="dashboard-content">
        <div className="section-heading">
          <div>
            <h2>Explorer les visualisations</h2>
            <p>
              Sélectionnez une analyse pour accéder à sa visualisation
              interactive.
            </p>
          </div>
          <span>05 analyses</span>
        </div>

        <div className="visualization-grid">
          {visualizations.map((visualization) => (
            <button
              key={visualization.id}
              type="button"
              className="visualization-card"
              onClick={() =>
                setActiveVisualization(visualization.id)
              }
            >
              <div className="card-top">
                <span className="card-number">
                  {visualization.number}
                </span>
                <span
                  className={`card-status ${
                    visualization.ready ? "ready" : "pending"
                  }`}
                >
                  {visualization.ready ? "Disponible" : "À intégrer"}
                </span>
              </div>

              <div className="card-content">
                <span className="card-technique">
                  {visualization.technique}
                </span>
                <h3>{visualization.title}</h3>
                <p>{visualization.description}</p>
              </div>

              <div className="card-footer">
                <span>Ouvrir la visualisation</span>
                <span className="card-arrow">↗</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <footer className="dashboard-footer">
        Projet universitaire · Visualisation d'informations · D3.js
      </footer>
    </main>
  );
}

export default App;
