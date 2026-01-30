// Inputs
const fstName = document.querySelector("#fname");
const lstName = document.querySelector("#lname");
const phone = document.querySelector("#phone");
const email = document.querySelector("#email");
const motif = document.querySelector("#motif");
const date = document.querySelector("#date");

// Buttons
const displayForm = document.querySelector("#add-btn");
const displayDemandesBtn = document.querySelector("#display-demandes");
const addDemandeBtn = document.querySelector("#add-demande");
// const deleteBtn = document.querySelector("#delete-btn");
const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");

// table infos
const infosTable = document.querySelector("#tbody");
const message = document.querySelector("#message");
const infos = document.querySelector("#infos");
const pagination = document.querySelector("#pagination");
const page = document.querySelector("#page");
const messageAlert = document.querySelector("#toast");
const totalItems = document.querySelector("#total-items");

const form = document.querySelector("#app");

let demandes = [];
let searchedDemandes = [];
let data = [];

let currPage = 1;
const itemsPerPage = 3;
let count = 1;

function addDemande(e) {
  e.preventDefault();

  if (
    !fstName.value ||
    !lstName.value ||
    !phone.value ||
    !email.value ||
    !motif.value ||
    !date.value
  )
    return;

  const demande = {
    id: count,
    firstName: fstName.value,
    lastName: lstName.value,
    phone: phone.value,
    email: email.value,
    motif: motif.value,
    date: date.value,
  };

  demandes.push(demande);
  // alert("demande ajoute avec succee ✅");
  setTimeout(() => {
    messageAlert.classList.remove("hide");

    setTimeout(() => {
      messageAlert.classList.add("hide");
    }, 1000);
  }, 0);

  clearInputs();

  count++;
}

// display Demandes
function displayDemandes() {
  console.log(demandes);
  infosTable.innerHTML = "";
  const cardsContainer = document.querySelector("#cards-container");
  cardsContainer.innerHTML = "";
  message.textContent = "";

  if (!demandes.length) {
    message.textContent = `Aucune Demande disponible.`;
    totalItems.textContent = `Aucune Demande disponible.`;
  }

  const startIndex = (currPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  demandes.slice(startIndex, endIndex).forEach((demande) => {
    // Create table row for desktop
    const row = document.createElement("tr");
    row.attributes.class = "py-2";

    row.innerHTML = `
      <td>${demande.lastName}</td>
      <td>${demande.firstName}</td>
      <td>${demande.date}</td>
      <td>${demande.phone}</td>
      <td>${demande.email}</td>
      <td>${demande.motif}</td>
      <td>
     
    <button onclick="deleteDemande(${demande.id})">
         <i class="fa-solid fa-trash text-red-500"></i>
    </button>
      </td>
    `;

    infosTable.appendChild(row);

    // Create card for mobile
    const card = document.createElement("div");
    card.className = "demande-card";
    card.innerHTML = `
      <div class="overflow-hidden bg-white rounded shadow-md text-slate-500 dark:text-slate-100">
  <div class="p-6 dark:bg-slate-800">
    <h3 class="mb-4 text-xl font-medium text-slate-700 dark:text-slate-50">${demande.firstName}</h3>
    <div class="flex items-center gap-2">
      <span>Nom: </span>
      <p>
      ${demande.lastName}
      </p>
    </div>
   <div class="flex items-center gap-2">
      <span>Prénom: </span>
      <p>
      ${demande.firstName}
      </p>
    </div>
    <div class="flex items-center gap-2">
        <span>Email: </span>
      <p>
      ${demande.email}
      </p>
    </div>
    <div class="flex items-center gap-2">
        <span>Motif: </span>
      <p>
      ${demande.motif}
      </p>
    </div>
   <div class="flex items-center gap-2">
      <span>Téléphone: </span>
      <p>
      ${demande.phone}
      </p>
    </div>
   <div class="flex items-center gap-2">
      <span>Date: </span>
      <p>
      ${demande.date}
      </p>
    </div>

    <button class="w-full flex justify-end" onclick="deleteDemande(${demande.id})">
         <i class="fa-solid fa-trash text-red-500"></i>
    </button>
  </div>
</div>
    `;

    cardsContainer.appendChild(card);

    totalItems.textContent = `${demandes.length} Demandes Au Total :`;

    pagination.classList.remove("hide");
    updatePagination();
  });
}

function getTotalPages() {
  return Math.ceil(demandes.length / itemsPerPage);
}

function updatePagination() {
  const totalPages = getTotalPages();

  page.textContent = currPage;

  if (currPage === 1) {
    prevBtn.classList.add("disabled");
  } else {
    prevBtn.classList.remove("disabled");
  }

  if (currPage === totalPages || totalPages === 0) {
    nextBtn.classList.add("disabled");
  } else {
    nextBtn.classList.remove("disabled");
  }

  if (demandes.length === 0 || totalPages <= 1) {
    pagination.classList.add("hide");
  } else {
    pagination.classList.remove("hide");
  }
}

// delete demande
function deleteDemande(id) {
  demandes = demandes.filter((demande) => demande.id != id);

  const totalPages = getTotalPages();
  if (currPage > totalPages && totalPages > 0) {
    currPage = totalPages;
    pagination.classList.add("hide");
  }

  displayDemandes();
}

window.deleteDemande = deleteDemande;

// clear inputs
function clearInputs() {
  fstName.value = "";
  lstName.value = "";
  phone.value = "";
  email.value = "";
  motif.value = "";
  date.value = "";
}

form.addEventListener("submit", (e) => addDemande(e));

displayDemandesBtn.addEventListener("click", () => {
  displayDemandes();

  displayDemandesBtn.classList.add("hide");
  displayForm.classList.remove("hide");

  form.classList.add("hide");
  infos.classList.remove("hide");
});

displayForm.addEventListener("click", () => {
  displayDemandesBtn.classList.remove("hide");
  displayForm.classList.add("hide");

  form.classList.remove("hide");
  infos.classList.add("hide");
});

prevBtn.addEventListener("click", () => {
  if (currPage > 1) {
    currPage--;
    displayDemandes();
  }
});

nextBtn.addEventListener("click", () => {
  const totalPages = getTotalPages();
  if (currPage < totalPages) {
    currPage++;
    displayDemandes();
  }
});

// filter by name
const searchBtn = document.querySelector("#search-btn");

searchBtn.addEventListener("click", function () {
  const searchInput = document.querySelector("#search").value.toLowerCase();

  if (!searchInput) {
    displayDemandes();
    return;
  }

  displayFiltredDemandes(searchInput);
});

function displayFiltredDemandes(searchTerm) {
  const filtered = demandes.filter((demande) =>
    demande.firstName.toLowerCase().includes(searchTerm),
  );

  infosTable.innerHTML = "";
  const cardsContainer = document.querySelector("#cards-container");
  cardsContainer.innerHTML = "";
  message.textContent = "";

  if (!filtered.length) {
    message.textContent = `Aucune demande trouvée.`;
    return;
  }

  console.log(filtered);
  filtered.forEach((demande) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${demande.lastName}</td>
      <td>${demande.firstName}</td>
      <td>${demande.date}</td>
      <td>${demande.phone}</td>
      <td>${demande.email}</td>
      <td>${demande.motif}</td>
      <td>
        <button onclick="deleteDemande(${demande.id})">
          <i class="fa-solid fa-trash text-red-500"></i>
        </button>
      </td>
    `;
    infosTable.appendChild(row);

    // Create card for mobile
    const card = document.createElement("div");
    card.className = "demande-card";
    card.innerHTML = `
      <div class="overflow-hidden bg-white rounded shadow-md text-slate-500 dark:text-slate-100">
  <div class="p-6 dark:bg-slate-800">
    <h3 class="mb-4 text-xl font-medium text-slate-700 dark:text-slate-50">${demande.firstName}</h3>
    <div class="flex items-center gap-2">
      <span>Nom: </span>
      <p>
      ${demande.lastName}
      </p>
    </div>
   <div class="flex items-center gap-2">
      <span>Prénom: </span>
      <p>
      ${demande.firstName}
      </p>
    </div>
    <div class="flex items-center gap-2">
        <span>Email: </span>
      <p>
      ${demande.email}
      </p>
    </div>
    <div class="flex items-center gap-2">
        <span>Motif: </span>
      <p>
      ${demande.motif}
      </p>
    </div>
   <div class="flex items-center gap-2">
      <span>Téléphone: </span>
      <p>
      ${demande.phone}
      </p>
    </div>
   <div class="flex items-center gap-2">
      <span>Date: </span>
      <p>
      ${demande.date}
      </p>
    </div>

    <button class="w-full flex justify-end" onclick="deleteDemande(${demande.id})">
         <i class="fa-solid fa-trash text-red-500"></i>
    </button>
  </div>
</div>
    `;
    cardsContainer.appendChild(card);
  });
}

document.querySelector("#dark-btn").addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
});
