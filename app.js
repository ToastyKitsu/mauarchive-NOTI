const SUPABASE_URL = "https://ckpmmxehcaqpstvepjeu.supabase.co";
const API_KEY = "YOUR_ANON_KEY";

// Containers
const notificationsContainer = document.getElementById("notifications");
const downloadsContainer = document.getElementById("downloads");

// Tabs
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

// Tab switching
tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    // Remove active from all buttons
    tabButtons.forEach(b => b.classList.remove("active"));
    // Hide all content
    tabContents.forEach(c => (c.style.display = "none"));

    // Activate clicked tab and show its content
    btn.classList.add("active");
    const targetId = btn.getAttribute("data-target");
    document.getElementById(targetId).style.display = "block";
  });
});

// Function to load messages
function loadMessages() {
  fetch(`${SUPABASE_URL}/rest/v1/messages?select=id,text,created_at&order=created_at.desc`, {
    headers: {
      "apikey": API_KEY,
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    }
  })
  .then(res => {
    if (!res.ok) throw new Error("Network response was not ok: " + res.status);
    return res.json();
  })
  .then(data => {
    // Clear containers
    notificationsContainer.innerHTML = "";
    downloadsContainer.innerHTML = "";

    data.forEach(msg => {
      const div = document.createElement("div");
      div.className = "message";

      const time = new Date(msg.created_at).toLocaleString();

      // Check if message is a download
      if (msg.text.toLowerCase().startsWith("download:")) {
        const link = document.createElement("a");
        link.href = msg.text.replace(/^download:/i, "").trim();
        link.textContent = "Download File";
        link.download = "";
        div.appendChild(link);

        const timestamp = document.createElement("div");
        timestamp.className = "timestamp";
        timestamp.textContent = time;
        div.appendChild(timestamp);

        downloadsContainer.prepend(div);
      } else {
        div.textContent = `${msg.text} — ${time}`;
        notificationsContainer.prepend(div);
      }
    });
  })
  .catch(err => console.error("Fetch error:", err));
}

// Initial load + auto-refresh
loadMessages();
setInterval(loadMessages, 5000);
