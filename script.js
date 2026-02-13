// smooth scroll
document.querySelectorAll('a').forEach(anchor=>{
  anchor.addEventListener('click',function(e){
    if(this.getAttribute('href').startsWith("#")){
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({behavior:'smooth'});
    }
  });
});

// contact form
document.getElementById("contactForm").addEventListener("submit",function(e){
  e.preventDefault();
  alert("Message sent!");
});

// LOGIN SYSTEM
let isRegister=false;

function openLogin(){
  document.getElementById("loginModal").style.display="block";
}

function closeLogin(){
  document.getElementById("loginModal").style.display="none";
}

function toggleForm(){
  isRegister=!isRegister;

  if(isRegister){
    document.getElementById("formTitle").innerText="Register";
    document.getElementById("nameField").style.display="block";
    document.getElementById("toggleText").innerHTML=
    'Already have account? <span class="toggle" onclick="toggleForm()">Login</span>';
  }else{
    document.getElementById("formTitle").innerText="Login";
    document.getElementById("nameField").style.display="none";
    document.getElementById("toggleText").innerHTML=
    'No account? <span class="toggle" onclick="toggleForm()">Register</span>';
  }
}

function submitForm(){
  let email=document.getElementById("email").value;
  let password=document.getElementById("password").value;
  let name=document.getElementById("nameField").value;

  if(isRegister){
    let user={name,email,password};
    localStorage.setItem("palnaUser",JSON.stringify(user));
    localStorage.setItem("loggedIn","true");
    alert("Registered!");
    showUser();
    closeLogin();
  }
  else{
    let user=JSON.parse(localStorage.getItem("palnaUser"));
    if(!user){alert("Register first");return;}

    if(email===user.email && password===user.password){
      localStorage.setItem("loggedIn","true");
      showUser();
      closeLogin();
    }else{
      alert("Wrong details");
    }
  }
}

function showUser(){
  let user=JSON.parse(localStorage.getItem("palnaUser"));
  if(!user)return;

  document.getElementById("userArea").innerHTML=
  `<span>Hi, ${user.name}</span>`;

  document.getElementById("logoutBtn").style.display="inline-block";
}

function logout(){
  localStorage.setItem("loggedIn","false");
  location.reload();
}

window.onload=function(){
  if(localStorage.getItem("loggedIn")==="true"){
    showUser();
  }
};
