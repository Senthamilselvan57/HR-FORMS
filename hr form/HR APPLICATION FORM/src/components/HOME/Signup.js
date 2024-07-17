import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
import { Modal, Button } from "react-bootstrap";

function SignUp() {
  const [values, setValues] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async () => {
    // Check if the mobile number is already verified with a JWT token
    if (isMobileVerified) {
      alert("Mobile number is already verified.");
      return;
    }

    // Ensure OTP is sent only if no OTP is currently sent
    if (!isOtpSent) {
      try {
        const response = await axios.post(
          "http://192.168.90.128:5001/api/send-otp",
          { mobile: values.mobile }
        );
        if (response.status === 200) {
          setIsOtpSent(true);
          setShowOtpModal(true);
          alert("OTP sent to your mobile number.");
        } else {
          setErrors({ mobile: "Failed to send OTP. Please try again." });
        }
      } catch (error) {
        console.error("Error sending OTP:", error);
        setErrors({ mobile: "Error sending OTP. Please try again later." });
      }
    } else {
      alert("OTP already sent. Please check your messages.");
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post(
        "http://192.168.90.128:5001/api/verify-otp",
        { mobile: values.mobile.toString(), otp: otp.toString() }
      );

      if (response.status === 200) {
        setIsMobileVerified(true);
        localStorage.setItem("jwtToken", response.data.token);
        setShowOtpModal(false);
        alert("Mobile number verified successfully.");
      } else {
        setErrors({ otp: "Invalid OTP. Please try again." });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setErrors({ otp: "Error verifying OTP. Please try again later." });
    }
  };

  const handleSignup = async (event) => {
    if (event) {
      event.preventDefault();
    }

    setErrors({});

    if (Object.values(values).some((value) => value === "")) {
      setErrors({ general: "Please fill in all fields" });
      return;
    }

    if (values.password !== values.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    if (!isMobileVerified) {
      setErrors({ mobile: "Please verify your mobile number" });
      return;
    }

    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.post(
        "http://192.168.90.128:5001/api/signup",
        { ...values },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setSignupSuccess(true);
        setValues({
          name: "",
          mobile: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setErrors({});
        alert("Your account has been created");
        navigate("/login");
      } else {
        if (
          response.status === 400 &&
          response.data.error === "Email or mobile number already exists."
        ) {
          setErrors({
            emailOrMobileExists: "Email or mobile number already exists.",
          });
        } else {
          console.log("Sign-up failed:", response.data.error);
          alert("Sign-up failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      alert("Error during sign-up. Please try again later.");
    }
  };

  const handleNameChange = (e) => {
    setValues({ ...values, name: e.target.value });
  };

  const handleMobileChange = (e) => {
    setValues({ ...values, mobile: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  return (
    <div className="container">
      <form onSubmit={handleSignup}>
        <div className="row justify-content-center align-items-center vh-100">
          <div className="col-md-6">
            <div
              className="card p-4 rounded"
              style={{ maxWidth: "400px", margin: "auto" }}
            >
              <h2>Sign-Up</h2>
              {signupSuccess && (
                <div className="alert alert-success mb-3" role="alert">
                  Your account has been created. Please{" "}
                  <Link to="/login">login</Link>.
                </div>
              )}
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  <strong>Name</strong>
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  name="name"
                  value={values.name}
                  onChange={handleNameChange}
                  className="form-control rounded-0"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="mobile" className="form-label">
                  <strong>Mobile Number</strong>
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Enter your Mobile Number"
                    name="mobile"
                    value={values.mobile}
                    onChange={handleMobileChange}
                    className="form-control rounded-0"
                  />
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={sendOtp}
                    style={{
                      marginLeft: "10px",
                      padding: "5px 10px",
                      fontSize: "14px",
                      borderRadius: "5px",
                      boxShadow: "0px 2px 2px rgba(0,0,0,0.2)",
                    }}
                  >
                    Send OTP
                  </button>
                </div>
                {errors.mobile && (
                  <div className="text-danger">{errors.mobile}</div>
                )}
              </div>
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
              <div className="mb-3 position-relative">
                <label htmlFor="confirmPassword" className="form-label">
                  <strong>Confirm Password</strong>
                </label>
                <div className="input-group">
                  <input
                    type={confirmPasswordVisible ? "text" : "password"}
                    placeholder="Confirm your password"
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onChange={(e) =>
                      setValues({ ...values, confirmPassword: e.target.value })
                    }
                    className="form-control rounded-0"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary position-absolute end-0 top-50 translate-middle-y"
                    onClick={toggleConfirmPasswordVisibility}
                    style={{ backgroundColor: "transparent", border: "none" }}
                  >
                    <Icon
                      icon={confirmPasswordVisible ? eye : eyeOff}
                      size={20}
                      style={{ color: "grey" }}
                    />
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="text-danger">{errors.confirmPassword}</div>
                )}
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100 mt-3"
                disabled={!isMobileVerified}
              >
                Sign Up
              </button>

              {errors.general && (
                <div className="text-danger mt-3">{errors.general}</div>
              )}
              {errors.emailOrMobileExists && (
                <div className="text-danger mt-3">
                  {errors.emailOrMobileExists}
                </div>
              )}

              {!signupSuccess && (
                <p className="mt-3">
                  Already have an account? <Link to="/login">Login here</Link>.
                </p>
              )}
            </div>
          </div>
        </div>
      </form>

      <Modal show={showOtpModal} onHide={() => setShowOtpModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Verify OTP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            An OTP has been sent to your mobile number. Please enter the OTP
            below:
          </p>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="form-control"
            placeholder="Enter OTP"
          />
          {errors.otp && <div className="text-danger">{errors.otp}</div>}
        </Modal.Body>
        <Modal.Footer>
          {!isOtpSent && (
            <button onClick={sendOtp} className="btn btn-secondary">
              Resend OTP
            </button>
          )}
          <button onClick={verifyOtp} className="btn btn-primary">
            Verify OTP
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default SignUp;
