/** PM2 ecosystem for ExamManagerOS static preview (local health checks). */
module.exports = {
  apps: [
    {
      name: "exammanageros-preview",
      cwd: "/home/ubuntu/projects/exammanageros",
      script: "pnpm",
      args: "--filter @workspace/exammanageros run serve",
      interpreter: "none",
      env: {
        NODE_ENV: "production",
        PORT: "5030",
        BASE_PATH: "/",
      },
      max_restarts: 10,
      min_uptime: "10s",
      autorestart: true,
    },
  ],
};
