import { useState } from "react";
import API from "../../api/axios";

import "../../styles/resetPwd.css";

const ResetPwd = () => {

  const [data, setData] = useState({
    email: "",
    otp: "",
    password: ""
  });

  const [msg, setMsg] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const fun = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  // SEND OTP 
  const sendOTP = async () => {

    if (!data.email) {
      return setMsg("Please enter email");
    }

    try {
      setLoading(true);
      setMsg("");

      const res = await API.post("/auth/sendotp", {
        email: data.email
      });

      setMsg(res.data.msg || "OTP Sent");
      setOtpSent(true);

    } catch (err) {
      setMsg(err.response?.data?.msg || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };


  //  VERIFY OTP 
  const verifyOTP = async () => {

    if (!data.otp) {
      return setMsg("Please enter OTP");
    }

    try {
      setLoading(true);
      setMsg("");

      const res = await API.post("/auth/verifyotp", {
        email: data.email,
        otp: data.otp
      });

      setMsg(res.data.msg || "OTP Verified");
      setOtpVerified(true);

    } catch (err) {
      setMsg(err.response?.data?.msg || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };


  //  RESET PASSWORD 
  const resetPassword = async () => {

    if (!data.password) {
      return setMsg("Enter new password");
    }

    if (data.password.length < 5) {
      return setMsg("Password must be at least 5 characters");
    }

    try {
      setLoading(true);
      setMsg("");

      const res = await API.post("/auth/resetpwd", {
        email: data.email,
        otp: data.otp,
        password: data.password
      });

      setMsg(res.data.msg || "Password Reset Successful");

      // reset flow
      setData({ email: "", otp: "", password: "" });
      setOtpSent(false);
      setOtpVerified(false);

    } catch (err) {
      setMsg(err.response?.data?.msg || "Reset failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="reset-page">

      <div className="reset-container">

        <div className="reset-left">
          <div className="left-content">
            <h2>Reset Password</h2>
            <p>Enter your email to receive an OTP and update your password securely.</p>
          </div>
        </div>

        <div className="reset-right">

          <h2>Forgot Password</h2>

          {msg && <p>{msg}</p>}

          <input
            name="email"
            placeholder="Enter Email"
            value={data.email}
            onChange={fun}
            disabled={otpSent}
          />

          {otpSent && (
            <input
              name="otp"
              placeholder="Enter OTP"
              value={data.otp}
              onChange={fun}
            />
          )}


          {otpVerified && (
            <input
              name="password"
              type="password"
              placeholder="New Password"
              value={data.password}
              onChange={fun}
            />
          )}


          {!otpSent && (
            <button onClick={sendOTP} disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          )}

          {otpSent && !otpVerified && (
            <button onClick={verifyOTP} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          )}

          {otpVerified && (
            <button onClick={resetPassword} disabled={loading}>
              {loading ? "Updating..." : "Reset Password"}
            </button>
          )}

        </div>

      </div>

    </div>
  );
};

export default ResetPwd;