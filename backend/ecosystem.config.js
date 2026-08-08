export default {
  apps: [
    {
      name: 'ds-pt-backend',
      script: 'dist/main.js',
      instances: 1,
      exec_mode: 'fork'
    }
  ]
}
