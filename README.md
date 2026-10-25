# TRINETRA — AI-Powered Women's Safety Intelligence

> **“See the Signs. Protect the Silent.”**

TRINETRA is a privacy-conscious, multilingual women's safety platform designed for India. It unifies confidential domestic abuse reporting, workplace sexual harassment POSH guidance, explainable AI-assisted pattern detection, and cryptographically verifiable tamper-evident case tracking.

---

## Brand & Visual Identity
- **Logo:** The official TRINETRA geometric three-eye and shield insignia is prominently integrated across the Navbar, Hero emblem, Floating SAATHI launcher, and Footer.
- **Background & Palette:** The root website background uses the warm ivory/cream background sampled directly from the brand insignia (`#FEF7ED`), paired with deep midnight navy (`#1E1B4B`), electric violet (`#6D28D9`), protective teal (`#0D9488`), and emergency crimson (`#E11D48`).

---

## Core Modules & Features

### 1. SafeReach — Domestic Abuse & Personal Safety Reporting
- Sensitive reporting workflow for domestic abuse, coercive control, stalking, and public transit harassment.
- **Privacy Modes:** Choose between **Anonymous Mode** (zero personal identity or IP recorded) and **Confidential Mode** (safe follow-up via encrypted contact channel).
- Approximate location by default (broad regional zones and approximate corridors) to prevent pinpointing survivor residences.
- Generates a private cryptographic **Case Reference** (e.g. `TRN-2026-SR-9182`).
- Prominently surfaces verified 24x7 India helplines: **112** (National Emergency) and **181** (Women Helpline).

### 2. SpeakUp — Workplace Harassment & POSH Legal Guidance
- Dedicated module for Indian workplaces, corporate campuses, and informal sectors.
- Clearly distinguishes between **Informal Concern Reporting** (for pattern detection and advisory support) and a **Formal Statutory POSH Complaint** before an employer's Internal Committee (IC) or District Local Committee (LC) under India's POSH Act 2013.
- Clarifies that formal inquiries legally require a designated written complaint and cannot guarantee total anonymity during cross-examination.
- Documents retaliation threats and tracks 90-day inquiry timelines.

### 3. PatternWatch — Explainable AI Safety Pattern Detection
- Correlates signals across anonymized reports to identify recurring predatory patterns (e.g. transit corridors, repeated vehicle descriptions, evening transit time clusters).
- **Zero Black-Box:** The "Explain This Pattern" drawer exposes exact confidence drivers and matching factors.
- **Privacy Constitution:** A pattern is not proof of misconduct; no individual names are ever published or ranked.
- Human-in-the-loop triage allows authorized reviewers to verify or dismiss false matches with an auditable reason.

### 4. TrustTrack — Accountable Case Tracking & SHA-256 Ledger
- Search and monitor case progression using only your private Case Reference code without passwords.
- **Cryptographic Hash Chain:** Every report creation and reviewer status update is chained to the previous block via SHA-256 (`canonicalPayload + previousHash = currentHash`).
- Live in-browser and server-side verification checks whether any tampering occurred.

### 5. TRINETRA SAATHI — Multilingual AI & Voice Companion
- **“Your Language. Your Voice. Your Safety.”**
- Floating, accessible AI assistant powered by Gemini 3.8 (`gemini-3.8-flash`) via `@google/genai` on the server, with expert safety rule fallbacks.
- **Voice Input:** Web Speech Recognition API with editable real-time transcripts.
- **Voice Output:** SpeechSynthesis with native Indian voice selection and play/stop controls.
- **Crisis Triage:** Detects imminent physical danger triggers and immediately surfaces 112 & 181.

### 6. 14 Indian Regional Languages
Complete interface and assistant translation across:
1. English (`en`)
2. ಕನ್ನಡ — Kannada (`kn`)
3. हिन्दी — Hindi (`hi`)
4. తెలుగు — Telugu (`te`)
5. தமிழ் — Tamil (`ta`)
6. മലയാളം — Malayalam (`ml`)
7. मराठी — Marathi (`mr`)
8. বাংলা — Bengali (`bn`)
9. ગુજરાતી — Gujarati (`gu`)
10. ਪੰਜਾਬੀ — Punjabi (`pa`)
11. ଓଡ଼ିଆ — Odia (`or`)
12. اردو — Urdu (`ur` with RTL support)
13. অসমীয়া — Assamese (`as`)
14. संस्कृतम् — Sanskrit (`sa`)

### 7. Quick Exit & Monitored Device Safety
- Header button and keyboard `Escape` shortcut to immediately redirect to Google Weather.
- Transparent disclaimer reminding users that Quick Exit does not clear browser history on monitored phones.

---

## Demo Mode for Hackathon Judges
- Use the **Demo Role Switcher** in the top navigation bar to toggle between:
  - **Reporter:** File reports in SafeReach or SpeakUp and track them in TrustTrack.
  - **Reviewer:** Triage active reports, update statuses, add reviewer notes, and dismiss false patterns.
  - **Admin:** Full audit oversight.
