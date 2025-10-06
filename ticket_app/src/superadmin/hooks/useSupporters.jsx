// src/superadmin/hooks/useSupporters.js
import { useState, useEffect, useCallback } from "react";
import {
  fetchSupporters,
  updateSupporter,
  deleteSupporter,
  assignPermissions,
} from "../services/supportTeamService";
import debounce from "lodash/debounce";

export function useSupporters() {
  const [supporters, setSupporters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Debounced fetchData
  const fetchData = useCallback(
    debounce(async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchSupporters();
        setSupporters(data);
      } catch (err) {
        console.error("Error fetching supporters:", err);
        setError(err.message || "Failed to fetch supporters");
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  // Update supporter
  const update = async (id, supporterData) => {
    try {
      setLoading(true);
      setError("");

      // 1. Extract permissions separately
      const { permission_ids, ...basicData } = supporterData;

      // 2. Update supporter details
      const updated = await updateSupporter(id, basicData);

      // 3. If permissions are provided, update them
      let updatedPermissions = [];
      if (Array.isArray(permission_ids) && permission_ids.length > 0) {
        const res = await assignPermissions(id, permission_ids);
        updatedPermissions = res.permissions || [];
      }

      const merged = { ...updated, permissions: updatedPermissions };

      // 4. Update local state
      setSupporters((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...merged } : s))
      );

      return merged;
    } catch (err) {
      console.error("Error updating supporter:", err);
      setError(err.message || "Failed to update supporter");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete supporter
  const remove = async (id) => {
    try {
      setLoading(true);
      setError("");
      await deleteSupporter(id);
      setSupporters((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Error deleting supporter:", err);
      setError(err.message || "Failed to delete supporter");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { supporters, loading, error, fetchData, update, remove };
}
