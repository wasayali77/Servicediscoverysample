🧾 Micro-Frontend Architecture with Service Discovery using Docker Compose
📌 Background
We are refactoring our monolithic Next.js app into three independent micro-frontend applications:

main-app

sidebar

footer

Each micro-frontend:

Lives in its own Git repository

Has its own Azure DevOps CI/CD pipeline

Is deployed as an individual container

🎯 Goal
Enable these micro-frontends to work together and communicate internally without relying on hardcoded hostnames or ports.

🧩 Why Docker Compose?
Using Docker Compose allows us to:

✅ Run multiple containers together as a unit
✅ Enable automatic service discovery using container names
✅ Avoid hardcoding backend URLs
✅ Restart only the service that needs updating
✅ Avoid bringing down other running services

🏗️ Architecture Overview
We define a shared docker-compose.yml:

version: "3.8"

services:
  main-app:
    image: main-app:latest
    container_name: main-app
    ports:
      - "3000:3000"
    environment:
      - SIDEBAR_URL=http://sidebar:3000/api/hello
      - FOOTER_URL=http://footer:3000/api/hello

  sidebar:
    image: sidebar:latest
    container_name: sidebar
    ports:
      - "3001:3000"

  footer:
    image: footer:latest
    container_name: footer
    ports:
      - "3002:3000"
🔗 Service Discovery
All services run on the default Docker Compose bridge network

Services can communicate using container names as hostnames (e.g., http://sidebar:3000)

Only public ports are exposed to the host — internal traffic is private and routed by Compose

🛠️ CI/CD Flow for Each Micro-Frontend
🧪 Build Pipeline (Azure DevOps)
No changes needed in the build pipeline. Use your existing steps:

- script: docker build -t $(Build.Repository.Name):latest .
- script: docker save -o $(Build.ArtifactStagingDirectory)/docker-image.tar $(Build.Repository.Name):latest
Each repo:

Builds its own Docker image

Publishes it as an artifact

🚀 Release Pipeline (Using Docker Compose)
Instead of using docker run, follow these steps:

Pull the shared docker-compose.yml (from a config repo or shared folder)

Load the built image in the correct directory (e.g., /home/glsadmin/gls/sidebar)

If necessary, update the image tag in the Compose file (e.g., sidebar:latest)

Deploy using:

cd /home/glsadmin/gls/
docker compose up -d sidebar
✅ This will:

Only restart the sidebar service

Keep footer and main-app running

Automatically reconnect main-app to the updated sidebar using the Docker network

📦 Example: Main App Consuming Sidebar & Footer
🔧 In .env
env

SIDEBAR_URL=http://sidebar:3000/api/hello
FOOTER_URL=http://footer:3000/api/hello
🧩 In Main App Code
const sidebarData = await fetch(process.env.SIDEBAR_URL);
const footerData = await fetch(process.env.FOOTER_URL);
✅ These environment variables resolve automatically inside Docker using service names.

