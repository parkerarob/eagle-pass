import autocannon from "autocannon";

const url = process.env.PERF_URL || "http://localhost:5173/api/passes";

autocannon(
  {
    url,
    connections: 1000,
    duration: 30,
  },
  (err, result) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(autocannon.printResult(result));
  },
);
