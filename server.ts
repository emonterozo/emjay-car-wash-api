require('dotenv').config();
import app from './app.js';

app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});
app.listen(process.env.PORT, () => console.log(`now listening on port ${process.env.PORT}`));
