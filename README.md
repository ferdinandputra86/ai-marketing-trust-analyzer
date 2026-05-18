# AI Marketing Trust Analyzer

## 1. Project Overview

**AI Marketing Trust Analyzer** is a lightweight browser prototype that evaluates marketing copy using a transparent trust framework based on clear rules, emphasizing specificity, verifiability, clarity, and honest framing.

---

## 2. Original Task Checklist

- [x] Installed Cursor IDE
- [x] Installed Claude Code extension in Cursor
- [x] Installed Codex extension in Cursor
- [x] Created a public GitHub repository
- [x] Opened the repository in Cursor
- [x] Created README.md
- [x] Committed and pushed the project to GitHub

## 3. Tools Installed

Tools installed: Cursor IDE (AI-assisted development workspace) — Installed. Claude Code extension (Reasoning, writing, and AI workflow exploration) — Installed. Codex extension (Code generation and implementation support) — Installed. GitHub (Version control and portfolio hosting) — Completed. React + Vite + TypeScript (Lightweight frontend prototype) — Used. shadcn/ui (Polished UI components) — Used. Tailwind CSS (Utility-first styling) — Used. lucide-react (Icons for product-style UI) — Used.

---

## 4. Steps Completed

1. Installed Cursor IDE
2. Installed Claude Code extension
3. Installed Codex extension
4. Created a new GitHub repository (`ai-marketing-trust-analyzer`)
5. Opened the repository in Cursor
6. Built a small frontend prototype using React, Vite, TypeScript, Tailwind CSS, and shadcn/ui
7. Created a simple trustworthiness framework (`framework/trust-framework.md`)
8. Documented experiments with example copy (`experiments/`)
9. Documented the process, issues, and learnings in this README
10. Committed and pushed the project to GitHub

---

## 5. Issues I Ran Into and How I Solved Them

Deciding on project scope: The task was simple, but I wanted to show initiative without overbuilding, so I kept the app lightweight and browser based (no backend, no external AI API).
The lesson: good execution is not about adding complexity; it is about matching the goal.

Designing the scoring framework: Trustworthiness in marketing is subjective, so I used transparent heuristic signals rather than claiming objective accuracy.
The lesson: it is important to be honest about the limits of AI and scoring systems.

Avoiding fake citations: AI tools can generate confident but unsupported statements, so I avoided fabricated sources and labeled the system as experimental.
The lesson: verification matters more than confident wording.

UI design balance: I wanted the app to feel polished but not overdesigned, so I used shadcn/ui cards, badges, tabs, alerts, and progress components to create a clean interface.
The lesson: clear interface design helps communicate the idea faster.

---

## 6. Why I Built This

AI tools are excellent for drafting headlines, ads, and landing page copy quickly. But marketing quality still depends on human judgment:

- Is the message **specific** enough?
- Are claims **verifiable**?
- Will the target audience **understand** it immediately?
- Does the copy sound **credible** instead of overhyped?

This prototype makes those questions visible in a lightweight, transparent way.

---

## 7. Trustworthiness Framework

The analyzer evaluates copy across six criteria: **Specificity** (Is the copy concrete or vague?), **Verifiability** (Can the claim be checked or supported?), **Clarity** (Can a normal human understand the message quickly?), **Audience Awareness** (Does the copy mention a real audience, pain point, or use case?), **Hype Control** (Does the copy avoid exaggerated or salesy wording?), and **Logical Soundness** (Does the claim make sense without overpromising?).

Full documentation: [framework/trust-framework.md](./framework/trust-framework.md)

Example experiments:

- [01-overhyped-copy.md](./experiments/01-overhyped-copy.md)
- [02-unverifiable-claims.md](./experiments/02-unverifiable-claims.md)
- [03-human-rewrite.md](./experiments/03-human-rewrite.md)

---

## 8. How to Run the Project

I have deployed the app for review at https://ai-marketing-trust-analyzer.vercel.app/.

```bash
git clone https://github.com/ferdinandputra86/ai-marketing-trust-analyzer.git
cd ai-marketing-trust-analyzer
npm install
npm run dev
```

Open the local Vite URL shown in the terminal
**Build for production:**

```bash
npm run build
npm run preview
```

---

## 9. What I Learned

- AI tools accelerate drafting and implementation
- Human judgment is still necessary for quality and trust
- Specific copy is usually more trustworthy than hype heavy copy
- Claims need verification. Confidence is not the same as proof
- A simple prototype can communicate an idea clearly to reviewers

---

## 10. Future Improvements

- Add real source checking for statistics and citations
- Add more advanced NLP (still transparent and explainable)
- Add side by side AI vs human rewrite comparison
- Add exportable audit reports (PDF or share link)
- Add industry specific example libraries (SaaS, e-commerce, hiring, etc.)

---

## Project Structure

```
ai-marketing-trust-analyzer/
├── README.md
├── package.json
├── index.html
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── lib/
│       └── analyzer.ts
├── framework/
│   └── trust-framework.md
├── experiments/
│   ├── 01-overhyped-copy.md
│   ├── 02-unverifiable-claims.md
│   └── 03-human-rewrite.md
└── screenshots/
    └── .gitkeep
```

---

## Disclaimer

This is an **experimental heuristic prototype**, not an objective truth detector. Always verify factual claims before publishing marketing copy.
