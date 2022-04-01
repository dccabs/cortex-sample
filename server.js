const express = require("express");
const app = express();
var PORT = process.env.PORT || 8000

app.use(express.static('public', {
    setHeaders : (res, path, stat)=>{
        if(path.endsWith('wasm')){
            res.set('Content-Type', 'application/wasm')
        }
    }
}));

app.listen(PORT, ()=>{
    console.log("Server Running")
})