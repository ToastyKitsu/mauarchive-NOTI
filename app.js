const SUPABASE_URL = "https://ckpmmxehcaqpstvepjeu.supabase.co";
const API_KEY = "YOUR_ANON_KEY";

const notificationsContainer = document.getElementById("notifications");
const downloadsContainer = document.getElementById("downloads");

const notificationsTab = document.getElementById("notificationsTab");
const downloadsTab = document.getElementById("downloadsTab");

notificationsTab.onclick = () => {
  notificationsContainer.style.display = "block";
  downloadsContainer.style.display = "none";
};

downloadsTab.onclick = () => {
  notificationsContainer.style.display = "none";
  downloadsContainer.style.display = "block";
};

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

    notificationsContainer.innerHTML = "";
    downloadsContainer.innerHTML = "";

    data.forEach(msg => {
      const div = document.createElement("div");
      div.className = "message";

      const time = new Date(msg.created_at).toLocaleString();

      // If text contains "download"
      if (msg.text.toLowerCase().includes("download")) {

        const link = document.createElement("a");
        link.href = msg.text.replace("download:", "").trim();
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

loadMessages();
setInterval(loadMessages, 5000);
