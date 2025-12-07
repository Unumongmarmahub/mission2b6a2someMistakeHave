import dotenv from "dotenv";
import app from "./app";

dotenv.config();
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello I am backend server..!');
});


app.listen(port, () => {
  console.log("Server running on port", port);
});
