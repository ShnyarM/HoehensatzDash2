const express = require('express');
const app = express();
var mysql = require('mysql');
const PORT = 80;
var cookieParser = require('cookie-parser');

app.use(express.static('public'));
app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser())
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
    con.query("select * from levels where id="+ req.body.id.toString(), function (err, result) {
        if (err) throw err;
        res.send(result[0])
    });
})

app.post('/getPrivateLevel', (req, res) => {
  isLoggedIn(req, res, (result)=>{
    if(result){
  con.query("select * from privateLevels where id="+ req.body.id.toString()+" and username ='"+req.cookies.username+"'", function (err, result) {
      if (err) throw err;
      res.send(result[0])
  });
}
  })
})

app.post('/getLevelNames', (req, res) => {
  con.query("select id from levels ORDER BY id DESC LIMIT 1", function (err, result) {
      if (err) throw err;
      let lastId = result[0].id - req.body.page*8
      let ids = lastId.toString();
      for(let i= 7; i > 0;i--){
        ids +=","+(lastId -i).toString()
      }
      con.query("select levelName, id from levels where id in ("+ids+")", function (er, resu) {
        if (er) throw er;
        res.send(resu)
    });
  });
})

app.post('/uploadLevel', (req, res) => {
  isLoggedIn(req, res, (result)=>{
    if(result){
    con.query("INSERT INTO levels (levelName, userName, level) VALUES ('"+req.body.levelName.toString()+"','"+req.cookies.username.toString()+"','"+req.body.level+"');", function (err, result) {
        if (err) throw err;
        res.send(result[0])
    });
  }else{
    }
  })
})

app.post('/saveLevel', (req, res) => {
  isLoggedIn(req, res, (result)=>{
    if(result){

  if(req.body.levelID == null){
    con.query("SELECT id FROM privateLevels WHERE id = (SELECT MAX(id) FROM privateLevels where username='"+req.cookies.username+"');", function (err, re) {
      if (err) throw err;
      let highestID = 1
      if(re.length > 0)highestID = parseInt(re[0].id) + 1
      con.query("INSERT INTO privateLevels (username, levelName, id, level) VALUES ('"+req.cookies.username+"','"+req.body.levelName+"','"+highestID+ "', '"+req.body.level+"');", function (err, result) {
        if (err) throw err;
        res.send(result)
    });
  });
  }else{
  con.query("update privateLevels set levelName='"+req.body.levelName+"', level='"+req.body.level+"' where username ='"+req.cookies.username+"' and id='"+req.body.levelID+"'", function (err, result) {
    if (err) throw err;
    res.send(result)
  });
  }
  }
  })
})

app.post('/login', (req, res) => {
  con.query("select password from users where username='"+req.body.username.toString()+"'", function (err, result) {
      if (err) throw err;
      if(result.length > 0){
        if(result[0].password==req.body.password){
          let sessionId = createSessionID();
          addSessionId(req.body.username.toString(), sessionId)
          res.cookie('username', req.body.username.toString());
          res.cookie('sessionId', sessionId);
          res.send({status:true})
        } else res.send({status: false, msg:"wrong password"})
      }else{
        res.send({status: false, msg:"user dont exist"})
      }
  });
})

app.post('/register', (req, res) => {
  con.query("select * from users where username='"+req.body.username.toString()+"'", function (err, result) {
      if (err) throw err;
      if(result.length > 0){
        res.send({status: false, msg:"user already exist"})
      }else{
        con.query("insert into users (username, password) values ('"+req.body.username.toString()+"','"+req.body.password.toString()+"')", function (er, resul) {
          if (er) throw er;
          let sessionId = createSessionID();
          addSessionId(req.body.username.toString(), sessionId)
          res.cookie('username', req.body.username.toString());
          res.cookie('sessionId', sessionId);
          res.send({status:true});
        })
      }
  });
})

app.post('/getPlayerLevels', (req, res) => {
  con.query("select levelName, id from levels where userName='"+req.body.username+"'", function (err, result) {
    if (err) throw err;
    res.send(result)
});
})

app.post('/getPrivateLevelNames', (req, res) => {
  isLoggedIn(req, res, (result)=>{
    if(result){
  con.query("SELECT id FROM privateLevels WHERE id = (SELECT MAX(id) FROM privateLevels where username='"+req.cookies.username+"');", function (err, result) {
      if (err) throw err;
      if(result.length <1){
        res.send([]);
        return;
      }
      let lastId = result[0].id - req.body.page*8
      let ids = lastId.toString();
      for(let i= 7; i > 0;i--){
        ids +=","+(lastId -i).toString()
      }
      con.query("select levelName, id from privateLevels where id in ("+ids+") and username='"+req.cookies.username+"'", function (er, resu) {
        if (er) throw er;
        console.log(resu)
        res.send(resu)
    });
  });
}
  })
})

function isLoggedIn(req, res, callback){
  con.query("select * from sessionIds where username='"+req.cookies.username+"' and sessionId='"+req.cookies.sessionId+"'", function (err, result) {
    if (err) throw err;
    if(result.length > 0)callback(true);
    else{
      res.clearCookie("username");
      res.clearCookie("sessionId");
      callback(false);
    }
    });
}

function createSessionID() {
  var result = '';
  const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  for (var i = 32; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

app.post('/test', (req, res) => {
  con.query("select * from privateLevels where username='niggermann'", function (err, result) {
      if (err) throw err;
      console.log(result)
      res.send(result)
  });
})

function addSessionId(username, sessionId){
  con.query("insert into sessionIds (username, sessionId) values ('"+username+"', '"+sessionId+"')", function (err, result) {
    if (err) throw err;
    console.log(result)
  });
}