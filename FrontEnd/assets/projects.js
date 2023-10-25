// Récupération des projets depuis le backend
const reponse = await fetch('http://localhost:5678/api/works');
const projects = await reponse.json();
const reponse2 = await fetch('http://localhost:5678/api/categories');
const categories = await reponse2.json();

// Création de l'affichage des projets
async function createProjects(projects) {
  document.querySelector(".gallery").innerHTML = "";
  for (let i = 0; i < projects.length; i++) {

    const project = projects[i];
    // Récupération de l'élément du DOM qui accueillera les projets
    const sectionGallery = document.querySelector(".gallery");
    // Création d’une balise dédiée à un projet
    const projectElement = document.createElement("figure");
    projectElement.setAttribute("id", `f${projects[i].id}`)
    // Création des balises 
    const imageElement = document.createElement("img");
    imageElement.src = project.imageUrl;
    const titleElement = document.createElement("figcaption");
    titleElement.innerText = project.title;

    // On rattache la balise project a la div gallery
    sectionGallery.appendChild(projectElement);
    projectElement.appendChild(imageElement);
    projectElement.appendChild(titleElement);
  }
}

// Création de l'affichage des filtres de catégorie
async function createFilters(categories) {
  for (let i = 0; i < categories.length; i++) {

    const cat = categories[i];
    const sectionFilters = document.querySelector(".filters");
    const categoryElement = document.createElement("button");
    categoryElement.classList.add('filters-btn', 'same');
    categoryElement.innerText = cat.name;
    sectionFilters.appendChild(categoryElement);
  }
}

createFilters(categories);

// Premier affichage des projets
createProjects(projects);

// Tous les boutons de filtre de la même class
const filterBtn = document.querySelectorAll(".filters-btn");

// Fonction de filtrage
function filterByCategory(categoryName) {
  const projectsFilt = projects.filter(function (project) {
    return project.category.name === categoryName;
  });
  document.querySelector(".gallery").innerHTML = "";
  createProjects(projectsFilt);
}

// Listener pour les filtres de catégorie
filterBtn.forEach(function (btn) {
  btn.addEventListener("click", function () {
    const categoryName = btn.textContent;
    filterByCategory(categoryName);
  });
});

// Listener pour le filtre "tous"
document.querySelector("#all").addEventListener("click", function () {
  document.querySelector(".gallery").innerHTML = "";
  createProjects(projects);
});

// Maintien du style pour montrer le filtre "actif"
var test = document.getElementsByClassName("same");

function addClassActive(inputChoix) {
  var button = document.getElementsByClassName("same");
  for (var i = 0; i < button.length; i++) {
    if (button[i].className == "active same") {
      button[i].className = "filters-btn same";
    }
  }

  inputChoix.currentTarget.className = "active same";
}

for (var i = 0; i < test.length; i++) {
  test[i].addEventListener("click", addClassActive, false);
}

// Ouvrir et fermer la modale
const dialog = document.getElementById('dialog1');

const openModal = function (event) {
  event.preventDefault();
  dialog.showModal();
  // Affichage à l'ouverture de la modale
  createProjectsEdition(projects);
}

const closeModal = function (event) {
  event.preventDefault();
  // Nettoyage de la modale
  let parent = document.querySelector(".gallery-edit");
  const arrow = document.querySelector('#arrow');
  arrow.setAttribute('style', "visibility: hidden;");
  const btnElement = document.getElementById("add-photo");
  btnElement.removeAttribute("style");
  const btnElement2 = document.getElementById("validate");
  btnElement2.setAttribute('style', "display: none;")
  cleanModal(parent);
  dialog.close();
}

function cleanModal(element) {
  while (element.firstElementChild) {
    element.firstElementChild.remove();
  }
}

document.querySelectorAll('.js-modal').forEach(a => {
  a.addEventListener('click', openModal)
})

document.querySelectorAll('.cross').forEach(a => {
  a.addEventListener('click', closeModal)
})

// Fermeture au click en dehors et à l'esc (car sinon l'esc ne passe pas par la fonction et ne vide pas la modale)
dialog.addEventListener('click', closeModal);

const myDiv = document.querySelector('.modal-wrapper');
myDiv.addEventListener('click', (event) => event.stopPropagation());

window.addEventListener('keydown', function (event) {
  if (event.key === "Escape" || event.key === "Esc") {
    closeModal(event);
  }
})

// Création de l'affichage des projets miniatures
async function createProjectsEdition() {
  document.querySelector(".gallery-edit").innerHTML = "";
  let respForEdit = await fetch('http://localhost:5678/api/works');
  let projectsForEdit = await respForEdit.json();
  for (let i = 0; i < projectsForEdit.length; i++) {
    const project = projectsForEdit[i];
    // Récupération de l'élément du DOM qui accueillera les projets
    const sectionGallery = document.querySelector(".gallery-edit");
    // Balises existantes
    const titleElement = document.getElementById("title-modal");
    titleElement.innerText = "Galerie Photo";
    // Création des balises
    const projectElement = document.createElement("figure");
    projectElement.setAttribute('id', `fe${projectsForEdit[i].id}`);
    const imageElement = document.createElement("img");
    imageElement.src = project.imageUrl;
    const divIconElement = document.createElement("div");
    divIconElement.classList.add("js-delete");
    divIconElement.setAttribute('id', projectsForEdit[i].id);
    const iconElement = document.createElement("i");
    iconElement.classList.add("fa-solid", "fa-trash-can");
    // On rattache la balise project a la div gallery-edit
    sectionGallery.appendChild(projectElement);
    projectElement.appendChild(imageElement);
    projectElement.appendChild(divIconElement);
    divIconElement.appendChild(iconElement);
  }
  deleteProject();
}

// Check du token
const token = sessionStorage.getItem("token");
const loggedIn = document.querySelector(".js-loggedin");


// Gestion de l'affichage pour admin
adminChange()

function adminChange() {
  document.querySelectorAll(".admin-changes").forEach(a => {
    if (token === null) {
      return;
    }
    else {
      if (a.getAttribute("style") === "display: none;") {
        a.removeAttribute("aria-hidden")
        a.removeAttribute("style")
      }
      else {
        a.setAttribute("style", "display: none;")
        a.setAttribute("aria-hidden", true)
      }
      loggedIn.innerHTML = "logout";
    }
  });
}

// Gestion du logout
loggedIn.addEventListener("click", function () {
  console.log("ceci est un test");
  if (token === null) {
    return;
  }
  else {
    sessionStorage.removeItem("token");
    location.reload();
  }
});

// Suppression au click sur poubelle

function deleteProject() {
  let delProject = document.querySelectorAll(".js-delete");
  for (let i = 0; i < delProject.length; i++) {
    delProject[i].addEventListener("click", deleteProjects);
  }
}

async function deleteProjects(event) {
  event.preventDefault();
  console.log("on va supprimer le projet " + this.id);
  await fetch(`http://localhost:5678/api/works/${this.id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })

    .then(response => {
      console.log(response)

      if (response.ok) {
        let elementf = document.getElementById(`f${this.id}`);
        let elementfe = document.getElementById(`fe${this.id}`);
        elementf.remove();
        elementfe.remove();
        console.log("le projet " + this.id + " a été supprimé avec succès");
      }

      else {
        alert("Le projet n'a pas pu être supprimé")
      }
    })
    .catch(error => {
      console.log(error)
    })
}

// Fonction pour miniature d'image 

function showThumbnail() {
  const input = document.getElementById('img-input');
  const thumbnail = document.getElementById('thumbnail');

  if (input.files && input.files[0]) {
    const reader = new FileReader();

    reader.onload = function (e) {
      thumbnail.src = e.target.result;
    };

    reader.readAsDataURL(input.files[0]);
    document.querySelector(".fa-image").style = "display: none;";
    input.style = "display: none;";
    document.getElementById("img-accept").style = "display: none;";
    document.getElementById("img-label").style = "display: none;";
    thumbnail.removeAttribute("style");
  }
}

function hideThumbnail() {
  const input = document.getElementById('img-input');
  const thumbnail = document.getElementById('thumbnail');

  if (input.files && input.files[0]) { return }

  else {
    document.querySelector(".fa-image").removeAttribute("style");
    input.removeAttribute("style");
    document.getElementById("img-accept").removeAttribute("style");
    document.getElementById("img-label").removeAttribute("style");
    thumbnail.setAttribute("style", "display: none;");
  }
}

// Changement du contenu de la modale

const formModal = `
<form id="form-modal" class="form-modal" action="" method="post" enctype="multipart/form-data">
<div id="upload-img" style="display: none;">
    <div id="img-uploaded"></div>
</div>
<div id="img-choice">
    <i class="fa-regular fa-image"></i>
    <input name="image" type="file" id="img-input" accept="image/png, image/jpeg" />
    <label id="img-label" for="img-input">+ Ajouter photo</label>
    <p id="img-accept">jpg, png : 4mo max</p>
    <br>
    <img id="thumbnail" style="display: none;"/>
</div>
<label id="form-error"></label>
<div class="form-input">
    <label>Titre</label>
    <input name="title" id="title-input">
</div>
<div class="form-input">
    <label>Catégorie</label>
    <select name="category" id="cat-input">
        <option value="1">Objets</option>
        <option value="2">Appartements</option>
        <option value="3">Hotels & restaurants</option>
    </select>
</div>
</form>`;

const openSecondModal = function (event) {
  event.preventDefault();
  validate.disabled = true;
  validate.setAttribute("class", "nadd-photo");
  let parent = document.querySelector(".gallery-edit");
  cleanModal(parent);
  const arrow = document.querySelector('#arrow');
  arrow.removeAttribute('style');
  const titleElement = document.getElementById("title-modal");
  titleElement.innerText = "Ajout photo";
  const btnElement = document.getElementById("add-photo");
  btnElement.setAttribute('style', "display: none;");
  const btnElement2 = document.getElementById("validate");
  btnElement2.removeAttribute("style");
  parent.insertAdjacentHTML("afterbegin", formModal);
  const input = document.getElementById('img-input');
  const titleInput = document.getElementById("title-input");
  const catInput = document.getElementById("cat-input");
  input.addEventListener("change", isValidWeight);
  input.addEventListener("change", checkForm);
  titleInput.addEventListener("keyup", checkForm);
  catInput.addEventListener("change", checkForm);
}

const addPhoto = document.getElementById('add-photo');
addPhoto.addEventListener('click', openSecondModal);

const backToModal = function (event) {
  event.preventDefault();
  let parent = document.querySelector(".gallery-edit");
  const arrow = document.querySelector('#arrow');
  arrow.setAttribute('style', "visibility: hidden;");
  const btnElement = document.getElementById("add-photo");
  btnElement.removeAttribute("style");
  const btnElement2 = document.getElementById("validate");
  btnElement2.setAttribute('style', "display: none;");
  cleanModal(parent);
  openModal(event);
}

document.querySelectorAll('.arrow').forEach(a => {
  a.addEventListener('click', backToModal)
})

// Gestion de l'ajout de projet

function addNewProject() {
  const titleInput = document.querySelector("#title-input");
  console.log(titleInput);
  const categoryInput = document.querySelector("#cat-input");
  console.log(categoryInput);
  const imageInput = document.querySelector("#img-input");
  const submit = document.querySelector("#form-modal");
  submit.addEventListener('submit', (event) => {
    event.preventDefault();

    console.log(titleInput.value);
    console.log(imageInput.value);

    const formData = new FormData();
    formData.append("image", imageInput.files[0]);
    formData.append("title", titleInput.value);
    formData.append("category", categoryInput.value);
    let request = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    };
    fetch("http://localhost:5678/api/works", request)
      .then(response => {
        if (response.ok) {
          return response.json();
        }

        else {
          alert("le projet n'a pas pu être ajouté");
          console.log("le projet n'a pas pu être ajouté");
          throw new Error('la requête a échoué');
        }
      })
      .then(data => {
        createProjectsEdition;
        backToModal(event);
        const sectionGallery = document.querySelector(".gallery");
        // Création d’une balise dédiée à un projet
        const projectElement = document.createElement("figure");
        projectElement.setAttribute("id", `f${data.id}`)
        // Création des balises 
        const imageElement = document.createElement("img");
        imageElement.src = data.imageUrl;
        const titleElement = document.createElement("figcaption");
        titleElement.innerText = data.title;
        // On rattache la balise project a la div gallery
        sectionGallery.appendChild(projectElement);
        projectElement.appendChild(imageElement);
        projectElement.appendChild(titleElement);
        console.log("le projet a été ajouté avec succès");
        alert("le projet a été ajouté avec succès");
      })
      .catch(error => {
        console.error('Erreur :', error);
      });
  });
}

const validate = document.getElementById('validate');
validate.disabled = true;
validate.addEventListener('click', addNewProject);

// Fonction d'enable du bouton d'ajout

function checkForm() {
  if (document.getElementById("img-input").value === "" || document.getElementById("title-input").value === "" || document.getElementById("cat-input").value === "") {
    validate.disabled = true;
    validate.setAttribute("class", "nadd-photo");
  }
  else {
    validate.disabled = false;
    validate.setAttribute("class", "add-photo");
  }
}

// Fonction de validation du poids de l'image

function isValidWeight() {
  if (document.getElementById("img-input").files[0].size > (4 * 1048576)) {
    alert("image trop lourde (>4mo)");
    document.getElementById("img-input").value = "";
  }
  else { showThumbnail(); }
}


