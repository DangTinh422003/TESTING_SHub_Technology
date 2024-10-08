import axios from "axios";

async function solve() {
  try {
    const inputResponse = await axios.get(
      "https://test-share.shub.edu.vn/api/intern-test/input"
    );
    const { token, data, query } = inputResponse.data;

    const n = data.length;

    const prefixSum = Array(n).fill(0);
    const prefixAltSum = Array(n).fill(0);

    prefixSum[0] = data[0];
    prefixAltSum[0] = data[0]; // Chẵn-lẻ: Vị trí 0 là chẵn,

    for (let i = 1; i < n; i++) {
      prefixSum[i] = prefixSum[i - 1] + data[i];
      prefixAltSum[i] =
        prefixAltSum[i - 1] + (i % 2 === 0 ? data[i] : -data[i]);
    }

    const results = [];

    for (const q of query) {
      const { type, range } = q;
      const [l, r] = range;

      if (type === "1") {
        const total = l > 0 ? prefixSum[r] - prefixSum[l - 1] : prefixSum[r];
        results.push(total);
      } else if (type === "2") {
        const total =
          l > 0 ? prefixAltSum[r] - prefixAltSum[l - 1] : prefixAltSum[r];
        results.push(total);
      }
    }

    await axios.post(
      "https://test-share.shub.edu.vn/api/intern-test/output",
      {
        result: results,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Kết quả đã được gửi thành công!");
  } catch (error) {
    console.error("Đã có lỗi xảy ra:", error);
  }
}

solve();
