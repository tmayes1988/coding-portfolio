// Grab DOM elements
const form = document.getElementById("prompt-form");

const businessInput = document.getElementById("business");
const audienceInput = document.getElementById("audience");
const platformSelect = document.getElementById("platform");
const toneSelect = document.getElementById("tone");
const goalSelect = document.getElementById("goal");
const contentTypeSelect = document.getElementById("content-type");
const lengthSelect = document.getElementById("length");
const offerInput = document.getElementById("offer");
const extrasInput = document.getElementById("extras");

const promptOutput = document.getElementById("prompt-output");
const copyBtn = document.getElementById("copy-btn");
const copyStatus = document.getElementById("copy-status");

// Build the ChatGPT prompt based on the form data
function buildPrompt() {
  const business = businessInput.value.trim();
  const audience = audienceInput.value.trim();
  const platform = platformSelect.value;
  const tone = toneSelect.value;
  const goal = goalSelect.value;
  const contentType = contentTypeSelect.value;
  const length = lengthSelect.value;
  const offer = offerInput.value.trim();
  const extras = extrasInput.value.trim();

  if (!business || !audience || !offer) {
    return `Please fill in:
- Business / niche
- Target audience
- Offer / topic

Then click "Generate ChatGPT prompt".`;
  }

  // Human-friendly platform label
  const platformLabel =
    platform === "Facebook"
      ? "Facebook post"
      : platform === "Instagram"
      ? "Instagram post"
      : platform === "LinkedIn"
      ? "LinkedIn post"
      : platform === "TikTok"
      ? "TikTok script"
      : platform === "Email"
      ? "Email newsletter"
      : platform;

  // Auto-pluralize "business" a bit so it reads better
  const audiencePlural = audience.toLowerCase().includes("business")
    ? audience.replace(/business\b/i, "businesses")
    : audience;

  // Length guidance line
  const lengthNote =
    length === "short"
      ? "Keep it short and punchy (1–3 sentences)."
      : length === "medium"
      ? "Aim for 1–2 short paragraphs with clear spacing."
      : "Feel free to go deeper with 2–4 paragraphs, but keep it skimmable.";

  return `
You are a marketing copywriter who specializes in content for small service-based businesses.

BUSINESS CONTEXT
- Business / niche: ${business}
- Target audience: ${audiencePlural}
- Platform: ${platformLabel}
- Content type: ${contentType}
- Primary goal: ${goal}
- Tone & voice: ${tone}

OFFER / TOPIC
${offer}

CONTENT TASK
Create a ${platformLabel.toLowerCase()} formatted as a ${contentType} that will ${goal.toLowerCase()}.
Use a ${tone} tone that speaks directly to ${audiencePlural}.
Include:
- A strong hook in the first line
- Clear benefits related to ${business}
- A specific call to action
- Language that feels natural, confident, and not overly salesy

${
  extras
    ? `EXTRA DETAILS
${extras}

`
    : ""
}FORMATTING
- ${lengthNote}
- Use short paragraphs for easy reading on ${platform}
- Add line breaks where it makes sense
- Avoid emojis unless they truly enhance the message

At the end, provide 3 alternative angles I could try next time.`;
}

// Handle form submit -> generate prompt
form.addEventListener("submit", (e) => {
  e.preventDefault();
  copyStatus.textContent = "";
  copyStatus.classList.remove("copy-status--error");

  const prompt = buildPrompt();
  promptOutput.value = prompt;
  promptOutput.scrollTop = 0;
});

// Handle Copy button
copyBtn.addEventListener("click", () => {
  const prompt = promptOutput.value.trim();

  if (!prompt) {
    copyStatus.textContent = "Nothing to copy yet.";
    copyStatus.classList.add("copy-status--error");
    return;
  }

  navigator.clipboard
    .writeText(prompt)
    .then(() => {
      copyStatus.textContent = "Prompt copied!";
      copyStatus.classList.remove("copy-status--error");
      setTimeout(() => {
        copyStatus.textContent = "";
      }, 1500);
    })
    .catch(() => {
      copyStatus.textContent =
        "Copy failed — you can still select and copy it manually.";
      copyStatus.classList.add("copy-status--error");
    });
});
