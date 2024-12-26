require('dotenv').config();
import app from './app.js';

app.listen(process.env.PORT, () => console.log(`now listening on port ${process.env.PORT}`));
