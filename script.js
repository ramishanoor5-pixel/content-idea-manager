
// DATA & STORAGE
const STORAGE_KEY = "contentIdeas";
function getIdeas() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveIdeas(ideas) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas));
}

let ideas = getIdeas();
let editId = null; 

const ideaTitle = document.getElementById("ideaTitle");
const ideaType = document.getElementById("ideaType");
const ideaStatus = document.getElementById("ideaStatus");
const ideaNotes = document.getElementById("ideaNotes");
const saveIdeaBtn = document.getElementById("saveIdeaBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const formTitle = document.getElementById("formTitle");
const ideasList = document.getElementById("ideasList");
const filterType = document.getElementById("filterType");
const filterStatus = document.getElementById("filterStatus");

// RENDER FUNCTION

function renderIdeas() {
  const typeFilter = filterType.value;
  const statusFilter = filterStatus.value;

  let filtered = ideas.filter(idea => {
    const matchType = typeFilter === "All" || idea.type === typeFilter;
    const matchStatus = statusFilter === "All" || idea.status === statusFilter;
    return matchType && matchStatus;
  });

  ideasList.innerHTML = "";

  if (filtered.length === 0) {
    ideasList.innerHTML = `
      <div class="empty-state">
        No ideas found. Add your first content idea above!
      </div>
    `;
    return;
  }

filtered.forEach(idea => {
   const card = document.createElement("div");
    card.className = "idea-card";
   card.dataset.id = idea.id;

    card.innerHTML = `
      <div class="idea-info">
        <h3>${idea.title}</h3>
        <div class="idea-meta">
          <span class="badge ${idea.type}">${idea.type}</span>
          <span class="badge ${idea.status}">${idea.status}</span>
        </div>
        ${idea.notes ? `<p class="idea-notes">${idea.notes}</p>` : ""}
      </div>
      <div class="idea-actions">
        <button class="btn-edit" data-id="${idea.id}">Edit</button>
        <button class="btn-delete" data-id="${idea.id}">Delete</button>
      </div>
    `;

    ideasList.appendChild(card);
  });
}

// ADD / UPDATE IDEA

function handleSave() {
  const title = ideaTitle.value.trim();
  if (!title) {
    alert("Please enter an idea title");
    return;
  }

  if (editId) {
    ideas = ideas.map(idea => {
      if (idea.id === editId) {
        return {
          ...idea,
          title,
          type: ideaType.value,
          status: ideaStatus.value,
          notes: ideaNotes.value.trim()
        };
      }
      return idea;
    });
  } else {
    const newIdea = {
      id: Date.now(),
      title,
      type: ideaType.value,
      status: ideaStatus.value,
      notes: ideaNotes.value.trim(),
      createdAt: new Date().toISOString()
    };
    ideas.unshift(newIdea);
  }

  saveIdeas(ideas);
  resetForm();
  renderIdeas();
}

// EDIT IDEA
function startEdit(id) {
  const idea = ideas.find(i => i.id === id);
  if (!idea) return;

  editId = id;
  ideaTitle.value = idea.title;
  ideaType.value = idea.type;
  ideaStatus.value = idea.status;
  ideaNotes.value = idea.notes || "";

  formTitle.textContent = "Edit Idea";
  saveIdeaBtn.textContent = "Update Idea";
  cancelEditBtn.classList.remove("hidden");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// DELETE IDEA

function deleteIdea(id) {
  if (!confirm("Are you sure you want to delete this idea?")) return;

  ideas = ideas.filter(idea => idea.id !== id);
  saveIdeas(ideas);
  renderIdeas();
}

// RESET FORM
function resetForm() {
  editId = null;
  ideaTitle.value = "";
  ideaType.value = "Video";
  ideaStatus.value = "Draft";
  ideaNotes.value = "";
  formTitle.textContent = "Add New Idea";
  saveIdeaBtn.textContent = "Add Idea";
  cancelEditBtn.classList.add("hidden");
}

// EVENT LISTENERS

saveIdeaBtn.addEventListener("click", handleSave);

cancelEditBtn.addEventListener("click", resetForm);

ideasList.addEventListener("click", (e) => {
  const id = Number(e.target.dataset.id);
  if (!id) return;

  if (e.target.classList.contains("btn-edit")) {
    startEdit(id);
  }

  if (e.target.classList.contains("btn-delete")) {
    deleteIdea(id);
  }
});

filterType.addEventListener("change", renderIdeas);
filterStatus.addEventListener("change", renderIdeas);


ideaTitle.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSave();
});
renderIdeas();