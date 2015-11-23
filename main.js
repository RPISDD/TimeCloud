var nodemon = require('nodemon');

/*
 * This package starts web server with auto-recovery library nodemon
 */

// Start web server with recovery
nodemon({
  script: 'index.js',
  ext: 'js json'
});


// Set event listeners
nodemon.on('start', function() {
  console.log('TimeShift server online');
});
nodemon.on('quit', function() {
  console.log('TimeShift server offline');
});
// Crash handler
nodemon.on('restart', function(blamed) {
  console.log('TimeShift server recovered from error in', blamed);
});
