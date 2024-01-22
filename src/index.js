const app = require("./server"); // Adjust the path if necessary

const PORT = Number(process.env.PORT) || 3000;

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

app.listen(PORT, "0.0.0.0", function () {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
