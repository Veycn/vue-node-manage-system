
const express = require("express")
const app = new express()
const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({ extended: false }))
app.post("/test", (req, res) => {
  console.log(req.body)
})

app.listen(5002, ()=>{
  console.log("server is running at 5002");
})