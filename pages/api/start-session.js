import fetch from "node-fetch";
import nookies from "nookies";

export default async (req, res) => {
  const cookies = nookies.get({ req, res })
  
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;

  const request = await fetch("https://api.aidungeon.io/sessions", {
    method: "POST",
    headers: {
      "X-Access-Token": cookies.auth,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(req.body)
  });

  const result = await request.json();

  res.end(JSON.stringify(result));
};
