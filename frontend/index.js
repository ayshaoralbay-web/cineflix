const API_URL = "http://localhost:5001";


fetch("navbar.html")
  .then((res) => res.text())
  .then((data) => {
    const navbar = document.querySelector("#navbar");
    navbar.innerHTML = data;

    const currentPage = window.location.pathname.split("/").pop() || "home.html";
    navbar.querySelectorAll(".links a").forEach((link) => {
      if (link.getAttribute("href") === currentPage) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });
  });

fetch("footer.html")
  .then((res) => res.text())
  .then((data) => (document.querySelector(".footer").innerHTML = data));


function showFormMessage(selector, message, isError = false) {
  const messageElement = document.querySelector(selector);
  if (!messageElement) return;

  messageElement.textContent = message;
  messageElement.classList.toggle("is-error", isError);
  messageElement.classList.toggle("is-success", Boolean(message) && !isError);
}

const registerButton = document.querySelector(".submit");
const registerForm = document.querySelector("#registerForm");

if (registerButton && registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    showFormMessage("#registerMessage", "");

    const user = {
      name: document.querySelector("#name").value.trim(),
      email: document.querySelector("#email").value.trim(),
      age: document.querySelector("#age").value,
      password: document.querySelector("#password").value,
    };

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      const result = await response.json();
      showFormMessage(
        "#registerMessage",
        result.message || (response.ok ? "Your account is ready." : "Unable to create your account."),
        !response.ok
      );
    } catch (error) {
      showFormMessage("#registerMessage", "Unable to reach the server. Please try again.", true);
    }
  });
}


const tableBody = document.querySelector(".table tbody");

async function loadUsers() {
  try {
    const res = await fetch(`${API_URL}/users`);
    const users = await res.json();

    tableBody.innerHTML = "";

    users.forEach((user, index) => {
      const row = tableBody.insertRow();
      [index + 1, user.name, user.email, user.age ?? ""].forEach((value) => {
        row.insertCell().textContent = value;
      });


      const actions = row.insertCell();

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.className = "edit-btn";
      editBtn.addEventListener("click", () => editUser(user));

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.className = "delete-btn";
      deleteBtn.addEventListener("click", () => deleteUser(user.id));

      actions.append(editBtn, deleteBtn);
    });
  } catch (error) {
    tableBody.innerHTML = "<tr><td colspan='5'>Unable to load users.</td></tr>";
  }
}

async function deleteUser(id) {
  if (!confirm("Delete this user?")) return;

  await fetch(`${API_URL}/users/${id}`, { method: "DELETE" });
  loadUsers();
}

async function editUser(user) {
  const newName = prompt("New name:", user.name);
  if (!newName) return;

  await fetch(`${API_URL}/users/${user.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: newName }),
  });
  loadUsers();
}

if (tableBody) {
  loadUsers();
}


const loginButton = document.querySelector(".login-btn");
const loginForm = document.querySelector("#loginForm");

if (loginButton && loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    showFormMessage("#loginMessage", "");

    const name = document.querySelector("#loginName").value.trim();
    const password = document.querySelector("#loginPassword").value;

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      if (response.ok) {
        window.location.href = "home.html";
      } else {
        showFormMessage("#loginMessage", "That name and password combination was not recognized.", true);
      }
    } catch (error) {
      showFormMessage("#loginMessage", "Unable to reach the server. Please try again.", true);
    }
  });
}