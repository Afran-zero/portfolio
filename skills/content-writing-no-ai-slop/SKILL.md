---
name: content-writing-no-ai-slop
description: Voice, anti-template, and "no AI slop" rules for the Kaif portfolio. Load when writing or editing any copy — hero, about, project descriptions, research pages, navigation labels, button text, OG descriptions, README. Ban-hammer for filler, hedges, clichés, and AI tells.
---

# Content Writing — No AI Slop

This skill is the writing standard for the Kaif portfolio. The portfolio's content is the **product** as much as the code is. If the words read like an LLM hallucinated them, the whole site reads like a template. We do not ship templates.

Load this skill when:

- Writing or editing any visible copy (headlines, body, captions).
- Writing or editing project case studies.
- Writing or editing research pages or publication descriptions.
- Writing or editing metadata (titles, descriptions, OG text).
- Writing or editing the README or any commit messages.
- Reviewing a PR that touches text content.

The full design rules live in `PLAN.md`; this skill is the **editorial policy**.

---

## 1. Voice (what we're aiming for)

### Voice in three adjectives

- **Specific** — names, numbers, dates, real outcomes.
- **Direct** — short sentences, active voice, no padding.
- **Calm** — confident without bravado, technical without posturing.

### Voice in three anti-adjectives

- Not "aspiring" — Kaif is doing the work, not aspiring to it.
- Not "passionate" — passion is assumed; results speak.
- Not "innovative" / "cutting-edge" — show, don't label.

### Two paragraphs to compare

❌ **AI slop**:

> "I'm a passionate and innovative AI engineer and researcher with a deep love for building cutting-edge, transformative solutions at the exciting intersection of machine learning, quantum computing, and data engineering. I thrive in fast-paced environments and I'm always eager to leverage my skills to drive meaningful impact and push the boundaries of what's possible."

✅ **Kaif**:

> "I build AI systems, full-stack applications, and data pipelines. I also do research in machine learning and quantum computing. This site splits those two sides so you can read whichever is relevant to you."

The second one is **better** because:

- It's 3 sentences instead of 4.
- It names specific things (AI systems, applications, pipelines, ML, quantum).
- It tells the visitor what's about to happen (split into two sides).
- It doesn't perform enthusiasm.

---

## 2. The hard ban-list (AI tells and template clichés)

The following are **banned** in the portfolio. If you find yourself writing any of these, stop and rewrite.

### Banned words

| Banned                                  | Why                                                  |
| --------------------------------------- | ---------------------------------------------------- |
| "passionate"                            | Show, don't label                                    |
| "innovative" / "innovation"            | Buzzword, says nothing                               |
| "cutting-edge"                          | Buzzword                                             |
| "state-of-the-art"                      | Buzzword                                             |
| "transformative"                        | Buzzword                                             |
| "leverage"                              | Corporate jargon                                     |
| "synergy" / "synergies"                | Corporate jargon                                     |
| "robust"                                | Usually means "works", often means "I didn't test it" |
| "seamless"                              | Used to mean nothing                                 |
| "robust solutions"                      | Triple-buzzword                                      |
| "drive impact" / "driving impact"       | Corporate jargon                                     |
| "delve into" / "delve deeper"           | AI favorite                                          |
| "navigate the complexities of"          | AI favorite                                          |
| "in today's fast-paced world"           | Template opener                                      |
| "in the realm of"                       | AI favorite                                          |
| "tapestry" (metaphor)                   | AI favorite                                          |
| "landscape" (abstract noun)             | AI favorite                                          |
| "ever-evolving"                         | Cliché                                               |
| "rapidly evolving"                      | Cliché                                               |
| "deep dive"                             | AI favorite                                          |
| "game-changer"                          | Cliché                                               |
| "revolutionary"                         | Cliché                                               |
| "empower"                               | Used to mean "let people do"                         |
| "unlock potential"                      | Cliché                                               |
| "world-class"                           | Unverifiable                                         |
| "best-in-class"                         | Unverifiable                                         |
| "thought leader"                        | Self-aggrandizing                                    |
| "results-driven"                        | Tautological                                        |
| "detail-oriented"                       | Tautological                                        |
| "go-getter"                             | Recruiter-speak                                     |
| "team player"                           | Recruiter-speak                                     |
| "fast learner"                          | Everyone says this                                   |
| "hard worker"                           | Show, don't label                                    |
| "excellent communicator"                | Unverifiable                                         |
| "problem solver"                        | Tautological                                        |
| "self-starter"                          | Recruiter-speak                                     |
| "value-add"                             | Corporate jargon                                     |
| "circle back"                           | Corporate jargon                                     |
| "moving forward"                        | Filler                                               |
| "going forward"                         | Filler                                               |
| "at the end of the day"                 | Filler                                               |
| "in conclusion"                         | AI favorite for closing paragraphs                  |
| "it is worth noting that"               | Hedge filler                                         |
| "it is important to note that"          | Hedge filler                                         |
| "I believe" / "I feel" (in writing)    | Weaken claims                                        |
| "I think" (in writing)                  | Weaken claims                                        |
| "in my opinion"                         | Weaken claims                                        |
| "strive to" / "striving to"             | AI favorite                                          |
| "aim to" / "aiming to"                 | Weak verb                                            |
| "endeavor to"                           | Pretentious                                          |

### Banned phrases

- "I am excited to announce..."
- "I am thrilled to share..."
- "I am passionate about..."
- "I have a strong foundation in..."
- "I bring to the table..."
- "I would be a great fit for..."
- "Looking for new opportunities" (passive, desperate tone)
- "Open to work" (recruiter feed language)
- "Let's connect!" (LinkedIn speak)
- "Hit me up" (slang)
- "Passion projects" (cliché)
- "Side hustle" (cliché)
- "On a mission to..." (startup speak)
- "Building the future of..." (startup speak)
- "Democratizing X" (startup speak)

### Banned constructions

- **Three-adjective stacks**: "fast, scalable, robust solutions" → pick one, prove it.
- **Hedge sandwiches**: "I believe X is Y" → "X is Y" or "X seems to be Y" (state uncertainty directly).
- **Vague quantifiers**: "many", "various", "several", "a number of" → name numbers.
- **Tautologies**: "end result", "past history", "future plans", "added bonus".
- **Buzzword compounds**: "AI-powered", "data-driven", "cloud-native", "next-gen" → describe what it actually does.

---

## 3. The "show, don't label" rule

If a sentence **labels** a quality, replace it with a sentence that **demonstrates** it.

| Label (bad)                                  | Demonstration (good)                                                                                                  |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| "I am passionate about machine learning."    | "I have spent the last three years working on QML for high-energy physics triggers."                                  |
| "I have strong communication skills."        | "I co-authored a paper with a CMS collaboration team across 4 time zones."                                |
| "I am a fast learner."                       | "I went from zero PyTorch experience to a working QML model in 8 weeks."                                            |
| "I deliver robust solutions."                | "The data pipeline processes 12M events/day with a 0.3% failure rate."                                                |
| "I am detail-oriented."                     | "Every PR includes a Zod schema, a test, and a Lighthouse screenshot."                                                |
| "I am a team player."                        | "I ran the weekly engineering sync for 6 months."                                                                      |
| "I am innovative."                           | "I wrote the first QML trigger prototype at the lab; it has since been cited by 3 follow-on papers."                 |
| "I love building things."                    | "I have shipped 6 production AI features and 4 full-stack applications."                                              |

**Rule**: every paragraph should contain at least one specific fact (number, name, date, measurement, outcome).

---

## 4. Specificity discipline

Every claim that can be made specific **must** be made specific.

### Numbers

- "Reduced inference latency" → "Reduced inference latency from 240ms to 90ms (62% faster)"
- "Handled large data" → "Processed 12M events / day"
- "Worked on a team" → "Worked with a team of 5 engineers and 1 PI"
- "Published in a venue" → "Published at NeurIPS 2025 Workshop on Quantum Machine Learning"
- "Improved accuracy" → "Improved accuracy from 0.81 to 0.88 AUC"

### Names

- "A research lab" → "CERN CMS collaboration"
- "A university" → "North South University"
- "A supervisor" → "Dr. Jane Smith"
- "A framework" → "PyTorch"

### Dates

- "Recently" → "in 2025"
- "A while ago" → "from 2022 to 2024"
- "Coming soon" → a specific quarter or remove the claim

### Verifiability

If a claim can't be verified, **delete it**. The portfolio is a public document. Recruiters and professors will check.

### What if I don't have numbers?

Say what you do have. If you don't have a number:

- "Worked on the data pipeline that..."
- "Helped ship X feature Y z."
- "Co-authored a paper on..."
- "Reduced..."

"Contributed to" is acceptable when specifics are confidential.

---

## 5. Sentence-level rules

### Length

- Average sentence: **15–22 words**.
- Maximum: **32 words**. Longer than that, split.
- Paragraphs: **3–5 sentences**. More than that, break.

### Voice

- **Active voice** by default. "I built X" not "X was built by me".
- **Past tense** for completed work. **Present tense** for ongoing work.
- No passive voice unless the actor is unknown or unimportant.

### Openings

- Don't start a sentence with "It is...", "There is...", "There are...". Start with the subject.
- Don't start a paragraph with "So," or "Well," or "Now,".

### Closings

- Don't close with a summary if the paragraph already said the point.
- Don't close with "and that's why..." — show, don't moralize.

### Contractions

Allowed and encouraged in casual copy. Avoid in research paper-style descriptions.

---

## 6. Paragraph-level rules

### Lead with the load-bearing claim

The first sentence of a paragraph carries the weight. Don't bury the lead.

❌ "Throughout my time at the lab, I had the opportunity to work on a project that focused on the development of a system that..."

✅ "I built a QML system for CMS Level-1 trigger momentum regression. It reduced inference latency by 62%."

### One idea per paragraph

If a paragraph is making two points, split it.

### No throat-clearing

Delete any opening phrase that doesn't add information:

- "I'd like to talk about..."
- "In this section, I'll discuss..."
- "Let me explain..."
- "Here's what I did..."

Just say the thing.

### No hedging

Remove "I think", "I believe", "in my opinion". State the claim or don't.

If the claim is genuinely uncertain, name the uncertainty directly:

- "We don't know which approach generalizes best yet."
- "Results vary by 5–8% depending on dataset."

---

## 7. Page-level rules

### Hero

- **5–12 words** for the headline.
- **1 sentence** for the sub.
- **No "I am"** openings ("I am an AI engineer" → "AI engineer. Researcher. Software developer.")

### About / bio

- 3–5 sentences.
- First sentence: name + role.
- Rest: what you actually do, with specifics.

### Section headings

- Title Case, ≤ 4 words.
- Action-oriented where possible ("Selected work", not "My work").
- Avoid "Introduction to...", "Overview of...", "A look at...".

### CTAs

- Active verbs: "View project", "Read paper", "Download CV".
- Not "Click here", "Learn more", "Find out more".

### Metadata (SEO)

- Title: 50–60 chars.
- Description: 140–160 chars.
- One specific noun phrase + one outcome.
- No emoji, no all-caps, no exclamation marks.

✅ "Md Kaif Afran Khan — AI Engineer and Researcher"

✅ "AI engineer and researcher working across machine learning, quantum computing, data engineering, and full-stack software."

❌ "Welcome to my portfolio! I'm so excited to share my work with you!"

---

## 8. Context-specific rules

### Industry page

- Present as a **working professional**, not a candidate.
- Use past tense for completed roles, present for ongoing.
- Numbers in every project description.

### Academic page

- Present as a **researcher**, not a job-seeker.
- Use precise academic language: "co-authored", "proposed", "evaluated", "ablation".
- Status labels are exact (`Published`, `Accepted`, `Under Review`, `Preprint`).
- Never call an under-review paper "published".

### Project case studies

- Structure: Problem → Why it matters → Method → Results → Limitations → What I learned.
- Numbers in Results.
- Honest limitations — say what didn't work.

### Research project pages

- Structure: Question → Method → Setup → Findings → Limitations → Future work.
- One figure or diagram per major section.
- Define acronyms on first use.

### Publications

- Citation: `Author A., Author B. (Year). Title. Venue.`
- Status badges use the exact vocabulary above.
- Abstract verbatim if the paper has one. If you paraphrase, mark it.

### CV (academic and professional)

- Reverse chronological.
- No paragraphs in role descriptions — bullets or one-line descriptions.
- No self-assessment scores ("Java: 4/5").
- Every line is verifiable.

---

## 9. Voice examples by section

### Hero

✅ "AI engineer. Researcher. Software developer."
✅ "Building intelligent systems across software and research."
✅ "Selected work from 2022–2026."

❌ "Welcome to my digital playground!"
❌ "I'm a passionate technologist crafting the future of AI."

### About

✅ "I build AI systems and full-stack applications, and I do research in quantum machine learning. I work on the CMS experiment at CERN in my research time. This site splits industry and academia so you can read whichever is relevant."

❌ "I'm a curious, driven technologist with a deep passion for pushing the boundaries of AI and creating innovative solutions that make a difference."

### Project description

✅ "QML model for CMS Level-1 trigger muon pT regression. PennyLane + PyTorch. Reduced inference latency from 240ms to 90ms in benchmark on the Open Data release."

❌ "A cutting-edge quantum machine learning solution for high-energy physics that leverages the power of PennyLane to deliver transformative results."

### Research interest

✅ "Graph neural networks for detector reconstruction. The goal is to replace the current cellular automaton track finder with a learned equivalent."

❌ "Exploring the fascinating intersection of graph theory and high-energy physics through innovative deep learning approaches."

### Conference / talk

✅ "Co-author, 'QML for L1 Trigger', CMS Week, June 2025."

❌ "Had the privilege of presenting our groundbreaking research at a prestigious international conference."

### Status (publications)

✅ "Under review at Physical Review Letters."

❌ "Manuscript in preparation for a top-tier journal."

### CTA

✅ "Read case study →"

❌ "Discover more!"

---

## 10. The "delete test"

Before publishing any paragraph, run this test:

1. **Read it aloud.** If it sounds like a LinkedIn post, rewrite.
2. **Highlight every adjective.** If more than 30% are buzzwords, rewrite.
3. **Highlight every adverb.** If they modify vague verbs ("really", "very", "truly"), rewrite.
4. **Find every "I think / I believe / I feel"**. Delete.
5. **Count the specific facts**. Every paragraph needs at least one.
6. **Find the longest sentence**. If > 32 words, split it.
7. **Find every hedge** ("kind of", "sort of", "a bit"). Delete.

If a paragraph survives all 7 steps, it's probably good.

---

## 11. Voice consistency

The portfolio has **one voice**, not multiple voices. Industry and Academic pages differ in **emphasis** (see `PLAN.md` §56), not in voice.

If you write a sentence and it sounds like:

- A LinkedIn post → rewrite.
- A GitHub README → consider if it's appropriate.
- A research paper → good for Academic, but check it's not too dry for Industry.
- A university brochure → rewrite (too formal, no specifics).
- An AI assistant → rewrite.

The voice is closer to:

- A senior engineer's commit message.
- A short bio in a conference program.
- A page on a YC-backed startup's about page.
- A well-edited academic CV.

---

## 12. Metadata writing rules

### Page title (SEO)

Format: `<Page> — Md Kaif Afran Khan` or `<Name> — AI Engineer & Researcher`.

```text
OK:    "Md Kaif Afran Khan — AI Engineer & Researcher"
OK:    "Industry — Md Kaif Afran Khan"
OK:    "CMS Muon pT Regression — Md Kaif Afran Khan"
NOT:   "Welcome to my portfolio!"
NOT:   "Home | Md Kaif Afran Khan | Official Website"
```

### Meta description

140–160 characters. One noun phrase + one specific thing.

```text
OK:    "AI engineer and researcher working across machine learning, quantum computing, data engineering, and full-stack software."
NOT:   "Welcome to my personal portfolio website! Here you'll find information about my work, research, and more."
NOT:   "Passionate AI engineer with extensive experience in cutting-edge technologies."
```

### OG image text

Short, factual, no marketing copy.

```text
OK:    "KAIF  /  ACADEMIA  /  AI / ML RESEARCH"
NOT:   "Welcome to my world of innovation!"
```

---

## 13. README rules

The repository README is also copy. Apply the same standards.

- Title: project name, no emoji.
- One sentence description: what + for whom.
- Install / dev / build commands.
- A "what's in here" section if the structure is non-obvious.
- A "deploy" section if it requires manual steps.

### Banned in README

- "Built with love"
- "Crafted with ❤️"
- "Made with passion"
- "Proudly open-source" (just say it's MIT)
- A wall of badges (use 3–5 max, only the ones that mean something)
- "Screenshots coming soon" (ship the screenshots)

---

## 14. Commit message rules

Apply voice discipline to commits too.

```text
OK:    "Add Zod schema for projects.yaml"
OK:    "Reduce hero image to 240KB"
OK:    "Remove unused framer-motion import"
NOT:   "Improve code quality and performance"
NOT:   "Refactor and enhance the user experience"
NOT:   "Initial commit"
```

Conventional Commits format when meaningful:

```text
feat: add QML project case study
fix: resolve CLS issue on hero
perf: defer below-the-fold images
docs: clarify CSP allowlist
```

---

## 15. The "would I quote this?" test

Before publishing any sentence, ask:

> Would I quote this sentence in a cover letter to a professor at MIT?

If the sentence is too salesy, too vague, or too AI-flavored, **a knowledgeable human will see through it** — and that hurts more than a weak sentence.

A good sentence is one you could publish in a CV, a paper, or a personal site without embarrassment.

---

## 16. Per-section checklist

### Hero

- [ ] ≤ 12 words.
- [ ] No "I am" opener.
- [ ] No banned words.
- [ ] Specific role/title.

### Project card

- [ ] Project name.
- [ ] Category + year.
- [ ] 1 sentence description with a number or specific outcome.

### Project case study

- [ ] Problem stated in 1–2 sentences.
- [ ] Why it matters in 1 sentence.
- [ ] Method in 2–4 sentences with tools named.
- [ ] Results with **numbers**.
- [ ] Limitations (at least one).
- [ ] What I learned (1–2 sentences, concrete).
- [ ] GitHub link works.

### Research page

- [ ] Research question stated upfront.
- [ ] Method named.
- [ ] Findings with numbers.
- [ ] Limitations (at least one).
- [ ] Future work (1–2 sentences, concrete).

### Publication

- [ ] All authors correct.
- [ ] Venue spelled correctly, full name.
- [ ] Year correct.
- [ ] Status label exact.
- [ ] DOI or arXiv link works.

### Bio

- [ ] First sentence: name + role.
- [ ] 3–5 sentences.
- [ ] At least one specific fact per paragraph.

---

## 17. Voice reference card (pin this)

### Write

- Short sentences (15–22 words).
- Active voice.
- Specific names, numbers, dates.
- Past tense for completed work.
- Direct claims, no hedging.

### Don't write

- Three-adjective stacks.
- "I am passionate / innovative / driven."
- "Leverage", "robust", "seamless".
- "In today's fast-paced world".
- "Delve into", "tapestry", "landscape".
- Vague quantifiers ("many", "various").
- "I believe / I think / I feel" (in writing).

### Replace

| Replace this               | With this                              |
| -------------------------- | -------------------------------------- |
| "passionate about AI"      | "build AI systems every week"          |
| "innovative solution"      | the actual method or result            |
| "robust pipeline"          | "pipeline that handles 12M events/day" |
| "drove impact"             | the change, with the number            |
| "in conclusion"            | (delete)                               |
| "seamless experience"      | (delete, describe what it actually does)|
| "cutting-edge technology"   | the technology name                    |
| "excited to announce"      | (just announce it)                     |

---

## 18. The one-line writing rule

> Specifics sell. Labels don't. If a sentence could appear on any portfolio on the internet, it's wrong.