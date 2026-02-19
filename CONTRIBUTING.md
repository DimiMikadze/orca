# Contributing to Orca

Thanks for your interest in contributing! Contributions of all kinds are welcome—bug fixes, improvements, documentation, and new ideas.

## Guidelines

**Open an issue first**  
Before submitting a pull request (PR), please open an issue or discussion to explain your idea. This helps us align early and avoid duplicate work.

**Keep it flexible**  
Please avoid changes that tightly couple it to a specific workflow. Contributions should improve general usability and allow others to optimize the library for their own needs.

**Code style**

- Use TypeScript strict mode
- Follow existing patterns for agents, services, and orchestrator logic
- Add clear comments for complex logic

## Process

1. Open an issue or discussion to describe the problem or idea.
2. Wait for feedback or alignment from maintainers/community.
3. Create a new branch (e.g. `fix/…`, `feature/…`, `docs/…`) from `main`.
4. Make your changes and ensure tests pass.
5. Submit a pull request with a clear description of what it improves.

## AI-Assisted Development

The repo is set up for development with Claude.

`CLAUDE.md` defines the project architecture, data flow, and key conventions. It explains how the pipeline works and what to avoid.

Copy `.mcp.json.example` to `.mcp.json` and fill in your API keys. It connects Claude to the LinkedIn scraper API, LangGraph JS documentation, and Next.js devtools.
