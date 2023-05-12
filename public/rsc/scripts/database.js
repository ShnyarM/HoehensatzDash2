let onlineLevelNames = []
let errorMessage = "";

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function deleteCookie(cname){
  document.cookie = cname + "=; expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/"
}


async function postJSON(url, data, callback) {
    try {
      const response = await fetch(url, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
      console.log("Success:", result);
      callback(result)
    } catch (error) {
      console.error("Error:", error);
    }
  }

function loginMenu(){
  textAlign(CENTER, CENTER)
  textSize(height/12)
  fill("#FFFF00")
  stroke("black")
  strokeWeight(height/60)
  text("Login", width*0.5, height*0.075)
  textSize(height/30)
  text(errorMessage, width*0.5, height*0.5+height*0.4)

  buttonRect(width*0.5, height*0.5+height*0.3, width / 5, height/ 10, "Login", height / 45, () => {
    hashPassword(passwordInput.value(), usernameInput.value(), (hash)=>{
    postJSON("/login", {username: usernameInput.value(), password: hash}, (result)=>{
        console.log(hash)  
      if(result.status) {
        menuState = 0;
        usernameInput.remove();
        passwordInput.remove();

      }
      else errorMessage = result.msg;
    })
  })
  })

  buttonRect(width*0.06, height*0.05, width / 10, height/ 15, "Back", height / 45, () => {
    menuState = 0
    usernameInput.remove();
    passwordInput.remove();
  })

  buttonRect(width-width*0.06, height*0.05, width / 10, height/ 15, "Register", height / 45, () => {
    errorMessage = ""
    menuState = 9
  })
}

function registerMenu(){
  textAlign(CENTER, CENTER)
  textSize(height/12)
  fill("#FFFF00")
  stroke("black")
  strokeWeight(height/60)
  text("Register", width*0.5, height*0.075)
  textSize(height/30)
  text(errorMessage, width*0.5, height*0.5+height*0.4)

  buttonRect(width*0.5, height*0.5+height*0.3, width / 5, height/ 10, "Register", height / 45, () => {
    hashPassword(passwordInput.value(), usernameInput.value(), (hash)=>{
      console.log(hash)
      postJSON("/register", {username: usernameInput.value(), password: hash}, (result)=>{
        if(result.status) {
          menuState = 0;
          usernameInput.remove();
          passwordInput.remove();
        }
        else errorMessage = result.msg;
      })
    })
  })

  buttonRect(width*0.06, height*0.05, width / 10, height/ 15, "Back", height / 45, () => {
    menuState = 0
    usernameInput.remove();
    passwordInput.remove();
  })

  buttonRect(width-width*0.06, height*0.05, width / 10, height/ 15, "Login", height / 45, () => {
    errorMessage = ""
    menuState = 8
  })
}



function hashPassword(username, password, callback) {
  const digestBuffer = digestMessage(password + "saltsimonshnyar" + username);
  digestBuffer.then(function(value) {
    console.log(value);
    callback(value)
  })
}

async function digestMessage(message) {
  const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  return hashHex;
}