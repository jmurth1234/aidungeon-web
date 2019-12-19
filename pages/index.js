import React, { useState } from "react";
import Head from "next/head";
import Style from "../components/Style";
import Router from "next/router";
import nookies from "nookies";
import LoadingIndicator from "react-loading-indicator";

const Index = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
    username: ""
  });
  const [stage, setStage] = useState("email");
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const setField = e => {
    const newData = {
      ...data,
      [e.currentTarget.name]: e.currentTarget.value
    };
    setData(newData);

    if (e.currentTarget.name === "email") {
      setStage("email");
    }
  };

  const checkEmail = async e => {
    setLoading(true);
    e.preventDefault();

    const request = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await request.json();

    if (result.error) {
      setStage("login");
    } else {
      nookies.set({}, "auth", result.accessToken);
      setStage("register");
    }

    setLoading(false);
  };

  const handleLogin = async e => {
    setLoading(true);
    e.preventDefault();

    const request = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await request.json();

    if (result.error) {
      setError(result.error);
      setStage("login");
    } else {
      nookies.set({}, "auth", result.accessToken);

      Router.push("/home");
    }

    setLoading(false);
  };

  const handleRegister = async e => {
    setLoading(true);
    e.preventDefault();

    const request = await fetch("/api/modify-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await request.json();

    if (!result.accessToken) {
      setError(result.error);
    } else {
      Router.push("/home");
    }

    setLoading(false);
  };

  const formActions = {
    email: checkEmail,
    login: handleLogin,
    register: handleRegister
  };

  return (
    <div>
      <Head>
        <title>AIDungeon Web</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Style />

      <div className="hero">
        <h1 className="title">Welcome to AIDungeon Web</h1>
        <p className="description">To get started, enter your email address.</p>

        <form id={stage} onSubmit={formActions[stage]}>
          <div className="row">
            <input
              type="email"
              name="email"
              value={data.email}
              placeholder="Enter Email Address"
              onChange={setField}
              disabled={loading}
            />
          </div>

          {stage === "email" && (
            <div className="row">
              <a href="#" className="button" onClick={checkEmail}>
                Next
              </a>
            </div>
          )}

          {stage === "login" && (
            <>
              <div className="row">
                <input
                  type="password"
                  name="password"
                  value={data.password}
                  placeholder="Enter Password"
                  onChange={setField}
                  disabled={loading}
                />
              </div>

              <div className="row">
                <button type="submit" className="button" onClick={handleLogin}>
                  Login
                </button>
              </div>
            </>
          )}

          {stage === "register" && (
            <>
              <div className="row">
                <input
                  type="password"
                  name="password"
                  value={data.password}
                  placeholder="Enter Password"
                  onChange={setField}
                  disabled={loading}
                />
              </div>

              <div className="row">
                <button
                  type="submit"
                  className="button"
                  onClick={handleRegister}
                >
                  Register
                </button>
              </div>
            </>
          )}
        </form>

        {loading && (
          <div className="row">
            <LoadingIndicator />
          </div>
        )}

        {error && (
          <div className="row">
            <h2>Error: {error}</h2>
          </div>
        )}

        <div className="row">
          <h2>
            <a href="https://github.com/rymate1234/aidungeon-web">
              View the source on Github
            </a>
          </h2>
        </div>
      </div>
    </div>
  );
};

Index.getInitialProps = async ctx => {
  const cookies = nookies.get(ctx);
  const { res } = ctx;

  if (cookies.auth) {
    if (res) {
      res.writeHead(302, {
        Location: "/home"
      });
      return res.end();
    } else {
      return Router.push("/home");
    }
  }

  return {};
};

export default Index;
