const state = {
  profiles: [],
  selectedProfile: null,
  listingView: localStorage.getItem("marketplacelens.listingView") || "list",
  language: localStorage.getItem("marketplacelens.language") || "en",
};

const translations = {
  en: {
    "brand.subtitle": "self-hosted listing watcher",
    "nav.dashboard": "Dashboard",
    "nav.profiles": "Jobs",
    "nav.listings": "Listings",
    "nav.watchlist": "Watchlist",
    "nav.settings": "Settings",
    "top.eyebrow": "Local marketplace watcher",
    "action.refresh": "Refresh",
    "action.logout": "Logout",
    "action.delete": "Delete",
    "summary.activeProfiles": "Active profiles",
    "summary.newListings": "New listings",
    "summary.watchlist": "Watchlist",
    "summary.hidden": "Hidden",
    "summary.notified": "Notified",
    "summary.runErrors": "Run errors",
    "dashboard.recentRuns": "Recent runs",
    "profiles.title": "Jobs",
    "profiles.subtitle": "Saved marketplace jobs grouped by source.",
    "profiles.editorSubtitle": "Create a job from a provider URL, then add filters and notifications.",
    "profiles.guidedSetup": "Quick job",
    "profiles.quickJob": "Quick job",
    "profiles.manual": "New job",
    "profiles.newJob": "New job",
    "profiles.all": "All profiles",
    "profile.new": "New job",
    "profile.edit": "Edit job",
    "profile.searchTitle": "Job",
    "profile.searchSubtitle": "Name this watch so it is easy to scan later",
    "profile.name": "Job name",
    "profile.source": "Source",
    "profile.sourceTitle": "Provider",
    "profile.sourceSubtitle": "Pick the marketplace and paste the sorted search URL.",
    "profile.searchUrl": "Search URL",
    "profile.openSource": "Open source",
    "profile.filtersTitle": "Criteria",
    "profile.filtersSubtitle": "Local filters applied after the search page is fetched",
    "profile.locationHint": "Location hint",
    "profile.minPrice": "Min price",
    "profile.maxPrice": "Max price",
    "profile.minPriceShort": "Min",
    "profile.maxPriceShort": "Max",
    "profile.pollInterval": "Poll interval",
    "profile.keywordTitle": "Keyword rules",
    "profile.keywordSubtitle": "Match, require, or hide terms from listings",
    "profile.include": "Include",
    "profile.required": "Required",
    "profile.exclude": "Exclude",
    "profile.hiddenCategories": "Hidden categories",
    "profile.automationTitle": "Automation & notifications",
    "profile.automationSubtitle": "Choose whether this job runs in the background and sends Telegram alerts.",
    "profile.enabled": "enabled",
    "profile.paused": "paused",
    "profile.everyMinutes": "every {minutes} min",
    "profile.save": "Save job",
    "profile.runNow": "Run now",
    "wizard.title": "Quick job",
    "wizard.subtitle": "Create a job from source, category, and search term, then fine-tune it below.",
    "wizard.query": "What should be found?",
    "wizard.source": "Source",
    "wizard.category": "Category",
    "wizard.allCategories": "All categories",
    "wizard.maxPrice": "Maximum price",
    "wizard.location": "Location",
    "wizard.mustInclude": "Must include",
    "wizard.hideWords": "Hide words",
    "wizard.create": "Create job",
    "wizard.manualForm": "Use manual form",
    "form.backgroundPolling": "Background polling",
    "form.telegram": "Telegram",
    "form.telegramNotifications": "Telegram notifications",
    "source.kleinanzeigenHelp": "Paste a public Kleinanzeigen search URL.",
    "source.facebookHelp": "Paste a reachable Marketplace URL.",
    "source.generic": "Generic HTML",
    "source.genericHelp": "Use a simple listing result page.",
    "jobSummary.nameMissing": "Name missing",
    "jobSummary.urlMissing": "URL missing",
    "jobSummary.provider": "Provider",
    "jobSummary.interval": "{minutes} min",
    "jobSummary.pollingOn": "Polling on",
    "jobSummary.pollingOff": "Polling off",
    "jobSummary.telegramOn": "Telegram on",
    "jobSummary.telegramOff": "Telegram off",
    "listings.title": "Browse listings",
    "listings.subtitle": "Scroll, filter, switch between list and tiles, or open the original listing.",
    "listings.searchPlaceholder": "Search title, location, category",
    "listings.allStatuses": "All statuses",
    "listings.includeHidden": "Hidden",
    "watchlist.title": "Watchlist",
    "watchlist.subtitle": "Saved listings you want to compare or revisit later.",
    "status.new": "New",
    "status.notified": "Notified",
    "status.hidden": "Hidden",
    "status.seen": "Seen",
    "sort.dateDesc": "Newest first",
    "sort.priceAsc": "Price low-high",
    "sort.priceDesc": "Price high-low",
    "sort.scoreDesc": "Best score",
    "view.list": "List",
    "view.tiles": "Tiles",
    "settings.telegram": "Telegram",
    "settings.botToken": "Bot token",
    "settings.chatId": "Chat ID",
    "settings.rateLimit": "Global rate limit seconds",
    "settings.save": "Save settings",
    "settings.sendTest": "Send test",
    "settings.password": "Password",
    "settings.passwordSubtitle": "Change the local admin password for this app.",
    "settings.currentPassword": "Current password",
    "settings.newPassword": "New password",
    "settings.repeatPassword": "Repeat new password",
    "settings.changePassword": "Change password",
    "empty.noRuns": "No runs yet",
    "empty.noRunsHint": "Create a profile and run it manually.",
    "empty.noProfiles": "No profiles",
    "empty.noProfilesHint": "Add the first search URL on the right.",
    "empty.sourceProfiles": "No {source} jobs yet",
    "empty.noListings": "No listings",
    "empty.noListingsHint": "Adjust filters or run a profile.",
    "empty.noWatchlist": "No watchlisted listings",
    "empty.noWatchlistHint": "Use the star button on a listing to save it here.",
    "listing.noImage": "No image available",
    "listing.noPrice": "no price",
    "listing.noLocation": "no location",
    "listing.score": "score {score}",
    "listing.addWatchlist": "Watch",
    "listing.removeWatchlist": "Remove",
    "listing.seen": "Seen",
    "listing.hide": "Hide",
    "listing.new": "New",
    "toast.passwordMismatch": "New passwords do not match",
    "toast.passwordChanged": "Password changed",
    "toast.profileSaved": "Profile saved",
    "toast.saveProfileFirst": "Save a profile first",
    "toast.runStarted": "Run started",
    "toast.runComplete": "Run complete: {new} new, {hidden} hidden, {duplicates} duplicate",
    "toast.profileDeleted": "Profile deleted",
    "toast.searchRequired": "Search term is required",
    "toast.settingsSaved": "Settings saved",
    "toast.telegramSent": "Telegram test sent",
  },
  de: {
    "brand.subtitle": "selbst gehosteter Anzeigen-Watcher",
    "nav.dashboard": "Dashboard",
    "nav.profiles": "Jobs",
    "nav.listings": "Listings",
    "nav.watchlist": "Watchlist",
    "nav.settings": "Einstellungen",
    "top.eyebrow": "Lokaler Marketplace-Watcher",
    "action.refresh": "Aktualisieren",
    "action.logout": "Abmelden",
    "action.delete": "Löschen",
    "summary.activeProfiles": "Aktive Profile",
    "summary.newListings": "Neue Listings",
    "summary.watchlist": "Watchlist",
    "summary.hidden": "Ausgeblendet",
    "summary.notified": "Benachrichtigt",
    "summary.runErrors": "Run-Fehler",
    "dashboard.recentRuns": "Letzte Runs",
    "profiles.title": "Jobs",
    "profiles.subtitle": "Gespeicherte Marketplace-Jobs nach Quelle gruppiert.",
    "profiles.editorSubtitle": "Job aus Provider-URL erstellen, dann Filter und Benachrichtigungen ergänzen.",
    "profiles.guidedSetup": "Schnelljob",
    "profiles.quickJob": "Schnelljob",
    "profiles.manual": "Neuer Job",
    "profiles.newJob": "Neuer Job",
    "profiles.all": "Alle Profile",
    "profile.new": "Neuer Job",
    "profile.edit": "Job bearbeiten",
    "profile.searchTitle": "Job",
    "profile.searchSubtitle": "So benennen, dass er später schnell erkennbar ist",
    "profile.name": "Job-Name",
    "profile.source": "Quelle",
    "profile.sourceTitle": "Provider",
    "profile.sourceSubtitle": "Marketplace auswählen und sortierte Such-URL einfügen.",
    "profile.searchUrl": "Such-URL",
    "profile.openSource": "Quelle öffnen",
    "profile.filtersTitle": "Kriterien",
    "profile.filtersSubtitle": "Lokale Filter nach dem Abruf der Suchseite",
    "profile.locationHint": "Ortshinweis",
    "profile.minPrice": "Mindestpreis",
    "profile.maxPrice": "Maximalpreis",
    "profile.minPriceShort": "Min.",
    "profile.maxPriceShort": "Max.",
    "profile.pollInterval": "Abrufintervall",
    "profile.keywordTitle": "Keyword-Regeln",
    "profile.keywordSubtitle": "Begriffe matchen, erzwingen oder ausblenden",
    "profile.include": "Einschließen",
    "profile.required": "Erforderlich",
    "profile.exclude": "Ausschließen",
    "profile.hiddenCategories": "Ausgeblendete Kategorien",
    "profile.automationTitle": "Automation & Benachrichtigungen",
    "profile.automationSubtitle": "Festlegen, ob der Job im Hintergrund läuft und Telegram sendet.",
    "profile.enabled": "aktiv",
    "profile.paused": "pausiert",
    "profile.everyMinutes": "alle {minutes} Min.",
    "profile.save": "Job speichern",
    "profile.runNow": "Jetzt ausführen",
    "wizard.title": "Schnelljob",
    "wizard.subtitle": "Job aus Quelle, Kategorie und Suchbegriff erstellen und danach unten feinjustieren.",
    "wizard.query": "Was soll gefunden werden?",
    "wizard.source": "Quelle",
    "wizard.category": "Kategorie",
    "wizard.allCategories": "Alle Kategorien",
    "wizard.maxPrice": "Maximalpreis",
    "wizard.location": "Ort",
    "wizard.mustInclude": "Muss enthalten",
    "wizard.hideWords": "Wörter ausblenden",
    "wizard.create": "Job erstellen",
    "wizard.manualForm": "Manuelles Formular",
    "form.backgroundPolling": "Automatisch abrufen",
    "form.telegram": "Telegram",
    "form.telegramNotifications": "Telegram-Benachrichtigungen",
    "source.kleinanzeigenHelp": "Öffentliche Kleinanzeigen-Such-URL einfügen.",
    "source.facebookHelp": "Erreichbare Marketplace-URL einfügen.",
    "source.generic": "Generic HTML",
    "source.genericHelp": "Einfache Listing-Ergebnisseite verwenden.",
    "jobSummary.nameMissing": "Name fehlt",
    "jobSummary.urlMissing": "URL fehlt",
    "jobSummary.provider": "Provider",
    "jobSummary.interval": "{minutes} Min.",
    "jobSummary.pollingOn": "Polling an",
    "jobSummary.pollingOff": "Polling aus",
    "jobSummary.telegramOn": "Telegram an",
    "jobSummary.telegramOff": "Telegram aus",
    "listings.title": "Listings durchsuchen",
    "listings.subtitle": "Scrollen, filtern, zwischen Liste und Kacheln wechseln oder Original öffnen.",
    "listings.searchPlaceholder": "Titel, Ort, Kategorie suchen",
    "listings.allStatuses": "Alle Status",
    "listings.includeHidden": "Ausgeblendete",
    "watchlist.title": "Watchlist",
    "watchlist.subtitle": "Gespeicherte Listings zum Vergleichen oder späteren Öffnen.",
    "status.new": "Neu",
    "status.notified": "Benachrichtigt",
    "status.hidden": "Ausgeblendet",
    "status.seen": "Gesehen",
    "sort.dateDesc": "Neueste zuerst",
    "sort.priceAsc": "Preis niedrig-hoch",
    "sort.priceDesc": "Preis hoch-niedrig",
    "sort.scoreDesc": "Bester Score",
    "view.list": "Liste",
    "view.tiles": "Kacheln",
    "settings.telegram": "Telegram",
    "settings.botToken": "Bot-Token",
    "settings.chatId": "Chat-ID",
    "settings.rateLimit": "Globales Rate-Limit in Sekunden",
    "settings.save": "Einstellungen speichern",
    "settings.sendTest": "Test senden",
    "settings.password": "Passwort",
    "settings.passwordSubtitle": "Lokales Admin-Passwort für diese App ändern.",
    "settings.currentPassword": "Aktuelles Passwort",
    "settings.newPassword": "Neues Passwort",
    "settings.repeatPassword": "Neues Passwort wiederholen",
    "settings.changePassword": "Passwort ändern",
    "empty.noRuns": "Noch keine Runs",
    "empty.noRunsHint": "Erstelle ein Profil und starte es manuell.",
    "empty.noProfiles": "Keine Profile",
    "empty.noProfilesHint": "Lege rechts die erste Such-URL an.",
    "empty.sourceProfiles": "Noch keine {source}-Jobs",
    "empty.noListings": "Keine Listings",
    "empty.noListingsHint": "Filter anpassen oder Profil ausführen.",
    "empty.noWatchlist": "Keine Watchlist-Listings",
    "empty.noWatchlistHint": "Speichere Listings über den Stern-Button hier.",
    "listing.noImage": "Kein Bild verfügbar",
    "listing.noPrice": "kein Preis",
    "listing.noLocation": "kein Ort",
    "listing.score": "Score {score}",
    "listing.addWatchlist": "Merken",
    "listing.removeWatchlist": "Entfernen",
    "listing.seen": "Gesehen",
    "listing.hide": "Ausblenden",
    "listing.new": "Neu",
    "toast.passwordMismatch": "Neue Passwörter stimmen nicht überein",
    "toast.passwordChanged": "Passwort geändert",
    "toast.profileSaved": "Profil gespeichert",
    "toast.saveProfileFirst": "Speichere zuerst ein Profil",
    "toast.runStarted": "Run gestartet",
    "toast.runComplete": "Run fertig: {new} neu, {hidden} ausgeblendet, {duplicates} Duplikate",
    "toast.profileDeleted": "Profil gelöscht",
    "toast.searchRequired": "Suchbegriff ist erforderlich",
    "toast.settingsSaved": "Einstellungen gespeichert",
    "toast.telegramSent": "Telegram-Test gesendet",
  },
};

const providerCategories = {
  kleinanzeigen: [
    { label: "Auto, Rad & Boot", path: "autos", id: "216" },
    { label: "Autoteile & Reifen", path: "autoteile-reifen", id: "223" },
    { label: "Dienstleistungen", path: "dienstleistungen", id: "297" },
    { label: "Elektronik", path: "elektronik", id: "161" },
    { label: "Familie, Kind & Baby", path: "familie-kind-baby", id: "17" },
    { label: "Freizeit, Hobby & Nachbarschaft", path: "freizeit-nachbarschaft", id: "185" },
    { label: "Haus & Garten", path: "haus-garten", id: "80" },
    { label: "Haustiere", path: "haustiere", id: "130" },
    { label: "Immobilien", path: "immobilien", id: "195" },
    { label: "Jobs", path: "jobs", id: "102" },
    { label: "Mode & Beauty", path: "mode-beauty", id: "153" },
    { label: "Musik, Filme & Bücher", path: "musik-filme-buecher", id: "73" },
    { label: "Unterricht & Kurse", path: "unterricht-kurse", id: "18" },
    { label: "Verschenken & Tauschen", path: "verschenken-tauschen", id: "192" },
  ],
  facebook: [
    { label: "Vehicles", slug: "vehicles" },
    { label: "Property rentals", slug: "propertyrentals" },
    { label: "Apparel", slug: "apparel" },
    { label: "Classifieds", slug: "classifieds" },
    { label: "Electronics", slug: "electronics" },
    { label: "Entertainment", slug: "entertainment" },
    { label: "Family", slug: "family" },
    { label: "Free stuff", slug: "free" },
    { label: "Garden & outdoor", slug: "garden" },
    { label: "Hobbies", slug: "hobbies" },
    { label: "Home goods", slug: "home" },
    { label: "Home improvement supplies", slug: "homeimprovement" },
    { label: "Musical instruments", slug: "musicalinstruments" },
    { label: "Office supplies", slug: "officesupplies" },
    { label: "Pet supplies", slug: "petsupplies" },
    { label: "Sporting goods", slug: "sportinggoods" },
    { label: "Toys & games", slug: "toys" },
    { label: "Books, movies & music", slug: "bookmoviesmusic" },
  ],
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

document.addEventListener("DOMContentLoaded", () => {
  bindNavigation();
  bindForms();
  $("#language-select").value = state.language;
  applyTranslations();
  updateWizardCategories();
  $("#view-title").textContent = t("nav.dashboard");
  refreshAll();
});

function bindNavigation() {
  $$(".nav-item").forEach((button) => {
    button.addEventListener("click", () => showView(button.dataset.view));
  });
  $("#refresh-button").addEventListener("click", refreshAll);
  $("#logout-button").addEventListener("click", logout);
  $("#language-select").addEventListener("change", () => setLanguage($("#language-select").value));
  $("#wizard-button").addEventListener("click", () => showWizard(true));
  $("#wizard-cancel-button").addEventListener("click", () => showWizard(false));
  $("#wizard-source").addEventListener("change", updateWizardCategories);
  $("#new-profile-button").addEventListener("click", () => editProfile(null));
  $("#profile-source").addEventListener("change", updateSourcePlaceholder);
  $("#open-source-button").addEventListener("click", openSelectedSource);
  $$("[data-source-option]").forEach((button) => {
    button.addEventListener("click", () => selectSource(button.dataset.sourceOption));
  });
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
    "#profile-name",
    "#profile-url",
    "#profile-interval",
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
  $("#view-title").textContent = t({
    dashboard: "nav.dashboard",
    profiles: "nav.profiles",
    listings: "nav.listings",
    watchlist: "nav.watchlist",
    settings: "nav.settings",
  }[view]);
  if (view === "listings") loadListings();
  if (view === "watchlist") loadWatchlist();
}

function showWizard(visible) {
  $("#profile-wizard").classList.toggle("hidden", !visible);
  $("#profile-form").classList.toggle("hidden", visible);
  if (visible) {
    updateProfileFormTitle(true);
    updateWizardCategories();
    $("#wizard-query").focus();
  } else {
    editProfile(null);
  }
}

async function refreshAll() {
  try {
    await Promise.all([loadSummary(), loadProfiles(), loadListings(), loadWatchlist(), loadSettings()]);
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
  $("#summary-watchlisted").textContent = summary.listings_watchlisted;
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
    : `<article><strong>${escapeHtml(t("empty.noRuns"))}</strong><p class="meta">${escapeHtml(t("empty.noRunsHint"))}</p></article>`;
}

async function loadProfiles() {
  state.profiles = await api("/api/profiles");
  $("#profiles-list").innerHTML = state.profiles.length
    ? groupedProfilesMarkup(state.profiles)
    : `<article class="profile-card"><h3>${escapeHtml(t("empty.noProfiles"))}</h3><p class="meta">${escapeHtml(t("empty.noProfilesHint"))}</p></article>`;
  $$(".profile-card[data-id]").forEach((card) => {
    card.addEventListener("click", () => {
      const profile = state.profiles.find((item) => item.id === Number(card.dataset.id));
      editProfile(profile);
    });
  });
  const current = $("#listing-profile-filter").value;
  $("#listing-profile-filter").innerHTML = `<option value="">${escapeHtml(t("profiles.all"))}</option>${state.profiles.map((profile) => `
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
        <p class="meta">${profile.enabled ? t("profile.enabled") : t("profile.paused")} · ${t("profile.everyMinutes", { minutes: profile.poll_interval_minutes })}</p>
        <p class="meta">${escapeHtml(profile.search_url)}</p>
      </article>
        `).join("") : `<article class="profile-empty">${escapeHtml(t("empty.sourceProfiles", { source: sourceLabel(source) }))}</article>`}
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

function sourceBaseUrl(source) {
  return {
    kleinanzeigen: "https://www.kleinanzeigen.de/",
    facebook: "https://www.facebook.com/marketplace/",
    html: "",
  }[source] || "";
}

async function changePassword() {
  const current = $("#current-password").value;
  const next = $("#new-password").value;
  const repeated = $("#repeat-password").value;
  if (next !== repeated) return toast(t("toast.passwordMismatch"));
  await api("/api/settings/password", {
    method: "POST",
    body: JSON.stringify({ current_password: current, new_password: next }),
  });
  $("#current-password").value = "";
  $("#new-password").value = "";
  $("#repeat-password").value = "";
  toast(t("toast.passwordChanged"));
}

function editProfile(profile) {
  $("#profile-wizard").classList.add("hidden");
  $("#profile-form").classList.remove("hidden");
  state.selectedProfile = profile;
  updateProfileFormTitle(false);
  $("#profile-id").value = profile?.id || "";
  $("#profile-name").value = profile?.name || "";
  $("#profile-source").value = profile?.source_type || "kleinanzeigen";
  $("#profile-url").value = profile?.search_url || "";
  updateSourcePlaceholder();
  updateSourceOptions();
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
  updateJobSetupSummary();
  loadProfiles();
}

function updateProfileFormTitle(wizardVisible = !$("#profile-wizard").classList.contains("hidden")) {
  $("#profile-form-title").textContent = wizardVisible
    ? t("wizard.title")
    : state.selectedProfile ? t("profile.edit") : t("profile.new");
}

async function createProfileFromWizard() {
  const query = $("#wizard-query").value.trim();
  if (!query) return toast(t("toast.searchRequired"));
  const source = $("#wizard-source").value;
  const category = selectedWizardCategory();
  $("#profile-id").value = "";
  $("#profile-name").value = category ? `${query} · ${category.label}` : `${query} · ${sourceLabel(source)}`;
  $("#profile-source").value = source;
  $("#profile-url").value = buildWizardSearchUrl(source, query, category);
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
  updateSourcePlaceholder();
  updateFilterPreview();
  await saveProfile();
  clearWizard();
  $("#profile-wizard").classList.add("hidden");
  $("#profile-form").classList.remove("hidden");
}

function clearWizard() {
  $("#wizard-source").value = "kleinanzeigen";
  updateWizardCategories();
  $("#wizard-query").value = "";
  $("#wizard-max-price").value = "";
  $("#wizard-location").value = "";
  $("#wizard-required").value = "";
  $("#wizard-exclude").value = "";
  $("#wizard-enabled").checked = false;
  $("#wizard-notify").checked = false;
}

function updateWizardCategories() {
  const source = $("#wizard-source").value;
  const current = $("#wizard-category").value;
  const categories = providerCategories[source] || [];
  $("#wizard-category").innerHTML = `
    <option value="">${escapeHtml(t("wizard.allCategories"))}</option>
    ${categories.map((category) => `<option value="${escapeAttribute(category.id || category.slug)}">${escapeHtml(category.label)}</option>`).join("")}
  `;
  $("#wizard-category").value = categories.some((category) => (category.id || category.slug) === current) ? current : "";
}

function selectedWizardCategory() {
  const source = $("#wizard-source").value;
  const value = $("#wizard-category").value;
  if (!value) return null;
  return (providerCategories[source] || []).find((category) => (category.id || category.slug) === value) || null;
}

function buildWizardSearchUrl(source, query, category) {
  if (source === "facebook") {
    const base = category?.slug
      ? `https://www.facebook.com/marketplace/category/${category.slug}/`
      : "https://www.facebook.com/marketplace/search/";
    return `${base}?query=${encodeURIComponent(query)}`;
  }
  if (source === "kleinanzeigen" && category?.id && category?.path) {
    const keywordPath = encodeURIComponent(query.trim()).replace(/%20/g, "-");
    return `https://www.kleinanzeigen.de/s-${category.path}/${keywordPath}/k0c${category.id}`;
  }
  return `https://www.kleinanzeigen.de/s-suchanfrage.html?keywords=${encodeURIComponent(query)}`;
}

async function saveProfile() {
  const payload = profilePayload();
  const id = $("#profile-id").value;
  const saved = await api(id ? `/api/profiles/${id}` : "/api/profiles", {
    method: id ? "PUT" : "POST",
    body: JSON.stringify(payload),
  });
  toast(t("toast.profileSaved"));
  editProfile(saved);
  await refreshAll();
}

async function runSelectedProfile() {
  const id = $("#profile-id").value;
  if (!id) return toast(t("toast.saveProfileFirst"));
  toast(t("toast.runStarted"));
  const result = await api(`/api/profiles/${id}/run`, { method: "POST" });
  toast(t("toast.runComplete", result));
  await refreshAll();
}

async function deleteSelectedProfile() {
  const id = $("#profile-id").value;
  if (!id) return;
  await api(`/api/profiles/${id}`, { method: "DELETE" });
  toast(t("toast.profileDeleted"));
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
  if (location) chips.push(`${t("profile.locationHint")}: ${location}`);
  if (minPrice) chips.push(`${t("profile.minPriceShort")} ${minPrice} EUR`);
  if (maxPrice) chips.push(`${t("profile.maxPriceShort")} ${maxPrice} EUR`);
  lines("#profile-required").forEach((item) => chips.push(`${t("profile.required")}: ${item}`));
  lines("#profile-include").slice(0, 5).forEach((item) => chips.push(`match: ${item}`));
  lines("#profile-exclude").forEach((item) => chips.push(`${t("profile.exclude")}: ${item}`));
  lines("#profile-categories").forEach((item) => chips.push(`${t("profile.hiddenCategories")}: ${item}`));
  chips.push($("#profile-enabled").checked ? t("form.backgroundPolling") : "Polling off");
  chips.push($("#profile-notify").checked ? t("form.telegramNotifications") : "Telegram off");
  $("#profile-filter-preview").innerHTML = chips.map((chip) => `<span>${escapeHtml(chip)}</span>`).join("");
  updateJobSetupSummary();
}

function updateSourcePlaceholder() {
  const source = $("#profile-source").value;
  $("#profile-url").placeholder = {
    kleinanzeigen: "https://www.kleinanzeigen.de/...",
    facebook: "https://www.facebook.com/marketplace/...",
    html: "https://example.com/search-results",
  }[source] || "https://example.com/search-results";
  updateSourceOptions();
  updateJobSetupSummary();
}

function selectSource(source) {
  $("#profile-source").value = source;
  updateSourcePlaceholder();
}

function updateSourceOptions() {
  const source = $("#profile-source").value;
  $$("[data-source-option]").forEach((button) => {
    button.classList.toggle("active", button.dataset.sourceOption === source);
  });
}

function openSelectedSource() {
  const baseUrl = sourceBaseUrl($("#profile-source").value);
  if (baseUrl) window.open(baseUrl, "_blank", "noopener");
  else $("#profile-url").focus();
}

function updateJobSetupSummary() {
  const name = $("#profile-name").value.trim() || t("jobSummary.nameMissing");
  const url = $("#profile-url").value.trim() || t("jobSummary.urlMissing");
  const interval = Number($("#profile-interval").value || 60);
  const chips = [
    `${t("profile.name")}: ${name}`,
    `${t("jobSummary.provider")}: ${sourceLabel($("#profile-source").value)}`,
    url,
    t("jobSummary.interval", { minutes: interval }),
    $("#profile-enabled").checked ? t("jobSummary.pollingOn") : t("jobSummary.pollingOff"),
    $("#profile-notify").checked ? t("jobSummary.telegramOn") : t("jobSummary.telegramOff"),
  ];
  $("#job-setup-summary").innerHTML = chips.map((chip) => `<span>${escapeHtml(chip)}</span>`).join("");
}

async function loadListings() {
  await loadListingBrowser("#listings-table", false);
}

async function loadWatchlist() {
  await loadListingBrowser("#watchlist-table", true);
}

async function loadListingBrowser(containerSelector, watchlistedOnly) {
  const browser = $(containerSelector);
  if (!browser) return;
  const status = $("#listing-status-filter").value;
  const profileId = $("#listing-profile-filter").value;
  const search = $("#listing-search-filter").value;
  const minPrice = $("#listing-min-price-filter").value;
  const maxPrice = $("#listing-max-price-filter").value;
  const includeHidden = $("#include-hidden").checked;
  const query = new URLSearchParams();
  if (!watchlistedOnly) {
    if (status) query.set("status", status);
    if (profileId) query.set("profile_id", profileId);
    if (search) query.set("q", search);
    if (minPrice) query.set("min_price", minPrice);
    if (maxPrice) query.set("max_price", maxPrice);
    query.set("include_hidden", String(includeHidden));
  }
  if (watchlistedOnly) query.set("watchlisted", "true");
  const listings = sortListings(await api(`/api/listings?${query}`));
  browser.classList.toggle("grid-view", state.listingView === "grid");
  browser.classList.toggle("list-view", state.listingView !== "grid");
  updateListingViewButtons();
  browser.innerHTML = listings.length
    ? listings.map((listing) => listingMarkup(listing)).join("")
    : `<article class="listing-card empty-listing"><strong>${escapeHtml(t(watchlistedOnly ? "empty.noWatchlist" : "empty.noListings"))}</strong><p class="meta">${escapeHtml(t(watchlistedOnly ? "empty.noWatchlistHint" : "empty.noListingsHint"))}</p></article>`;
  browser.querySelectorAll("[data-listing-action]").forEach((button) => {
    button.addEventListener("click", async () => {
      await api(`/api/listings/${button.dataset.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: button.dataset.listingAction }),
      });
      await Promise.all([loadListings(), loadWatchlist(), loadSummary()]);
    });
  });
  browser.querySelectorAll("[data-watchlist-action]").forEach((button) => {
    button.addEventListener("click", async () => {
      await api(`/api/listings/${button.dataset.id}`, {
        method: "PATCH",
        body: JSON.stringify({ watchlisted: button.dataset.watchlistAction === "add" }),
      });
      await Promise.all([loadListings(), loadWatchlist(), loadSummary()]);
    });
  });
  browser.querySelectorAll(".listing-image").forEach((img) => {
    img.addEventListener("error", () => {
      const fallback = document.createElement("span");
      fallback.className = "no-image";
      fallback.textContent = t("listing.noImage");
      img.replaceWith(fallback);
    });
  });
}

function setListingView(view) {
  state.listingView = view === "grid" ? "grid" : "list";
  localStorage.setItem("marketplacelens.listingView", state.listingView);
  loadListings();
  loadWatchlist();
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
  const watchlistAction = listing.watchlisted ? "remove" : "add";
  const watchlistLabel = listing.watchlisted ? t("listing.removeWatchlist") : t("listing.addWatchlist");
  return `
    <article class="listing-card ${listing.watchlisted ? "watchlisted" : ""}">
      <div class="listing-media">
        ${listing.thumbnail_url ? `
          <img class="listing-image" src="/api/listings/${listing.id}/image" alt="${escapeAttribute(listing.title)}" loading="lazy">
        ` : `<span class="no-image">${escapeHtml(t("listing.noImage"))}</span>`}
      </div>
      <div class="listing-main">
        <div class="listing-title-row">
          <a href="${escapeAttribute(listing.listing_url)}" target="_blank" rel="noopener">${escapeHtml(listing.title)}</a>
          <div class="listing-badges">
            ${listing.watchlisted ? `<span class="pill watchlist-pill">★ ${escapeHtml(t("nav.watchlist"))}</span>` : ""}
            <span class="pill ${escapeAttribute(listing.status)}">${escapeHtml(statusLabel(listing.status))}</span>
          </div>
        </div>
        <strong class="listing-price">${escapeHtml(listing.price_text || t("listing.noPrice"))}</strong>
        <p class="meta listing-description">${escapeHtml(listing.description_snippet || "")}</p>
        <div class="listing-facts">
          <span>${escapeHtml(listing.profile_name || "")}</span>
          <span>${escapeHtml(listing.location_text || t("listing.noLocation"))}</span>
          <span>${escapeHtml(t("listing.score", { score: listing.score }))}</span>
          <span>${formatDate(listing.first_seen_at)}</span>
        </div>
        ${listing.filter_reason ? `<p class="filter-reason">${escapeHtml(listing.filter_reason)}</p>` : ""}
      </div>
      <div class="row-actions">
        <button class="mini-button watch-button ${listing.watchlisted ? "active" : ""}" data-watchlist-action="${watchlistAction}" data-id="${listing.id}">${listing.watchlisted ? "★" : "☆"} ${escapeHtml(watchlistLabel)}</button>
        <button class="mini-button" data-listing-action="seen" data-id="${listing.id}">${escapeHtml(t("listing.seen"))}</button>
        <button class="mini-button" data-listing-action="hidden" data-id="${listing.id}">${escapeHtml(t("listing.hide"))}</button>
        <button class="mini-button" data-listing-action="new" data-id="${listing.id}">${escapeHtml(t("listing.new"))}</button>
      </div>
    </article>
  `;
}

function statusLabel(status) {
  return t(`status.${status}`) || status;
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
  toast(t("toast.settingsSaved"));
  await loadSettings();
}

async function testTelegram() {
  await api("/api/settings/telegram/test", { method: "POST" });
  toast(t("toast.telegramSent"));
}

function lines(selector) {
  return $(selector).value.split(/\n|,/).map((item) => item.trim()).filter(Boolean);
}

function numberOrNull(selector) {
  const value = $(selector).value;
  return value === "" ? null : Number(value);
}

function formatDate(value) {
  return value ? new Date(value).toLocaleString(state.language === "de" ? "de-DE" : "en-US") : "never";
}

function setLanguage(language) {
  state.language = language === "de" ? "de" : "en";
  localStorage.setItem("marketplacelens.language", state.language);
  applyTranslations();
  const activeView = $(".view.active")?.id?.replace("-view", "") || "dashboard";
  $("#view-title").textContent = t({
    dashboard: "nav.dashboard",
    profiles: "nav.profiles",
    listings: "nav.listings",
    watchlist: "nav.watchlist",
    settings: "nav.settings",
  }[activeView]);
  updateProfileFormTitle();
  updateWizardCategories();
  updateFilterPreview();
  loadSummary();
  loadProfiles();
  loadListings();
  loadWatchlist();
}

function applyTranslations() {
  document.documentElement.lang = state.language;
  $$("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  $$("[data-i18n-placeholder]").forEach((node) => {
    node.placeholder = t(node.dataset.i18nPlaceholder);
  });
  $$("[data-listing-view='list']").forEach((button) => {
    button.title = t("view.list");
    button.setAttribute("aria-label", t("view.list"));
  });
  $$("[data-listing-view='grid']").forEach((button) => {
    button.title = t("view.tiles");
    button.setAttribute("aria-label", t("view.tiles"));
  });
}

function t(key, values = {}) {
  const template = translations[state.language]?.[key] || translations.en[key] || key || "";
  return template.replace(/\{(\w+)\}/g, (_, name) => values[name] ?? "");
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
