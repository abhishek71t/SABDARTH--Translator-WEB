# Implementation Plan - Shabdarth: Smart Hindi Meaning & Language Assistant (Web Edition)

Shabdarth is a modern, high-performance web application designed to help Hindi readers, students, and language enthusiasts understand complex Devanagari words and sentences. It translates complex or literary Hindi into clear, everyday सरल हिंदी (simple Hindi) with synonyms, English reference meanings, and usage examples, while seamlessly supporting Hinglish (Romanized Hindi) and Urdu script normalization, phonetic typing, audio pronunciation, and dark/night light modes.

---

## 1. User Decisions & Confirmed Requirements
Based on user feedback:
- **Display Modes**: Standard Dark / Light mode toggle plus a warm Night Light (amber eye-care comfort) toggle option.
- **Companion Features**: Word of the Day (आज का शब्द) with daily vocabulary gems, Web Speech Audio Pronunciation (TTS) for Devanagari words and sentences, and persistent LocalStorage Search History with instant re-query and clear actions.
- **Hindi Typing Support**: Phonetic Hinglish conversion, real-time debounced suggestions dropdown (300-400ms debounce), and a toggleable on-screen Hindi Devanagari virtual keyboard.
- **Backend & AI Architecture**: Express server with server-side Gemini API (`@google/genai` or client-fallback proxy) handling translation, simplification, Hinglish normalization, and phrase suggestions, with bundled local offline dictionary entries for instant zero-latency responses for common queries.

---

## 2. Architecture & Tech Stack

### Frontend Architecture
- **Framework**: React 19 + TypeScript + Vite.
- **Styling**: Tailwind CSS v4 with custom warm saffron/ochre themes, dark theme, and night-light amber filter overlay.
- **Icons & Motion**: Lucide React icons & Motion for smooth animated transitions, expandable cards, and keyboard docks.
- **Text-to-Speech (TTS)**: Web Speech Synthesis API (`window.speechSynthesis`) tuned specifically for Hindi (`hi-IN`) and English voice tags.

### Backend & AI Architecture
- **Server**: Express server (`server.ts`) with Vite middleware integration.
- **Endpoints**:
  - `POST /api/translate`: Accepts `{ input: string }`, returns structured JSON:
    - For words: `original`, `normalized`, `detectedLanguage`, `simpleHindi`, `synonyms`, `englishMeanings`, `exampleSentence`, `wordType`.
    - For sentences: `originalSentence`, `simpleHindi`, `keyWords` (array of `{ word, meaning }`), `english`.
  - `POST /api/suggest`: Accepts `{ input: string }`, returns `{ suggestions: string[] }` (3-5 phrase completions).
  - `GET /api/word-of-the-day`: Returns daily curated word with literary and everyday examples.
- **AI Model**: Google Gemini (`gemini-2.5-flash`) structured JSON output via `@google/genai`, paired with an extensive in-memory dictionary for high-frequency Hindi words (दुरुह, संबल, वक्तव्य, इत्यादि).

---

## 3. Step-by-Step Implementation Tasks

### Task 1: Environment & Express Server Setup
- Update `package.json` with `"dev": "tsx server.ts"` and `"start": "node dist/server.js"`.
- Create `server.ts` implementing Express API routes (`/api/translate`, `/api/suggest`, `/api/word-of-the-day`) with Gemini integration and local fallback dictionary.
- Sync `metadata.json` and `index.html` with title "Shabdarth – Smart Hindi Meaning & Language Assistant", Hindi font links (Google Fonts Noto Sans Devanagari and Poppins), and meta tags.

### Task 2: Core Data, Dictionary & Utilities
- Create `src/data/dictionary.ts`: Pre-seeded dictionary of ~60 common/literary Hindi words and daily words for instant lookups without network delay.
- Create `src/utils/transliteration.ts`: Lightweight phonetic transliteration mapping common Romanized sounds (e.g., *namaste*, *duruuh*, *kitab*) to Devanagari for real-time typing assistance.
- Create `src/utils/speech.ts`: Hindi Web Speech Synthesis helper with voice selection, pitch, rate control, and fallback feedback.
- Create `src/types/shabdarth.ts`: Strict TypeScript interfaces for word translations, sentence analyses, suggestions, and history entries.

### Task 3: Theme & Night Light Engine
- Create `src/context/ThemeContext.tsx`:
  - Light mode (clean paper cream `#FBFBFD` with warm saffron `#D95D1E`).
  - Dark mode (deep slate `#111827` / `#1E293B`).
  - Night Light toggle (adjustable warm amber overlay reducing blue light fatigue during evening reading).

### Task 4: Interactive Components
- **Header & Controls**: Brand badge, Dark/Light mode toggle, Night Light toggle, and On-Screen Keyboard launcher.
- **Translate Hero Input**:
  - Auto-resizing textarea with clear button and script detector badge (Hindi / Hinglish / Urdu / English).
  - Real-time debounced suggestions popup (300ms) with keyboard navigation and click-to-fill.
  - Quick action chips for sample words/sentences (e.g., *दुरुह*, *उसका वक्तव्य अत्यंत प्रभावशाली था*, *kathin*, *مشکل*).
- **On-Screen Devanagari Keyboard**:
  - Categorized virtual keyboard (Swar/Vowels, Vyanjan/Consonants, Matras, Halant, Numerals).
  - Insert character at cursor position with click feedback.
- **Structured Result Display**:
  - Word card: Big Devanagari title, badge with detected language, सरल हिंदी headline card, clickable synonym pills, English reference badges, and contextual example sentence.
  - Sentence card: Original vs सरल हिंदी translation card, plus interactive table of parsed difficult terms with individual meanings.
  - Actions: TTS Audio button with playing pulse animation, Copy to Clipboard with toast indicator, and Web Share API.
- **Companion Hub (Word of the Day & History)**:
  - "आज का शब्द" (Word of the Day) banner with rich literary depth and audio.
  - Search History list with timestamps, one-tap re-run, and clear history.

### Task 5: Testing, Linting & Verification
- Run `lint_applet` and `compile_applet`.
- Verify dark/light toggle and night-light mode visual fidelity.
- Test Hinglish, Devanagari, Urdu, and English sentence queries.
- Verify audio speech playback and debounced autocomplete suggestions.

---

## 4. Verification Checklist
- [ ] Responsive web layout (mobile, tablet, desktop) without Android-specific artifacts.
- [ ] Dark / Light mode toggle + Night Light warmth filter.
- [ ] Hinglish / Urdu script detection and Devanagari normalization.
- [ ] Word meanings (सरल हिंदी, synonyms, English, example) and sentence breakdowns.
- [ ] Debounced real-time suggestions dropdown.
- [ ] On-screen Hindi virtual keyboard.
- [ ] Web Speech API pronunciation.
- [ ] Word of the Day & LocalStorage history.
- [ ] Clean build and error-free execution.
