# JIRA Integration Setup Guide

This guide walks you through setting up the JIRA Task Definition Generator for use with Cursor AI agents.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Getting Your JIRA API Token](#getting-your-jira-api-token)
3. [Configuring Cursor Cloud Agent Secrets](#configuring-cursor-cloud-agent-secrets)
4. [Testing the Integration](#testing-the-integration)
5. [Usage Examples](#usage-examples)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Access to a JIRA instance (Cloud or Server)
- JIRA account with permission to view tickets
- Cursor IDE with Cloud Agents feature

---

## Getting Your JIRA API Token

### For JIRA Cloud (Atlassian Cloud)

1. **Go to Atlassian Account Security**
   - Navigate to: https://id.atlassian.com/manage-profile/security/api-tokens
   - Or: Click your profile → Account Settings → Security → API tokens

2. **Create API Token**
   - Click "Create API token"
   - Give it a descriptive name: `Cursor Agent - JIRA Integration`
   - Click "Create"

3. **Copy Token**
   - Copy the generated token immediately
   - Store it securely - you won't be able to see it again
   - If lost, you'll need to create a new one

4. **Note Your Details**
   - JIRA Domain: Your subdomain (e.g., `your-company.atlassian.net`)
   - Email: The email associated with your Atlassian account

### For JIRA Server/Data Center

1. **Create Personal Access Token**
   - Go to: Profile → Personal Access Tokens
   - Click "Create token"
   - Set appropriate permissions (at minimum: read issues)
   - Copy the token

2. **Configuration**
   - JIRA Domain: Your server domain (e.g., `jira.yourcompany.com`)
   - May require different authentication setup

---

## Configuring Cursor Cloud Agent Secrets

### Step 1: Open Cursor Dashboard

1. Open Cursor IDE
2. Go to Settings (⚙️)
3. Navigate to: **Cloud Agents** → **Secrets**
4. Or visit directly: https://cursor.com/settings/cloud-agents/secrets

### Step 2: Add Environment Variables

Add three secrets with these exact names:

#### Secret 1: JIRA_DOMAIN

- **Name:** `JIRA_DOMAIN`
- **Value:** Your JIRA domain without `https://`
- **Example:** `your-company.atlassian.net`
- **Scope:** Select your repository

#### Secret 2: JIRA_EMAIL

- **Name:** `JIRA_EMAIL`
- **Value:** Your JIRA account email
- **Example:** `you@yourcompany.com`
- **Scope:** Select your repository

#### Secret 3: JIRA_API_TOKEN

- **Name:** `JIRA_API_TOKEN`
- **Value:** The API token you generated
- **Example:** `ATBBxxxxxxxxxxxxxxxxxxxxxx`
- **Scope:** Select your repository

### Step 3: Set Secret Scopes

**Repository Scoping:**
- If you want secrets available only for this repo, select the specific repository
- For team-wide use, select appropriate team scope
- User secrets override team secrets

**Important:**
- Secrets are injected as environment variables into Cloud Agent VMs
- They persist across runs
- For public repositories, secret injection may be disabled unless explicitly allowed

### Step 4: Save Configuration

- Click "Save" for each secret
- Verify all three secrets are listed
- Check that scoping is correct

---

## Testing the Integration

### Test 1: Check Environment Variables

Run this command in a Cloud Agent terminal:

```bash
node -e "console.log('JIRA_DOMAIN:', process.env.JIRA_DOMAIN ? '✓' : '✗'); console.log('JIRA_EMAIL:', process.env.JIRA_EMAIL ? '✓' : '✗'); console.log('JIRA_API_TOKEN:', process.env.JIRA_API_TOKEN ? '✓' : '✗');"
```

Expected output:
```
JIRA_DOMAIN: ✓
JIRA_EMAIL: ✓
JIRA_API_TOKEN: ✓
```

### Test 2: Fetch a Test Ticket

Pick any ticket key from your JIRA instance and run:

```bash
npm run jira:task -- PROJ-123
```

Replace `PROJ-123` with an actual ticket key from your JIRA.

### Expected Success Output:

```
🚀 JIRA Task Definition Generator
📋 Processing ticket: PROJ-123

📥 Fetching ticket PROJ-123...
✅ Ticket fetched: Add user authentication
💬 Fetching comments for PROJ-123...
✅ Found 5 comments
📎 Found 2 attachments

📝 Generating task definition...

✅ Task definition saved to: /workspace/task-definitions/PROJ-123-task-definition.md

✨ Task definition generated successfully!

Next steps:
1. Review the task definition: /workspace/task-definitions/PROJ-123-task-definition.md
2. Share with coding agents or developers
3. Create implementation branch and start coding
```

---

## Usage Examples

### Example 1: Generate Task Definition for a Story

```bash
npm run jira:task -- BP-401
```

This will:
1. Fetch BP-401 from JIRA
2. Download all comments and attachments
3. Generate a comprehensive task definition
4. Save to `task-definitions/BP-401-task-definition.md`

### Example 2: Use with Cursor Agent

1. Generate the task definition:
   ```bash
   npm run jira:task -- BP-401
   ```

2. Open the generated file:
   ```bash
   cat task-definitions/BP-401-task-definition.md
   ```

3. Create a new agent task in Cursor:
   - Copy the task definition content
   - Paste into agent instructions
   - Or reference the file directly with `@task-definitions/BP-401-task-definition.md`

### Example 3: Batch Processing (Future Feature)

```bash
# Process multiple tickets
npm run jira:task -- BP-401 BP-402 BP-403
```

### Example 4: Direct Node Execution

```bash
node scripts/jira-task-generator.js --ticket PROJ-123
```

---

## Troubleshooting

### Problem: "Missing required environment variables"

**Cause:** Secrets not configured or not available in current context

**Solution:**
1. Verify secrets are added in Cursor Dashboard
2. Check secret names are exactly: `JIRA_DOMAIN`, `JIRA_EMAIL`, `JIRA_API_TOKEN`
3. Ensure secrets are scoped to your repository
4. Restart Cloud Agent VM (close and reopen Cursor)

### Problem: "JIRA API error (401): Unauthorized"

**Cause:** Invalid credentials or API token

**Solution:**
1. Regenerate JIRA API token
2. Update `JIRA_API_TOKEN` secret in Cursor Dashboard
3. Verify email matches the account that created the token
4. For JIRA Server, check authentication method

### Problem: "JIRA API error (404): Issue not found"

**Cause:** Ticket doesn't exist or you don't have permission

**Solution:**
1. Verify ticket key is correct (e.g., BP-401, not bp-401)
2. Check you have permission to view the ticket in JIRA
3. Ensure the ticket hasn't been deleted
4. Try accessing the ticket in your browser first

### Problem: "Failed to parse JSON response"

**Cause:** Network issues or JIRA server problems

**Solution:**
1. Check internet connection
2. Verify JIRA_DOMAIN is correct (no https://, no trailing slash)
3. Try accessing JIRA in browser
4. Check if JIRA is experiencing downtime

### Problem: "ECONNREFUSED" or network errors

**Cause:** Cannot connect to JIRA server

**Solution:**
1. Check JIRA_DOMAIN format: `company.atlassian.net` (no protocol)
2. Verify firewall/VPN settings
3. For JIRA Server, ensure domain is accessible from Cloud Agent VM
4. Test with: `curl https://${JIRA_DOMAIN}/rest/api/3/myself`

### Problem: Secrets not available in Cloud Agent

**Cause:** Secret injection disabled for public repos

**Solution:**
1. In Cursor Dashboard, explicitly allow secrets for public repos
2. Or make repository private
3. Check secret scoping settings

### Problem: "Permission denied" when accessing attachments

**Cause:** Insufficient JIRA permissions

**Solution:**
1. Verify your JIRA account has "Browse Projects" permission
2. Check you can view attachments in JIRA web interface
3. Contact JIRA admin for permission adjustments

---

## Security Best Practices

### DO:
- ✅ Use personal API tokens, not passwords
- ✅ Scope tokens to minimum required permissions
- ✅ Set secrets at repository level, not team level (unless needed)
- ✅ Rotate API tokens regularly
- ✅ Revoke tokens when no longer needed
- ✅ Use repository-specific secrets for sensitive projects

### DON'T:
- ❌ Share API tokens with others
- ❌ Commit tokens to code
- ❌ Use admin-level tokens unnecessarily
- ❌ Leave tokens active indefinitely
- ❌ Use the same token across multiple tools

---

## Verification Checklist

Before using the integration, verify:

- [ ] JIRA API token created
- [ ] All three secrets added to Cursor Dashboard
- [ ] Secret names match exactly (case-sensitive)
- [ ] Secrets scoped correctly to repository
- [ ] JIRA_DOMAIN has no protocol or trailing slash
- [ ] Test command runs successfully
- [ ] Can fetch a real ticket from your JIRA

---

## Advanced Configuration

### Custom Fields

If your JIRA uses custom fields for acceptance criteria or other data:

1. Open `scripts/jira-task-generator.js`
2. Locate the `extractAcceptanceCriteria` function
3. Update `customfield_10000` to your custom field ID
4. Find field IDs in JIRA: Issue → More (...) → View field IDs

### Multiple JIRA Instances

To support multiple JIRA instances:

1. Create separate secret sets:
   - `JIRA1_DOMAIN`, `JIRA1_EMAIL`, `JIRA1_API_TOKEN`
   - `JIRA2_DOMAIN`, `JIRA2_EMAIL`, `JIRA2_API_TOKEN`

2. Modify script to accept instance parameter:
   ```bash
   node scripts/jira-task-generator.js --instance JIRA1 --ticket BP-401
   ```

---

## Next Steps

Once setup is complete:

1. ✅ Generate task definitions for your tickets
2. ✅ Use task definitions with Cursor agents
3. ✅ Integrate with your development workflow
4. ✅ Share with team members
5. ✅ Provide feedback for improvements

---

## Support

### Resources:
- [JIRA REST API Documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/)
- [Cursor Cloud Agents Documentation](https://cursor.com/docs/cloud-agents)
- [Project Contributing Guide](./Contributing.md)

### Issues:
If you encounter problems not covered in this guide:
1. Check JIRA API status: https://status.atlassian.com/
2. Review Cursor Cloud Agent logs
3. Create an issue in the repository

---

*Last updated: 2026-02-06*
