import fetch from "node-fetch";

export default async (url, token) => {
  const request = await fetch(url, {
    method: "GET",
    headers: {
      "X-Access-Token": token,
      "Content-Type": "application/json"
    }
  });

  const resultText = await request.text();

  let result = {};
  try {
    result = JSON.parse(resultText);
  } catch (e) {
    result = null;
    console.log(e, resultText);
  }

  if (!result) {
    return { error: "Invalid Auth" };
  }

  return result;
};
