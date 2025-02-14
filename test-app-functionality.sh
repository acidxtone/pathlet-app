#!/bin/bash

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to run tests
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    echo -e "${YELLOW}Running test: $test_name${NC}"
    
    # Execute the test command
    eval "$test_command"
    
    # Check the exit status
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $test_name: PASSED${NC}"
    else
        echo -e "${RED}✗ $test_name: FAILED${NC}"
        FAILED_TESTS+=("$test_name")
    fi
}

# Initialize array for failed tests
FAILED_TESTS=()

# Test 1: Check package installation
run_test "Package Installation" "npm install"

# Test 2: Check TypeScript compilation
run_test "TypeScript Compilation" "npm run build"

# Test 3: Lint check
run_test "Linting" "npm run lint"

# Test 4: Check key dependencies
run_test "Dependency Check" "npm ls react next @supabase/supabase-js"

# Test 5: Validate authentication hook
run_test "Authentication Hook" "node -e \"
const { useAuth } = require('./src/hooks/use-auth');
if (typeof useAuth === 'function') {
  console.log('Authentication hook is valid');
  process.exit(0);
} else {
  console.error('Authentication hook is invalid');
  process.exit(1);
}
\""

# Test 6: Check protected route functionality
run_test "Protected Route" "node -e \"
const { ProtectedRoute } = require('./src/components/auth/ProtectedRoute');
if (typeof ProtectedRoute === 'function') {
  console.log('Protected Route is valid');
  process.exit(0);
} else {
  console.error('Protected Route is invalid');
  process.exit(1);
}
\""

# Summary
echo -e "\n${YELLOW}Test Summary:${NC}"
if [ ${#FAILED_TESTS[@]} -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed successfully!${NC}"
else
    echo -e "${RED}✗ Some tests failed:${NC}"
    for failed_test in "${FAILED_TESTS[@]}"; do
        echo -e "${RED}- $failed_test${NC}"
    done
    exit 1
fi
