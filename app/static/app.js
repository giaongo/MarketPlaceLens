const state = {
  profiles: [],
  selectedProfile: null,
  listingView: localStorage.getItem("marketplacelens.listingView") || "list",
  language: localStorage.getItem("marketplacelens.language") || "en",
  theme: localStorage.getItem("marketplacelens.theme") || "light",
  listingPage: 0,
  watchlistPage: 0,
  pageSize: Number(localStorage.getItem("marketplacelens.pageSize") || 10),
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
    "theme.light": "Light",
    "theme.dark": "Dark",
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
    "keyword.add": "Add keyword",
    "keyword.remove": "Remove {item}",
    "filter.ruleType": "Rule",
    "filter.typeRequired": "Only show when text contains",
    "filter.typeExclude": "Hide when text contains",
    "filter.typeInclude": "Prefer when text contains",
    "filter.term": "Word or phrase",
    "filter.termPlaceholder": "washing",
    "filter.add": "Add rule",
    "filter.empty": "No keyword rules yet",
    "filter.requiredRule": "Only show listings when title or description contains \"{term}\"",
    "filter.excludeRule": "Hide listings when title or description contains \"{term}\"",
    "filter.includeRule": "Prefer listings when title or description contains \"{term}\"",
    "profile.automationTitle": "Automation & notifications",
    "profile.automationSubtitle": "Choose whether this job runs in the background and sends notifications.",
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
    "listingTypes.title": "Listing types",
    "listingTypes.offers": "Offers",
    "listingTypes.wanted": "Wanted",
    "listingTypes.help": "Both selected means all listing types.",
    "listingTypes.all": "All listing types",
    "listingTypes.offersOnly": "Offers only",
    "listingTypes.wantedOnly": "Wanted only",
    "form.backgroundPolling": "Background polling",
    "form.telegram": "Telegram",
    "form.webhook": "Webhook",
    "form.telegramNotifications": "Telegram notifications",
    "form.webhookNotifications": "Webhook notifications",
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
    "jobSummary.webhookOn": "Webhook on",
    "jobSummary.webhookOff": "Webhook off",
    "listings.title": "Browse listings",
    "listings.subtitle": "Scroll, filter, switch between list and tiles, or open the original listing.",
    "listings.searchPlaceholder": "Search title, location, category",
    "listings.allStatuses": "All statuses",
    "listings.includeHidden": "Show hidden",
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
    "pagination.pageSize": "Per page",
    "pagination.prev": "Prev",
    "pagination.next": "Next",
    "pagination.range": "{start}-{end} / {total}",
    "settings.notifications": "Notifications",
    "settings.telegram": "Telegram",
    "settings.botToken": "Bot token",
    "settings.chatId": "Chat ID",
    "settings.webhookUrl": "Webhook URL",
    "settings.rateLimit": "Global rate limit seconds",
    "settings.save": "Save settings",
    "settings.sendTest": "Send test",
    "settings.sendWebhookTest": "Send webhook test",
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
    "date.never": "never",
    "toast.listingHidden": "Listing hidden",
    "toast.listingSeen": "Listing marked as seen",
    "toast.listingNew": "Listing moved back to new",
    "toast.watchlistAdded": "Added to watchlist",
    "toast.watchlistRemoved": "Removed from watchlist",
    "toast.passwordMismatch": "New passwords do not match",
    "toast.passwordChanged": "Password changed",
    "toast.profileSaved": "Profile saved",
    "toast.saveProfileFirst": "Save a profile first",
    "toast.runStarted": "Run started",
    "toast.runComplete": "Run complete: {new} new, {hidden} hidden, {duplicates} duplicate",
    "toast.profileDeleted": "Profile deleted",
    "toast.searchRequired": "Search term is required",
    "toast.listingTypeRequired": "Select at least one Kleinanzeigen listing type",
    "toast.settingsSaved": "Settings saved",
    "toast.telegramSent": "Telegram test sent",
    "toast.webhookSent": "Webhook test sent",
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
    "theme.light": "Hell",
    "theme.dark": "Dunkel",
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
    "keyword.add": "Keyword hinzufügen",
    "keyword.remove": "{item} entfernen",
    "filter.ruleType": "Regel",
    "filter.typeRequired": "Nur anzeigen, wenn Text enthält",
    "filter.typeExclude": "Ausblenden, wenn Text enthält",
    "filter.typeInclude": "Bevorzugen, wenn Text enthält",
    "filter.term": "Wort oder Satz",
    "filter.termPlaceholder": "wäsche",
    "filter.add": "Regel hinzufügen",
    "filter.empty": "Noch keine Keyword-Regeln",
    "filter.requiredRule": "Nur anzeigen, wenn Titel oder Beschreibung \"{term}\" enthält",
    "filter.excludeRule": "Ausblenden, wenn Titel oder Beschreibung \"{term}\" enthält",
    "filter.includeRule": "Bevorzugen, wenn Titel oder Beschreibung \"{term}\" enthält",
    "profile.automationTitle": "Automation & Benachrichtigungen",
    "profile.automationSubtitle": "Festlegen, ob der Job im Hintergrund läuft und Benachrichtigungen sendet.",
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
    "listingTypes.title": "Anzeigenarten",
    "listingTypes.offers": "Angebote",
    "listingTypes.wanted": "Gesuche",
    "listingTypes.help": "Beide ausgewählt bedeutet alle Anzeigenarten.",
    "listingTypes.all": "Alle Anzeigenarten",
    "listingTypes.offersOnly": "Nur Angebote",
    "listingTypes.wantedOnly": "Nur Gesuche",
    "form.backgroundPolling": "Automatisch abrufen",
    "form.telegram": "Telegram",
    "form.webhook": "Webhook",
    "form.telegramNotifications": "Telegram-Benachrichtigungen",
    "form.webhookNotifications": "Webhook-Benachrichtigungen",
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
    "jobSummary.webhookOn": "Webhook an",
    "jobSummary.webhookOff": "Webhook aus",
    "listings.title": "Listings durchsuchen",
    "listings.subtitle": "Scrollen, filtern, zwischen Liste und Kacheln wechseln oder Original öffnen.",
    "listings.searchPlaceholder": "Titel, Ort, Kategorie suchen",
    "listings.allStatuses": "Alle Status",
    "listings.includeHidden": "Ausgeblendete anzeigen",
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
    "pagination.pageSize": "Pro Seite",
    "pagination.prev": "Zurück",
    "pagination.next": "Weiter",
    "pagination.range": "{start}-{end} / {total}",
    "settings.notifications": "Benachrichtigungen",
    "settings.telegram": "Telegram",
    "settings.botToken": "Bot-Token",
    "settings.chatId": "Chat-ID",
    "settings.webhookUrl": "Webhook-URL",
    "settings.rateLimit": "Globales Rate-Limit in Sekunden",
    "settings.save": "Einstellungen speichern",
    "settings.sendTest": "Test senden",
    "settings.sendWebhookTest": "Webhook-Test senden",
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
    "date.never": "nie",
    "toast.listingHidden": "Listing ausgeblendet",
    "toast.listingSeen": "Listing als gesehen markiert",
    "toast.listingNew": "Listing wieder auf neu gesetzt",
    "toast.watchlistAdded": "Zur Watchlist hinzugefügt",
    "toast.watchlistRemoved": "Aus Watchlist entfernt",
    "toast.passwordMismatch": "Neue Passwörter stimmen nicht überein",
    "toast.passwordChanged": "Passwort geändert",
    "toast.profileSaved": "Profil gespeichert",
    "toast.saveProfileFirst": "Speichere zuerst ein Profil",
    "toast.runStarted": "Run gestartet",
    "toast.runComplete": "Run fertig: {new} neu, {hidden} ausgeblendet, {duplicates} Duplikate",
    "toast.profileDeleted": "Profil gelöscht",
    "toast.searchRequired": "Suchbegriff ist erforderlich",
    "toast.listingTypeRequired": "Wähle mindestens eine Kleinanzeigen-Anzeigenart aus",
    "toast.settingsSaved": "Einstellungen gespeichert",
    "toast.telegramSent": "Telegram-Test gesendet",
    "toast.webhookSent": "Webhook-Test gesendet",
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
  applyTheme();
  bindNavigation();
  bindForms();
  $("#language-select").value = state.language;
  $("#theme-select").value = state.theme;
  syncPageSizeControls();
  applyTranslations();
  setupChipInputs();
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
  $("#theme-select").addEventListener("change", () => setTheme($("#theme-select").value));
  $("#wizard-button").addEventListener("click", () => showWizard(true));
  $("#wizard-cancel-button").addEventListener("click", () => showWizard(false));
  $("#wizard-source").addEventListener("change", updateWizardCategories);
  $("#new-profile-button").addEventListener("click", () => editProfile(null));
  $("#profile-source").addEventListener("change", updateSourcePlaceholder);
  $("#profile-url").addEventListener("change", syncProfileKleinanzeigenTypesFromUrl);
  $("#open-source-button").addEventListener("click", openSelectedSource);
  $$("[data-source-option]").forEach((button) => {
    button.addEventListener("click", () => selectSource(button.dataset.sourceOption));
  });
  $$("input[name='wizard-kleinanzeigen-type']").forEach((input) => {
    input.addEventListener("change", updateKleinanzeigenTypeVisibility);
  });
  $$("input[name='profile-kleinanzeigen-type']").forEach((input) => {
    input.addEventListener("change", () => {
      syncProfileKleinanzeigenTypeUrl();
      updateFilterPreview();
    });
  });
  $("#run-profile-button").addEventListener("click", runSelectedProfile);
  $("#delete-profile-button").addEventListener("click", deleteSelectedProfile);
  $("#listing-status-filter").addEventListener("change", resetListingsPage);
  $("#listing-profile-filter").addEventListener("change", resetListingsPage);
  $("#listing-search-filter").addEventListener("input", debounce(resetListingsPage, 220));
  $("#listing-min-price-filter").addEventListener("input", debounce(resetListingsPage, 220));
  $("#listing-max-price-filter").addEventListener("input", debounce(resetListingsPage, 220));
  $("#listing-sort-filter").addEventListener("change", resetListingsPage);
  $("#include-hidden").addEventListener("change", resetListingsPage);
  $$("[data-listing-view]").forEach((button) => {
    button.addEventListener("click", () => setListingView(button.dataset.listingView));
  });
  $$(".pagination-controls").forEach((control) => {
    const watchlistedOnly = control.id === "watchlist-pagination";
    control.querySelector("[data-page-size]").addEventListener("change", (event) => setPageSize(event.target.value));
    control.querySelector("[data-page-prev]").addEventListener("click", () => changePage(watchlistedOnly, -1));
    control.querySelector("[data-page-next]").addEventListener("click", () => changePage(watchlistedOnly, 1));
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
    "#profile-notify-webhook",
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
  $("#add-filter-rule-button").addEventListener("click", addGuidedFilterRule);
  $("#filter-rule-term").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addGuidedFilterRule();
    }
  });
  $("#telegram-test-button").addEventListener("click", testTelegram);
  $("#webhook-test-button").addEventListener("click", testWebhook);
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

function selectedKleinanzeigenTypes(scope) {
  return $$(`input[name='${scope}-kleinanzeigen-type']:checked`)
    .map((input) => input.value)
    .filter((value) => ["angebote", "gesuche"].includes(value));
}

function setKleinanzeigenTypes(scope, types) {
  const selected = types?.length ? types : ["angebote", "gesuche"];
  $$(`input[name='${scope}-kleinanzeigen-type']`).forEach((input) => {
    input.checked = selected.includes(input.value);
  });
}

function kleinanzeigenTypesFromUrl(url) {
  const value = String(url || "");
  if (value.includes("anzeige:angebote")) return ["angebote"];
  if (value.includes("anzeige:gesuche")) return ["gesuche"];
  return ["angebote", "gesuche"];
}

function kleinanzeigenTypeLabel(types = selectedKleinanzeigenTypes("profile")) {
  const selected = types.length ? types : ["angebote", "gesuche"];
  if (selected.length === 1 && selected[0] === "angebote") return t("listingTypes.offersOnly");
  if (selected.length === 1 && selected[0] === "gesuche") return t("listingTypes.wantedOnly");
  return t("listingTypes.all");
}

function kleinanzeigenTypeSegment(types) {
  return types.length === 1 ? `/anzeige:${types[0]}` : "";
}

function keywordUrlPath(query) {
  return encodeURIComponent(query.trim()).replace(/%20/g, "-");
}

function setKleinanzeigenTypeInUrl(url, types) {
  const raw = String(url || "").trim();
  if (!raw || !raw.includes("kleinanzeigen.de")) return raw;
  const selected = types.length ? types : ["angebote", "gesuche"];
  let next = raw
    .replace(/\/anzeige:(angebote|gesuche)(?=\/|$)/, "")
    .replace(/\/s-anzeige:(angebote|gesuche)(?=\/|$)/, "/s");
  if (next.includes("/s-suchanfrage.html") || selected.length !== 1) return next;
  const type = selected[0];
  if (/\/s-[^/?#]+/.test(next)) return next.replace(/(\/s-[^/?#]+)/, `$1/anzeige:${type}`);
  if (/\/s(?=\/|$)/.test(next)) return next.replace(/\/s(?=\/|$)/, `/s-anzeige:${type}`);
  return next;
}

function updateKleinanzeigenTypeVisibility() {
  const wizardTypes = $("#wizard-kleinanzeigen-types");
  if (wizardTypes) wizardTypes.classList.toggle("hidden", $("#wizard-source").value !== "kleinanzeigen");
  const profileTypes = $("#profile-kleinanzeigen-types");
  if (profileTypes) profileTypes.classList.toggle("hidden", $("#profile-source").value !== "kleinanzeigen");
}

function syncProfileKleinanzeigenTypeUrl() {
  if ($("#profile-source").value !== "kleinanzeigen") return;
  $("#profile-url").value = setKleinanzeigenTypeInUrl($("#profile-url").value, selectedKleinanzeigenTypes("profile"));
}

function syncProfileKleinanzeigenTypesFromUrl() {
  if ($("#profile-source").value !== "kleinanzeigen") return;
  setKleinanzeigenTypes("profile", kleinanzeigenTypesFromUrl($("#profile-url").value));
  updateFilterPreview();
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
  setKleinanzeigenTypes("profile", kleinanzeigenTypesFromUrl(profile?.search_url || ""));
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
  syncAllChipInputs();
  renderGuidedFilterRules();
  $("#profile-enabled").checked = profile?.enabled ?? true;
  $("#profile-notify").checked = profile?.notify_telegram ?? true;
  $("#profile-notify-webhook").checked = profile?.notify_webhook ?? false;
  updateKleinanzeigenTypeVisibility();
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
  const selectedTypes = selectedKleinanzeigenTypes("wizard");
  if (source === "kleinanzeigen" && !selectedTypes.length) return toast(t("toast.listingTypeRequired"));
  $("#profile-id").value = "";
  $("#profile-name").value = category ? `${query} · ${category.label}` : `${query} · ${sourceLabel(source)}`;
  $("#profile-source").value = source;
  $("#profile-url").value = buildWizardSearchUrl(source, query, category, selectedTypes);
  setKleinanzeigenTypes("profile", selectedTypes);
  $("#profile-interval").value = 120;
  $("#profile-location").value = $("#wizard-location").value.trim();
  $("#profile-min-price").value = "";
  $("#profile-max-price").value = $("#wizard-max-price").value;
  $("#profile-include").value = query.split(/\s+/).filter(Boolean).join("\n");
  $("#profile-required").value = $("#wizard-required").value;
  $("#profile-exclude").value = $("#wizard-exclude").value;
  $("#profile-categories").value = "";
  syncAllChipInputs();
  renderGuidedFilterRules();
  $("#profile-enabled").checked = $("#wizard-enabled").checked;
  $("#profile-notify").checked = $("#wizard-notify").checked;
  $("#profile-notify-webhook").checked = $("#wizard-notify-webhook").checked;
  updateSourcePlaceholder();
  updateKleinanzeigenTypeVisibility();
  updateFilterPreview();
  await saveProfile();
  clearWizard();
  $("#profile-wizard").classList.add("hidden");
  $("#profile-form").classList.remove("hidden");
}

function clearWizard() {
  $("#wizard-source").value = "kleinanzeigen";
  updateWizardCategories();
  setKleinanzeigenTypes("wizard", ["angebote", "gesuche"]);
  $("#wizard-query").value = "";
  $("#wizard-max-price").value = "";
  $("#wizard-location").value = "";
  $("#wizard-required").value = "";
  $("#wizard-exclude").value = "";
  syncAllChipInputs();
  $("#wizard-enabled").checked = false;
  $("#wizard-notify").checked = false;
  $("#wizard-notify-webhook").checked = false;
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
  updateKleinanzeigenTypeVisibility();
}

function selectedWizardCategory() {
  const source = $("#wizard-source").value;
  const value = $("#wizard-category").value;
  if (!value) return null;
  return (providerCategories[source] || []).find((category) => (category.id || category.slug) === value) || null;
}

function buildWizardSearchUrl(source, query, category, kleinanzeigenTypes = selectedKleinanzeigenTypes("wizard")) {
  if (source === "facebook") {
    const base = category?.slug
      ? `https://www.facebook.com/marketplace/category/${category.slug}/`
      : "https://www.facebook.com/marketplace/search/";
    return `${base}?query=${encodeURIComponent(query)}`;
  }
  if (source === "kleinanzeigen" && category?.id && category?.path) {
    return `https://www.kleinanzeigen.de/s-${category.path}${kleinanzeigenTypeSegment(kleinanzeigenTypes)}/${keywordUrlPath(query)}/k0c${category.id}`;
  }
  if (source === "kleinanzeigen" && kleinanzeigenTypes.length === 1) {
    return `https://www.kleinanzeigen.de/s-anzeige:${kleinanzeigenTypes[0]}/${keywordUrlPath(query)}/k0`;
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
    notify_webhook: $("#profile-notify-webhook").checked,
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
  if ($("#profile-source").value === "kleinanzeigen") {
    chips.push(`${t("listingTypes.title")}: ${kleinanzeigenTypeLabel()}`);
  }
  lines("#profile-required").forEach((item) => chips.push(`${t("profile.required")}: ${item}`));
  lines("#profile-include").slice(0, 5).forEach((item) => chips.push(`match: ${item}`));
  lines("#profile-exclude").forEach((item) => chips.push(`${t("profile.exclude")}: ${item}`));
  lines("#profile-categories").forEach((item) => chips.push(`${t("profile.hiddenCategories")}: ${item}`));
  chips.push($("#profile-enabled").checked ? t("form.backgroundPolling") : "Polling off");
  chips.push($("#profile-notify").checked ? t("form.telegramNotifications") : "Telegram off");
  chips.push($("#profile-notify-webhook").checked ? t("form.webhookNotifications") : t("jobSummary.webhookOff"));
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
  updateKleinanzeigenTypeVisibility();
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
    $("#profile-source").value === "kleinanzeigen" ? `${t("listingTypes.title")}: ${kleinanzeigenTypeLabel()}` : "",
    url,
    t("jobSummary.interval", { minutes: interval }),
    $("#profile-enabled").checked ? t("jobSummary.pollingOn") : t("jobSummary.pollingOff"),
    $("#profile-notify").checked ? t("jobSummary.telegramOn") : t("jobSummary.telegramOff"),
    $("#profile-notify-webhook").checked ? t("jobSummary.webhookOn") : t("jobSummary.webhookOff"),
  ];
  $("#job-setup-summary").innerHTML = chips.filter(Boolean).map((chip) => `<span>${escapeHtml(chip)}</span>`).join("");
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
  const page = watchlistedOnly ? state.watchlistPage : state.listingPage;
  const pageSize = state.pageSize;
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
  query.set("sort", $("#listing-sort-filter").value);
  query.set("limit", String(pageSize));
  query.set("offset", String(page * pageSize));
  query.set("paged", "true");
  const result = await api(`/api/listings?${query}`);
  const listings = result.items || [];
  const total = result.total || 0;
  const maxPage = Math.max(0, Math.ceil(total / pageSize) - 1);
  if (page > maxPage) {
    if (watchlistedOnly) state.watchlistPage = maxPage;
    else state.listingPage = maxPage;
    return loadListingBrowser(containerSelector, watchlistedOnly);
  }
  browser.classList.toggle("grid-view", state.listingView === "grid");
  browser.classList.toggle("list-view", state.listingView !== "grid");
  updateListingViewButtons();
  updatePaginationControls(watchlistedOnly, total);
  browser.innerHTML = listings.length
    ? listings.map((listing) => listingMarkup(listing)).join("")
    : `<article class="listing-card empty-listing"><strong>${escapeHtml(t(watchlistedOnly ? "empty.noWatchlist" : "empty.noListings"))}</strong><p class="meta">${escapeHtml(t(watchlistedOnly ? "empty.noWatchlistHint" : "empty.noListingsHint"))}</p></article>`;
  browser.querySelectorAll("[data-listing-action]").forEach((button) => {
    button.addEventListener("click", async () => {
      button.disabled = true;
      await api(`/api/listings/${button.dataset.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: button.dataset.listingAction }),
      });
      toast(listingActionToast(button.dataset.listingAction));
      await Promise.all([loadListings(), loadWatchlist(), loadSummary()]);
    });
  });
  browser.querySelectorAll("[data-watchlist-action]").forEach((button) => {
    button.addEventListener("click", async () => {
      button.disabled = true;
      const added = button.dataset.watchlistAction === "add";
      await api(`/api/listings/${button.dataset.id}`, {
        method: "PATCH",
        body: JSON.stringify({ watchlisted: added }),
      });
      toast(t(added ? "toast.watchlistAdded" : "toast.watchlistRemoved"));
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

function resetListingsPage() {
  state.listingPage = 0;
  loadListings();
}

function setPageSize(value) {
  state.pageSize = [5, 10, 20].includes(Number(value)) ? Number(value) : 10;
  localStorage.setItem("marketplacelens.pageSize", String(state.pageSize));
  state.listingPage = 0;
  state.watchlistPage = 0;
  syncPageSizeControls();
  loadListings();
  loadWatchlist();
}

function syncPageSizeControls() {
  $$("[data-page-size]").forEach((select) => {
    select.value = String(state.pageSize);
  });
}

function changePage(watchlistedOnly, direction) {
  if (watchlistedOnly) {
    state.watchlistPage = Math.max(0, state.watchlistPage + direction);
    loadWatchlist();
  } else {
    state.listingPage = Math.max(0, state.listingPage + direction);
    loadListings();
  }
}

function updatePaginationControls(watchlistedOnly, total) {
  const control = $(watchlistedOnly ? "#watchlist-pagination" : "#listings-pagination");
  if (!control) return;
  const page = watchlistedOnly ? state.watchlistPage : state.listingPage;
  const start = total ? page * state.pageSize + 1 : 0;
  const end = Math.min(total, (page + 1) * state.pageSize);
  const maxPage = Math.max(0, Math.ceil(total / state.pageSize) - 1);
  control.querySelector("[data-page-info]").textContent = t("pagination.range", { start, end, total });
  control.querySelector("[data-page-prev]").disabled = page <= 0;
  control.querySelector("[data-page-next]").disabled = page >= maxPage;
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

function listingActionToast(action) {
  if (action === "hidden") return t("toast.listingHidden");
  if (action === "seen") return t("toast.listingSeen");
  if (action === "new") return t("toast.listingNew");
  return statusLabel(action);
}

async function loadSettings() {
  const settings = await api("/api/settings");
  $("#telegram-token").value = settings.telegram_bot_token;
  $("#telegram-chat").value = settings.telegram_chat_id;
  $("#webhook-url").value = settings.webhook_url;
  $("#global-rate").value = settings.global_rate_limit_seconds;
}

async function saveSettings() {
  await api("/api/settings", {
    method: "PUT",
    body: JSON.stringify({
      telegram_bot_token: $("#telegram-token").value,
      telegram_chat_id: $("#telegram-chat").value,
      webhook_url: $("#webhook-url").value,
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

async function testWebhook() {
  await api("/api/settings/webhook/test", { method: "POST" });
  toast(t("toast.webhookSent"));
}

function addGuidedFilterRule() {
  const type = $("#filter-rule-type").value;
  const term = normalizeFilterTerm($("#filter-rule-term").value);
  const selector = {
    include: "#profile-include",
    required: "#profile-required",
    exclude: "#profile-exclude",
  }[type];
  if (!selector || !term) return;
  addListValue($(selector), term);
  $("#filter-rule-term").value = "";
  renderGuidedFilterRules();
  updateFilterPreview();
}

function renderGuidedFilterRules() {
  const target = $("#guided-filter-rules");
  if (!target) return;
  const rules = [
    ...lines("#profile-required").map((term) => ({ type: "required", term })),
    ...lines("#profile-exclude").map((term) => ({ type: "exclude", term })),
    ...lines("#profile-include").map((term) => ({ type: "include", term })),
  ];
  if (!rules.length) {
    target.innerHTML = `<p class="empty-filter-rules">${escapeHtml(t("filter.empty"))}</p>`;
    return;
  }
  target.innerHTML = rules.map((rule) => `
    <article class="guided-filter-rule ${escapeAttribute(rule.type)}">
      <span>${escapeHtml(guidedFilterSentence(rule))}</span>
      <button type="button" data-filter-remove-type="${escapeAttribute(rule.type)}" data-filter-remove-term="${escapeAttribute(rule.term)}" aria-label="${escapeAttribute(t("keyword.remove", { item: rule.term }))}">X</button>
    </article>
  `).join("");
  target.querySelectorAll("[data-filter-remove-type]").forEach((button) => {
    button.addEventListener("click", () => {
      removeListValue($(filterSelector(button.dataset.filterRemoveType)), button.dataset.filterRemoveTerm);
      renderGuidedFilterRules();
      updateFilterPreview();
    });
  });
}

function guidedFilterSentence(rule) {
  return t(`filter.${rule.type}Rule`, { term: rule.term });
}

function filterSelector(type) {
  return {
    include: "#profile-include",
    required: "#profile-required",
    exclude: "#profile-exclude",
  }[type];
}

function normalizeFilterTerm(value) {
  return String(value || "").trim().replace(/^\*+|\*+$/g, "").trim();
}

function setupChipInputs() {
  $$("textarea[data-chip-list]").forEach((textarea) => {
    if (textarea.dataset.chipReady) return;
    textarea.dataset.chipReady = "true";
    textarea.classList.add("chip-source");

    const control = document.createElement("div");
    control.className = "chip-list-control";
    control.innerHTML = `
      <div class="chip-list"></div>
      <input class="chip-list-input" type="text" autocomplete="off">
    `;
    textarea.insertAdjacentElement("afterend", control);

    const input = control.querySelector(".chip-list-input");
    control.addEventListener("click", () => input.focus());
    textarea.addEventListener("input", () => renderChipInput(textarea));
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === "," || event.key === "Tab") {
        if (input.value.trim()) {
          event.preventDefault();
          addChipValues(textarea, input.value);
          input.value = "";
        }
      }
      if (event.key === "Backspace" && !input.value) {
        removeChipValue(textarea, listFromText(textarea.value).at(-1));
      }
    });
    input.addEventListener("paste", () => {
      window.setTimeout(() => {
        if (input.value.includes("\n") || input.value.includes(",")) {
          addChipValues(textarea, input.value);
          input.value = "";
        }
      }, 0);
    });
    input.addEventListener("blur", () => {
      if (input.value.trim()) {
        addChipValues(textarea, input.value);
        input.value = "";
      }
    });
    renderChipInput(textarea);
  });
}

function syncAllChipInputs() {
  $$("textarea[data-chip-list]").forEach(renderChipInput);
}

function renderChipInput(textarea) {
  const control = textarea.nextElementSibling;
  if (!control?.classList.contains("chip-list-control")) return;
  const items = listFromText(textarea.value);
  const list = control.querySelector(".chip-list");
  const input = control.querySelector(".chip-list-input");
  list.innerHTML = items.map((item) => `
    <span class="keyword-chip">
      <span>${escapeHtml(item)}</span>
      <button type="button" data-chip-remove="${escapeAttribute(item)}" aria-label="${escapeAttribute(t("keyword.remove", { item }))}">X</button>
    </span>
  `).join("");
  list.querySelectorAll("[data-chip-remove]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      removeChipValue(textarea, button.dataset.chipRemove);
    });
  });
  input.placeholder = items.length ? "" : t(textarea.dataset.chipPlaceholder || "keyword.add");
}

function addChipValues(textarea, rawValue) {
  addListValue(textarea, rawValue);
}

function addListValue(textarea, rawValue) {
  const current = listFromText(textarea.value);
  const seen = new Set(current.map((item) => item.toLocaleLowerCase()));
  for (const item of listFromText(rawValue)) {
    const key = item.toLocaleLowerCase();
    if (!seen.has(key)) {
      current.push(item);
      seen.add(key);
    }
  }
  textarea.value = current.join("\n");
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
}

function removeChipValue(textarea, item) {
  removeListValue(textarea, item);
}

function removeListValue(textarea, item) {
  if (!item) return;
  textarea.value = listFromText(textarea.value).filter((value) => value !== item).join("\n");
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
}

function listFromText(value) {
  return String(value || "").split(/\n|,/).map((item) => item.trim()).filter(Boolean);
}

function lines(selector) {
  return listFromText($(selector).value);
}

function numberOrNull(selector) {
  const value = $(selector).value;
  return value === "" ? null : Number(value);
}

function formatDate(value) {
  if (!value) return t("date.never");
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return t("date.never");
  const locale = state.language === "de" ? "de-DE" : "en-US";
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: state.language !== "de",
  }).format(date);
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

function setTheme(theme) {
  state.theme = theme === "dark" ? "dark" : "light";
  localStorage.setItem("marketplacelens.theme", state.theme);
  applyTheme();
}

function applyTheme() {
  document.body.dataset.theme = state.theme === "dark" ? "dark" : "light";
  document.documentElement.style.colorScheme = state.theme === "dark" ? "dark" : "light";
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
  syncAllChipInputs();
  renderGuidedFilterRules();
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
