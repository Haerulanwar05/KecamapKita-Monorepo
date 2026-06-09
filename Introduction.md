# Comprehensive System Architecture & Engineering Prompt: Project "KecamapKita"

You are a Senior Full-Stack Software Architect and DevOps Engineer. Your primary task is to completely implement the full-stack system architecture migration for "KecamapKita"—a micro-community tourism application featuring weather-adaptive algorithms, spatial geofencing, and gamified RPG systems.

You have full workspace file-writing permissions. You must scaffold, write, and execute the entire codebase across the workspace directory structure.

---

## 0. MANDATORY CORE REFERENCE CONTRACT

- **Primary Source of Truth:** You MUST open, parse, and analyze the existing mockup file named `elegant_kecamapkita_prototype_3.html` located in your workspace.
- Do not invent, substitute, or hallucinate any data structure, text label, or numerical metric. Every single variable, sub-district boundary context, destination coordinate, facility array, and UI vibe state must be anchored directly to what is written in `elegant_kecamapkita_prototype_3.html`.

### Exact Taxonomy & Rules to Extract from the HTML File:

1. **Target Sub-districts (`mockKecamatan`):** Menteng, Jatinangor, Ubud, Cilandak.
2. **Vibe Categories:** syahdu, kenyang, kreatif, sejarah.
3. **Gamified RPG Level System:**
   - Every valid check-in operation yields exactly +150 XP.
   - **Level 1 (0-149 XP):** 🥚 Pendatang Baru
   - **Level 2 (150-299 XP):** 🐣 Langkah Pertama
   - **Level 3 (300-599 XP):** 🚶🏽‍♂️ Penjelajah Santai
   - **Level 4 (600-1199 XP):** 🎯 Pencari Harmoni
   - **Level 5 (1200+ XP):** 👑 Kecamap Overlord

---

## 1. Phase 1: Spatial Backend & Database Seeding (FastAPI + PostGIS)

Scaffold the backend architecture inside the `kecamapkita-backend/` directory using modern, fully asynchronous Python 3.12 code. Load environment secrets safely from the local `.env` file.

### A. Database Layer (`database.py`, `models.py`)

- Set up an asynchronous SQLAlchemy database engine using `async_engine`.
- Create tables with explicit schema mappings:
  1. `users`: UUID primary key, indexed unique strings for `username` and `email`, `hashed_password`, `display_name`, `avatar` (string emoji container defaulting to '🤠'), `total_xp` (int, default 0), `level` (int, default 1).
  2. `kecamatan`: Integer primary key, unique name check, and a PostGIS `Geometry(Polygon, 4326)` column named `geom` to store geographic boundary coordinate vertex polygons.
  3. `spots`: Integer primary key, string properties matching the layout fields in the HTML file (name, description, image_url, hours, price, best_time, vibe, type). Store crowdedness data fields as separate integer metrics (`crowdedness_pagi`, `crowdedness_siang`, `crowdedness_sore`, `crowdedness_malam`). Store location coordinate vectors inside a PostGIS `Geometry(Point, 4326)` column named `geom`.
  4. `checkins`: UUID primary key, foreign key links to `users` (nullable to allow temporary anonymous logs) and `spots` (non-nullable), timestamped via `visited_at`.

### B. Database Seeding Script (`seed.py`)

- Write an automation script that reads `elegant_kecamapkita_prototype_3.html` to parse and extract the mock datasets.
- Inject the precise geographic polygon mock vertices for Menteng, Jatinangor, Ubud, and Cilandak.
- Populate the database tables with the actual coordinates, facility arrays, descriptions, and crowdedness statistics of all 6 core destinations (including Taman Suropati, Nasi Uduk Gondangdia, Teras Sawah Tegalalang, etc.) specified inside the script tags of the HTML file.

### C. Core API Routers (`main.py`, `schemas.py`)

Implement full asynchronous routes using Pydantic data validation contracts:

1. `GET /api/spots`: Accepts float queries (`lat`, `lng`), `vibe`, and string `weather_state`. Use a native PostGIS query via `ST_Contains` on the client's point coordinate array against the sub-district polygon geometries to detect the current area. Apply weather-adaptive sorting: if `weather_state == "rain"`, bubble up `type == "indoor"` assets first and attach rainproof UI advising labels.
2. `POST /api/spots/{id}/checkin`: Requires an authorized JWT token bearer header. Extract input client coordinates. Execute an `ST_Distance` calculation in meters against the spot's target coordinates point. If the client is farther than 100 meters, throw an HTTP 400 rejection error. If verified, append the check-in record, increment user account `total_xp` by +150, recalculate level changes, and return an updated progression structure payload featuring `level_up: true/false`.
3. `POST /api/ai/chat`: Bridge user text input requests against the Google GenAI `google-generativeai` client package using the Gemini 1.5 Flash model architecture. Inject a customized system context wrapper converting the AI instance into **"Pak RT"** (the friendly local neighborhood chief). Programmatically parse the active sub-district geolocation string and Weatherstack data inputs to tailor recommendations (e.g., matching local Indonesian dialects, warning users about current rain vs sunshine parameters).

---

## 2. Phase 2: Web Client Frontend Migration (Next.js App Router)

Scaffold the client platform in `kecamapkita-frontend/` using modern web frameworks.

- Translate the exact HTML layout structure, responsive designs, card patterns, and structural states of `elegant_kecamapkita_prototype_3.html` into reactive modular components styled with Tailwind CSS wrappers.
- Implement **Zustand** as the core client state manager to track synchronous operational parameters: `currentUser`, anonymous sync backlogs (`guestHistory`), `activeWeather`, and `activeVibe`.
- Replicate the custom dark mode tracking layer to neutralize flash of unstyled content issues on page loads.
- Integrate an automatic data merging hook: upon user authentication event (login/registration), execute a batch post query pushing local `guestHistory` records to synchronize with cloud database profiles.

---

## 3. Phase 3: Native Mobile Build Setup (React Native via Expo)

Scaffold the primary user mobile client runtime environment inside `kecamapkita-mobile/`.

- Port the main application layout feed, the gamified adventure statistics panel, and Pak RT's AI chat container from the HTML reference file into responsive native mobile elements.
- Swap basic browser scroll wrappers for highly optimized native window rendering containers like `<FlatList>` to maximize frames-per-second performance metrics on hardware devices.
- Integrate `expo-location` hooks to automate native hardware device GPS coordinate polling operations.
- Integrate `expo-secure-store` to cache and secure authenticated JWT user credentials locally.
- Transform the HTML canvas simulation script execution layer into a native experience: use `react-native-confetti-cannon` to trigger a hardware-accelerated celebration particle effect when a check-in event yields a `level_up: true` backend response flag.
- Map native deep-linking schema structures into the navigation button interface to bypass browser redirections when executing external directions routing commands:
  - Android intent URI protocol: `geo:lat,lng?q=DestinationName`
  - iOS Maps schema protocol: `maps://app?daddr=lat,lng`

---

## 4. Phase 4: Release Pipelines Automation (GitHub Releases & Play Store Manifests)

Generate all automated deployment files, configuration codeblocks, and administrative release assets.

### A. GitHub Releases Standalone Build Engine Configuration

- Write a valid production profile structure for Expo Application Services inside `eas.json`.
- Configure the native compilation profile target properties to output a **standalone, self-contained Android Package File (`.apk`)** instead of an App Bundle format to facilitate direct, free distribution down to user hardware devices from the GitHub Releases web interface.

```json
{
  "build": {
    "production_apk": {
      "android": {
        "buildType": "apk"
      },
      "releaseChannel": "production"
    }
  }
}
```

### B. Google Play Store Store-Listing Manifest Preparation

- Write an extensive configuration manifest inside `app.json` allocating a reverse-domain Android package bundle path configuration identifier (`com.haerul.kecamapkita`).
- Explicitly declare the hardware access permissions array within the manifest to satisfy security audits (`ACCESS_COARSE_LOCATION`, `ACCESS_FINE_LOCATION`).
- Generate a generic, compliant `PRIVACY_POLICY.md` file addressing the collection, usage boundaries, and non-retention policies of hardware geolocation metrics to ensure passing Google Play automated compliance verification audits.
- Output a comprehensive, sequential shell-script playbook outlining terminal deployment invocation commands (`eas build --platform android --profile production_apk`) and a checklist to configure Google Console Closed Testing tracks (mandating 20 unique active testers for 14 continuous deployment days).

Go ahead and generate all file assets sequentially. Ensure that all generated files are written cleanly without cutting off code structures.
