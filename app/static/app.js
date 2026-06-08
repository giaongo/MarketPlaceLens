const state = {
  profiles: [],
  selectedProfile: null,
  listingView: localStorage.getItem("marketplacelens.listingView") || "list",
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

document.addEventListener("DOMContentLoaded", () => {
  bindNavigation();
  bindForms();
  refreshAll();
});

function bindNavigation() {
  $$(".nav-item").forEach((button) => {
    button.addEventListener("click", () => showView(button.dataset.view));
  });
  $("#refresh-button").addEventListener("click", refreshAll);
  $("#logout-button").addEventListener("click", logout);
  $("#wizard-button").addEventListener("click", () => showWizard(true));
  $("#wizard-cancel-button").addEventListener("click", () => showWizard(false));
  $("#new-profile-button").addEventListener("click", () => editProfile(null));
  $("#profile-source").addEventListener("change", updateSourcePlaceholder);
  $("#run-profile-button").addEventListener("click", runSelectedProfile);
  $("#delete-profile-button").addEventListener("click", deleteSelectedProfile);
  $("#listing-status-filter").addEventListener("change", loadListings);
  $("#listing-profile-filter").addEventListener("change", loadListings);
  $("#listing-search-filter").addEventListener("input", debounce(loadListings, 220));
  $("#listing-min-price-filter").addEventListener("input", debounce(loadListings, 220));
  $("#listing-max-price-filter").addEventListener("input", debounce(loadListings, 220));
  $("#listing-sort-filter").addEventListener("change", loadListings);
  $("#include-hidden").addEventListener("change", loadListings);
  $$("[data-listing-view]").forEach((button) => {
    button.addEventListener("click", () => setListingView(button.dataset.listingView));
  });
  [
    "#profile-location",
    "#profile-min-price",
    "#profile-max-price",
    "#profile-include",
    "#profile-required",
    "#profile-exclude",
    "#profile-categories",
    "#profile-enabled",
    "#profile-notify",
  ].forEach((selector) => $(selector).addEventListener("input", updateFilterPreview));
}

function bindForms() {
  $("#profile-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    await saveProfile();
  });
  $("#profile-wizard").addEventListener("submit", async (event) => {
    event.preventDefault();
    await createProfileFromWizard();
  });
  $("#settings-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    await saveSettings();
  });
  $("#password-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    await changePassword();
  });
  $("#telegram-test-button").addEventListener("click", testTelegram);
}

function showView(view) {
  $$(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.view === view));
  $$(".view").forEach((item) => item.classList.toggle("active", item.id === `${view}-view`));
  $("#view-title").textContent = {
    dashboard: "Dashboard",
    profiles: "Search profiles",
    listings: "Listings",
    settings: "Settings",
  }[view];
  if (view === "listings") loadListings();
}

function showWizard(visible) {
  $("#profile-wizard").classList.toggle("hidden", !visible);
  $("#profile-form").classList.toggle("hidden", visible);
  if (visible) {
    $("#profile-form-title").textContent = "Guided setup";
    $("#wizard-query").focus();
  } else {
    editProfile(null);
  }
}

async function refreshAll() {
  try {
    await Promise.all([loadSummary(), loadProfiles(), loadListings(), loadSettings()]);
  } catch (error) {
    if (String(error.message).includes("Not authenticated") || String(error.message).includes("401")) {
      window.location.href = "/login";
      return;
    }
    throw error;
  }
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(`${response.status} ${message || response.statusText}`);
  }
  return response.json();
}

async function logout() {
  await api("/api/auth/logout", { method: "POST" });
  window.location.href = "/login";
}

async function loadSummary() {
  const summary = await api("/api/summary");
  $("#summary-active").textContent = `${summary.profiles_enabled}/${summary.profiles_total}`;
  $("#summary-new").textContent = summary.listings_new;
  $("#summary-hidden").textContent = summary.listings_hidden;
  $("#summary-notified").textContent = summary.listings_notified;
  $("#summary-errors").textContent = summary.run_errors;
  $("#recent-runs").innerHTML = summary.recent_runs.length
    ? summary.recent_runs.map((run) => `
      <article>
        <strong>${escapeHtml(run.profile_name)}</strong>
        <p class="meta">${escapeHtml(run.status)} · fetched ${run.fetched} · new ${run.new_count} · hidden ${run.hidden_count} · duplicate ${run.duplicate_count} · ${formatDate(run.finished_at)}</p>
        ${run.error_message ? `<p class="meta danger-text">${escapeHtml(run.error_message)}</p>` : ""}
      </article>
    `).join("")
    : `<article><strong>No runs yet</strong><p class="meta">Create a profile and run it manually.</p></article>`;
}

async function loadProfiles() {
  state.profiles = await api("/api/profiles");
  $("#profiles-list").innerHTML = state.profiles.length
    ? groupedProfilesMarkup(state.profiles)
    : `<article class="profile-card"><h3>No profiles</h3><p class="meta">Add the first search URL on the right.</p></article>`;
  $$(".profile-card[data-id]").forEach((card) => {
    card.addEventListener("click", () => {
      const profile = state.profiles.find((item) => item.id === Number(card.dataset.id));
      editProfile(profile);
    });
  });
  const current = $("#listing-profile-filter").value;
  $("#listing-profile-filter").innerHTML = `<option value="">All profiles</option>${state.profiles.map((profile) => `
    <option value="${profile.id}">${escapeHtml(profile.name)}</option>
  `).join("")}`;
  $("#listing-profile-filter").value = current;
}

function groupedProfilesMarkup(profiles) {
  const order = ["kleinanzeigen", "facebook", "html"];
  return order.map((source) => {
    const items = profiles.filter((profile) => profile.source_type === source);
    return `
      <section class="profile-source-group">
        <h3>${escapeHtml(sourceLabel(source))}</h3>
        ${items.length ? items.map((profile) => `
      <article class="profile-card ${state.selectedProfile?.id === profile.id ? "active" : ""}" data-id="${profile.id}">
        <div class="profile-card-top">
          <h4>${escapeHtml(profile.name)}</h4>
          <span class="source-badge ${escapeAttribute(profile.source_type)}">${escapeHtml(sourceLabel(profile.source_type))}</span>
        </div>
        <p class="meta">${profile.enabled ? "enabled" : "paused"} · every ${profile.poll_interval_minutes} min</p>
        <p class="meta">${escapeHtml(profile.search_url)}</p>
      </article>
        `).join("") : `<article class="profile-empty">No ${escapeHtml(sourceLabel(source))} profiles yet</article>`}
      </section>
    `;
  }).join("");
}

function sourceLabel(source) {
  return {
    kleinanzeigen: "Kleinanzeigen",
    facebook: "Facebook Marketplace",
    html: "Generic HTML",
  }[source] || source;
}

async function changePassword() {
  const current = $("#current-password").value;
  const next = $("#new-password").value;
  const repeated = $("#repeat-password").value;
  if (next !== repeated) return toast("New passwords do not match");
  await api("/api/settings/password", {
    method: "POST",
    body: JSON.stringify({ current_password: current, new_password: next }),
  });
  $("#current-password").value = "";
  $("#new-password").value = "";
  $("#repeat-password").value = "";
  toast("Password changed");
}

function editProfile(profile) {
  $("#profile-wizard").classList.add("hidden");
  $("#profile-form").classList.remove("hidden");
  state.selectedProfile = profile;
  $("#profile-form-title").textContent = profile ? "Edit profile" : "New profile";
  $("#profile-id").value = profile?.id || "";
  $("#profile-name").value = profile?.name || "";
  $("#profile-source").value = profile?.source_type || "kleinanzeigen";
  $("#profile-url").value = profile?.search_url || "";
  updateSourcePlaceholder();
  $("#profile-interval").value = profile?.poll_interval_minutes || 60;
  $("#profile-location").value = profile?.location_hint || "";
  $("#profile-min-price").value = profile?.min_price ?? "";
  $("#profile-max-price").value = profile?.max_price ?? "";
  $("#profile-include").value = (profile?.include_keywords || []).join("\n");
  $("#profile-required").value = (profile?.required_keywords || []).join("\n");
  $("#profile-exclude").value = (profile?.exclude_keywords || []).join("\n");
  $("#profile-categories").value = (profile?.excluded_categories || []).join("\n");
  $("#profile-enabled").checked = profile?.enabled ?? true;
  $("#profile-notify").checked = profile?.notify_telegram ?? true;
  updateFilterPreview();
  loadProfiles();
}

async function createProfileFromWizard() {
  const query = $("#wizard-query").value.trim();
  if (!query) return toast("Search term is required");
  $("#profile-id").value = "";
  $("#profile-name").value = `${query} auf Kleinanzeigen`;
  $("#profile-source").value = "kleinanzeigen";
  $("#profile-url").value = `https://www.kleinanzeigen.de/s-suchanfrage.html?keywords=${encodeURIComponent(query)}`;
  $("#profile-interval").value = 120;
  $("#profile-location").value = $("#wizard-location").value.trim();
  $("#profile-min-price").value = "";
  $("#profile-max-price").value = $("#wizard-max-price").value;
  $("#profile-include").value = query.split(/\s+/).filter(Boolean).join("\n");
  $("#profile-required").value = $("#wizard-required").value;
  $("#profile-exclude").value = $("#wizard-exclude").value;
  $("#profile-categories").value = "";
  $("#profile-enabled").checked = $("#wizard-enabled").checked;
  $("#profile-notify").checked = $("#wizard-notify").checked;
  updateFilterPreview();
  await saveProfile();
  clearWizard();
  $("#profile-wizard").classList.add("hidden");
  $("#profile-form").classList.remove("hidden");
}

function clearWizard() {
  $("#wizard-query").value = "";
  $("#wizard-max-price").value = "";
  $("#wizard-location").value = "";
  $("#wizard-required").value = "";
  $("#wizard-exclude").value = "";
  $("#wizard-enabled").checked = false;
  $("#wizard-notify").checked = false;
}

async function saveProfile() {
  const payload = profilePayload();
  const id = $("#profile-id").value;
  const saved = await api(id ? `/api/profiles/${id}` : "/api/profiles", {
    method: id ? "PUT" : "POST",
    body: JSON.stringify(payload),
  });
  toast("Profile saved");
  editProfile(saved);
  await refreshAll();
}

async function runSelectedProfile() {
  const id = $("#profile-id").value;
  if (!id) return toast("Save a profile first");
  toast("Run started");
  const result = await api(`/api/profiles/${id}/run`, { method: "POST" });
  toast(`Run complete: ${result.new} new, ${result.hidden} hidden, ${result.duplicates} duplicate`);
  await refreshAll();
}

async function deleteSelectedProfile() {
  const id = $("#profile-id").value;
  if (!id) return;
  await api(`/api/profiles/${id}`, { method: "DELETE" });
  toast("Profile deleted");
  editProfile(null);
  await refreshAll();
}

function profilePayload() {
  return {
    name: $("#profile-name").value,
    enabled: $("#profile-enabled").checked,
    source_type: $("#profile-source").value,
    search_url: $("#profile-url").value,
    poll_interval_minutes: Number($("#profile-interval").value || 60),
    include_keywords: lines("#profile-include"),
    required_keywords: lines("#profile-required"),
    exclude_keywords: lines("#profile-exclude"),
    excluded_categories: lines("#profile-categories"),
    min_price: numberOrNull("#profile-min-price"),
    max_price: numberOrNull("#profile-max-price"),
    location_hint: $("#profile-location").value,
    notify_telegram: $("#profile-notify").checked,
  };
}

function updateFilterPreview() {
  const chips = [];
  const location = $("#profile-location").value.trim();
  const minPrice = $("#profile-min-price").value;
  const maxPrice = $("#profile-max-price").value;
  if (location) chips.push(`Ort: ${location}`);
  if (minPrice) chips.push(`ab ${minPrice} EUR`);
  if (maxPrice) chips.push(`bis ${maxPrice} EUR`);
  lines("#profile-required").forEach((item) => chips.push(`muss: ${item}`));
  lines("#profile-include").slice(0, 5).forEach((item) => chips.push(`match: ${item}`));
  lines("#profile-exclude").forEach((item) => chips.push(`ausblenden: ${item}`));
  lines("#profile-categories").forEach((item) => chips.push(`Kategorie aus: ${item}`));
  chips.push($("#profile-enabled").checked ? "Polling an" : "Polling aus");
  chips.push($("#profile-notify").checked ? "Telegram an" : "Telegram aus");
  $("#profile-filter-preview").innerHTML = chips.map((chip) => `<span>${escapeHtml(chip)}</span>`).join("");
}

function updateSourcePlaceholder() {
  const source = $("#profile-source").value;
  $("#profile-url").placeholder = {
    kleinanzeigen: "https://www.kleinanzeigen.de/...",
    facebook: "https://www.facebook.com/marketplace/...",
    html: "https://example.com/search-results",
  }[source] || "https://example.com/search-results";
}

async function loadListings() {
  const status = $("#listing-status-filter").value;
  const profileId = $("#listing-profile-filter").value;
  const search = $("#listing-search-filter").value;
  const minPrice = $("#listing-min-price-filter").value;
  const maxPrice = $("#listing-max-price-filter").value;
  const includeHidden = $("#include-hidden").checked;
  const query = new URLSearchParams();
  if (status) query.set("status", status);
  if (profileId) query.set("profile_id", profileId);
  if (search) query.set("q", search);
  if (minPrice) query.set("min_price", minPrice);
  if (maxPrice) query.set("max_price", maxPrice);
  query.set("include_hidden", String(includeHidden));
  const listings = sortListings(await api(`/api/listings?${query}`));
  const browser = $("#listings-table");
  browser.classList.toggle("grid-view", state.listingView === "grid");
  browser.classList.toggle("list-view", state.listingView !== "grid");
  updateListingViewButtons();
  browser.innerHTML = listings.length
    ? listings.map((listing) => listingMarkup(listing)).join("")
    : `<article class="listing-card"><strong>No listings</strong><p class="meta">Adjust filters or run a profile.</p></article>`;
  $$("[data-listing-action]").forEach((button) => {
    button.addEventListener("click", async () => {
      await api(`/api/listings/${button.dataset.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: button.dataset.listingAction }),
      });
      await Promise.all([loadListings(), loadSummary()]);
    });
  });
  $$(".listing-image").forEach((img) => {
    img.addEventListener("error", () => {
      const fallback = document.createElement("span");
      fallback.className = "no-image";
      fallback.textContent = "No image available";
      img.replaceWith(fallback);
    });
  });
}

function setListingView(view) {
  state.listingView = view === "grid" ? "grid" : "list";
  localStorage.setItem("marketplacelens.listingView", state.listingView);
  loadListings();
}

function updateListingViewButtons() {
  $$("[data-listing-view]").forEach((button) => {
    button.classList.toggle("active", button.dataset.listingView === state.listingView);
  });
}

function sortListings(listings) {
  const sort = $("#listing-sort-filter").value;
  const copy = [...listings];
  const price = (listing) => typeof listing.price_value === "number" ? listing.price_value : null;
  const comparePrice = (a, b, direction) => {
    const priceA = price(a);
    const priceB = price(b);
    if (priceA === null && priceB === null) return 0;
    if (priceA === null) return 1;
    if (priceB === null) return -1;
    return direction === "desc" ? priceB - priceA : priceA - priceB;
  };
  const seenAt = (listing) => new Date(listing.first_seen_at || 0).getTime();
  return copy.sort((a, b) => {
    if (sort === "price_asc") return comparePrice(a, b, "asc");
    if (sort === "price_desc") return comparePrice(a, b, "desc");
    if (sort === "score_desc") return (b.score || 0) - (a.score || 0);
    return seenAt(b) - seenAt(a);
  });
}

function listingMarkup(listing) {
  return `
    <article class="listing-card">
      <div class="listing-media">
        ${listing.thumbnail_url ? `
          <img class="listing-image" src="/api/listings/${listing.id}/image" alt="${escapeAttribute(listing.title)}" loading="lazy">
        ` : `<span class="no-image">No image available</span>`}
      </div>
      <div class="listing-main">
        <div class="listing-title-row">
          <a href="${escapeAttribute(listing.listing_url)}" target="_blank" rel="noopener">${escapeHtml(listing.title)}</a>
          <span class="pill ${escapeAttribute(listing.status)}">${escapeHtml(listing.status)}</span>
        </div>
        <strong class="listing-price">${escapeHtml(listing.price_text || "no price")}</strong>
        <p class="meta listing-description">${escapeHtml(listing.description_snippet || "")}</p>
        <div class="listing-facts">
          <span>${escapeHtml(listing.profile_name || "")}</span>
          <span>${escapeHtml(listing.location_text || "no location")}</span>
          <span>score ${listing.score}</span>
          <span>${formatDate(listing.first_seen_at)}</span>
        </div>
        ${listing.filter_reason ? `<p class="filter-reason">${escapeHtml(listing.filter_reason)}</p>` : ""}
      </div>
      <div class="row-actions">
        <button class="mini-button" data-listing-action="seen" data-id="${listing.id}">Seen</button>
        <button class="mini-button" data-listing-action="hidden" data-id="${listing.id}">Hide</button>
        <button class="mini-button" data-listing-action="new" data-id="${listing.id}">New</button>
      </div>
    </article>
  `;
}

async function loadSettings() {
  const settings = await api("/api/settings");
  $("#telegram-token").value = settings.telegram_bot_token;
  $("#telegram-chat").value = settings.telegram_chat_id;
  $("#global-rate").value = settings.global_rate_limit_seconds;
}

async function saveSettings() {
  await api("/api/settings", {
    method: "PUT",
    body: JSON.stringify({
      telegram_bot_token: $("#telegram-token").value,
      telegram_chat_id: $("#telegram-chat").value,
      global_rate_limit_seconds: Number($("#global-rate").value || 20),
    }),
  });
  toast("Settings saved");
  await loadSettings();
}

async function testTelegram() {
  await api("/api/settings/telegram/test", { method: "POST" });
  toast("Telegram test sent");
}

function lines(selector) {
  return $(selector).value.split(/\n|,/).map((item) => item.trim()).filter(Boolean);
}

function numberOrNull(selector) {
  const value = $(selector).value;
  return value === "" ? null : Number(value);
}

function formatDate(value) {
  return value ? new Date(value).toLocaleString() : "never";
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char]));
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}

function toast(message) {
  const node = $("#toast");
  node.textContent = message;
  node.classList.add("visible");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => node.classList.remove("visible"), 3600);
}

function debounce(callback, delay) {
  let timer;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(callback, delay);
  };
}
