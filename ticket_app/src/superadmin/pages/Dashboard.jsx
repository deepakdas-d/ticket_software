import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import Chart from "chart.js/auto";
import "../style/Dashboard.css";
import useTickets from "../services/TicketsService";

const Dashboard = () => {
  const { user, signOut, loading: authLoading, isAuthLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const { tickets, counts, loading: ticketsLoading, error } = useTickets();

  // Redirect to signin if not logged in
  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate("/adminsignin");
    }
  }, [user, isAuthLoading, navigate]);

  // Chart data for ticket status
  const chartData = {
    labels: ["Open", "In Progress", "Closed"],
    counts: [counts.open, counts.in_progress, counts.closed],
  };

  // Initialize Chart.js for status distribution
  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      chartInstance.current = new Chart(chartRef.current, {
        type: "bar",
        data: {
          labels: chartData.labels,
          datasets: [
            {
              label: "Ticket Distribution by Status",
              data: chartData.counts,
              backgroundColor: [
                "rgba(54, 162, 235, 0.6)", // Open
                "rgba(255, 206, 86, 0.6)", // In Progress
                "rgba(75, 192, 192, 0.6)", // Closed
              ],
              borderColor: [
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true },
          },
        },
      });
    }
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData]); // Re-run when chartData changes

  // Calculate progress percentage for total tickets (assuming max 200 for scaling)
  const maxTickets = 200;
  const progressPercentage = Math.min((counts.total / maxTickets) * 100, 100);

  // Show loading state
  if (isAuthLoading || ticketsLoading) {
    return (
      <div className="d-flex vh-100 justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="d-flex vh-100 justify-content-center align-items-center">
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
      </div>
    );
  }

  // Redirect or render null if not authenticated
  if (!user) return null;

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <Sidebar user={user} />

      {/* Main Content */}
      <div className="main-content flex-grow-1 p-4">
        <h1 className="mb-4">Welcome, {user.username || user.email}!</h1>

        {/* Ticket Stats Cards */}
        <div className="row g-4 mb-4">
          <div className="col-md-6 col-lg-3">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <h5 className="card-title">Total Tickets</h5>
                <p className="card-text display-6">{counts.total}</p>
                <div className="progress mt-3">
                  <div
                    className="progress-bar bg-info"
                    role="progressbar"
                    style={{ width: `${progressPercentage}%` }}
                    aria-valuenow={counts.total}
                    aria-valuemin="0"
                    aria-valuemax={maxTickets}
                  >
                    {counts.total}/{maxTickets}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <h5 className="card-title">Open Tickets</h5>
                <p className="card-text display-6 text-primary">{counts.open}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <h5 className="card-title">In Progress</h5>
                <p className="card-text display-6 text-warning">{counts.in_progress}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <h5 className="card-title">Closed Tickets</h5>
                <p className="card-text display-6 text-success">{counts.closed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Distribution Chart */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title">Ticket Distribution by Status</h5>
            <div className="chart-container">
              <canvas ref={chartRef}></canvas>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <h5 className="card-title">Recent Tickets</h5>
                <p className="card-text">View and manage recent ticket activity.</p>
                <button className="btn btn-primary w-100">View Tickets</button>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <h5 className="card-title">Analytics</h5>
                <p className="card-text">Analyze ticket trends and performance.</p>
                <button className="btn btn-primary w-100">Go to Analytics</button>
              </div>
            </div>
          </div>
        </div>

        {/* Sign Out Button */}
        <div className="mt-5 text-center">
          <button
            className="btn btn-danger btn-lg"
            onClick={signOut}
            disabled={authLoading}
          >
            {authLoading ? "Signing Out..." : "Sign Out"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;