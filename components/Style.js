import React from "react";

const Nav = () => (
  <style jsx global>{`
    :global(body) {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, Avenir Next, Avenir,
        Helvetica, sans-serif;
    }
 
    * { 
      box-sizing: border-box;
    }

    nav {
      text-align: center;
    }
    ul {
      display: flex;
      justify-content: space-between;
    }
    nav > ul {
      padding: 4px 16px;
    }
    li {
      display: flex;
      padding: 6px 8px;
    }
    a {
      color: #067df7;
      text-decoration: none;
      font-size: 13px;
    }

    .hero {
      width: 100%;
      color: #333;
    }
    .title {
      margin: 0;
      width: 100%;
      padding-top: 80px;
      line-height: 1.15;
      font-size: 48px;
    }
    .title,
    .description {
      text-align: center;
    }
    .row {
      max-width: 880px;
      margin: 80px auto 40px;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
    }
    input {
      width: 100%;
      padding: 5px;
    }
    .button {
      width: 200px;
      display: block;
      border: 1px solid #666;
      text-align: center;
      padding: 20px;
    }
    .select {
      width: 200px;
    }

    .terminal {
      font-family: monospace;
      font-size: 14px;
      background-color: #000000;
      color: #ffffff;
      padding: 10px;
      white-space: pre-line;
    }

    .input::before {
      content: '> ';
    }

    .input {
      margin: 5px 0;
      color: #dddddd;
      font-style: italic;
    }

    .terminal input {
      display: block;
      background: #111111;
      border: 0;
      color: #ffffff;
      font-style: normal;
    }
  `}</style>
);

export default Nav;
