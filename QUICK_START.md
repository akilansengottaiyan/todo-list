# JIRA Task Definition Generator - Quick Start

⚡ Get started in 3 minutes

---

## Step 1: Get Your JIRA API Token (2 minutes)

1. Go to: https://id.atlassian.com/manage-profile/security/api-tokens
2. Click **"Create API token"**
3. Name it: `Cursor Agent`
4. **Copy the token** (you won't see it again!)

---

## Step 2: Configure Secrets in Cursor (1 minute)

1. Open Cursor → Settings → Cloud Agents → Secrets
2. Add these three secrets:

| Secret Name | Value | Example |
|-------------|-------|---------|
| `JIRA_DOMAIN` | Your JIRA domain | `company.atlassian.net` |
| `JIRA_EMAIL` | Your JIRA email | `you@company.com` |
| `JIRA_API_TOKEN` | Token from Step 1 | `ATBBxxx...` |

**Important:** 
- JIRA_DOMAIN should NOT include `https://` or trailing `/`
- Scope secrets to this repository

---

## Step 3: Use It! (30 seconds)

```bash
# Generate task definition for any JIRA ticket
npm run jira:task -- TICKET-123

# Output saved to: task-definitions/TICKET-123-task-definition.md
```

---

## Usage Examples

```bash
# Example 1: Generate task for ticket BP-401
npm run jira:task -- BP-401

# Example 2: Use with ticket flag
npm run jira:task -- --ticket PROJ-456

# Example 3: Get help
npm run jira:task -- --help
```

---

## What You Get

A comprehensive markdown file with:

- ✅ Complete ticket details and metadata
- ✅ Full description and requirements
- ✅ Acceptance criteria as checkboxes
- ✅ All comments analyzed and categorized
- ✅ Key decisions highlighted
- ✅ Edge cases identified
- ✅ Attachments linked
- ✅ Implementation guidance
- ✅ Ready for AI coding agents

---

## Troubleshooting

**"Missing required environment variables"**
→ Check that all 3 secrets are added in Cursor Dashboard

**"JIRA API error (401)"**
→ Regenerate your API token and update the secret

**"JIRA API error (404)"**
→ Check the ticket key exists (e.g., BP-401, not bp-401)

---

## Full Documentation

Need more details? See:

- 📖 [Complete Setup Guide](./SETUP_JIRA_INTEGRATION.md)
- 📋 [System Overview](./JIRA_TASK_DEFINITION.md)
- 📄 [Example Output](./task-definitions/EXAMPLE-task-definition.md)
- 🔧 [Script Documentation](./scripts/README.md)
- 📊 [Task Summary](./TASK_DEFINITION_SUMMARY.md)

---

## That's It!

You're ready to generate AI-optimized task definitions from JIRA tickets.

```bash
npm run jira:task -- YOUR-TICKET-KEY
```

Happy coding! 🚀
