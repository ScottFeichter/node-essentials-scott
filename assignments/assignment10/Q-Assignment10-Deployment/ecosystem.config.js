module.exports = {
  apps: [{
    name: 'node-app',
    script: './app.js',
    instances: 'max', // Use all available CPU cores
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    // Restart configuration
    max_restarts: 10,
    min_uptime: '10s',
    max_memory_restart: '500M',
    
    // Logging
    log_file: './logs/pm2.log',
    out_file: './logs/pm2-out.log',
    error_file: './logs/pm2-error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Monitoring
    monitoring: false,
    
    // Advanced features
    watch: false,
    ignore_watch: ['node_modules', 'logs'],
    
    // Graceful shutdown
    kill_timeout: 5000,
    listen_timeout: 3000,
    
    // Health check
    health_check_grace_period: 3000
  }]
};