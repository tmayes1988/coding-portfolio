const businessInput = document.getElementById("business-type");
const audienceInput = document.getElementById("audience");
const platformSelect = document.getElementById("platform");
const goalSelect = document.getElementById("goal");
const toneSelect = document.getElementById("tone");
const offerInput = document.getElementById("offer");
const extrasInput = document.getElementById("extras");
const generateBtn = document.getElementById("generate-btn");
const outputBox = document.getElementById("output");
const copyBtn = document.getElementById("copy-btn");
const copyStatus = document.getElementById("copy-status");

function buildPrompt() {
  const business = businessInput.value.trim();
  const audience = audienceInput.value.trim();
  const platform = platformSelect.value;
  const goal = goalSelect.value;
  const tone = toneSelect.value;
  const offer = offerInput.value.trim();
  const extras = extrasInput.value.trim();

  if (!business || !audience || !offer) {
    return `Before generating content, please fill in:
- Your business or niche
- Your target audience
- Your offer / topic

Then click "Generate ChatGPT prompt".`;
  }

  return `
You are a marketing copywriter who specializes in content for small service-based businesses.

BUSINESS CONTEXT
- Business / niche: ${business}
- Target audience: ${audience}
- Platform: ${platform}
- Primary goal: ${goal}
- Tone & voice: ${tone}

OFFER / TOPIC
${offer || "(User did not specify more detail.)"}

CONTENT TASK
Create a ${platform.toLowerCase()} that will ${goal}.
Use a ${tone} tone that speaks directly to ${audience}.
Include:
- A strong hook in the first line
- Clear benefits related to ${business}
- A specific call to action
- Language that feels natural and not overly salesy.

${extras ? `EXTRA DETAILS\n${extras}\n` : ""}FORMATTING
- Write it so it's easy to read on ${platform}.
- Use line breaks where it makes sense.
- Avoid emojis unless they truly enhance the message.

At the end, briefly suggest 3 alternative angles I could try next time.`;
}

generateBtn.addEventListener("click", () => {
  const prompt = buildPrompt();
  outputBox.value = prompt;
  copyStatus.textContent = "";
  copyStatus.className = "copy-status";
});

copyBtn.addEventListener("click", async () => {
  const text = outputBox.value.trim();
  if (!text) {
    copyStatus.textContent = "Nothing to copy yet.";
    copyStatus.className = "copy-status error";
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    copyStatus.textContent = "Prompt copied to clipboard!";
    copyStatus.className = "copy-status success";
  } catch (err) {
    console.error(err);
    copyStatus.textContent = "Could not copy. Select and copy manually.";
    copyStatus.className = "copy-status error";
  }
});
