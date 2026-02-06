# Task Definition: BP-401 - Add Date Fields and Sorting to Todo App

## Metadata

- **JIRA Ticket:** [BP-401](https://yourcompany.atlassian.net/browse/BP-401)
- **Issue Type:** Story
- **Priority:** Medium
- **Status:** Done
- **Story Points:** 3
- **Reporter:** John Doe
- **Assignee:** Jane Smith

## Summary

Add `createdAt` and `completedAt` timestamp fields to todo items in the React todo application. Sort the todo list by creation date (newest first) to improve user experience and provide temporal context for tasks. This enhancement will help users understand when tasks were created and completed, making task management more efficient.

## Full Description

As a user of the todo application, I want to see when each todo was created and when it was completed, so I can better manage my tasks and understand my productivity patterns.

Currently, the todo app only shows the task text and a completion checkbox. Users have no way to know when tasks were added or how long they took to complete.

This feature will add:
1. A `createdAt` timestamp that is automatically set when a todo is created
2. A `completedAt` timestamp that is set when a todo is marked as complete
3. Automatic sorting of todos by creation date (newest first)
4. Persistence of these timestamps in localStorage

The timestamps should be displayed in a human-readable format, and the sorting should happen automatically whenever the todo list is rendered.

## Acceptance Criteria

- [ ] Each new todo has a `createdAt` timestamp when created
- [ ] When a todo is marked complete, it receives a `completedAt` timestamp
- [ ] Todo list is sorted by `createdAt` in descending order (newest first)
- [ ] Timestamps are displayed in a readable format (e.g., "Created: Jan 15, 2026")
- [ ] Completed todos show both creation and completion times
- [ ] All timestamp data persists in localStorage
- [ ] Existing todos are handled gracefully (migration)
- [ ] Tests pass
- [ ] No console errors or warnings

## Labels

- enhancement
- frontend
- react
- user-experience

## Components

- Frontend
- Todo App

## Technical Specifications

### Files to Modify

- `src/App.jsx` - Main component where todo state is managed
  - Update todo object structure to include `createdAt` and `completedAt`
  - Add Date.now() when creating new todos
  - Set `completedAt` when marking todos complete
  - Implement sort function to order by `createdAt` DESC
  - Display formatted timestamps in UI

### Dependencies

No new packages required. Using native JavaScript Date APIs.

Consider adding (optional):
- `date-fns` for better date formatting
- `moment.js` or `dayjs` for relative time ("2 hours ago")

### Implementation Details

**Todo Object Structure (Before):**
```javascript
{
  id: 1,
  text: "Buy groceries",
  completed: false
}
```

**Todo Object Structure (After):**
```javascript
{
  id: 1,
  text: "Buy groceries",
  completed: false,
  createdAt: 1675526400000,  // Unix timestamp
  completedAt: null           // Null until completed
}
```

**Sorting Logic:**
```javascript
const sortedTodos = todos.sort((a, b) => b.createdAt - a.createdAt);
```

**Date Display:**
- Option 1: Simple format - `new Date(createdAt).toLocaleString()`
- Option 2: Custom format - `new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })`

## Implementation Steps

1. **Update Todo State Structure**
   - Add `createdAt` and `completedAt` fields to todo objects
   - Set `createdAt: Date.now()` when adding new todos
   - Initialize `completedAt: null` for new todos

2. **Implement Completion Tracking**
   - Update the toggle completion handler
   - Set `completedAt: Date.now()` when marking complete
   - Set `completedAt: null` when marking incomplete

3. **Add Sorting Logic**
   - Create a function to sort todos by `createdAt` descending
   - Apply sorting before rendering the todo list
   - Ensure sorting is efficient (memoization if needed)

4. **Update UI to Display Timestamps**
   - Add createdAt display for each todo
   - Add completedAt display for completed todos
   - Format timestamps in a readable way
   - Style timestamp text (smaller font, muted color)

5. **Update localStorage Persistence**
   - Ensure new fields are saved to localStorage
   - Test that data persists on page refresh

6. **Handle Existing Data Migration**
   - Add logic to handle todos without timestamps
   - Set reasonable default dates for existing todos
   - Consider using current date or null for legacy data

7. **Testing**
   - Test creating new todos
   - Test completing/uncompleting todos
   - Test sorting with multiple todos
   - Test localStorage persistence
   - Test with empty state
   - Test with existing data

8. **Code Review & Cleanup**
   - Remove any console.logs
   - Ensure code follows project conventions
   - Update comments if needed

## Test Cases

### Test Case 1: Create New Todo
- **Action:** Add a new todo "Test task"
- **Expected:** Todo has `createdAt` set to current timestamp
- **Expected:** Todo has `completedAt` set to null
- **Expected:** Todo appears at the top of the list

### Test Case 2: Complete Todo
- **Action:** Mark a todo as complete
- **Expected:** Todo has `completedAt` set to current timestamp
- **Expected:** Todo checkbox is checked
- **Expected:** Completed timestamp is displayed

### Test Case 3: Uncomplete Todo
- **Action:** Uncheck a completed todo
- **Expected:** Todo has `completedAt` set to null
- **Expected:** Completed timestamp is removed from display

### Test Case 4: Sort Multiple Todos
- **Action:** Create 3 todos with 1-second delays between each
- **Expected:** Most recently created todo is at the top
- **Expected:** Order is maintained after page refresh

### Test Case 5: localStorage Persistence
- **Action:** Create todos with dates, refresh page
- **Expected:** All timestamp data persists
- **Expected:** Sorting is maintained

### Test Case 6: Legacy Data Migration
- **Action:** Load app with old todos (no timestamps)
- **Expected:** App doesn't crash
- **Expected:** Old todos get default timestamps or null
- **Expected:** New todos work correctly

## Edge Cases & Considerations

1. **Clock Changes:** System clock changes (timezone, daylight saving)
   - Use consistent timestamp format (UTC milliseconds)
   - Consider displaying in user's local timezone

2. **Large Number of Todos:** Performance with 100+ todos
   - Sorting should be efficient
   - Consider memoization with useMemo

3. **Rapid Todo Creation:** Multiple todos created in same millisecond
   - Add secondary sort by ID if timestamps are equal

4. **localStorage Size:** Timestamps add data size
   - Monitor localStorage usage
   - Current impact: ~24 bytes per todo

5. **Date Formatting:** Browser compatibility
   - Test toLocaleString() across browsers
   - Provide fallback formatting

6. **Null/Undefined Handling:** Missing timestamp fields
   - Gracefully handle null or undefined dates
   - Don't render invalid dates

## Key Decisions

1. **Decision: Use Unix Timestamps (milliseconds)**
   - **Rationale:** Compact storage, easy sorting, universally supported
   - **Alternative:** ISO 8601 strings (more readable but larger)

2. **Decision: Sort newest first**
   - **Rationale:** Most recent tasks are typically most relevant
   - **Alternative:** Could make sort order configurable

3. **Decision: Set completedAt to null when uncompleting**
   - **Rationale:** Cleaner state management, reflects current state
   - **Alternative:** Keep history of all completion times

4. **Decision: No external date library initially**
   - **Rationale:** Keep dependencies minimal, native Date is sufficient
   - **Note:** Can add later if formatting needs increase

## Clarifications

1. **Q: Should we show relative times like "2 hours ago"?**
   - A: Not in initial version, but nice-to-have for future

2. **Q: What format for date display?**
   - A: Use toLocaleDateString() for now, can enhance later

3. **Q: Should sorting be configurable?**
   - A: Not in v1, always sort newest first

4. **Q: What about existing todos without timestamps?**
   - A: Set to null or current date on first load

## Blockers & Dependencies

**No blockers identified.**

Dependencies:
- None - this is a self-contained feature

## Attachments

- [mockup-todo-dates.png](https://yourcompany.atlassian.net/secure/attachment/12345/mockup-todo-dates.png)
- [technical-spec.pdf](https://yourcompany.atlassian.net/secure/attachment/12346/technical-spec.pdf)

## Linked Issues

- **Blocks:** [BP-402](https://yourcompany.atlassian.net/browse/BP-402) - Add date filtering
- **Related to:** [BP-350](https://yourcompany.atlassian.net/browse/BP-350) - localStorage improvements

## Comments History

### Comment 1 by John Doe
*2026-01-10T14:30:00Z*

Should we show the time as well or just the date? For tasks created today, maybe we could show "Today at 2:30 PM" instead of the full date?

---

### Comment 2 by Jane Smith
*2026-01-10T15:45:00Z*

Good point. Let's keep it simple for v1 and just show the date. We can add relative time formatting in a follow-up story. I'll add that to the backlog as BP-403.

---

### Comment 3 by Product Manager
*2026-01-11T09:00:00Z*

Approved for sprint 5. Please make sure the date format works across different locales. We have users in US, EU, and Asia.

---

### Comment 4 by Jane Smith
*2026-01-11T10:15:00Z*

Will use `toLocaleDateString()` which handles locales automatically. Testing with en-US, en-GB, and ja-JP locales.

---

## Additional Notes

- This task definition was auto-generated from JIRA ticket BP-401
- Generated on: 2026-02-06T10:00:00.000Z
- Review the original ticket for any updates: https://yourcompany.atlassian.net/browse/BP-401

---

## Implementation Result

This feature was successfully implemented in commit `61034df`. The implementation:

- Added `createdAt` and `completedAt` fields to todo state
- Implemented automatic sorting by creation date (newest first)
- Added timestamp display in the UI with formatted dates
- Ensured persistence in localStorage
- Handled legacy todos without timestamps gracefully

Key code changes:
- `src/App.jsx`: Updated todo structure, added sorting, added date display

The feature is now merged to main and deployed to production.
