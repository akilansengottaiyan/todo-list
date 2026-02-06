# JIRA Task Definition System

## Overview

This document outlines the requirements and implementation plan for a system that fetches JIRA ticket details, analyzes attached documents, and produces clear, complete, and unambiguous task definitions for coding agents.

## Problem Statement

Coding agents require well-structured, unambiguous task definitions to execute work effectively. JIRA tickets often contain:
- Incomplete or ambiguous requirements
- Multiple attached documents (screenshots, specs, design files)
- Comments and discussion threads that contain critical context
- Acceptance criteria scattered across multiple fields

This system aims to synthesize all JIRA ticket information into a single, comprehensive task definition optimized for AI coding agents.

## Required JIRA Credentials

To fetch JIRA ticket details, the following environment variables must be configured:

```bash
JIRA_DOMAIN=your-domain.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=your-api-token
```

**Setup Instructions:**
1. Go to Cursor Dashboard → Cloud Agents → Secrets
2. Add the above environment variables
3. Ensure they are scoped to this repository

## System Components

### 1. JIRA API Integration

**Endpoints Required:**
- `GET /rest/api/3/issue/{issueKey}` - Fetch issue details
- `GET /rest/api/3/issue/{issueKey}/attachments` - Fetch attachments
- `GET /rest/api/3/issue/{issueKey}/comment` - Fetch comments

**Data to Extract:**
- Summary and Description
- Issue Type, Priority, Status
- Acceptance Criteria (from custom fields or description)
- Labels and Components
- All comments (sorted chronologically)
- All attachments (documents, images, files)
- Linked issues (blockers, dependencies)
- Story points or time estimates
- Reporter and Assignee information

### 2. Document Analysis

**Supported Document Types:**
- Images (screenshots, mockups, diagrams) - Extract via OCR or describe visually
- PDFs (specifications, requirements) - Parse text content
- Text files (.txt, .md, .doc)
- Design files (Figma links, Sketch files) - Extract URLs and metadata

**Analysis Steps:**
1. Download all attachments
2. Parse document content
3. Extract key information:
   - Technical requirements
   - UI/UX specifications
   - Data models or schemas
   - API contracts
   - Test scenarios
4. Cross-reference with ticket description

### 3. Information Synthesis

**Synthesis Process:**

1. **Requirement Extraction**
   - Parse description for technical requirements
   - Extract acceptance criteria
   - Identify user stories and use cases
   - List functional and non-functional requirements

2. **Context Analysis**
   - Analyze comment thread for clarifications
   - Identify decision rationale
   - Extract edge cases and considerations
   - Note any blockers or dependencies

3. **Technical Specification**
   - Identify affected files/modules
   - Determine required technologies
   - List API endpoints or database changes
   - Specify configuration requirements

4. **Ambiguity Resolution**
   - Flag unclear requirements
   - List assumptions made
   - Suggest clarifying questions
   - Provide default interpretations

### 4. Task Definition Output

**Output Format:**

```markdown
# Task Definition: [JIRA-XXX] [Title]

## Metadata
- JIRA Ticket: [Link]
- Issue Type: [Story/Bug/Task]
- Priority: [High/Medium/Low]
- Status: [Current Status]
- Estimated Effort: [Story Points/Hours]

## Summary
[1-2 paragraph summary of what needs to be done]

## Requirements

### Functional Requirements
1. [Requirement 1]
2. [Requirement 2]
...

### Non-Functional Requirements
1. [Performance, Security, etc.]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
...

## Technical Specifications

### Files to Modify
- `path/to/file1.js` - [What changes]
- `path/to/file2.css` - [What changes]

### New Files to Create
- `path/to/newfile.js` - [Purpose]

### Dependencies
- [New packages to install]
- [External services required]

### API Changes
- [Endpoints to add/modify]
- [Request/response formats]

### Database Changes
- [Schema modifications]
- [New tables/fields]

## Implementation Steps
1. [Step 1]
2. [Step 2]
...

## Test Cases
1. **Test Case 1:** [Description]
   - Input: [Input]
   - Expected Output: [Output]

## Edge Cases & Considerations
- [Edge case 1]
- [Edge case 2]

## Assumptions
- [Assumption 1]
- [Assumption 2]

## Questions & Ambiguities
- [Question 1]
- [Question 2]

## References
- [Attached documents]
- [Related tickets]
- [Design links]

## Additional Context
[Any relevant comments, discussions, or decisions from the ticket]
```

## Implementation Plan

### Phase 1: JIRA API Client (Day 1)
- [ ] Set up authentication with JIRA API
- [ ] Implement ticket fetching
- [ ] Implement attachment download
- [ ] Implement comment retrieval
- [ ] Add error handling and retry logic

### Phase 2: Document Processing (Day 2-3)
- [ ] Implement PDF text extraction
- [ ] Implement image analysis/OCR
- [ ] Add support for various document formats
- [ ] Build document content parser

### Phase 3: Information Synthesis (Day 4-5)
- [ ] Build requirement extraction logic
- [ ] Implement context analysis from comments
- [ ] Create technical specification generator
- [ ] Add ambiguity detection

### Phase 4: Task Definition Generator (Day 6)
- [ ] Build markdown template generator
- [ ] Implement structured output formatting
- [ ] Add validation and completeness checks
- [ ] Create human-readable summary

### Phase 5: Testing & Refinement (Day 7)
- [ ] Test with various ticket types
- [ ] Validate output quality
- [ ] Refine synthesis algorithms
- [ ] Add configuration options

## Usage Example

```bash
# Fetch and generate task definition
npm run jira-task-def -- --ticket JIRA-123

# Output will be saved to:
# ./task-definitions/JIRA-123-task-definition.md
```

## Quality Criteria

A good task definition should:
1. **Be Complete** - All requirements are captured
2. **Be Unambiguous** - No room for misinterpretation
3. **Be Actionable** - Clear steps for implementation
4. **Be Testable** - Clear acceptance criteria
5. **Include Context** - Why this work is needed
6. **Flag Gaps** - Identify missing information
7. **Be Self-Contained** - Minimal need to reference original ticket

## Integration with Coding Agents

The generated task definitions will be optimized for:
- Cursor AI Agents
- GitHub Copilot
- Other AI coding assistants

**Optimization strategies:**
- Clear, structured format
- Explicit technical specifications
- Step-by-step implementation guidance
- Comprehensive test cases
- Edge case documentation

## Next Steps

1. **Immediate**: Set up JIRA credentials in Cursor Dashboard
2. **Short-term**: Implement JIRA API client
3. **Medium-term**: Build document processing pipeline
4. **Long-term**: Refine synthesis algorithms based on feedback

---

## Example: Sample Task Definition

For reference, here's what a completed task definition would look like:

### Task Definition: BP-401 Add Date Fields and Sorting to Todo App

**Metadata:**
- JIRA Ticket: BP-401
- Issue Type: Story
- Priority: Medium
- Status: Done
- Estimated Effort: 3 Story Points

**Summary:**
Add `createdAt` and `completedAt` timestamp fields to todo items. Sort the todo list by creation date (newest first) to improve user experience and provide temporal context for tasks.

**Functional Requirements:**
1. Each todo item must have a `createdAt` timestamp set when created
2. Each todo item must have a `completedAt` timestamp set when marked complete
3. Todo list must be sorted by `createdAt` in descending order (newest first)
4. Timestamps must persist in localStorage

**Acceptance Criteria:**
- [x] Todo items display creation date
- [x] Completed items show completion date
- [x] List is automatically sorted by creation date
- [x] Dates persist across page refreshes

**Technical Specifications:**

*Files to Modify:*
- `src/App.jsx` - Add date fields to todo state, implement sorting logic

*Implementation:*
1. Update todo object structure to include `createdAt` and `completedAt`
2. Set `createdAt` when new todo is added
3. Set `completedAt` when todo is marked complete
4. Add sorting function to order todos by `createdAt` DESC
5. Update localStorage to persist new fields

**Test Cases:**
1. Create new todo → Should have current timestamp in `createdAt`
2. Mark todo complete → Should have current timestamp in `completedAt`
3. Refresh page → Dates should persist
4. Create multiple todos → Should be ordered newest first

---

*Document generated: 2026-02-06*
