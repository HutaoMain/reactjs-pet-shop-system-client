import "./LoginPage.css";
import axios from "axios";
import React, { useState } from "react";
import { loginInterface } from "../../types/Types";
import useAuthStore from "../../zustand/AuthStore";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const navigate = useNavigate();

  const [credentials, setCredentials] = useState<loginInterface>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<string>("");

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLogin = async (event: any) => {
    event.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/user/login`,
        credentials
      );
      setUser(credentials.email);
      navigate("/");
    } catch (err) {
      console.log(err);
      setErrors("Incorrect email or password.");
    }
  };

  return (
    <div className="login-container">
      <section className="login-header">
        <h1>Sign in to your Account</h1>
      </section>
      <div className="login-title">
        <h1>
          Welcome to Comprehensive Pet Management System with Promotional Email
          Notification
        </h1>
      </div>
      <div className="login-form">
        <form>
          <div className="login-input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              onChange={onChangeHandler}
            />
          </div>
          <div className="login-input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              onChange={onChangeHandler}
            />
          </div>
          {errors && (
            <div style={{ padding: "5px 0" }}>
              <span style={{ color: "red" }}>{errors}</span>
            </div>
          )}
          <div className="button-group">
            <button type="submit" onClick={handleLogin}>
              Log In
            </button>
            <Link
              to="/registration"
              className="login-link"
              style={{ textDecoration: "none" }}
            >
              <button type="button">Sign Up</button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
