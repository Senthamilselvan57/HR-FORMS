import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";

function Login() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});

    if (Object.values(values).some((value) => value === "")) {
      setErrors({ general: "Please fill in all fields" });
      return;
    }

    try {
      const response = await axios.post(
        "http://192.168.90.128:5001/api/login",
        {
          email: values.email,
          password: values.password,
        }
      );

      if (response.status === 200) {
        if (response.data.status === "Success") {
          navigate("/home");
        } else {
          setErrors({
            general: "Invalid email or password",
          });
        }
      } else if (response.status === 400) {
        setErrors({
          general: "Invalid email or password",
        });
      } else if (response.status === 404) {
        setErrors({
          general: "No such email exists",
        });
      } else {
        setErrors({
          general: "An unexpected error occurred. Please try again later.",
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        if (error.response.status === 400) {
          setErrors({
            general: "Invalid email or password",
          });
        } else if (error.response.status === 404) {
          setErrors({
            general: "No such email exists",
          });
        } else {
          setErrors({
            general: "An unexpected error occurred. Please try again later.",
          });
        }
      } else if (error.request) {
        // The request was made but no response was received
        setErrors({
          general: "No response from the server. Please try again later.",
        });
      } else {
        // Something happened in setting up the request that triggered an error
        setErrors({
          general: "An unexpected error occurred. Please try again later.",
        });
      }
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center vh-100">
        <div className="col-md-6">
          <div
            className="card p-4 rounded"
            style={{ maxWidth: "400px", margin: "auto" }}
          >
            <h2>Sign-In</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  <strong>Email</strong>
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={values.email}
                  onChange={(e) =>
                    setValues({ ...values, email: e.target.value })
                  }
                  className="form-control rounded-0"
                />
                {errors.email && (
                  <div className="text-danger">{errors.email}</div>
                )}{" "}
              </div>
              <div className="mb-3 position-relative">
                <label htmlFor="password" className="form-label">
                  <strong>Password</strong>
                </label>
                <div className="input-group">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Enter your password"
                    name="password"
                    value={values.password}
                    onChange={(e) =>
                      setValues({ ...values, password: e.target.value })
                    }
                    className="form-control rounded-0"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary position-absolute end-0 top-50 translate-middle-y"
                    onClick={togglePasswordVisibility}
                    style={{ backgroundColor: "transparent", border: "none" }}
                  >
                    <Icon
                      icon={passwordVisible ? eye : eyeOff}
                      size={20}
                      style={{ color: "grey" }}
                    />
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-success w-100 rounded-pill mb-3"
                style={{
                  backgroundColor: "#b32e3f",
                  borderColor: "#5cb85c",
                  fontSize: "0.85rem",
                  padding: "0.4rem 1rem",
                }}
              >
                Log In
              </button>
              {errors.general && (
                <div className="text-danger">{errors.general}</div>
              )}{" "}
              <Link
                to="/signup"
                className="btn btn-primary w-100 rounded-pill text-decoration-none"
                style={{
                  backgroundColor: "#5bc0de",
                  borderColor: "#dcdcdc",
                  fontSize: "0.85rem",
                  padding: "0.4rem 1rem",
                }}
              >
                Create Account
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
