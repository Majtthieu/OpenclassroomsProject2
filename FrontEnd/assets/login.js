const email = document.getElementById("email");
const password = document.getElementById("password");
const form = document.getElementById("form-login");
const badLogin = document.getElementById("bad-login");

// Récupération des informations au submit
form.addEventListener('submit', function (event) {
  event.preventDefault();

  let login = {
    email: email.value,
    password: password.value,
  };

  logIn(login);

});

// Fonction d'identification
function logIn(login) {
  fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(login)
  })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(data => {

      if (!validateEmail(email.value)) {
        alert('Entrez un email valide');
        return;
      }

      if (data.status === 200) {
        sessionStorage.setItem("token", data.body.token);
        location.href = "index.html";
      }

      else {
        badLogin.innerText = "Il y a une erreur dans vos identifiants"
        document.getElementById("email").value = null;
        document.getElementById("password").value = null;
      }
    })
    .catch(error =>
      console.log(error));
}

// Fonction de validation du format de l'email
function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}