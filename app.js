// Demo dataset: realistic campus reports.
const seedItems = [
  {
    id: "CLF-1042",
    name: "Black Samsung Galaxy phone",
    category: "Electronics",
    status: "Found",
    location: "Main Library",
    date: "2026-09-03",
    description: "Black Samsung Galaxy phone in a slim black case. Small silver sticker near the camera.",
    contact: "librarydesk@campus.example",
    recovery: "Ask at the Main Library front desk and mention reference CLF-1042.",
    icon: "📱",
  },
  {
    id: "CLF-1038",
    name: "Blue student ID card",
    category: "Documents",
    status: "Lost",
    location: "Science Quad",
    date: "2026-09-02",
    description: "Blue university student ID card. The card has a clear plastic sleeve and a blue lanyard.",
    contact: "id-office@campus.example",
    recovery: "If found, please leave it with the Student Services desk and quote CLF-1038.",
    icon: "🪪",
  },
  {
    id: "CLF-1034",
    name: "Black backpack",
    category: "Accessories",
    status: "Lost",
    location: "Student Center",
    date: "2026-09-01",
    description: "Medium black backpack with a grey front pocket and a small orange key tag.",
    contact: "student.demo@campus.example",
    recovery: "Contact the demo owner and arrange a daytime handover at Student Services.",
    icon: "🎒",
  },
  {
    id: "CLF-1030",
    name: "Silver water bottle",
    category: "Other",
    status: "Found",
    location: "Gymnasium",
    date: "2026-08-31",
    description: "Silver insulated bottle with a matte finish and a small mountain sticker.",
    contact: "gymdesk@campus.example",
    recovery: "Claim it at the Gymnasium reception with reference CLF-1030.",
    icon: "🥤",
  },
  {
    id: "CLF-1027",
    name: "Wireless earbuds",
    category: "Electronics",
    status: "Lost",
    location: "Arts Building",
    date: "2026-08-30",
    description: "White wireless earbuds in a compact charging case. One earbud has a tiny scratch.",
    contact: "student.demo@campus.example",
    recovery: "Describe the distinguishing scratch when contacting the demo owner.",
    icon: "🎧",
  },
  {
    id: "CLF-1024",
    name: "Scientific calculator",
    category: "Electronics",
    status: "Found",
    location: "Engineering Block",
    date: "2026-08-29",
    description: "Casio-style scientific calculator with a dark grey body and worn keypad.",
    contact: "engineeringdesk@campus.example",
    recovery: "Ask at the Engineering Block reception and provide CLF-1024.",
    icon: "🧮",
  },
  {
    id: "CLF-1021",
    name: "USB flash drive",
    category: "Electronics",
    status: "Found",
    location: "Computer Lab 3",
    date: "2026-08-28",
    description: "Small black USB flash drive with a blue cap and metal keyring loop.",
    contact: "itdesk@campus.example",
    recovery: "Collect from the IT help desk after identifying the drive contents privately.",
    icon: "💾",
  },
  {
    id: "CLF-1019",
    name: "Wallet",
    category: "Accessories",
    status: "Lost",
    location: "Cafeteria",
    date: "2026-08-27",
    description: "Brown slim wallet. Contains a few cards and a distinctive stitched corner.",
    contact: "student.demo@campus.example",
    recovery: "Contact the demo owner; do not share card numbers or sensitive details.",
    icon: "👛",
  },
  {
    id: "CLF-1015",
    name: "Umbrella",
    category: "Other",
    status: "Found",
    location: "West Gate",
    date: "2026-08-26",
    description: "Compact navy umbrella with a curved wooden-style handle.",
    contact: "securitydesk@campus.example",
    recovery: "Ask campus security at West Gate for CLF-1015.",
    icon: "☂️",
  },
  {
    id: "CLF-1011",
    name: "Laptop charger",
    category: "Electronics",
    status: "Lost",
    location: "Business School",
    date: "2026-08-25",
    description: "USB-C laptop charger with a white cable and a black power brick.",
    contact: "student.demo@campus.example",
    recovery: "Arrange recovery through Student Services and mention CLF-1011.",
    icon: "🔌",
  },
  {
    id: "CLF-1007",
    name: "Soundcore earpods",
    category: "Electronics",
    status: "Found",
    location: "Engineering Block",
    date: "2026-08-24",
    description: "Soundcore wireless earpods in a black charging case with a small scuff on the lid.",
    contact: "engineeringdesk@campus.example",
    recovery: "Ask the Engineering reception team for reference CLF-1007.",
    icon: "🎶",
  },
];

// Demo reports associated with the current browser.
const seedReports = [
  {
    item: "Black backpack",
    date: "2026-08-28",
    status: "Match Found",
    location: "Student Center",
    id: "MY-204",
  },
  {
    item: "Blue student ID card",
    date: "2026-08-20",
    status: "Searching",
    location: "Science Quad",
    id: "MY-198",
  },
  {
    item: "Silver water bottle",
    date: "2026-07-15",
    status: "Reunited",
    location: "Gymnasium",
    id: "MY-177",
  },
];

let items = JSON.parse(localStorage.getItem("clf_items") || "null") || seedItems;
let myReports = JSON.parse(localStorage.getItem("clf_reports") || "null") || seedReports;
let reportType = "Lost";
let activeFilter = "All";
let currentItemId = null;

const cats = ["All", "Lost", "Found", "Electronics", "Documents", "Accessories", "Other"];

// Persist the demo state locally so reports survive refreshes.
function save() {
  localStorage.setItem("clf_items", JSON.stringify(items));
  localStorage.setItem("clf_reports", JSON.stringify(myReports));
}

function formatDate(s) {
  return new Date(s + "T12:00:00").toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Simple client-side page navigation.
function go(page, type) {
  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
  document.getElementById(page).classList.add("active");
  document.querySelectorAll("[data-page]").forEach((b) => b.classList.toggle("active", b.dataset.page === page));
  
  const nav = document.getElementById("mobileNav");
  nav.classList.remove("open");
  document.querySelector(".mobile-toggle").setAttribute("aria-expanded", "false");

  if (page === "browse") renderBrowse();
  if (page === "reports") renderReports();
  if (page === "report") {
    setReportType(type === "found" ? "Found" : "Lost");
    document.getElementById("date").value ||= new Date().toISOString().slice(0, 10);
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleMobileNav() {
  const nav = document.getElementById("mobileNav");
  const toggleBtn = document.querySelector(".mobile-toggle");
  const isOpen = nav.classList.toggle("open");
  toggleBtn.setAttribute("aria-expanded", isOpen);
}

function homeSearch() {
  const q = document.getElementById("homeSearch").value.trim();
  go("browse");
  document.getElementById("browseSearch").value = q;
  renderBrowse();
}

function card(item) {
  return `<article class="item-card" onclick="openDetails('${item.id}')">
   <div class="item-visual">${esc(item.icon)}</div><div class="item-body">
   <div class="item-top"><div class="item-name">${esc(item.name)}</div><span class="pill ${item.status === "Lost" ? "status-lost" : "status-found"}">${item.status}</span></div>
   <div class="item-desc">${esc(item.description)}</div>
   <div class="meta"><span class="pill">${esc(item.category)}</span><span>📍 ${esc(item.location)}</span><span>• ${formatDate(item.date)}</span></div>
   </div></article>`;
}

// Render dashboard statistics and recent items.
function renderHome() {
  document.getElementById("statReported").textContent = items.length;
  document.getElementById("statReunited").textContent = myReports.filter((r) => r.status === "Reunited").length;
  document.getElementById("statSearching").textContent = items.filter((i) => i.status === "Found").length;
  document.getElementById("recentGrid").innerHTML = items.slice(0, 6).map(card).join("");
}

// Apply the active search/filter state and render cards.
function renderBrowse() {
  document.getElementById("filters").innerHTML = cats
    .map((c) => `<button class="filter ${activeFilter === c ? "active" : ""}" onclick="setFilter('${c}')">${c}</button>`)
    .join("");
    
  const q = (document.getElementById("browseSearch")?.value || "").toLowerCase().trim();
  const result = items.filter((i) => {
    const matchesFilter = activeFilter === "All" || i.status === activeFilter || i.category === activeFilter;
    const hay = [i.name, i.category, i.location, i.description].join(" ").toLowerCase();
    return matchesFilter && (!q || hay.includes(q));
  });
  
  document.getElementById("browseGrid").innerHTML = result.length
    ? result.map(card).join("")
    : `<div class="empty" style="grid-column:1/-1"><strong>No matching reports</strong><br>Try a different item, location, or filter.</div>`;
}

function setFilter(f) {
  activeFilter = f;
  renderBrowse();
}

// Show a single report and its recovery/contact information.
function openDetails(id) {
  currentItemId = id;
  const i = items.find((x) => x.id === id);
  if (!i) return;
  document.getElementById("detailContent").innerHTML = `
 <div class="detail-visual">${esc(i.icon)}</div>
 <div class="detail-panel">
   <span class="pill ${i.status === "Lost" ? "status-lost" : "status-found"}">${i.status}</span>
   <h1>${esc(i.name)}</h1><p class="desc">${esc(i.description)}</p>
   <div class="info-grid">
    <div class="info"><small>Location</small>${esc(i.location)}</div><div class="info"><small>Date</small>${formatDate(i.date)}</div>
    <div class="info"><small>Category</small>${esc(i.category)}</div><div class="info"><small>Reference ID</small>${esc(i.id)}</div>
   </div>
   <div class="contact-box"><strong>${i.status === "Found" ? "Recovery instructions" : "Contact owner"}</strong><span>${esc(i.recovery)}</span><br><span style="display:block;margin-top:8px">Demo contact: ${esc(i.contact)}</span></div>
   <button class="btn btn-primary" onclick="contactAction('${i.id}')">${i.status === "Found" ? "Contact Finder" : "Contact Owner"} →</button>
   <div class="notice">Demo information only. In a real deployment, contact details would be protected behind authentication.</div>
 </div>`;
  go("details");
}

function backToBrowse() {
  go("browse");
}

function contactAction(id) {
  const i = items.find((x) => x.id === id);
  alert(`Demo contact for ${i.name}: ${i.contact}\n\nReference: ${i.id}\n\nNo message was sent — this MVP uses local demo data only.`);
}

function setReportType(t) {
  reportType = t;
  document.getElementById("lostBtn").classList.toggle("active", t === "Lost");
  document.getElementById("foundBtn").classList.toggle("active", t === "Found");
}

// Add a new report to the local demo state.
function submitReport(e) {
  e.preventDefault();
  const id = "CLF-" + Math.floor(1000 + Math.random() * 8999);
  const categoryVal = document.getElementById("category").value;
  
  const item = {
    id,
    name: document.getElementById("itemName").value.trim(),
    category: cats.includes(categoryVal) ? categoryVal : "Other", // Basic validation enforcement
    status: reportType === "Found" ? "Found" : "Lost",
    location: document.getElementById("location").value.trim(),
    date: document.getElementById("date").value,
    description: document.getElementById("description").value.trim(),
    contact: document.getElementById("contact").value.trim(),
    recovery: reportType === "Found"
        ? "Contact the demo finder using the reference ID."
        : "Contact the demo owner using the reference ID.",
    icon: iconFor(document.getElementById("category").value),
  };
  
  items = [item, ...items];
  myReports = [
    {
      item: item.name,
      date: item.date,
      status: reportType === "Lost" ? "Searching" : "Match Found",
      location: item.location,
      id: "MY-" + Math.floor(100 + Math.random() * 899),
    },
    ...myReports,
  ];
  
  save();
  renderHome();
  document.getElementById("successBox").innerHTML =
    `<div class="success"><strong>✓ Report submitted successfully</strong>Your reference ID is <b>${id}</b>. It is now visible in Browse Items and My Reports.</div>`;
  
  e.target.reset();
  setReportType(reportType);
  document.getElementById("date").value = new Date().toISOString().slice(0, 10);
}

// Render reports belonging to the demo user.
function renderReports() {
  document.getElementById("myReports").innerHTML = myReports
    .map((r) => `<div class="report"><div><h3>${esc(r.item)}</h3><p>${formatDate(r.date)} · 📍 ${esc(r.location)}</p></div><div class="report-right"><span class="status">${esc(r.status)}</span><div class="report-id">${esc(r.id)}</div></div></div>`)
    .join("");
}

function iconFor(c) {
  return c === "Electronics" ? "📱" : c === "Documents" ? "🪪" : c === "Accessories" ? "🎒" : "✦";
}

function esc(v) {
  return String(v).replace(
    /[&<>"']/g,
    (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m]
  );
}

renderHome();
renderBrowse();
renderReports();
setReportType("Lost");
document.getElementById("date").value = new Date().toISOString().slice(0, 10);