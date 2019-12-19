import nookies from "nookies";
import get from "../../../lib/basic-get";
import fetch from "node-fetch";

export default async (req, res) => {
  const {
    query: { id }
  } = req;

  const cookies = nookies.get({ req, res });

  try {
    if (req.body && req.body.text) {
      const request = await fetch(
        "https://api.aidungeon.io/sessions/" + id + "/inputs",
        {
          method: "POST",
          headers: {
            "X-Access-Token": cookies.auth,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(req.body)
        }
      );
      res.json(await request.json());
    } else {
      const result = await get(
        "https://api.aidungeon.io/sessions/" + id,
        cookies.auth
      );

      res.json(result);
    }
  } catch (e) {
    console.log(e);

    res.json({ error: "AI Dungeon is broken maybe: " + e.message });
  }
};
