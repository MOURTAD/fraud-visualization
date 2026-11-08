
import { useState } from "react";
import ParallelCoordinates from "./visualizations/mourtada/ParallelCoordinates";
import "./App.css";

const visualizations = [
  {
    id: "mourtada",
    author: "Mourtada",
    title: "Suspicious Transaction Profile Identification",
    description: "Parallel coordinates with multidimensional filtering.",
    ready: true,
  },
  {
    id: "hiba",
    author: "Hiba",
    title: "Fraud Risk Factor Analysis",
    description: "Heatmap exploring fraud patterns across merchant categories and transaction amounts.",
    ready: true,
    url: "/visualizations/hiba/heatmap.html",
  },
  {
    id: "salma",
    author: "Salma",
    title: "Spatial Anomaly Analysis",
    description: "Interactive exploration of transaction distance, amount, and fraud patterns.",
    ready: true,
    url: "/visualizations/salma/scatter.html",
  },
  {
    id: "di",
    author: "Di",
    title: "Category and Temporal Fraud Analysis",
    description: "Bar and line charts comparing merchant fraud rates and hourly fraud patterns.",
    ready: true,
    url: "/visualizations/di/bar_line.html",
  },
  {
    id: "abdelhafid",
    author: "Hafid",
    title: "Transaction Amount Distribution",
    description: "Histogram comparing fraudulent and legitimate transaction amounts.",
    ready: true,
    url: "/visualizations/abdelhafid/index.html",
  },
];

// Analytical tasks and their associated visualizations
const tasks = [
  {
    id: "distribution",
    number: "01",
    title: "Explore Transaction Amount Distributions",
    description:
      "Compare the amount distributions of fraudulent and legitimate transactions.",
    visualizationIds: ["abdelhafid"],
  },
  {
    id: "factors",
    number: "02",
    title: "Identify Fraud Risk Factors",
    description:
      "Explore merchant categories, transaction amounts, and attribute combinations associated with higher fraud rates.",
    visualizationIds: ["hiba", "di", "mourtada"],
  },
  {
    id: "spatial",
    number: "03",
    title: "Investigate Spatial Anomalies",
    description:
      "Examine relationships between transaction distance, amount, and fraudulent activity.",
    visualizationIds: ["salma", "mourtada"],
  },
  {
    id: "profiles",
    number: "04",
    title: "Identify Suspicious Transaction Profiles",
    description:
      "Combine multiple transaction attributes and apply filters to identify suspicious patterns.",
    visualizationIds: ["mourtada"],
  },
  {
    id: "temporal",
    number: "05",
    title: "Analyze Fraud Patterns Over Time",
    description:
      "Explore fraud activity across the 24 hours of the day and identify potential peak-risk periods.",
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

  // Visualization page
  if (selectedVisualization) {
    return (
      <main className="dashboard">
        <header className="dashboard-navigation">
          <button
            type="button"
            className="back-button"
            onClick={() => setActiveVisualization(null)}
          >
            ← Back
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
              <p>This visualization will be available soon.</p>
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
          INFORMATION VISUALIZATION PROJECT
        </span>

        <h1>Credit Card Fraud Analysis</h1>

        <p>
          Explore banking transactions through five interactive
          visualizations designed to support fraud investigation.
        </p>

        <div className="dashboard-meta">
          <span>20,000 Transactions</span>
          <span>5 Visualizations</span>
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
            Explore by Tasks
          </button>

          <button
            type="button"
            className={mode === "visualizations" ? "mode-active" : ""}
            onClick={() => {
              setMode("visualizations");
              setActiveTask(null);
            }}
          >
            Explore by Visualizations
          </button>
        </div>

        {mode === "tasks" && !selectedTask ? (
          <>
            <div className="section-heading">
              <div>
                <h2>What would you like to investigate?</h2>
                <p>
                  Select an analytical task to discover the
                  visualizations that can help answer your questions.
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
                    <span className="card-number">
                      {task.number}
                    </span>
                    <span className="card-status ready">
                      {task.visualizationIds.length}{" "}
                      {task.visualizationIds.length === 1
                        ? "Visualization"
                        : "Visualizations"}
                    </span>
                  </div>

                  <div className="card-content">
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                  </div>

                  <div className="card-footer">
                    <span>Explore Related Visualizations</span>
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
                    ← All Tasks
                  </button>
                )}

                <h2>
                  {selectedTask
                    ? selectedTask.title
                    : "Our Visualizations"}
                </h2>

                <p>
                  {selectedTask
                    ? selectedTask.description
                    : "Choose a visualization to explore the transaction data."}
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

                    <span
                      className={`card-status ${
                        item.ready ? "ready" : "pending"
                      }`}
                    >
                      {item.ready ? "Available" : "Coming Soon"}
                    </span>
                  </div>

                  <div className="card-content">
                    <span className="card-technique">
                      {item.author}
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>

                  <div className="card-footer">
                    <span>Open Visualization</span>
                    <span className="card-arrow">↗</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </section>

      <footer className="dashboard-footer">
        University Project · Information Visualization · D3.js
      </footer>
    </main>
  );
}

export default App;
