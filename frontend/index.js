const API_URL = "http://localhost:3000";

fetch("navbar.html")
  .then((res) => res.text())
  .then((data) => (document.querySelector("#navbar").innerHTML = data));

fetch("footer.html")
  .then((res) => res.text())
  .then((data) => (document.querySelector(".footer").innerHTML = data));




async function getUsers() {
  const response = await fetch(`${API_URL}/users`);
  return response.json();
}

const registerButton = document.querySelector(".submit");

if (registerButton) {
  registerButton.addEventListener("click", async (event) => {
    event.preventDefault();

    const user = {
      name: document.querySelector("#name").value,
      email: document.querySelector("#email").value,
      age: document.querySelector("#age").value,
      password: document.querySelector("#password").value,
    };

    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (response.ok) {
      alert("User registered");
    } else {
      alert("Server is not working");
    }
  });
}




const table = document.querySelector(".table");

if (table) {
  getUsers().then((users) => {
    for (let i = 0; i < users.length; i++) {
      table.innerHTML += 
      `<tr>
        <td>${i + 1}</td>
        <td>${users[i].name}</td>
        <td>${users[i].email}</td>
        <td>${users[i].age}</td>
      </tr>`;
    }
  });
}


const loginButton = document.querySelector(".login-btn");

if (loginButton) {
  loginButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const name = document.querySelector("#loginName").value;
    const password = document.querySelector("#loginPassword").value;

    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
    });

    if (response.ok) {
      window.location.href = "home.html";
    } else {
      alert("Wrong name or password");
    }
  });
}
