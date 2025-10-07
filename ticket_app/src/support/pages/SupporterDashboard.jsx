import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSupporterAuthContext } from "../context/SupporterAuthProvider";
import SupporterSidebar from "../components/SideBar/SupporterSidebar";
import Chart from 'chart.js/auto';
import "../styles/SupporterDashboard.css";
import { fetchTicketReports } from "../services/SupportServices";
import { FaBars, FaTimes } from "react-icons/fa";

const SupporterDashboard = () => {
  const { user, isAuthLoading } = useSupporterAuthContext();
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [reports, setReports] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate("/supportsignin");
    }
  }, [user, isAuthLoading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const fetchedReports = await fetchTicketReports();
        setReports(fetchedReports);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
        // Optionally show a toast/error message to user
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  // Separate effect to render chart after reports are set and DOM is updated
  useEffect(() => {
    if (!reports || !chartRef.current) return;

    renderPieChart(reports);

    // Cleanup chart on unmount or reports change
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [reports]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderPieChart = (fetchedReports) => {
    const ctx = chartRef.current?.getContext('2d');
    if (!ctx) {
      console.warn("Canvas context not available");
      return;
    }

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Ensure data is valid (fallback to 0 if undefined/null)
    const open = fetchedReports.open_complaints || 0;
    const inProgress = fetchedReports.in_progress_complaints || 0;
    const closed = fetchedReports.closed_complaints || 0;

    // Only render if there's data to show
    if (open + inProgress + closed === 0) {
      console.warn("No data available for chart");
      return;
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Open', 'In Progress', 'Closed'],
        datasets: [{
          data: [open, inProgress, closed],
          backgroundColor: [
            '#FF6B6B', // Soft red for Open
            '#4ECDC4', // Teal for In Progress
            '#45B7D1'  // Sky blue for Closed
          ],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              color: '#333',
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            callbacks: {
              label: (context) => {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
                return `${context.label}: ${context.parsed} (${percentage}%)`;
              }
            }
          }
        },
        animation: {
          animateRotate: true,
          duration: 1500
        }
      }
    });
  };

  if (isLoading) {
    return (
      <div className="supporter-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="supporter-dashboard">
      {/* Sidebar overlay */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "show" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar container */}
      <div className={`sidebar-container ${isSidebarOpen ? "open" : ""}`}>
        <SupporterSidebar />
      </div>

      {/* Main content */}
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="menu-btn"
              onClick={toggleSidebar}
            >
              {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
          <h1>Welcome, {user?.username || "Supporter"} 👋</h1>
        </header>

        <section className="dashboard-content">
          <div className="card">
            <div className="card-icon">🎫</div>
            <h3>Active Tickets</h3>
            <p>{reports?.total_complaints || 0}</p>
          </div>
          <div className="card">
            <div className="card-icon">✅</div>
            <h3>Resolved Today</h3>
            <p>{reports?.closed_complaints || 0}</p>
          </div>
          <div className="card">
            <div className="card-icon">⏳</div>
            <h3>Pending Reviews</h3>
            <p>{reports?.in_progress_complaints || 0}</p>
          </div>
          <div className="card chart-card">
            <h3>Ticket Status Distribution</h3>
            <div className="chart-container">
              <canvas ref={chartRef}></canvas>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SupporterDashboard;