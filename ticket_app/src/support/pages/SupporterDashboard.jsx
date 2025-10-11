import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSupporterAuthContext } from "../context/SupporterAuthProvider";
import Chart from "chart.js/auto";
import { fetchTicketReports } from "../services/SupportServices";
import SupporterSidebar from "../components/SideBar/SupporterSidebar";

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
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    if (!reports || !chartRef.current) return;
    renderDonutChart(reports);
    return () => chartInstanceRef.current?.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reports]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const renderDonutChart = (fetchedReports) => {
    const ctx = chartRef.current?.getContext("2d");
    if (!ctx) return;

    chartInstanceRef.current?.destroy();

    const open = Number(fetchedReports?.open_complaints || 0);
    const inProgress = Number(fetchedReports?.in_progress_complaints || 0);
    const closed = Number(fetchedReports?.closed_complaints || 0);

    const totalSum = open + inProgress + closed;

    // If no data, show a single "No data" slice so chart area isn't empty
    const dataLabels = totalSum === 0 ? ["No Data"] : ["Open", "In Progress", "Closed"];
    const dataValues = totalSum === 0 ? [1] : [open, inProgress, closed];
    const colors = totalSum === 0 ? ["#E5E7EB"] : ["#3B82F6", "#F59E0B", "#10B981"];

    chartInstanceRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: dataLabels,
        datasets: [
          {
            data: dataValues,
            backgroundColor: colors,
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "65%",
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              padding: 12,
              font: { size: 13 },
              color: "#374151",
            },
          },
          tooltip: {
            backgroundColor: "#1F2937",
            padding: 10,
            cornerRadius: 8,
          },
        },
      },
    });
  };

  return (
    <div style={styles.dashboard}>
      {isSidebarOpen && window.innerWidth <= 768 && (
        <SupporterSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      )}
      <button className="menu-btn" style={styles.menuBtn} onClick={toggleSidebar}>
        ☰
      </button>

      <main style={styles.mainContent} className="main-content">
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Dashboard</h1>
            <p style={styles.subtitle}>Welcome back, {user?.username || "Supporter"}</p>
          </div>
        </header>

        {isLoading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Loading...</p>
          </div>
        ) : (
          <>
            {/* Stats row - same flex layout as before */}
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <span style={styles.statLabel}>Total Tickets</span>
                <span style={styles.statValue}>{reports?.total_complaints ?? 0}</span>
              </div>

              {/* Open card (added) */}
              <div style={styles.statCard}>
                <span style={styles.statLabel}>Open</span>
                <span style={{ ...styles.statValue, color: "#3B82F6" }}>
                  {reports?.open_complaints ?? 0}
                </span>
              </div>

              <div style={styles.statCard}>
                <span style={styles.statLabel}>In Progress</span>
                <span style={{ ...styles.statValue, color: "#F59E0B" }}>
                  {reports?.in_progress_complaints ?? 0}
                </span>
              </div>

              <div style={styles.statCard}>
                <span style={styles.statLabel}>Resolved</span>
                <span style={{ ...styles.statValue, color: "#10B981" }}>
                  {reports?.closed_complaints ?? 0}
                </span>
              </div>
            </div>

            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>Status Overview</h3>
              <div style={styles.chartContainer} className="chart-container">
                <canvas ref={chartRef}></canvas>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

const styles = {
  dashboard: {
    minHeight: "100vh",
    background: "#F9FAFB",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  menuBtn: {
    position: "fixed",
    top: "1rem",
    left: "1rem",
    zIndex: 1100,
    background: "#FFF",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    padding: "0.5rem 0.75rem",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  mainContent: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "2rem 1.5rem",
  },
  header: {
    marginBottom: "2rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 0.25rem 0",
  },
  subtitle: {
    fontSize: "0.95rem",
    color: "#6B7280",
    margin: 0,
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "400px",
  },
  spinner: {
    width: "32px",
    height: "32px",
    border: "3px solid #E5E7EB",
    borderTop: "3px solid #3B82F6",
    borderRadius: "50%",
    animation: "spin 0.6s linear infinite",
  },
  loadingText: {
    marginTop: "1rem",
    color: "#6B7280",
    fontSize: "0.9rem",
  },
  statsGrid: {
    display: "flex",
    flexDirection: "row",
    gap: "1rem",
    overflowX: "auto",
    marginBottom: "2rem",
    paddingBottom: "0.5rem",
  },
  statCard: {
    background: "#FFF",
    padding: "1.5rem",
    borderRadius: "12px",
    border: "1px solid #E5E7EB",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    minWidth: "200px",
    textAlign: "left",
  },
  statLabel: {
    fontSize: "0.875rem",
    color: "#6B7280",
    fontWeight: "500",
  },
  statValue: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#111827",
  },
  chartCard: {
    background: "#FFF",
    padding: "1.5rem",
    borderRadius: "12px",
    border: "1px solid #E5E7EB",
  },
  chartTitle: {
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#111827",
    margin: "0 0 1.5rem 0",
  },
  chartContainer: {
    height: "280px",
    position: "relative",
  },
};

// Inject a small stylesheet for keyframes & responsive tweaks (keeps same behavior as before)
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .menu-btn { /* kept for compatibility with existing CSS rules */
    display: block;
  }
  @media (max-width: 768px) {
    .menu-btn {
      display: block !important;
    }
    .main-content {
      padding: 1rem;
    }
    .welcome-text h1 {
      font-size: 1.5rem;
    }
    .chart-container {
      height: 240px;
    }
  }
  @media (min-width: 769px) {
    .menu-btn {
      display: none !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default SupporterDashboard;
