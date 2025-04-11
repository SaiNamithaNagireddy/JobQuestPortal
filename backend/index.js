const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectToDB = require("./config/connectTODB");

const app = express();

//////dotenv config/////////////////////
dotenv.config();
connectToDB();
const PORT = process.env.PORT || 8001;

/////////////////middlewares////////////////
app.use(express.json());
app.use(cors());


/////////////////routes/////////////////////
app.use('/api/user', require('./routes/userRoutes'))
app.use('/api/admin', require('./routes/adminRoutes'))



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
