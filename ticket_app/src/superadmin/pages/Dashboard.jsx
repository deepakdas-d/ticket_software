import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import Chart from "chart.js/auto";
import "../style/Dashboard.css";
import useTickets from "../services/TicketsService";
import ErrorMessage from "../components/ErrorMessage";

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

  // Professional chart data with enhanced styling
  const chartData = {
    labels: ["Open Tickets", "In Progress", "Closed Tickets"],
    counts: [counts.open, counts.in_progress, counts.closed],
  };

  // Initialize Professional Chart.js
  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      
      const ctx = chartRef.current.getContext('2d');
      
      // Create gradient backgrounds
      const openGradient = ctx.createLinearGradient(0, 0, 0, 400);
      openGradient.addColorStop(0, 'rgba(54, 162, 235, 0.8)');
      openGradient.addColorStop(1, 'rgba(54, 162, 235, 0.2)');
      
      const progressGradient = ctx.createLinearGradient(0, 0, 0, 400);
      progressGradient.addColorStop(0, 'rgba(255, 193, 7, 0.8)');
      progressGradient.addColorStop(1, 'rgba(255, 193, 7, 0.2)');
      
      const closedGradient = ctx.createLinearGradient(0, 0, 0, 400);
      closedGradient.addColorStop(0, 'rgba(40, 167, 69, 0.8)');
      closedGradient.addColorStop(1, 'rgba(40, 167, 69, 0.2)');

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
              text: 'Ticket Status Distribution',
              font: {
                size: 18,
                weight: 'bold',
                family: "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif"
              },
              color: '#2c3e50',
              padding: 20
            },
            legend: {
              display: true,
              position: 'top',
              align: 'end',
              labels: {
                font: {
                  size: 12,
                  weight: '500'
                },
                color: '#495057',
                usePointStyle: true,
                pointStyle: 'circle',
                padding: 20
              }
            },
            tooltip: {
              enabled: true,
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              titleColor: '#fff',
              bodyColor: '#fff',
              borderColor: '#dee2e6',
              borderWidth: 1,
              cornerRadius: 8,
              displayColors: true,
              font: {
                size: 13
              },
              callbacks: {
                title: function(context) {
                  return `${context[0].label}`;
                },
                label: function(context) {
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = ((context.parsed.y / total) * 100).toFixed(1);
                  return `Count: ${context.parsed.y} (${percentage}%)`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: '#6c757d',
                font: {
                  size: 12,
                  weight: '500'
                }
              },
              border: {
                color: '#e9ecef'
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)',
                lineWidth: 1
              },
              ticks: {
                color: '#6c757d',
                font: {
                  size: 11
                },
                stepSize: Math.max(1, Math.ceil(Math.max(...chartData.counts) / 5))
              },
              border: {
                color: '#e9ecef'
              }
            },
          },
          animation: {
            duration: 2000,
            easing: 'easeInOutQuart'
          },
          interaction: {
            intersect: false,
            mode: 'index'
          }
        },
      });
    }
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData]);

  // Calculate progress percentage for total tickets
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
    return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  }

  // Redirect or render null if not authenticated
  if (!user) return null;

  return (
    <div className="d-flex vh-100">
      {/* Enhanced Sidebar */}
      <Sidebar user={user} />

      {/* Main Content */}
      <div className="main-content flex-grow-1 p-4">
        <div className="welcome-header mb-4">
          <h1 className="display-5 mb-2">Welcome back, {user.username || user.email}! 👋</h1>
          <p className="text-muted lead">Here's what's happening with your tickets today</p>
        </div>

        {/* Enhanced Ticket Stats Cards */}
        <div className="row g-4 mb-5">
          <div className="col-md-6 col-lg-3">
            <div className="card shadow-sm h-100 stat-card total-tickets">
              <div className="card-body text-center position-relative">
                <div className="stat-icon mb-3">
                  <i className="fas fa-ticket-alt"></i>
                </div>
                <h5 className="card-title text-uppercase fw-bold letter-spacing">Total Tickets</h5>
                <p className="card-text display-4 fw-bold mb-3">{counts.total}</p>
                <div className="progress mt-3" style={{height: '8px'}}>
                  <div
                    className="progress-bar bg-info progress-bar-striped progress-bar-animated"
                    role="progressbar"
                    style={{ width: `${progressPercentage}%` }}
                    aria-valuenow={counts.total}
                    aria-valuemin="0"
                    aria-valuemax={maxTickets}
                  />
                </div>
                <small className="text-muted mt-2 d-block">
                  {counts.total}/{maxTickets} capacity
                </small>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="card shadow-sm h-100 stat-card open-tickets">
              <div className="card-body text-center position-relative">
                <div className="stat-icon mb-3 text-primary">
                  <i className="fas fa-exclamation-circle"></i>
                </div>
                <h5 className="card-title text-uppercase fw-bold">Open Tickets</h5>
                <p className="card-text display-4 fw-bold text-primary">{counts.open}</p>
                <div className="trend-indicator">
                  <small className="text-primary">
                    <i className="fas fa-arrow-up"></i> Needs Attention
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="card shadow-sm h-100 stat-card progress-tickets">
              <div className="card-body text-center position-relative">
                <div className="stat-icon mb-3 text-warning">
                  <i className="fas fa-clock"></i>
                </div>
                <h5 className="card-title text-uppercase fw-bold">In Progress</h5>
                <p className="card-text display-4 fw-bold text-warning">{counts.in_progress}</p>
                <div className="trend-indicator">
                  <small className="text-warning">
                    <i className="fas fa-sync-alt fa-spin"></i> Active Work
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="card shadow-sm h-100 stat-card closed-tickets">
              <div className="card-body text-center position-relative">
                <div className="stat-icon mb-3 text-success">
                  <i className="fas fa-check-circle"></i>
                </div>
                <h5 className="card-title text-uppercase fw-bold">Closed Tickets</h5>
                <p className="card-text display-4 fw-bold text-success">{counts.closed}</p>
                <div className="trend-indicator">
                  <small className="text-success">
                    <i className="fas fa-arrow-down"></i> Completed
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Chart Section */}
        <div className="card shadow-lg mb-5 chart-card">
          <div className="card-header bg-gradient border-0 py-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="card-title mb-1 fw-bold">Analytics Dashboard</h5>
                <small className="text-muted">Real-time ticket distribution overview</small>
              </div>
              <div className="chart-actions">
                <button className="btn btn-sm btn-outline-primary me-2">
                  <i className="fas fa-download me-1"></i>Export
                </button>
                <button className="btn btn-sm btn-outline-secondary">
                  <i className="fas fa-refresh"></i>
                </button>
              </div>
            </div>
          </div>
          <div className="card-body p-4">
            <div className="chart-container position-relative">
              <canvas ref={chartRef}></canvas>
            </div>
          </div>
        </div>

        {/* Enhanced Action Cards */}
        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <div className="card shadow-sm h-100 action-card">
              <div className="card-body text-center p-4">
                <div className="action-icon mb-3 text-primary">
                  <i className="fas fa-list-ul fa-2x"></i>
                </div>
                <h5 className="card-title fw-bold">Recent Tickets</h5>
                <p className="card-text text-muted">View and manage recent ticket activity and updates.</p>
                <button className="btn btn-primary btn-lg w-100 mt-3">
                  <i className="fas fa-eye me-2"></i>View Tickets
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card shadow-sm h-100 action-card">
              <div className="card-body text-center p-4">
                <div className="action-icon mb-3 text-success">
                  <i className="fas fa-chart-line fa-2x"></i>
                </div>
                <h5 className="card-title fw-bold">Advanced Analytics</h5>
                <p className="card-text text-muted">Analyze ticket trends, performance metrics and insights.</p>
                <button className="btn btn-success btn-lg w-100 mt-3">
                  <i className="fas fa-analytics me-2"></i>Go to Analytics
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Sign Out Section */}
        <div className="mt-5 text-center">
          <div className="logout-section p-4 rounded bg-light">
            <h6 className="text-muted mb-3">Session Management</h6>
            <button
              className="btn btn-danger btn-lg px-5"
              onClick={signOut}
              disabled={authLoading}
            >
              <i className="fas fa-sign-out-alt me-2"></i>
              {authLoading ? "Signing Out..." : "Sign Out"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;