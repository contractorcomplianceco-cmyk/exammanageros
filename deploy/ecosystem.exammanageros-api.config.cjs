/** PM2 ecosystem for ExamManagerOS API server. */
module.exports = {
  apps: [
    {
      name: "exammanageros-api",
      cwd: "/home/ubuntu/projects/exammanageros",
      script: "artifacts/api-server/dist/index.mjs",
      interpreter: "node",
      node_args: "--enable-source-maps",
      env_file: "/home/ubuntu/projects/scripts/exammanageros.env",
      env: {
        NODE_ENV: "production",
        PORT: "5031",
      },
      max_restarts: 10,
      min_uptime: "10s",
      autorestart: true,
    },
  ],
};
