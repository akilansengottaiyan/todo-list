#!/usr/bin/env node

/**
 * JIRA Task Definition Generator
 * 
 * Fetches JIRA ticket details, analyzes attachments and comments,
 * and generates a comprehensive task definition for coding agents.
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration from environment variables
const JIRA_DOMAIN = process.env.JIRA_DOMAIN;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

// Output directory for task definitions
const OUTPUT_DIR = path.join(__dirname, '../task-definitions');

/**
 * Validates that required environment variables are set
 */
function validateConfig() {
  const missing = [];
  
  if (!JIRA_DOMAIN) missing.push('JIRA_DOMAIN');
  if (!JIRA_EMAIL) missing.push('JIRA_EMAIL');
  if (!JIRA_API_TOKEN) missing.push('JIRA_API_TOKEN');
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(v => console.error(`   - ${v}`));
    console.error('\nPlease set these in Cursor Dashboard → Cloud Agents → Secrets');
    console.error('\nExample values:');
    console.error('  JIRA_DOMAIN=your-company.atlassian.net');
    console.error('  JIRA_EMAIL=your-email@company.com');
    console.error('  JIRA_API_TOKEN=your-api-token');
    process.exit(1);
  }
}

/**
 * Makes an authenticated request to JIRA API
 */
function jiraRequest(endpoint) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');
    
    const options = {
      hostname: JIRA_DOMAIN,
      path: endpoint,
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Failed to parse JSON response: ${e.message}`));
          }
        } else {
          reject(new Error(`JIRA API error (${res.statusCode}): ${data}`));
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

/**
 * Fetches full ticket details from JIRA
 */
async function fetchTicketDetails(ticketKey) {
  console.log(`📥 Fetching ticket ${ticketKey}...`);
  
  try {
    const issue = await jiraRequest(`/rest/api/3/issue/${ticketKey}?expand=renderedFields,names`);
    console.log(`✅ Ticket fetched: ${issue.fields.summary}`);
    return issue;
  } catch (error) {
    console.error(`❌ Failed to fetch ticket: ${error.message}`);
    throw error;
  }
}

/**
 * Fetches comments for a ticket
 */
async function fetchComments(ticketKey) {
  console.log(`💬 Fetching comments for ${ticketKey}...`);
  
  try {
    const response = await jiraRequest(`/rest/api/3/issue/${ticketKey}/comment`);
    console.log(`✅ Found ${response.comments.length} comments`);
    return response.comments;
  } catch (error) {
    console.error(`⚠️  Failed to fetch comments: ${error.message}`);
    return [];
  }
}

/**
 * Extracts acceptance criteria from description or custom fields
 */
function extractAcceptanceCriteria(issue) {
  const criteria = [];
  const description = issue.renderedFields?.description || issue.fields.description || '';
  
  // Look for acceptance criteria in description
  const acRegex = /(?:acceptance criteria|ac|definition of done)[:\s]*\n([\s\S]*?)(?:\n\n|$)/i;
  const match = description.match(acRegex);
  
  if (match) {
    const lines = match[1].split('\n');
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && (trimmed.startsWith('-') || trimmed.startsWith('*') || /^\d+\./.test(trimmed))) {
        criteria.push(trimmed.replace(/^[-*\d.]\s*/, ''));
      }
    });
  }
  
  // Check custom fields for acceptance criteria
  if (issue.fields.customfield_10000) { // Common AC field ID
    const ac = issue.fields.customfield_10000;
    if (typeof ac === 'string') {
      criteria.push(...ac.split('\n').filter(l => l.trim()));
    }
  }
  
  return criteria;
}

/**
 * Analyzes comments to extract important context
 */
function analyzeComments(comments) {
  const context = {
    clarifications: [],
    decisions: [],
    edgeCases: [],
    blockers: []
  };
  
  comments.forEach(comment => {
    const body = comment.body?.toLowerCase() || '';
    const content = comment.body || '';
    
    // Identify clarifications
    if (body.includes('clarif') || body.includes('question') || body.includes('unclear')) {
      context.clarifications.push({
        author: comment.author?.displayName || 'Unknown',
        text: content.substring(0, 200)
      });
    }
    
    // Identify decisions
    if (body.includes('decided') || body.includes('agreed') || body.includes('approach')) {
      context.decisions.push({
        author: comment.author?.displayName || 'Unknown',
        text: content.substring(0, 200)
      });
    }
    
    // Identify edge cases
    if (body.includes('edge case') || body.includes('what if') || body.includes('corner case')) {
      context.edgeCases.push({
        author: comment.author?.displayName || 'Unknown',
        text: content.substring(0, 200)
      });
    }
    
    // Identify blockers
    if (body.includes('blocked') || body.includes('blocker') || body.includes('dependency')) {
      context.blockers.push({
        author: comment.author?.displayName || 'Unknown',
        text: content.substring(0, 200)
      });
    }
  });
  
  return context;
}

/**
 * Generates the task definition markdown
 */
function generateTaskDefinition(issue, comments, attachments) {
  const fields = issue.fields;
  const key = issue.key;
  
  const acceptanceCriteria = extractAcceptanceCriteria(issue);
  const context = analyzeComments(comments);
  
  let markdown = `# Task Definition: ${key} - ${fields.summary}\n\n`;
  
  // Metadata
  markdown += `## Metadata\n\n`;
  markdown += `- **JIRA Ticket:** [${key}](https://${JIRA_DOMAIN}/browse/${key})\n`;
  markdown += `- **Issue Type:** ${fields.issuetype?.name || 'N/A'}\n`;
  markdown += `- **Priority:** ${fields.priority?.name || 'N/A'}\n`;
  markdown += `- **Status:** ${fields.status?.name || 'N/A'}\n`;
  
  if (fields.timeestimate) {
    markdown += `- **Estimated Effort:** ${fields.timeestimate / 3600} hours\n`;
  }
  if (fields.customfield_10016) { // Story points
    markdown += `- **Story Points:** ${fields.customfield_10016}\n`;
  }
  
  markdown += `- **Reporter:** ${fields.reporter?.displayName || 'Unknown'}\n`;
  if (fields.assignee) {
    markdown += `- **Assignee:** ${fields.assignee.displayName}\n`;
  }
  markdown += `\n`;
  
  // Summary (first 2 paragraphs of description)
  markdown += `## Summary\n\n`;
  const description = issue.renderedFields?.description || fields.description || 'No description provided';
  const paragraphs = description.split('\n\n').filter(p => p.trim());
  markdown += paragraphs.slice(0, 2).join('\n\n') + '\n\n';
  
  // Full Description
  markdown += `## Full Description\n\n`;
  markdown += description + '\n\n';
  
  // Acceptance Criteria
  markdown += `## Acceptance Criteria\n\n`;
  if (acceptanceCriteria.length > 0) {
    acceptanceCriteria.forEach(ac => {
      markdown += `- [ ] ${ac}\n`;
    });
  } else {
    markdown += `- [ ] Feature works as described\n`;
    markdown += `- [ ] Tests pass\n`;
    markdown += `- [ ] Code is reviewed\n`;
  }
  markdown += `\n`;
  
  // Labels and Components
  if (fields.labels && fields.labels.length > 0) {
    markdown += `## Labels\n\n`;
    fields.labels.forEach(label => {
      markdown += `- ${label}\n`;
    });
    markdown += `\n`;
  }
  
  if (fields.components && fields.components.length > 0) {
    markdown += `## Components\n\n`;
    fields.components.forEach(comp => {
      markdown += `- ${comp.name}\n`;
    });
    markdown += `\n`;
  }
  
  // Technical Specifications
  markdown += `## Technical Specifications\n\n`;
  markdown += `### Files to Modify\n`;
  markdown += `\n`;
  markdown += `*To be determined during implementation*\n\n`;
  
  markdown += `### Dependencies\n`;
  markdown += `\n`;
  markdown += `*Check if new packages are needed*\n\n`;
  
  // Implementation Guidance
  markdown += `## Implementation Steps\n\n`;
  markdown += `1. Review the full description and acceptance criteria\n`;
  markdown += `2. Identify files that need modification\n`;
  markdown += `3. Implement core functionality\n`;
  markdown += `4. Add tests\n`;
  markdown += `5. Verify acceptance criteria\n`;
  markdown += `6. Request code review\n\n`;
  
  // Context from Comments
  if (context.decisions.length > 0) {
    markdown += `## Key Decisions\n\n`;
    context.decisions.forEach((d, i) => {
      markdown += `${i + 1}. **${d.author}:** ${d.text}\n\n`;
    });
  }
  
  if (context.clarifications.length > 0) {
    markdown += `## Clarifications\n\n`;
    context.clarifications.forEach((c, i) => {
      markdown += `${i + 1}. **${c.author}:** ${c.text}\n\n`;
    });
  }
  
  if (context.edgeCases.length > 0) {
    markdown += `## Edge Cases & Considerations\n\n`;
    context.edgeCases.forEach((e, i) => {
      markdown += `${i + 1}. **${e.author}:** ${e.text}\n\n`;
    });
  }
  
  if (context.blockers.length > 0) {
    markdown += `## Blockers & Dependencies\n\n`;
    context.blockers.forEach((b, i) => {
      markdown += `${i + 1}. **${b.author}:** ${b.text}\n\n`;
    });
  }
  
  // Attachments
  if (attachments && attachments.length > 0) {
    markdown += `## Attachments\n\n`;
    attachments.forEach(att => {
      markdown += `- [${att.filename}](${att.content})\n`;
    });
    markdown += `\n`;
  }
  
  // Linked Issues
  if (fields.issuelinks && fields.issuelinks.length > 0) {
    markdown += `## Linked Issues\n\n`;
    fields.issuelinks.forEach(link => {
      const type = link.type?.name || 'Related';
      const linkedIssue = link.outwardIssue || link.inwardIssue;
      if (linkedIssue) {
        markdown += `- **${type}:** [${linkedIssue.key}](https://${JIRA_DOMAIN}/browse/${linkedIssue.key}) - ${linkedIssue.fields?.summary || ''}\n`;
      }
    });
    markdown += `\n`;
  }
  
  // All Comments
  if (comments.length > 0) {
    markdown += `## Comments History\n\n`;
    comments.forEach((comment, i) => {
      markdown += `### Comment ${i + 1} by ${comment.author?.displayName || 'Unknown'}\n`;
      markdown += `*${comment.created}*\n\n`;
      markdown += `${comment.body}\n\n`;
      markdown += `---\n\n`;
    });
  }
  
  markdown += `## Additional Notes\n\n`;
  markdown += `- This task definition was auto-generated from JIRA ticket ${key}\n`;
  markdown += `- Generated on: ${new Date().toISOString()}\n`;
  markdown += `- Review the original ticket for any updates: https://${JIRA_DOMAIN}/browse/${key}\n`;
  
  return markdown;
}

/**
 * Saves the task definition to a file
 */
function saveTaskDefinition(ticketKey, markdown) {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  const filename = `${ticketKey.replace('/', '-')}-task-definition.md`;
  const filepath = path.join(OUTPUT_DIR, filename);
  
  fs.writeFileSync(filepath, markdown, 'utf8');
  console.log(`\n✅ Task definition saved to: ${filepath}`);
  
  return filepath;
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log('JIRA Task Definition Generator\n');
    console.log('Usage:');
    console.log('  node jira-task-generator.js <JIRA_TICKET_KEY>');
    console.log('  node jira-task-generator.js --ticket <JIRA_TICKET_KEY>');
    console.log('\nExample:');
    console.log('  node jira-task-generator.js BP-401');
    console.log('  node jira-task-generator.js --ticket PROJ-123');
    console.log('\nEnvironment Variables Required:');
    console.log('  JIRA_DOMAIN - Your JIRA domain (e.g., company.atlassian.net)');
    console.log('  JIRA_EMAIL - Your JIRA email');
    console.log('  JIRA_API_TOKEN - Your JIRA API token');
    process.exit(0);
  }
  
  // Parse ticket key
  let ticketKey = args[0];
  if (ticketKey === '--ticket') {
    ticketKey = args[1];
  }
  
  if (!ticketKey) {
    console.error('❌ Error: Please provide a JIRA ticket key');
    process.exit(1);
  }
  
  // Validate configuration
  validateConfig();
  
  console.log('🚀 JIRA Task Definition Generator');
  console.log(`📋 Processing ticket: ${ticketKey}\n`);
  
  try {
    // Fetch ticket details
    const issue = await fetchTicketDetails(ticketKey);
    
    // Fetch comments
    const comments = await fetchComments(ticketKey);
    
    // Get attachments (already in issue.fields.attachment)
    const attachments = issue.fields.attachment || [];
    if (attachments.length > 0) {
      console.log(`📎 Found ${attachments.length} attachments`);
    }
    
    // Generate task definition
    console.log('\n📝 Generating task definition...');
    const markdown = generateTaskDefinition(issue, comments, attachments);
    
    // Save to file
    const filepath = saveTaskDefinition(ticketKey, markdown);
    
    console.log('\n✨ Task definition generated successfully!');
    console.log(`\nNext steps:`);
    console.log(`1. Review the task definition: ${filepath}`);
    console.log(`2. Share with coding agents or developers`);
    console.log(`3. Create implementation branch and start coding\n`);
    
  } catch (error) {
    console.error('\n❌ Error generating task definition:');
    console.error(error.message);
    process.exit(1);
  }
}

// Run the script
main();
