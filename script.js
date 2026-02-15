/* =========================
   SAFE DOM SELECTORS
========================= */
const $ = (id) => document.getElementById(id);

/* =========================
   SMOOTH SCROLL (SAFE)
========================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    try {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    } catch (err) {
      console.error("Scroll Error:", err);
    }
  });
});

/* =========================
   CONTACT FORM
========================= */
const contactForm = $("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = contactForm.querySelector('input[type="text"]').value.trim();
    const email = contactForm.querySelector('input[type="email"]').value.trim();

    if (!name || !email) {
      showToast("Please fill required fields");
      return;
    }

    showToast("Message sent successfully ✅");
    contactForm.reset();
  });
}

/* =========================
   LOGIN SYSTEM
========================= */
let isRegister = false;

function openLogin() {
  $("loginModal").style.display = "block";
}

function closeLogin() {
  $("loginModal").style.display = "none";
  clearForm();
}

/* Close modal outside click */
window.addEventListener("click", (e) => {
  if (e.target === $("loginModal")) closeLogin();
});

/* ESC key close */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLogin();
});

/* Toggle Login/Register */
function toggleForm() {
  isRegister = !isRegister;

  if (isRegister) {
    $("formTitle").innerText = "Register";
    $("nameField").style.display = "block";
    $("toggleText").innerHTML =
      'Already have account? <span class="toggle" onclick="toggleForm()">Login</span>';
  } else {
    $("formTitle").innerText = "Login";
    $("nameField").style.display = "none";
    $("toggleText").innerHTML =
      'No account? <span class="toggle" onclick="toggleForm()">Register</span>';
  }
}

/* =========================
   VALIDATION
========================= */
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  return password.length >= 6;
}

/* =========================
   STORAGE HELPERS
========================= */
function getUser() {
  try {
    return JSON.parse(localStorage.getItem("palnaUser"));
  } catch {
    return null;
  }
}

function saveUser(user) {
  localStorage.setItem("palnaUser", JSON.stringify(user));
}

function setSession() {
  localStorage.setItem("loggedIn", "true");
  localStorage.setItem("loginTime", Date.now());
}

/* =========================
   SUBMIT LOGIN / REGISTER
========================= */
function submitForm() {
  const email = $("email").value.trim();
  const password = $("password").value.trim();
  const name = $("nameField").value.trim();

  if (!validateEmail(email)) {
    showToast("Invalid email format ❌");
    return;
  }

  if (!validatePassword(password)) {
    showToast("Password must be 6+ characters ❌");
    return;
  }

  if (isRegister) {
    if (!name) {
      showToast("Enter full name ❌");
      return;
    }

    const user = { name, email, password };

    saveUser(user);
    setSession();

    showToast("Registered successfully 🎉");
    showUser();
    closeLogin();
  } else {
    const user = getUser();

    if (!user) {
      showToast("Please register first");
      return;
    }

    if (email === user.email && password === user.password) {
      setSession();
      showUser();
      showToast("Welcome back 👋");
      closeLogin();
    } else {
      showToast("Wrong email or password ❌");
    }
  }
}

/* =========================
   USER UI UPDATE
========================= */
function showUser() {
  const user = getUser();
  if (!user) return;

  $("userArea").innerHTML = `<span>Hi, ${user.name}</span>`;
  $("logoutBtn").style.display = "inline-block";
}

let slides = document.querySelectorAll(".slide");
let index = 0;

setInterval(() => {
  slides[index].classList.remove("active");
  index = (index + 1) % slides.length;
  slides[index].classList.add("active");
}, 3000);


/* =========================
   LOGOUT
========================= */
function logout() {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("loginTime");
  location.reload();
}

/* =========================
   SESSION EXPIRY (Demo)
========================= */
function checkSession() {
  const loginTime = localStorage.getItem("loginTime");
  if (!loginTime) return;

  const now = Date.now();
  const diff = now - loginTime;

  const ONE_DAY = 24 * 60 * 60 * 1000;

  if (diff > ONE_DAY) {
    logout();
  }
}

/* =========================
   CLEAR FORM
========================= */
function clearForm() {
  $("email").value = "";
  $("password").value = "";
  $("nameField").value = "";
}

/* =========================
   TOAST MESSAGE (BETTER UX)
========================= */
function showToast(message) {
  let toast = document.createElement("div");
  toast.innerText = message;

  toast.style.position = "fixed";
  toast.style.bottom = "30px";
  toast.style.right = "30px";
  toast.style.background = "#6c63ff";
  toast.style.color = "white";
  toast.style.padding = "12px 20px";
  toast.style.borderRadius = "8px";
  toast.style.zIndex = "9999";

  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

/* =========================
   INIT
========================= */
window.onload = function () {
  checkSession();

  if (localStorage.getItem("loggedIn") === "true") {
    showUser();
  }
};
