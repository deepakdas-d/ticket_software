import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import PasswordInput from "../components/Password";


const SignIn = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useContext(AuthContext);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      await signIn(formData.username, formData.password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <div className="col-12 col-md-6">
        <div className="card">
          <div className="card-body">
            <h2 className="card-title text-center mb-4">Sign In</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input type="text" className="form-control" name="username" value={formData.username} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
             <PasswordInput value={formData.password} onChange={handleChange} />

              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
