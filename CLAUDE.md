# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## VibeCoding Study Series

This is Study-06 in the VibeCoding learning project series. Previous studies follow these conventions:

## Conventions

- All new files must include a creation date/time comment at the top:
  - Python: `# Created: 2026-01-28 14:30`
  - JavaScript: `// Created: 2026-01-28 14:30`
  - HTML: `<!-- Created: 2026-01-28 14:30 -->`
- API keys go in `.env` with a `.env.example` template (never commit `.env`)
- Korean language is used for user-facing content and comments where appropriate
- Windows 11 is the development environment

## Tech Stack Patterns from Previous Studies

| Study | Type | Stack |
|-------|------|-------|
| 01 | ML/GUI | Python (TensorFlow, Tkinter) + Flask |
| 02 | Todo App | Vanilla JS/HTML/CSS, LocalStorage |
| 03 | Quiz Game | Vanilla JS/HTML/CSS, LocalStorage + JSON |
| 04 | Recipe App | Node.js/Express, SQLite, bcrypt, OpenRouter API |
| 05 | AI Diary | Vanilla JS/HTML/CSS, LocalStorage, OpenRouter API |

Common choices: vanilla JS (no framework), LocalStorage for persistence, OpenRouter for AI features, single-page apps with no build system for simpler projects, Express + SQLite for full-stack projects.
