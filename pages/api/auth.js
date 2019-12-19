import fetch from "node-fetch";
import nookies from "nookies";

export default async (req, res) => {
  const request = await fetch("https://api.aidungeon.io/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req.body)
  });

  const resultText = await request.text();
  
  let result = {}
  try {
    result = JSON.parse(resultText);
  } catch (e) {
    console.log(e, resultText);
  }

  if (!result.accessToken) {
    return res.json({ error: "Invalid login" });
  }

  res.json(result);
};
