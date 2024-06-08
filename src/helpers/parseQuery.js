export default function parseQuery(_query) {
  const url = window.location.href

  const queryString = url.split('?')[1];
  const params = new URLSearchParams(queryString);
  const json = {};

  for (const [key, value] of params.entries()) {
    json[key] = value.trim();
  }
  
  return json;
}