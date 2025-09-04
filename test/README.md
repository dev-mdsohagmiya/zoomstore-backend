# Test Directory

This directory contains all test files for the Zoomit backend application.

## Test Files

- **`test-validation-direct.js`** - Tests direct model validation for super admin creation
- **`test-address.js`** - Tests address functionality in user model
- **`test-category-image.js`** - Tests category image functionality
- **`test-category-products.js`** - Tests category-product relationship functionality
- **`test-login.js`** - Tests login functionality for different user roles
- **`test-super-admin-validation.js`** - Tests API endpoint validation for super admin creation
- **`start-server.js`** - Starts the server for testing purposes
- **`run-all-tests.js`** - Runs all tests in sequence

## Running Tests

### Individual Tests

```bash
# Test direct model validation
node test/test-validation-direct.js

# Test address functionality
node test/test-address.js

# Test category image functionality
node test/test-category-image.js

# Test category-product relationship
node test/test-category-products.js

# Test login functionality
node test/test-login.js

# Test super admin validation
node test/test-super-admin-validation.js
```

### Run All Tests

```bash
node test/run-all-tests.js
```

### Start Server for Testing

```bash
node test/start-server.js
```

## Prerequisites

1. Make sure you have a `.env` file in the root directory with:
   - `MONGODB_URI`
   - `SUPER_ADMIN_EMAIL`
   - `SUPER_ADMIN_PASSWORD`
   - Other required environment variables

2. Ensure MongoDB is running

3. For API tests, make sure the server is running on port 8000

## Test Categories

### Direct Model Tests

- Tests the User model validation directly
- No server required
- Tests super admin role restrictions

### API Tests

- Tests HTTP endpoints
- Requires server to be running
- Tests complete request/response cycle

### Integration Tests

- Tests the complete flow from API to database
- Validates end-to-end functionality
