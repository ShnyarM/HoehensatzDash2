const express = require('express');
const app = express();
var mysql = require('mysql');
const PORT = 80;

app.use(express.static('public'));
app.use(express.urlencoded());
app.use(express.json());
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));


var con = mysql.createConnection({
    host: "localhost",
    user: "sql",
    password: "Kiener69420!",
    database: "höhensatzdash"
  });
  

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });
  
  app.post('/getLevel', (req, res) => {
    console.log(req.body.id.toString())
    con.query("select * from levels where id="+ req.body.id.toString(), function (err, result) {
        if (err) throw err;
        res.send(result[0])
    });
})

app.post('/getLevelNames', (req, res) => {
  console.log(req.body.page.toString())
  con.query("select id from levels ORDER BY id DESC LIMIT 1", function (err, result) {
      if (err) throw err;
      let lastId = result[0].id - req.body.page*8
      let ids = lastId.toString();
      for(let i= 8; i > 0;i--){
        ids +=","+(lastId -i).toString()
      }
      console.log(ids)
      con.query("select levelName, id from levels where id in ("+ids+")", function (er, resu) {
        if (er) throw er;
        console.log(resu)
        res.send(resu)
    });
  });
})

app.post('/uploadLevel', (req, res) => {
  console.log(req.body.level)
  con.query("INSERT INTO levels (levelName, userName, level) VALUES ('der Poopenfarten','VamosMurak','52°17°1°0+71°20°2°0+107°22°1°0+124°23°6°3+136°23°6°3+126°72°4°0~19+4+255,44,22+255,54,0+penis+Hexagon Force');", function (err, result) {
      if (err) throw err;
      res.send(result[0])
  });
})