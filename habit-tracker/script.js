// Simple daily habit tracker using localStorage

const habitInput = document.getElementById("habit-input");
const addHabitBtn = document.getElementById("add-habit-btn");
const habitList = document.getElementById("habit-list");
const todayLabel = document.getElementById("today-label");

const today = new Date().toISOString().slice(0, 10); // e.g. "2025-11-29"

todayLabel.textContent = `Today: ${today}`;

// Calculate current streak of consecutive completed days up to today
function calculateStreak(completedDates = {}, today) {
  // Work with a copy of today's date
  const current = new Date(today);
  let streak = 0;

  while (true) {
    const key = current.toISOString().slice(0, 10); // "YYYY-MM-DD"

    if (completedDates[key]) {
      streak += 1;
      // Move one day back
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

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

    // Total days completed
const timesDone = habit.completedDates
  ? Object.keys(habit.completedDates).filter((d) => habit.completedDates[d]).length
  : 0;

// Current streak up to today
const streak = calculateStreak(habit.completedDates || {}, today);

const countSpan = document.createElement("span");
countSpan.textContent = `${timesDone} day(s) done`;

const streakSpan = document.createElement("span");
streakSpan.textContent = `Streak: ${streak} day(s)`;

// Delete button
const deleteBtn = document.createElement("button");
deleteBtn.textContent = "Delete";
deleteBtn.addEventListener("click", () => {
  state.habits.splice(index, 1);
  saveHabits(state);
  renderHabits();
});

// Add all three to the actions area
right.appendChild(countSpan);
right.appendChild(streakSpan);
right.appendChild(deleteBtn);

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
