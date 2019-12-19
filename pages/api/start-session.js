import fetch from "node-fetch";
import nookies from "nookies";

export default async (req, res) => {
  const cookies = nookies.get({ req, res });

  try {
    const request = await fetch("https://api.aidungeon.io/sessions", {
      method: "POST",
      headers: {
        "X-Access-Token": cookies.auth,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    });

    const result = await request.json();

    res.json(result);
  } catch (e) {
    console.log(e);

    res.json({ error: "AI Dungeon is broken maybe: " + e.message });
  }
};
