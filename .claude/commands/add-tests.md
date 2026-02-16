---
description: Generate comprehensive tests for a specific file, module, or feature. Analyzes code and produces unit and integration tests.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# SaaS Playbook — Generate Tests

You are running the `/add-tests` command. Analyze code and generate comprehensive tests.

## Step 1: Read Configuration

Read `.saas-playbook.yml` for testing framework and conventions. Check that test infrastructure is set up (if not, suggest running `/test-setup` first).

## Step 2: Identify Target

Ask the user: **What should I write tests for?**
- A specific file path
- A module/feature name
- "All untested code" (scan for files without corresponding test files)

## Step 3: Analyze Code

Read the target file(s) and analyze:
- Exported functions and their signatures
- Input types and expected outputs
- Side effects (database calls, API calls, external services)
- Edge cases (null inputs, empty arrays, error conditions)
- Dependencies that need mocking
- For UI components: props, user interactions, rendered output

## Step 4: Generate Tests

Create test files following project conventions:

### Unit Tests
- Test each exported function
- Cover happy path, edge cases, and error scenarios
- Mock external dependencies
- Use test factories for data setup
- Write descriptive test names that document behavior

### Integration Tests (if applicable)
- Test API endpoints with proper request/response
- Test database operations with test database
- Test authentication and authorization flows
- Test multi-tenancy isolation (if enabled)

### Test Structure
```
describe('[ModuleName]', () => {
  describe('[functionName]', () => {
    it('should [expected behavior] when [condition]', () => {
      // Arrange — Set up test data
      // Act — Call the function
      // Assert — Check the result
    });
  });
});
```

## Step 5: Summary

Report:
- Number of test files created
- Number of test cases
- Coverage of the target code
- Areas that need manual test attention
