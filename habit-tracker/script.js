// Simple daily habit tracker using localStorage

const habitInput = document.getElementById("habit-input");
const addHabitBtn = document.getElementById("add-habit-btn");
const habitList = document.getElementById("habit-list");
const todayLabel = document.getElementById("today-label");

const celebrationBanner = document.getElementById("celebration-banner");

function updateCelebrationBanner() {
  if (!celebrationBanner) return;

  if (state.habits.length === 0) {
    celebrationBanner.style.display = "none";
    return;
  }

  const allDone = state.habits.every(habit => {
    return habit.completedDates && habit.completedDates[today];
  });

  celebrationBanner.style.display = allDone ? "block" : "none";
}

const today = new Date().toISOString().slice(0, 10); // e.g. "2025-11-30"
todayLabel.textContent = `Today: ${today}`;

// Calculate current streak of consecutive completed days up to today
function calculateStreak(completedDates = {}, todayStr) {
  let streak = 0;
  const current = new Date(todayStr);
  current.setHours(0, 0, 0, 0); // normalize to midnight

  while (true) {
    const key = current.toISOString().slice(0, 10); // "YYYY-MM-DD"
    if (completedDates[key]) {
      streak += 1;
      current.setDate(current.getDate() - 1); // move one day back
    } else {
      break;
    }
  }

  return streak;
}

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

    if (!habit.completedDates) {
      habit.completedDates = {};
    }

    checkbox.checked = !!habit.completedDates[today];

    checkbox.addEventListener("change", () => {
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
    const timesDone = Object.keys(habit.completedDates).filter(
      (d) => habit.completedDates[d]
    ).length;

    // Current streak up to today
    const streak = calculateStreak(habit.completedDates, today);

    const countSpan = document.createElement("span");
    countSpan.textContent = `${timesDone} day(s) done`;

    const streakSpan = document.createElement("span");
if (streak >= 3) {
  streakSpan.textContent = `Streak: ${streak} day(s) 🔥`;
} else {
  streakSpan.textContent = `Streak: ${streak} day(s)`;
}

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      state.habits.splice(index, 1);
      saveHabits(state);
      renderHabits();
    });

    right.appendChild(countSpan);
    right.appendChild(streakSpan);
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
  updateCelebrationBanner();   // <— add this line
});
  renderHabits();
});

habitInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addHabitBtn.click();
  }
});

// Initial render
renderHabits();
