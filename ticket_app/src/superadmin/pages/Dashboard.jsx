import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import Chart from "chart.js/auto";
import "../style/Dashboard.css";



const Dashboard = () => {
  const { user, signOut, loading, isAuthLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Mock ticket data
  const ticketData = {
    total: 120,
    open: 45,
    inProgress: 30,
    closed: 45,
    categories: ["Urgent", "High", "Medium", "Low"],
    counts: [20, 30, 40, 30],
  };

  // Redirect to signin if not logged in
  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate("/adminsignin");
    }
  }, [user, isAuthLoading, navigate]);

  // Initialize Chart.js
  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      chartInstance.current = new Chart(chartRef.current, {
        type: "bar",
        data: {
          labels: ticketData.categories,
          datasets: [
            {
              label: "Ticket Distribution",
              data: ticketData.counts,
              backgroundColor: [
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 206, 86, 0.6)",
                "rgba(75, 192, 192, 0.6)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
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
  }, []);

  if (isAuthLoading || !user) return null;

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
                <p className="card-text display-6">{ticketData.total}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <h5 className="card-title">Open Tickets</h5>
                <p className="card-text display-6 text-primary">{ticketData.open}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <h5 className="card-title">In Progress</h5>
                <p className="card-text display-6 text-warning">{ticketData.inProgress}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <h5 className="card-title">Closed Tickets</h5>
                <p className="card-text display-6 text-success">{ticketData.closed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Distribution Chart */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title">Ticket Distribution by Priority</h5>
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
            disabled={loading}
          >
            {loading ? "Signing Out..." : "Sign Out"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;