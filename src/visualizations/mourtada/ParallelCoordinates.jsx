import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./parallelCoordinates.css";

const AXES = [
  "amount_usd",
  "distance_from_home_km",
  "velocity_score",
  "txn_count_last_24h",
  "cvv_retry_count",
  "merchant_risk_score",
];

const LABELS = {
  amount_usd: "Amount ($)",
  distance_from_home_km: "Distance (km)",
  velocity_score: "Velocity",
  txn_count_last_24h: "Transactions / 24h",
  cvv_retry_count: "CVV retries",
  merchant_risk_score: "Merchant risk",
};

const YES_NO_OPTIONS = [
  { value: "all", label: "All" },
  { value: "True", label: "Yes" },
  { value: "False", label: "No" },
];

// The same promise is reused across filter changes and component remounts.
let transactionsPromise = null;
function loadTransactions() {
  if (!transactionsPromise) {
    transactionsPromise = d3
      .csv("/data/credit_card_fraud_2026_TEAM_v1.csv", (row) => {
        const transaction = { ...row };
        AXES.forEach((axis) => {
          transaction[axis] = Number(row[axis]);
        });
        return transaction;
      })
      .catch((error) => {
        transactionsPromise = null;
        throw error;
      });
  }
  return transactionsPromise;
}

function FilterButtons({ label, value, onChange, options }) {
  return (
    <div className="mourtada-filter-controls">
      <span className="mourtada-filter-label">{label}</span>
      <div className="mourtada-filter-buttons">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`mourtada-filter-button${value === option.value ? " active" : ""}`}
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ParallelCoordinates() {
  const svgRef = useRef(null);
  const activeBrushesRef = useRef({});
  const selectedTransactionRef = useRef(null);
  const chartRef = useRef(null);

  const [fraudFilter, setFraudFilter] = useState("all");
  const [vpnFilter, setVpnFilter] = useState("all");
  const [ipMismatchFilter, setIpMismatchFilter] = useState("all");
  const [selectionStats, setSelectionStats] = useState({
    total: 0,
    fraud: 0,
    fraudRate: 0,
  });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [error, setError] = useState("");

  // STEP A: Initialize SVG, scales, axes and brushes exactly once per mount.
  useEffect(() => {
    let cancelled = false;

    async function initializeChart() {
      try {
        const data = await loadTransactions();
        if (cancelled || !svgRef.current) return;

        const width = 1100;
        const height = 500;
        const margin = { top: 70, right: 70, bottom: 45, left: 70 };
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();
        svg
          .attr("viewBox", `0 0 ${width} ${height}`)
          .attr("width", "100%")
          .attr("role", "img")
          .attr("aria-label", "Parallel Coordinates Plot of credit card transactions");

        const x = d3.scalePoint().domain(AXES).range([margin.left, width - margin.right]);
        const y = {};
        AXES.forEach((axis) => {
          y[axis] = d3.scaleLinear()
            .domain(d3.extent(data, (d) => d[axis]))
            .range([height - margin.bottom, margin.top]);
        });

        const fraudData = data.filter((d) => d.is_fraud === "1");
        const legitimateData = data.filter((d) => d.is_fraud === "0");
        const sampleSize = Math.min(500, legitimateData.length);
        const sampledLegitimate = Array.from({ length: sampleSize }, (_, i) =>
          legitimateData[Math.floor((i * legitimateData.length) / sampleSize)]
        );
        const displayedData = [...sampledLegitimate, ...fraudData];

        const line = d3.line()
          .x(([axis]) => x(axis))
          .y(([axis, value]) => y[axis](value));
        const pathFor = (transaction) => line(AXES.map((axis) => [axis, transaction[axis]]));
        const transactionGroup = svg.append("g").attr("class", "mourtada-lines");
        const hitAreaGroup = svg.append("g").attr("class", "mourtada-hit-areas");

        const axisGroups = svg
          .selectAll(".mourtada-axis")
          .data(AXES)
          .join("g")
          .attr("class", "mourtada-axis")
          .attr("transform", (axis) => `translate(${x(axis)},0)`);

        axisGroups.each(function (axis) {
          const axisGenerator = d3.axisLeft(y[axis]);
          if (axis === "cvv_retry_count" || axis === "txn_count_last_24h") {
            const max = d3.max(data, (d) => d[axis]);
            const step = axis === "cvv_retry_count" ? 1 : 2;
            axisGenerator.tickValues(d3.range(0, max + 1, step));
            axisGenerator.tickFormat(d3.format("d"));
          } else {
            axisGenerator.ticks(6);
          }
          d3.select(this).call(axisGenerator);
        });

        axisGroups.append("text")
          .attr("class", "mourtada-axis-label")
          .attr("y", margin.top - 24)
          .attr("text-anchor", "middle")
          .text((axis) => LABELS[axis]);

        // Mutable chart closure: these selections are refreshed by updateVisualization.
        let transactionLines = transactionGroup.selectAll("path");
        let hitAreas = hitAreaGroup.selectAll("path");
        let currentFilters = { fraudFilter: "all", vpnFilter: "all", ipMismatchFilter: "all" };
        const activeBrushes = activeBrushesRef.current;

        const matchesActiveBrushes = (transaction) =>
          Object.entries(activeBrushes).every(([axis, [min, max]]) =>
            transaction[axis] >= min && transaction[axis] <= max
          );

        function calculateSelectionStats() {
          let total = 0;
          let fraud = 0;
          for (const transaction of data) {
            if (!matchesActiveBrushes(transaction)) continue;
            if (currentFilters.vpnFilter !== "all" && transaction.used_vpn !== currentFilters.vpnFilter) continue;
            if (currentFilters.ipMismatchFilter !== "all" && transaction.ip_country_mismatch !== currentFilters.ipMismatchFilter) continue;
            total += 1;
            if (transaction.is_fraud === "1") fraud += 1;
          }
          setSelectionStats({ total, fraud, fraudRate: total ? (fraud / total) * 100 : 0 });
        }

        function updateLineAppearance() {
          const selected = selectedTransactionRef.current;
          transactionLines
  .classed("mourtada-selected-line", (d) => d === selected)
  .style("stroke", (d) => (d === selected ? "#eab308" : null))
  .style("stroke-width", (d) => (d === selected ? "3.5px" : null))
  .style("stroke-opacity", (d) => (d === selected ? 1 : null))
  .style("opacity", 1)
  .style("display", (d) =>
    matchesActiveBrushes(d) ? null : "none"
  );
          hitAreas.style("pointer-events", (d) => matchesActiveBrushes(d) ? "stroke" : "none");
        }

        function clearSelection() {
          selectedTransactionRef.current = null;
          setSelectedTransaction(null);
          updateLineAppearance();
        }

        function updateHighlightedLines() {
          const selected = selectedTransactionRef.current;
          if (selected && !matchesActiveBrushes(selected)) {
            selectedTransactionRef.current = null;
            setSelectedTransaction(null);
          }
          updateLineAppearance();
          calculateSelectionStats();
        }

        function updateVisualization(nextFilters) {
          currentFilters = nextFilters;
          // Previous transaction may disappear from the visible subset.
          selectedTransactionRef.current = null;
          setSelectedTransaction(null);

          const filteredData = displayedData.filter((transaction) => {
            const matchesFraud =
              currentFilters.fraudFilter === "all" ||
              (currentFilters.fraudFilter === "fraud" && transaction.is_fraud === "1") ||
              (currentFilters.fraudFilter === "legitimate" && transaction.is_fraud === "0");
            const matchesVpn = currentFilters.vpnFilter === "all" || transaction.used_vpn === currentFilters.vpnFilter;
            const matchesIp = currentFilters.ipMismatchFilter === "all" || transaction.ip_country_mismatch === currentFilters.ipMismatchFilter;
            return matchesFraud && matchesVpn && matchesIp;
          });

          // Data joins modify only line paths. Axes and brush nodes stay intact.
          transactionLines = transactionGroup
            .selectAll("path")
            .data(filteredData, (d) => d.transaction_id)
            .join("path")
            .attr("class", (d) => `mourtada-transaction-line ${d.is_fraud === "1" ? "mourtada-fraud" : "mourtada-legitimate"}`)
            .attr("d", pathFor)
            .style("pointer-events", "none");

          hitAreas = hitAreaGroup
            .selectAll("path")
            .data(filteredData, (d) => d.transaction_id)
            .join("path")
            .attr("class", "mourtada-hit-area")
            .attr("d", pathFor)
            .on("click", (event, transaction) => {
              event.stopPropagation();
              if (!matchesActiveBrushes(transaction)) return;
              selectedTransactionRef.current = transaction;
              setSelectedTransaction(transaction);
              updateLineAppearance();
              transactionLines.filter((d) => d === transaction).raise();
            });

          updateHighlightedLines();
          console.log("Updated transaction paths (axes/brushes unchanged):", filteredData.length);
        }

        AXES.forEach((axis) => {
          const brush = d3.brushY()
            .extent([[-12, margin.top], [12, height - margin.bottom]])
            .on("brush end", (event) => {
              if (event.selection === null) {
                delete activeBrushes[axis];
              } else {
                const [pixelTop, pixelBottom] = event.selection;
                activeBrushes[axis] = [y[axis].invert(pixelBottom), y[axis].invert(pixelTop)];
              }
              updateHighlightedLines();
            });

          const brushGroup = svg.append("g")
            .attr("class", "mourtada-brush")
            .attr("data-axis", axis)
            .attr("transform", `translate(${x(axis)},0)`)
            .call(brush);

          const savedRange = activeBrushes[axis];
          if (savedRange) {
            brushGroup.call(brush.move, [y[axis](savedRange[1]), y[axis](savedRange[0])]);
          }
        });

        chartRef.current = { updateVisualization, clearSelection };
        updateVisualization({ fraudFilter, vpnFilter, ipMismatchFilter });
        setError("");
        console.log("Parallel Coordinates axes and brushes initialized once");
      } catch (err) {
        if (!cancelled) {
          console.error("Error initializing Parallel Coordinates:", err);
          setError(err.message);
        }
      }
    }

    initializeChart();
    return () => {
      cancelled = true;
      chartRef.current = null;
      d3.select(svgRef.current).selectAll("*").remove();
    };
    // This effect deliberately has no filter dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // STEP B: On filter changes, reuse existing axes/brushes and update paths only.
  useEffect(() => {
    chartRef.current?.updateVisualization({ fraudFilter, vpnFilter, ipMismatchFilter });
  }, [fraudFilter, vpnFilter, ipMismatchFilter]);

  return (
    <section className="mourtada-parallel-coordinates">
      <h2>Suspicious Profile Identification</h2>
      <p>Parallel Coordinates Plot — Credit Card Fraud Detection 2026</p>

      <FilterButtons label="Transaction status:" value={fraudFilter} onChange={setFraudFilter} options={[
        { value: "all", label: "All" },
        { value: "fraud", label: "Fraud" },
        { value: "legitimate", label: "Legitimate" },
      ]} />
      <FilterButtons label="VPN usage:" value={vpnFilter} onChange={setVpnFilter} options={YES_NO_OPTIONS} />
      <FilterButtons label="IP country mismatch:" value={ipMismatchFilter} onChange={setIpMismatchFilter} options={YES_NO_OPTIONS} />

      <div className="mourtada-stats">
        <div className="mourtada-stat-card"><span>Selected transactions</span><strong>{selectionStats.total.toLocaleString()}</strong></div>
        <div className="mourtada-stat-card"><span>Fraud transactions</span><strong>{selectionStats.fraud.toLocaleString()}</strong></div>
        <div className="mourtada-stat-card"><span>Fraud rate</span><strong>{selectionStats.total === 0 ? "N/A" : `${selectionStats.fraudRate.toFixed(2)}%`}</strong></div>
      </div>

      <div className="mourtada-chart-container"><svg ref={svgRef} /></div>
      <div className="mourtada-legend">
        <span className="mourtada-legend-item"><span className="mourtada-legend-color mourtada-legend-legitimate" />Legitimate (500 sampled)</span>
        <span className="mourtada-legend-item"><span className="mourtada-legend-color mourtada-legend-fraud" />Fraud (all 339)</span>
      </div>
      <p className="mourtada-sampling-note">
        Visual sampling is used for readability. Displayed proportions do not represent the dataset&apos;s fraud rate. Statistics use the full dataset.
      </p>

      {selectedTransaction && (
        <div className="mourtada-details-panel">
          <h3>Transaction details</h3>
          <p><strong>ID:</strong> {selectedTransaction.transaction_id}</p>
          <p><strong>Status:</strong> {selectedTransaction.is_fraud === "1" ? "Fraud" : "Legitimate"}</p>
          <p><strong>Amount:</strong> ${selectedTransaction.amount_usd.toFixed(2)}</p>
          <p><strong>Distance:</strong> {selectedTransaction.distance_from_home_km.toFixed(2)} km</p>
          <p><strong>Velocity:</strong> {selectedTransaction.velocity_score}</p>
          <p><strong>Transactions / 24h:</strong> {selectedTransaction.txn_count_last_24h}</p>
          <p><strong>CVV retries:</strong> {selectedTransaction.cvv_retry_count}</p>
          <p><strong>Merchant risk:</strong> {selectedTransaction.merchant_risk_score}</p>
          <p><strong>VPN used:</strong> {selectedTransaction.used_vpn}</p>
          <p><strong>IP country mismatch:</strong> {selectedTransaction.ip_country_mismatch}</p>
          <p><strong>Authentication method:</strong> {selectedTransaction.auth_method}</p>
          <button type="button" onClick={() => chartRef.current?.clearSelection()}>Close details</button>
        </div>
      )}
      {error && <p role="alert" style={{ color: "#b91c1c" }}>{error}</p>}
    </section>
  );
}

export default ParallelCoordinates;
