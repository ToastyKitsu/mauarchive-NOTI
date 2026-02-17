const SUPABASE_URL = "https://ckpmmxehcaqpstvepjeu.supabase.co";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrcG1teGVoY2FxcHN0dmVwamV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNDIxMTMsImV4cCI6MjA4NjkxODExM30.B2QG-r2kXFeoFqoLB9viMJZOv4AdM56HQZHax0pnbVo";

const container = document.getElementById("notifications");

function loadMessages() {
  fetch(`${SUPABASE_URL}/rest/v1/messages?select=id,text,created_at&order=created_at.desc`, {
    headers: {
      "apikey": API_KEY,
      "Authorization": `Bearer ${API_KEY}`
    }
  })
  .then(res => {
    if (!res.ok) throw new Error("Network response was not ok: " + res.status);
    return res.json();
  })
  .then(data => {
    container.innerHTML = "";
    data.forEach(msg => {
      const div = document.createElement("div");
      div.className = "message";
      div.textContent = `${msg.text} — ${new Date(msg.created_at).toLocaleString()}`;
      container.prepend(div);
    });
  })
  .catch(err => console.error("Fetch error:", err));
}

loadMessages();
setInterval(loadMessages, 5000);
