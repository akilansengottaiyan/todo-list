# 📝 React Todo App

A simple, clean Todo List built with **React + Vite**.  
I made this project to practice working with React state, localStorage, and UI layout.

---

## 🚀 Features

### Todo App
- Add new todos  
- Delete tasks  
- Mark todos as complete/incomplete
- Track creation and completion dates
- Automatic sorting by creation date
- Todos stay saved using **localStorage**  
- Lightweight and fast  
- Minimal UI with button hover animations  
- Responsive card layout  

### JIRA Integration (NEW)
- **Automated Task Definition Generator**
- Fetch JIRA ticket details via API
- Analyze comments and attachments
- Generate comprehensive task definitions for AI coding agents
- Structured markdown output optimized for Cursor AI

---

## 🛠️ Tech Stack

- **React** (Hooks)
- **Vite**
- **localStorage API**
- **CSS**
- **JIRA REST API** (for task definition generator)
- **Node.js** (for automation scripts)

---

## 📦 Installation

Clone the repo

Install dependencies:

```bash
npm install
```

Run the project:

```bash
npm run dev
```

---

## 🎯 JIRA Task Definition Generator

This project includes a powerful tool to fetch JIRA tickets and generate comprehensive task definitions for coding agents.

### Quick Start

1. **Set up JIRA credentials** (see [Setup Guide](./SETUP_JIRA_INTEGRATION.md))
   - Add `JIRA_DOMAIN`, `JIRA_EMAIL`, and `JIRA_API_TOKEN` to Cursor Dashboard

2. **Generate a task definition:**
   ```bash
   npm run jira:task -- YOUR-TICKET-KEY
   ```

3. **Use with AI agents:**
   - Task definitions are saved in `task-definitions/`
   - Reference them in Cursor AI agent prompts
   - Get clear, unambiguous coding instructions

### Example

```bash
# Fetch JIRA ticket BP-401 and generate task definition
npm run jira:task -- BP-401

# Output: task-definitions/BP-401-task-definition.md
```

### Documentation

- 📖 [Complete Setup Guide](./SETUP_JIRA_INTEGRATION.md)
- 📋 [JIRA Task Definition System Overview](./JIRA_TASK_DEFINITION.md)
- 🔧 [Scripts Documentation](./scripts/README.md)
- 📄 [Example Task Definition](./task-definitions/EXAMPLE-task-definition.md)

### What Gets Generated

Each task definition includes:
- Complete ticket metadata and links
- Full description and acceptance criteria
- Analyzed comments with key decisions
- Technical specifications and implementation steps
- Edge cases and considerations
- All attachments and linked issues
- AI-optimized format for coding agents

---

## 📚 Additional Documentation

- [Contributing Guidelines](./Contributing.md)
- [Code Owners](./CODEOWNERS)

---

