# Scripts

This directory contains utility scripts for the project.

## JIRA Task Definition Generator

### Overview

The `jira-task-generator.js` script fetches JIRA ticket details and generates comprehensive task definitions optimized for AI coding agents.

### Prerequisites

Set up the following environment variables in Cursor Dashboard → Cloud Agents → Secrets:

```bash
JIRA_DOMAIN=your-company.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your-jira-api-token
```

#### How to get your JIRA API Token:

1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Give it a name (e.g., "Cursor Agent")
4. Copy the token and save it as `JIRA_API_TOKEN` in Cursor Dashboard

### Usage

```bash
# Using npm script
npm run jira:task -- BP-401

# Or directly with node
node scripts/jira-task-generator.js BP-401

# With --ticket flag
node scripts/jira-task-generator.js --ticket PROJ-123

# Help
node scripts/jira-task-generator.js --help
```

### Output

The script generates a markdown file in the `task-definitions/` directory:

```
task-definitions/
  └── BP-401-task-definition.md
```

### What Gets Extracted

The generator fetches and analyzes:

1. **Ticket Metadata**
   - Issue type, priority, status
   - Story points, time estimates
   - Reporter and assignee

2. **Description Content**
   - Full description with formatting
   - Acceptance criteria
   - Requirements

3. **Comments Analysis**
   - Key decisions made
   - Clarifications provided
   - Edge cases discussed
   - Blockers identified

4. **Attachments**
   - Links to all attached files
   - Screenshots, documents, specs

5. **Linked Issues**
   - Dependencies
   - Blockers
   - Related tickets

### Task Definition Format

The generated task definition includes:

- **Metadata** - Ticket info, links, status
- **Summary** - Clear overview of the work
- **Full Description** - Complete ticket description
- **Acceptance Criteria** - Testable criteria as checkboxes
- **Technical Specifications** - Implementation guidance
- **Implementation Steps** - Step-by-step approach
- **Key Decisions** - Important context from comments
- **Clarifications** - Questions and answers
- **Edge Cases** - Special scenarios to handle
- **Blockers** - Dependencies and impediments
- **Attachments** - All linked documents
- **Linked Issues** - Related tickets
- **Comments History** - Full discussion thread

### Example Output

```markdown
# Task Definition: BP-401 - Add Date Fields and Sorting

## Metadata
- **JIRA Ticket:** [BP-401](https://company.atlassian.net/browse/BP-401)
- **Issue Type:** Story
- **Priority:** Medium
- **Status:** In Progress

## Summary
Add createdAt and completedAt timestamp fields to todos...

## Acceptance Criteria
- [ ] Todos have creation timestamps
- [ ] Completed todos show completion time
- [ ] List is sorted by creation date

...
```

### Features

- ✅ Automatic JIRA API authentication
- ✅ Complete ticket data extraction
- ✅ Comment analysis and categorization
- ✅ Acceptance criteria parsing
- ✅ Attachment linking
- ✅ Linked issues tracking
- ✅ Structured markdown output
- ✅ AI-optimized format
- ✅ Error handling and validation

### Troubleshooting

**"Missing required environment variables"**
- Ensure JIRA_DOMAIN, JIRA_EMAIL, and JIRA_API_TOKEN are set
- Check they're scoped to your repository in Cursor Dashboard

**"JIRA API error (401)"**
- Your API token is invalid or expired
- Regenerate a new token and update the secret

**"JIRA API error (404)"**
- The ticket key doesn't exist
- Check the ticket key format (e.g., BP-401, PROJ-123)

**"Failed to fetch ticket"**
- Check your network connection
- Verify the JIRA_DOMAIN is correct (without https://)

### Integration with Coding Agents

The generated task definitions are optimized for:

- **Cursor AI Agents** - Clear, structured format
- **GitHub Copilot** - Context-rich descriptions
- **Claude/ChatGPT** - Unambiguous requirements

Use the generated task definition as input when creating agent tasks or coding prompts.

### Future Enhancements

Potential improvements:

- [ ] OCR for image attachments
- [ ] PDF text extraction
- [ ] Automatic code file identification
- [ ] Test case generation
- [ ] Integration with git branches
- [ ] Automatic PR creation with task definition
- [ ] Support for multiple tickets at once
- [ ] Task definition templates by issue type
- [ ] AI-powered requirement clarification

---

For more information, see `/workspace/JIRA_TASK_DEFINITION.md`
