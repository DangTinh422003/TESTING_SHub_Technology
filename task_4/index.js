function preparePrefixSum(data) {
  const prefixSum = new Array(data.length).fill(0);
  prefixSum[0] = data[0];
  for (let i = 1; i < data.length; i++) {
    prefixSum[i] = prefixSum[i - 1] + data[i];
  }
  return prefixSum;
}

function prepareAlternateSum(data) {
  const alternateSum = new Array(data.length).fill(0);
  alternateSum[0] = data[0];
  for (let i = 1; i < data.length; i++) {
    alternateSum[i] = alternateSum[i - 1] + (i % 2 === 0 ? data[i] : -data[i]);
  }
  return alternateSum;
}

function rangeSum(prefixSum, l, r) {
  if (l === 0) {
    return prefixSum[r];
  }
  return prefixSum[r] - prefixSum[l - 1];
}

function alternatingSum(alternateSum, l, r) {
  if (l === 0) {
    return alternateSum[r];
  }
  const result = alternateSum[r] - alternateSum[l - 1];
  return l % 2 === 0 ? result : -result;
}

async function solve() {
  const response = await fetch(
    "https://test-share.shub.edu.vn/api/intern-test/input"
  );

  const { token, data, query } = await response.json();
  console.log("🚀 ~ solve ~ data:", data);

  const prefixSum = preparePrefixSum(data);
  const alternateSum = prepareAlternateSum(data);
  const result = query.map((q) => {
    switch (q.type) {
      case "1":
        return rangeSum(prefixSum, q.range[0], q.range[1]);
      case "2":
        return alternatingSum(alternateSum, q.range[0], q.range[1]);
      default:
    }
  });

  await fetch("https://test-share.shub.edu.vn/api/intern-test/output", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(result),
  });
}

solve();
