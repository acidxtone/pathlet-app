@echo on

echo Starting Application Tests

echo Checking Package Installation
call npm install

echo Checking Build Process
call npm run build

echo Checking Dependencies
call npm list react next @supabase/supabase-js

echo Checking Authentication Hook
node -e "
try {
    const { useAuth } = require('./src/hooks/use-auth');
    if (typeof useAuth === 'function') {
        console.log('Authentication hook is valid');
        process.exit(0);
    } else {
        console.error('Authentication hook is invalid');
        process.exit(1);
    }
} catch (error) {
    console.error('Error loading authentication hook:', error);
    process.exit(1);
}
"

echo Checking Protected Route
node -e "
try {
    const { ProtectedRoute } = require('./src/components/auth/ProtectedRoute');
    if (typeof ProtectedRoute === 'function') {
        console.log('Protected Route is valid');
        process.exit(0);
    } else {
        console.error('Protected Route is invalid');
        process.exit(1);
    }
} catch (error) {
    console.error('Error loading Protected Route:', error);
    process.exit(1);
}
"

echo All Tests Completed
