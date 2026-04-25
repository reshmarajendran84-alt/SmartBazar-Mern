module.exports = {
  apps: [{
    name: "smartbazar-api",
    script: "server.js",
    instances: 1,
    exec_mode: "fork",
    watch: false,
    env: {
      NODE_ENV: "production",
      PORT: 5000,
    },
    error_file: "./logs/err.log",
    out_file: "./logs/out.log",
    log_file: "./logs/combined.log",
    time: true,
    max_memory_restart: "1G",
    restart_delay: 3000,
    kill_timeout: 5000,
  }],
};