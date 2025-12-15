# Untitled Journal

> "The mirror must not speak first. The user writes. The app only reflects what is already there."

A quiet, minimalist journaling application that resists the urge to "optimize" the user. It offers no streaks, no advice, no mood tracking, and no gamification. It exists solely to accumulate evidence of existence over time.

## Core Philosophy

*   **Non-judgmental by design:** No "good" or "bad" entries. No progress metrics.
*   **No Intervention:** The app never suggests actions, reframes thoughts, or offers psychological interpretation.
*   **Time-based restraint:** The "Mirror" (AI analysis) only reveals itself after sufficient data has been collected.
*   **Privacy:** All data is stored locally in your browser. Data is only sent to the AI API when you explicitly request a reflection.

## Features

*   **Minimalist Entry:** A distraction-free interface with optional, soft writing prompts.
*   **Vague Time:** Time is rendered relatively ("Earlier", "Some time ago", "A long time ago") rather than precise timestamps, reducing urgency.
*   **The Mirror:** Powered by **Google Gemini 2.5**, this feature analyzes your entries to find subtle patterns. It does not give answers; it asks deep, existential questions based on your lexical habits.
*   **Data Sovereignty:** 
    *   Full JSON Export/Import.
    *   "Forget Everything" button (Instant local wipe).
    *   No login required.

## Tech Stack

*   **Frontend:** React 19, TypeScript
*   **Styling:** Tailwind CSS (configured for a monochrome, paper-like aesthetic)
*   **Icons:** Lucide React
*   **AI:** @google/genai SDK (Gemini 2.5 Flash)
*   **Storage:** Browser LocalStorage

## Setup & Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/untitled-journal.git
    cd untitled-journal
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure API Key**
    Create a `.env` file in the root directory. You will need a Google Gemini API key.
    ```env
    API_KEY=your_google_genai_api_key_here
    ```

4.  **Run the application**
    ```bash
    npm start
    # or
    npm run dev
    ```

## Developer Tools

Because the "Mirror" feature is designed to unlock slowly (after 30 entries), the application includes a **Developer Tools** section in the Settings menu.

*   **Generate Entries:** Injects 50 synthetic entries spread over the last 3 months. This allows you to immediately test the "Evidence" feed and the AI Reflection generation without waiting months to accumulate real data.

## The Mirror (Prompt Engineering)

The AI is specifically prompted *not* to act like a therapist. It is instructed to avoid words like "healing," "coping," or "process." Instead, it looks for:
*   Lexical patterns (words used only in winter, or only at night).
*   Structural habits (stopping mid-sentence).
*   The "unsaid" (describing noise but ignoring silence).

It returns 3 open-ended inquiries designed to provoke thought, not provide closure.

## License

MIT
