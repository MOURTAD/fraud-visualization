
import { useState } from "react";
import ParallelCoordinates from "./visualizations/mourtada/ParallelCoordinates";
import "./App.css";

const visualizations = [
  {
    id: "mourtada",
    author: "Mourtada",
    title: "Identification des profils suspects",
    description: "Coordonnées parallèles et filtrage multidimensionnel.",
    ready: true,
  },
  {
    id: "hiba",
    author: "Hiba",
    title: "Identification des facteurs de fraude",
    description: "Carte de chaleur des catégories et montants.",
    ready: true,
    url: "/visualizations/hiba/heatmap.html",
  },
  {
    id: "salma",
    author: "Salma",
    title: "Analyse des anomalies spatiales",
    description: "Relations entre distance, montant et fraude.",
    ready: true,
    url: "/visualizations/salma/scatter.html",
  },
  {
    id: "di",
    author: "Di",
    title: "Analyse des transactions",
    description: "Visualisation combinant barres et lignes.",
    ready: true,
    url: "/visualizations/di/bar_line.html",
  },
  {
    id: "abdelhafid",
    author: "Hafid",
    title: "Distribution des montants des transactions",
    description: "Histogramme comparant transactions frauduleuses et légitimes.",
    ready: true,
    url: "/visualizations/abdelhafid/index.html",
  },
];

// Tâches analytiques et visualisations qui y répondent

const tasks = [
  {
    id: "distribution",
    number: "01",
    title: "Comprendre la distribution des montants",
    description:
      "Comparer les distributions des montants des transactions frauduleuses et légitimes.",
    visualizationIds: ["abdelhafid"],
  },
  {
    id: "factors",
    number: "02",
    title: "Identifier les secteurs et facteurs de fraude",
    description:
      "Comparer les catégories de commerçants, les montants et les combinaisons de caractéristiques associés à des taux de fraude élevés.",
    visualizationIds: ["hiba", "di", "mourtada"],
  },
  {
    id: "spatial",
    number: "03",
    title: "Examiner les anomalies spatiales",
    description:
      "Étudier les relations entre la distance, le montant des transactions et la fraude.",
    visualizationIds: ["salma", "mourtada"],
  },
  {
    id: "profiles",
    number: "04",
    title: "Identifier les profils suspects",
    description:
      "Combiner plusieurs attributs et filtrer les transactions pour identifier des profils suspects.",
    visualizationIds: ["mourtada"],
  },
  {
    id: "temporal",
    number: "05",
    title: "Analyser les périodes de fraude",
    description:
      "Examiner les variations de la fraude au cours des 24 heures de la journée et identifier les périodes les plus sensibles.",
    visualizationIds: ["di"],
  },
];


function App() {
  const [activeVisualization, setActiveVisualization] = useState(null);
  const [mode, setMode] = useState("tasks");
  const [activeTask, setActiveTask] = useState(null);

  const selectedVisualization = visualizations.find(
    (item) => item.id === activeVisualization
  );

  const selectedTask = tasks.find(
    (task) => task.id === activeTask
  );

  const availableVisualizations = selectedTask
    ? visualizations.filter((item) =>
        selectedTask.visualizationIds.includes(item.id)
      )
    : visualizations;

  // Page d'une visualisation
  if (selectedVisualization) {
    return (
      <main className="dashboard">
        <header className="dashboard-navigation">
          <button
            type="button"
            className="back-button"
            onClick={() => setActiveVisualization(null)}
          >
            ← Retour
          </button>
          <span>{selectedVisualization.author}</span>
        </header>

        <section className="visualization-page">
          {activeVisualization === "mourtada" ? (
            <ParallelCoordinates />
          ) : selectedVisualization.url ? (
            <iframe
              key={selectedVisualization.id}
              src={selectedVisualization.url}
              title={selectedVisualization.title}
              className="team-visualization-frame"
            />
          ) : (
            <div className="placeholder-page">
              <h2>{selectedVisualization.title}</h2>
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

        <h1>Analyse des fraudes bancaires</h1>

        <p>
          Explorez les transactions bancaires selon vos objectifs
          d'analyse, à travers cinq visualisations interactives.
        </p>

        <div className="dashboard-meta">
          <span>20 000 transactions</span>
          <span>5 visualisations</span>
          <span>D3.js</span>
        </div>
      </header>

      <section className="dashboard-content">
        <div className="exploration-modes">
          <button
            type="button"
            className={mode === "tasks" ? "mode-active" : ""}
            onClick={() => {
              setMode("tasks");
              setActiveTask(null);
            }}
          >
            Explorer par tâches
          </button>

          <button
            type="button"
            className={mode === "visualizations" ? "mode-active" : ""}
            onClick={() => {
              setMode("visualizations");
              setActiveTask(null);
            }}
          >
            Explorer par visualisations
          </button>
        </div>

        {mode === "tasks" && !selectedTask ? (
          <>
            <div className="section-heading">
              <div>
                <h2>Que souhaitez-vous analyser ?</h2>
                <p>
                  Choisissez une tâche pour découvrir les
                  visualisations qui permettent d'y répondre.
                </p>
              </div>
            </div>

            <div className="visualization-grid">
              {tasks.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  className="visualization-card"
                  onClick={() => setActiveTask(task.id)}
                >
                  <div className="card-top">
                    <span className="card-number">{task.number}</span>
                    <span className="card-status ready">
                      {task.visualizationIds.length} visualisation(s)
                    </span>
                  </div>

                  <div className="card-content">
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                  </div>

                  <div className="card-footer">
                    <span>Voir les visualisations adaptées</span>
                    <span className="card-arrow">↗</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="section-heading">
              <div>
                {selectedTask && (
                  <button
                    type="button"
                    className="back-button"
                    onClick={() => setActiveTask(null)}
                    style={{ marginBottom: 20 }}
                  >
                    ← Toutes les tâches
                  </button>
                )}

                <h2>
                  {selectedTask
                    ? selectedTask.title
                    : "Nos visualisations"}
                </h2>

                <p>
                  {selectedTask
                    ? selectedTask.description
                    : "Sélectionnez une visualisation pour l'explorer."}
                </p>
              </div>
            </div>

            <div className="visualization-grid">
              {availableVisualizations.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className="visualization-card"
                  onClick={() => setActiveVisualization(item.id)}
                >
                  <div className="card-top">
                    <span className="card-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className={`card-status ${
                      item.ready ? "ready" : "pending"
                    }`}>
                      {item.ready ? "Disponible" : "À intégrer"}
                    </span>
                  </div>

                  <div className="card-content">
                    <span className="card-technique">{item.author}</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>

                  <div className="card-footer">
                    <span>Ouvrir la visualisation</span>
                    <span className="card-arrow">↗</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </section>

      <footer className="dashboard-footer">
        Projet universitaire · Visualisation d'informations · D3.js
      </footer>
    </main>
  );
}

export default App;
