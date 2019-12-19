import nookies from "nookies";
import get from "../../lib/basic-get";

export default async (req, res) => {
  const cookies = nookies.get({ req, res });

  const result = await get(
    "https://api.aidungeon.io/sessions/*/config",
    cookies.auth
  );

  res.json(result);
};
