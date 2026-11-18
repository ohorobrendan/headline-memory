# Between the Lines

A static HTML/CSS/JavaScript classroom experiment on headline framing and later article-based recognition. Built for the PSYC 402 Memory & Cognition project and the same GitHub Pages workflow used in the earlier encoding demo.

## Run
Open `dist/index.html` in a modern browser, or serve `dist/` with any static server. No build, database, dependency installation, or API key is required. The downloaded GitHub package places these six web files under `website/`.

## Publish on GitHub Pages
1. Make a new public repository named `headline-memory` (keep the earlier encoding demo separately).
2. Upload the **contents** of `website/` from the zip directly into the repository root: `index.html`, `styles.css`, `script.js`, `content.js`, `config.js`, `icon.svg`. `.nojekyll` is also included.
3. Commit with `Add headline memory experiment`.
4. Settings → Pages → Deploy from a branch → `main` → `/(root)` → Save.
5. Open the link GitHub shows. Hard-refresh after later edits if a cached version appears.
6. Settings → Collaborators → add your teammates and Dr. Onyper (`sonyper`). Inviting collaborators remains a project-team step.

This deliverable also has an owner-private working preview. It has not been uploaded into your GitHub account or published on GitHub Pages.

## Flow
Voluntary participation screen → randomized headline condition (original vs. precise) → three randomized stories → 60 seconds of active-tab subtraction → nine randomized multiple-choice questions, each with confidence → scores, explanations, sources, CSV downloads.

Each story first displays its headline for at least four active seconds. The brief then appears **under the same headline**. Continue becomes available after 15 active seconds, but reading is self-paced. All three stories precede the quiz. Feedback is withheld until all nine responses are saved.

## Data collection
`config.js` starts with an empty `dataPipeExperimentId`, so this is **local demo mode**. Anonymous responses are kept in sessionStorage in the same tab; no participant responses are sent over the network in demo mode. Closing the tab can remove its data. CSV download is always available after completion.

To enable the class workflow, create your approved experiment at https://pipe.jspsych.org/, copy its public experiment ID into `config.js`, deploy the edit, and submit a pilot. There is no secret API key to add. Do not add participant names or emails. Verify consent/recruitment wording with the instructor before recruitment; collect research-credit details separately. The app has no automatic subject-credit flow.

Configured collection shows a **Submit anonymous responses** button after completion. The request sends the nine-row response CSV to the official `/api/data/` endpoint. 201 means stored; 202 means accepted/queued and must not be resubmitted. Network/5xx failures are marked uncertain; inspect the dashboard before another attempt. These API response branches were checked with mocks; a live submission requires your real experiment ID and has not been performed.

Exports:
- `*-responses.csv`: nine rows, one per question; repeats session metadata and reading times to simplify analysis.
- `*-summary.csv`: one row with score totals and session measures.

Only the responses CSV is submitted through DataPipe. The researcher workspace imports complete response CSVs and displays participant-level mean headline-lure percentages and accuracy for each condition. It ignores duplicates and excludes conflicting, incomplete, or incompatible sessions. It does not upload imported files. Never put behavioral datasets in the public GitHub repository.

## Files
- `index.html`: document shell and exit dialog
- `styles.css`: responsive editorial design; Google Fonts are optional, with local font fallbacks
- `content.js`: three sourced brief adaptations, two headlines each, and nine questions
- `config.js`: timing, version, DataPipe experiment ID
- `script.js`: randomization, timing, task flow, scoring, debrief, export, upload, and CSV analysis
- `RESEARCH_NOTES.md`: design rationale, source verification, limitations, and pilot plan

## Timing and reproducibility
Each session gets a cryptographically random UUID and a 50/50 between-participant headline assignment. Story order, question order, and answer positions are independently randomized and exported. Assignment is probabilistic rather than balanced across devices. Active timing pauses when the tab is hidden or the exit dialog is open. Resume status and tab-away measures are recorded. Retesting can produce practice effects; each person should contribute one study session.

## Validation
JavaScript syntax checks; programmatic complete-quiz scoring, all-lure scoring, answer mappings, CSV escaping/roundtrip, duplicate/conflict/incomplete import, timer hidden-tab pause, stored-session handling, and mocked DataPipe response branches. Browser walkthrough checks the actual reveal, progression, number task, quiz, and debrief. No actual participant dataset is bundled.
