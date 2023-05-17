const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000 ;


app.use(cors());
app.use(express.json());



app.get('/', (req, res)=>{
    res.send('mera bhi ayega')
})

app.listen(port, ()=>{
    console.log(`running on port ${port}`);
})