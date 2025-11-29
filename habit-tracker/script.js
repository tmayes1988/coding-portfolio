// Simple daily habit tracker using localStorage

const habitInput = document.getElementById("habit-input");
const addHabitBtn = document.getElementById("add-habit-btn");
const habitList = document.getElementById("habit-list");
const todayLabel = document.getElementById("today-label");

const today = new Date().toISOString().slice(0, 10); // e.g. "2025-11-29"

todayLabel.textContent = `Today: ${today}`;

// Load habits from localStorage
function loadHabits() {
  const data = localStorage.getItem("habit-tracker-data");
  return data ? JSON.parse(data) : { habits: [] };
}

// Save habits to localStorage
function saveHabits(state) {
  localStorage.setItem("habit-tracker-data", JSON.stringify(state));
}

let state = loadHabits();

function renderHabits() {
  habitList.innerHTML = "";

  state.habits.forEach((habit, index) => {
    const li = document.createElement("li");
    li.className = "habit-item";

    const left = document.createElement("div");
    left.className = "habit-name";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = !!habit.completedDates?.[today];

    checkbox.addEventListener("change", () => {
      if (!habit.completedDates) habit.completedDates = {};
      habit.completedDates[today] = checkbox.checked;
      saveHabits(state);
      renderHabits();
    });

    const nameSpan = document.createElement("span");
    nameSpan.textContent = habit.name;

    left.appendChild(checkbox);
    left.appendChild(nameSpan);

    const right = document.createElement("div");
    right.className = "habit-actions";

    const timesDone = habit.completedDates
      ? Object.keys(habit.completedDates).filter((d) => habit.completedDates[d]).length
      : 0;

    const countSpan = document.createElement("span");
    countSpan.textContent = `${timesDone} day(s) done`;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      state.habits.splice(index, 1);
      saveHabits(state);
      renderHabits();
    });

    right.appendChild(countSpan);
    right.appendChild(deleteBtn);

    li.appendChild(left);
    li.appendChild(right);

    habitList.appendChild(li);
  });
}

addHabitBtn.addEventListener("click", () => {
  const name = habitInput.value.trim();
  if (!name) return;

  state.habits.push({
    name,
    completedDates: {}
  });

  habitInput.value = "";
  saveHabits(state);
  renderHabits();
});

habitInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addHabitBtn.click();
  }
});

// Initial render
renderHabits();
