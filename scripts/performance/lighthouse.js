import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";

const url = process.argv[2] || "http://localhost:5173";

(async () => {
  const chrome = await launch({ chromeFlags: ["--headless"] });
  const result = await lighthouse(url, { port: chrome.port, output: "json" });
  const { lhr } = result;
  console.log("Performance score:", lhr.categories.performance.score * 100);
  await chrome.kill();
})();
