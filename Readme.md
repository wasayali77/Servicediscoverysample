🧾 Service Discovery using Docker Compose for Micro-Frontends (Next.js)
📌 Background
Currently, we have a monolithic Next.js app deployed using Azure DevOps pipelines where:

Docker image is built in the build stage

Image is saved and published as artifact

In release stage, image is loaded and docker run is used to start the container

Now, we are refactoring this monolith into 3 micro-frontend Next.js apps:

Sidebar

Footer

Main App

Each will:

Live in its own Git repo

Have its own build and release pipeline

Be deployed as individual containers

🎯 Goal
Enable these micro-frontends to work in sync and communicate internally without relying on hardcoded hostnames or ports.

🧩 Why Docker Compose?
Docker Compose helps us:

✅ Run multiple containers as a single unit
✅ Enable automatic service discovery using container names
✅ Avoid hardcoding backend URLs
✅ Restart only the service that needs update
✅ Avoid bringing down running containers

🏗️ Proposed Architecture
We will define a docker-compose.yml that includes:

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
Each app can now discover others by name (e.g. http://sidebar:3000)

All containers run on a default bridge network (Docker Compose handles this)

Only exposed ports are public — internal communication happens via service names

🛠️ CI/CD Flow for Each Micro-Frontend Repo
🏗️ Build Pipeline (Azure DevOps)
No change needed. You already have this in place:

- script: docker build -t $(Build.Repository.Name):latest .
- script: docker save -o $(Build.ArtifactStagingDirectory)/docker-image.tar $(Build.Repository.Name):latest
Each repo creates its own Docker image and publishes it.

🚀 Release Pipeline (Using docker-compose for deployment)
Instead of docker run, we do:

Pull existing docker-compose.yml from shared folder or config repo

Place built image in correct path (e.g., /home/glsadmin/gls/sidebar)

Edit image name in compose file if needed (sidebar:latest)

Run:
cd /home/glsadmin/gls/
docker compose up -d sidebar
⚠️ This will:

Only restart sidebar service

Keep footer and main-app running as-is

Automatically rewire network so that main-app connects to the new sidebar container without reconfiguration

🧪 Example: main-app Consuming sidebar and footer
// In main-app frontend code
const sidebarData = await fetch(process.env.SIDEBAR_URL)
const footerData = await fetch(process.env.FOOTER_URL)
.env:

env
SIDEBAR_URL=http://sidebar:3000/api/hello
FOOTER_URL=http://footer:3000/api/hello
These will resolve automatically using Docker Compose network.
