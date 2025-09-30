import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import Chart from "chart.js/auto";
import "../style/Dashboard.css";
import useTicketCounts from "../services/useTicketCounts"; // ✅ using new service
import ErrorMessage from "../components/ErrorMessage";

const Dashboard = () => {
  const { user, loading: authLoading, isAuthLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const { counts, loading: countsLoading, error: countsError } = useTicketCounts();

  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate("/adminsignin");
    }
  }, [user, isAuthLoading, navigate]);

  const chartData = {
    labels: ["Open Tickets", "In Progress", "Closed Tickets"],
    counts: [counts.total, counts.in_progress, counts.closed],
  };

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) chartInstance.current.destroy();

      const ctx = chartRef.current.getContext("2d");

      const openGradient = ctx.createLinearGradient(0, 0, 0, 400);
      openGradient.addColorStop(0, "rgba(54, 162, 235, 0.8)");
      openGradient.addColorStop(1, "rgba(54, 162, 235, 0.2)");

      const progressGradient = ctx.createLinearGradient(0, 0, 0, 400);
      progressGradient.addColorStop(0, "rgba(255, 193, 7, 0.8)");
      progressGradient.addColorStop(1, "rgba(255, 193, 7, 0.2)");

      const closedGradient = ctx.createLinearGradient(0, 0, 0, 400);
      closedGradient.addColorStop(0, "rgba(40, 167, 69, 0.8)");
      closedGradient.addColorStop(1, "rgba(40, 167, 69, 0.2)");

      chartInstance.current = new Chart(chartRef.current, {
        type: "bar",
        data: {
          labels: chartData.labels,
          datasets: [
            {
              label: "Number of Tickets",
              data: chartData.counts,
              backgroundColor: [openGradient, progressGradient, closedGradient],
              borderColor: [
                "rgba(54, 162, 235, 1)",
                "rgba(255, 193, 7, 1)",
                "rgba(40, 167, 69, 1)",
              ],
              borderWidth: 2,
              borderRadius: 8,
              borderSkipped: false,
              barThickness: 60,
              maxBarThickness: 80,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Ticket Status Distribution",
              font: {
                size: 18,
                weight: "bold",
                family: "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
              },
              color: "#2c3e50",
              padding: 20,
            },
            legend: {
              display: true,
              position: "top",
              align: "end",
              labels: {
                font: { size: 12, weight: "500" },
                color: "#495057",
                usePointStyle: true,
                pointStyle: "circle",
                padding: 20,
              },
            },
            tooltip: {
              enabled: true,
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              titleColor: "#fff",
              bodyColor: "#fff",
              borderColor: "#dee2e6",
              borderWidth: 1,
              cornerRadius: 8,
              displayColors: true,
              font: { size: 13 },
              callbacks: {
                title: (context) => `${context[0].label}`,
                label: (context) => {
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = ((context.parsed.y / total) * 100).toFixed(1);
                  return `Count: ${context.parsed.y} (${percentage}%)`;
                },
              },
            },
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: "#6c757d", font: { size: 12, weight: "500" } },
              border: { color: "#e9ecef" },
            },
            y: {
              beginAtZero: true,
              grid: { color: "rgba(0, 0, 0, 0.05)", lineWidth: 1 },
              ticks: {
                color: "#6c757d",
                font: { size: 11 },
                stepSize: Math.max(1, Math.ceil(Math.max(...chartData.counts) / 5)),
              },
              border: { color: "#e9ecef" },
            },
          },
          animation: { duration: 2000, easing: "easeInOutQuart" },
          interaction: { intersect: false, mode: "index" },
        },
      });
    }

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [chartData]);

  if (isAuthLoading || countsLoading) {
    return (
      <div className="d-flex vh-100 justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (countsError) {
    return <ErrorMessage message={countsError} onRetry={() => window.location.reload()} />;
  }

  if (!user) return null;

  return (
    <div className="d-flex vh-100">
      <Sidebar user={user} />
      <div className="main-content flex-grow-1 p-4">
        {/* ✅ Cards Row */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center">
                <h6 className="text-muted">Total Tickets</h6>
                <h3 className="fw-bold text-primary">{counts.total}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center">
                <h6 className="text-muted">In Progress</h6>
                <h3 className="fw-bold text-warning">{counts.in_progress}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center">
                <h6 className="text-muted">Closed</h6>
                <h3 className="fw-bold text-success">{counts.closed}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Chart Section */}
        <div className="card shadow-sm border-0">
          <div className="card-body" style={{ height: "400px" }}>
            <canvas ref={chartRef}></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
