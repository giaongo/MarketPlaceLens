const state = {
  profiles: [],
  selectedProfile: null,
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
  $("#new-profile-button").addEventListener("click", () => editProfile(null));
  $("#run-profile-button").addEventListener("click", runSelectedProfile);
  $("#delete-profile-button").addEventListener("click", deleteSelectedProfile);
  $("#listing-status-filter").addEventListener("change", loadListings);
  $("#listing-profile-filter").addEventListener("change", loadListings);
  $("#listing-search-filter").addEventListener("input", debounce(loadListings, 220));
  $("#listing-min-price-filter").addEventListener("input", debounce(loadListings, 220));
  $("#listing-max-price-filter").addEventListener("input", debounce(loadListings, 220));
  $("#include-hidden").addEventListener("change", loadListings);
}

function bindForms() {
  $("#profile-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    await saveProfile();
  });
  $("#settings-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    await saveSettings();
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
    ? state.profiles.map((profile) => `
      <article class="profile-card ${state.selectedProfile?.id === profile.id ? "active" : ""}" data-id="${profile.id}">
        <h3>${escapeHtml(profile.name)}</h3>
        <p class="meta">${profile.enabled ? "enabled" : "paused"} · ${escapeHtml(profile.source_type)} · every ${profile.poll_interval_minutes} min</p>
        <p class="meta">${escapeHtml(profile.search_url)}</p>
      </article>
    `).join("")
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

function editProfile(profile) {
  state.selectedProfile = profile;
  $("#profile-form-title").textContent = profile ? "Edit profile" : "New profile";
  $("#profile-id").value = profile?.id || "";
  $("#profile-name").value = profile?.name || "";
  $("#profile-source").value = profile?.source_type || "html";
  $("#profile-url").value = profile?.search_url || "";
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
  loadProfiles();
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
  const listings = await api(`/api/listings?${query}`);
  $("#listings-table").innerHTML = listings.length
    ? listings.map((listing) => `
      <article class="listing-card">
        <div class="listing-media">
          ${listing.thumbnail_url ? `
            <button class="image-load" data-listing-id="${listing.id}" data-image-alt="${escapeAttribute(listing.title)}">Load image</button>
          ` : `<span class="no-image">No image</span>`}
        </div>
        <div class="listing-main">
          <div class="listing-title-row">
            <a href="${escapeAttribute(listing.listing_url)}" target="_blank" rel="noopener">${escapeHtml(listing.title)}</a>
            <span class="pill ${escapeAttribute(listing.status)}">${escapeHtml(listing.status)}</span>
          </div>
          <p class="meta">${escapeHtml(listing.description_snippet || "")}</p>
          <div class="listing-facts">
            <span>${escapeHtml(listing.profile_name || "")}</span>
            <span>${escapeHtml(listing.price_text || "no price")}</span>
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
    `).join("")
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
  $$(".image-load").forEach((button) => {
    button.addEventListener("click", () => {
      const img = document.createElement("img");
      img.src = `/api/listings/${button.dataset.listingId}/image`;
      img.alt = button.dataset.imageAlt;
      img.loading = "lazy";
      img.addEventListener("error", () => {
        const fallback = document.createElement("span");
        fallback.className = "no-image";
        fallback.textContent = "Image unavailable";
        img.replaceWith(fallback);
      });
      button.replaceWith(img);
    });
  });
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
