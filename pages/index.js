import React, { useState } from "react";
import Head from "next/head";
import Style from "../components/Style";
import Router from "next/router";
import nookies from "nookies";

const Index = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
    username: ""
  });
  const [stage, setStage] = useState("email");
  const [error, setError] = useState();

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

  const checkEmail = async () => {
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
      setStage("register")
    }
  };

  const login = async () => {
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
  };

  const register = async () => {
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

        <div className="row">
          <input
            type="email"
            name="email"
            value={data.email}
            placeholder="Enter Email Address"
            onChange={setField}
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
              />
            </div>

            <div className="row">
              <a href="#" className="button" onClick={login}>
                Login
              </a>
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
              />
            </div>

            <div className="row">
              <a href="#" className="button" onClick={register}>
                Register
              </a>
            </div>
          </>
        )}

        {error && (
          <div className="row">
            <h2>Error: {error}</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
