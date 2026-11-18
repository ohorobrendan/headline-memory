# Research notes and source audit

## Research question
Does seeing an original, potentially misleading or overstated headline, compared with a more precise headline above the same brief, increase later selection of answers consistent with the headline but unsupported by the article?

This is a classroom pilot of headline framing and recognition after a short delay. Do not label every error a false memory or conclude that one person's score proves misinformation changed memory.

## Design
Between-participant 50/50 random assignment:
- **original**: original published headlines quoted in `content.js`.
- **precise**: alternative headlines authored for this experiment that state the animal-study or observational limitation.

All three story bodies are identical between conditions. Story, question, and option orders are randomized. Minimum headline preview is 4 active seconds, followed by self-paced reading (15 active seconds minimum per brief). A 60-second subtraction task follows all three stories. The quiz contains two headline-sensitive questions and one body-detail question per story, for nine questions total. Confidence is required on each answer; no correctness feedback appears until the end.

No headline-only pretest is included, because it would rehearse the lure and may change later encoding. The design measures delayed answer choices, rather than a direct within-person difference between headline-only and article responses.

## Predefined outcomes
Primary outcome: each participant's number of `selected_option=lure` responses on the six target questions, divided by six.

Secondary: target accuracy out of six, detail accuracy out of three, mean confidence, and active reading/response times. “Do not remember” and other distractor choices are separate from headline-consistent errors. Only `selected_option=fact` is correct. Letter positions change and should never be used to score answers.

Compare participant-level means across conditions, with group sizes and uncertainty. Do not treat the six target rows from each participant as independent people. Inspect attention/reading indicators using rules you decide before analyzing results; the app does not silently exclude people for slow or incorrect responses. The in-app chart is descriptive and does not perform a significance test.

## Real reports and adaptations
These are **historical real reports, not fabricated news events**. All bodies are original condensed paraphrases that combine reported details with source research or a university clarification. They are **not full original publisher articles**. This choice standardizes reading length and avoids reproducing copyrighted full text. Original publisher/report and research links are provided after the quiz and in the researcher workspace.

The precise condition uses experiment-written headlines; it must not be represented as text originally published by the outlets. Original headline qualifiers such as “could” remain intact. A headline lure is an anticipated inference or overstatement, not necessarily a verbatim claim in that headline.

### Wine and exercise
The quoted HuffPost UK headline is preserved in a university-hosted PDF archive of the report. That copy shows July 23, 2015 and an update on January 8, 2017; other archived references show inconsistent dates, so the participant display says “Archived 2015 report.” The report's exercise-equivalence claim is contrasted with the isolated-compound rat study and the university's January 30, 2015 clarification. This brief deliberately includes that correction; it is not a transcription of the original HuffPost body.

- Archived report: https://st551.cwick.co.nz/lecture/lecture_2_articles.pdf
- University clarification: https://www.ualberta.ca/en/medicine/news/2015/january/resveratrol.html
- Dolinsky et al. (2012), The Journal of Physiology, 590(11), 2783–2799. DOI: https://doi.org/10.1113/jphysiol.2012.230490
- Full research: https://pmc.ncbi.nlm.nih.gov/articles/PMC3424731/

Targets: whether a glass of wine was demonstrated to replace exercise; whether the treatment was ordinary wine or resveratrol. Detail: the 12-week training program. Article-based answers: no demonstrated workout replacement; resveratrol; 12 weeks.

### Champagne and memory
The Independent's November 9, 2015 headline discusses possible Alzheimer's risk reduction. Its body explicitly reports rats and cautions against a clinical recommendation. The original 2013 paper reports a six-week intervention and spatial working-memory improvement in aged rodents. Neither establishes dementia prevention in humans.

- Original report: https://www.the-independent.com/life-style/health-and-families/health-news/preventing-dementia-three-glasses-of-champagne-could-cut-risk-of-developing-alzheimer-s-but-why-stop-there-a6727486.html
- Corona et al. (2013), Antioxidants & Redox Signaling, 19(14), 1676–1689. DOI: https://doi.org/10.1089/ars.2012.5142
- Research record: https://pubmed.ncbi.nlm.nih.gov/23458470/

Targets: rats vs. humans; whether human Alzheimer's prevention was established. Detail: the 2013 research year versus renewed 2015 coverage. Article-based answers: rats; no established human prevention; 2013.

### Coffee and mortality
Imperial College London's July 2017 news headline uses causal wording. The underlying multinational cohort and the news body's own caveat describe observational research. The brief includes 521,330 adults over 35, 10 European countries, roughly 16 years of follow-up, statistical adjustment, and no basis for changing intake on the strength of the study.

- Original news report: https://www.imperial.ac.uk/news/180494/drinking-coffee-reduces-risk-death-from/amp/
- Gunter et al. (2017), Annals of Internal Medicine, 167(4), 236–247. DOI: https://doi.org/10.7326/M16-2945
- University research record: https://spiral.imperial.ac.uk/entities/publication/b11248e3-0900-4b6d-a427-0fe717299b76

Targets: association vs. causation; whether researchers recommended increasing intake. Detail: 10 countries. Article-based answers: association without established causation; no intake-change recommendation; 10.

## Psychological evidence
Ecker, U. K. H., Lewandowsky, S., Chang, E. P., & Pillai, R. (2014). The effects of subtle misinformation in news headlines. Journal of Experimental Psychology: Applied, 20(4), 323–335. https://doi.org/10.1037/xap0000028

Verified author/institution record: https://research-information.bris.ac.uk/en/publications/the-effects-of-subtle-misinformation-in-news-headlines/

The paper examines effects of misleading headlines on memory and reasoning. It motivates this app's question; it does not validate this new task or guarantee that the three selected items will produce an effect.

## Limits to explain in your presentation
- The two headline sets differ in length and explicit caveats. Any difference may reflect additional accurate information in the precise headline, attention, or framing, alongside misinformation.
- Every participant sees only three stories, all related to science/health, with two about alcohol. Item effects and topic overlap limit generalization.
- Multiple-choice recognition after one minute is not long-term free recall. The task does not isolate source confusion or prove a memory was altered.
- Asking for article-based answers may encourage critical reading. The correct alternatives sometimes contain more qualification; a usability pilot should assess readability and whether questions are too easy.
- Familiarity with these older stories is not separately measured. If important, add a post-quiz familiarity item before the study begins, then increment the data version.
- Chance assignment can create unequal small groups. The workspace reports actual group sizes.
- Source links and the answer key are withheld until debrief; the researcher workspace gives a spoiler notice before entry, but it is not access-controlled.
- This is a prototype consent screen, not institutional research approval. Match recruitment, consent and collection to your instructor's requirements before recruitment.

## Pilot checklist
1. Have teammates complete one session each on desktop and phone; inspect reading and question clarity.
2. Verify both conditions appear across fresh sessions and that all three stories are encountered before the quiz.
3. Export responses and summary; verify nine rows versus one, option IDs and headline assignment, and a chart that matches the answers.
4. Configure the class-approved DataPipe experiment and verify a pilot file arrives, including queued/delivery handling.
5. Freeze stimuli, timing and the primary outcome before collecting the evaluation sample. Keep participant files outside the public repository.

Official DataPipe API reference, verified November 18, 2026: https://pipe.jspsych.org/docs/api
