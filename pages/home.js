import React, { useState } from "react";
import Head from "next/head";
import Style from "../components/Style";
import get from "../lib/basic-get";
import nookies from "nookies";
import Router from "next/router";
import Select from "react-select";

const Home = props => {
  const config = props.config.modes;
  const [error, setError] = useState();

  const [data, setData] = useState({
    customPrompt: "",
    setting: ""
  });

  const settings = Object.keys(config).map(setting => ({
    value: setting,
    label: setting
  }));

  const characterArray =
    data.setting && data.setting.value !== "custom"
      ? Object.keys(config[data.setting.value].characters)
      : [];

  const characters = characterArray.map(character => ({
    label: character,
    value: character
  }));

  const setField = e => {
    const newData = {
      ...data,
      [e.currentTarget.name]: e.currentTarget.value
    };
    setData(newData);
  };

  const begin = async e => {
    e.preventDefault();
    const request = {};
    if (data.customPrompt) {
      request.customPrompt = data.customPrompt;
    } else {
      request.storyMode = data.setting.value;
      request.characterType = data.character.value;
      request.name = data.name;
    }

    const req = await fetch("/api/start-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(request)
    });

    try {
      const result = await req.json();

      if (result && result.id) {
        Router.push("/session/" + result.id);
      } else {
        setError(result && result.error ? result.error : "Timed Out");
      }
    } catch (e) {
      setError("Time out, AI Dungeon too slow");
    }
  };

  const logout = () => {
    nookies.set({}, "auth", "");

    Router.push("/");
  }

  return (
    <div>
      <Head>
        <title>AIDungeon Web</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Style />

      <div className="hero">
        <h1 className="title">Welcome</h1>
        <p className="description"><a href="#" onClick={logout}>Logout</a></p>
      </div>

      <div className="row">
        <h2>Create new game</h2>
      </div>

      <form onSubmit={begin}>
        <div className="row">
          <Select
            className="select"
            value={data.setting}
            options={settings}
            onChange={value =>
              setField({ currentTarget: { name: "setting", value } })
            }
          />
          {characters.length > 0 && (
            <Select
              className="select"
              value={data.character}
              options={characters}
              onChange={value =>
                setField({ currentTarget: { name: "character", value } })
              }
            />
          )}
        </div>

        {data.character && (
          <div className="row">
            <input
              type="name"
              name="name"
              value={data.name}
              placeholder="Enter Your Name"
              onChange={setField}
            />
          </div>
        )}

        {data.setting.value === "custom" && (
          <div className="row">
            <input
              type="customPrompt"
              name="customPrompt"
              value={data.customPrompt}
              placeholder="Enter Prompt"
              onChange={setField}
            />
          </div>
        )}

        {(data.customPrompt || data.name) && (
          <div className="row">
            <button type="submit" className="button" onClick={begin}>
              Begin your journey...
            </button>
          </div>
        )}
      </form>

      {error && (
        <div className="row">
          <h2>Error: {error}</h2>
        </div>
      )}

      {props.sessions && props.sessions.length && (
        <>
          <div className="row">
            <h2>Existing games</h2>
          </div>

          {props.sessions.map(session => (
            <div className="row">
              <a href={`/session/${session.id}`}>{session.story[0].value}</a>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

Home.getInitialProps = async ctx => {
  const cookies = nookies.get(ctx);
  const { req, res } = ctx;

  if (!cookies.auth) {
    if (res) {
      res.writeHead(302, {
        Location: "/"
      });
      return res.end();
    } else {
      return Router.push("/");
    }
  }

  if (ctx.req) {
    const sessions = await get(
      "https://api.aidungeon.io/sessions/",
      cookies.auth
    );
    const config = await get(
      "https://api.aidungeon.io/sessions/*/config",
      cookies.auth
    );

    return { sessions, config };
  } else {
    const requestSessions = await fetch("/api/list-sessions", {
      method: "GET"
    });
    const requestConfig = await fetch("/api/list-configs", {
      method: "GET"
    });
    return {
      sessions: await requestSessions.json(),
      config: await requestConfig.json()
    };
  }
};

export default Home;
