// src/superadmin/hooks/useSupporters.js
import debounce from "lodash/debounce";
import { useState, useEffect, useCallback } from "react";
import {
  fetchSupporters,
  updateSupporter,
  deleteSupporter,
  assignPermissions,
} from "../services/supportTeamService";

export function useSupporters() {
  const [supporters, setSupporters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Debounced fetch function with safe signal handling
  const fetchData = useCallback(
    debounce(async (signal) => {
      try {
        setLoading(true);
        setError("");

        const data = await fetchSupporters({ signal });

        if (!signal?.aborted) {
          setSupporters(data);
        }
      } catch (err) {
        if (!signal?.aborted) {
          console.error("Error fetching supporters:", err);
          setError(err.message || "Failed to fetch supporters");
        }
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    }, 300), // small debounce for responsiveness
    []
  );

  // ✅ Fetch data on mount
  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);

    // Cleanup to abort fetch on unmount
    return () => controller.abort();
  }, [fetchData]);

  // ✅ Update supporter (with permission assignment)
  const update = async (id, supporterData) => {
    try {
      setLoading(true);
      setError("");

      const { permission_ids, ...basicData } = supporterData;

      // Update supporter basic info
      const updated = await updateSupporter(id, basicData);

      // Update permissions (if provided)
      let updatedPermissions = [];
      if (Array.isArray(permission_ids) && permission_ids.length > 0) {
        const res = await assignPermissions(id, permission_ids);
        updatedPermissions = res.permissions || [];
      }

      const merged = { ...updated, permissions: updatedPermissions };

      // Update local state
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

  // ✅ Delete supporter
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

  return { supporters, loading, error, fetchData, update, remove };
}
