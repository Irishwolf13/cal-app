# Running with Docker Compose

Sample docker-compose.yml
```
version: "3.8"
services:
  web:
    ports:
      - "3000:3000"
    environment:
      - RAILS_MASTER_KEY=$RAILS_MASTER_KEY
      - DATABASE_URL=postgres://root:password@postgres-db/
    depends_on:
      postgres-db:
        condition: service_healthy
    image: rooneyjohn/cal-app:latest

  postgres-db:
    image: postgres
    environment:
      POSTGRES_USER: root
      POSTGRES_PASSWORD: password
    volumes:
      - ./tmp/db:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: pg_isready
      interval: 2s
      timeout: 5s
      retries: 30
```

- create a .env file in the same dir as your docker-compose.yml. It's contents should be:
```text
RAILS_MASTER_KEY=passwordhere
```
If you need the password, please contact me.

# Development

## Well Known Network Ports
- 22 - ssh
- 80 - http
- 443 - https
- 3000 - Rails Proxy
- 4000 - HTTP Frontend
- 5432- PostgreSQL

## Environments
- [dev](http://18.219.53.0:4000/calendar)
- [prod](https://example.com/calendar)

# Local Dev Environment Setup
1. Clone this repo. Commands are issued in the root of the repo unless otherwise specified.

2. [Install rbenv](https://github.com/rbenv/rbenv-installer#rbenv-installer) if you want multiple versions of Ruby on the same workstation.

```bash
rbenv install 3.2.2 --verbose
rbenv global 3.2.2
```

3. Install NodeJS v16
```bash
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash - && sudo apt-get install -y nodejs
```

4. Install Postgres & Client Libraries
```bash
sudo apt install postgresql postgresql-contrib libpq-dev
sudo service postgresql start
```

5. Install Node.js dependencies from package.json
```bash
npm install
```

## Install Client Dependencies
```bash
cd client
npm install
```

# Run local development servers

## Backend API
```bash
rails s
```

## HTTP Server (serving up the React App)
```bash
npm start --prefix client
```

# Build & Serve Production Release Locally
```bash
cd cal-app/client
npm run build
serve -s build -l 4000
```

# Docker

## Docker Build Initial Setup

1. Install Docker following the instructions on the [offical web page](https://www.docker.com/)

2. You can skip this step as the Dockerfile is already commited to the repo. If the Dockerfile requires regeneration, create a new Dockerfile using dockerfile-rails.

```bash
bin/rails generate dockerfile --compose --postgresql
```

3. You can skip this step as the secrets have already been generated and commited to the repo. If the secrets need to be recreated, follow these steps
  1. Delete old secret key
```bash
rm .env
rm config/credentials.yml.enc
rm config/master.key
```
  2. Generate new secret key
```bash
EDITOR=nano bin/rails credentials:edit
```
Simply hit Ctrl-X to save and exit. This will generate a new config/master.key, which is later used to decrypt & start the docker container.

  3. Write the key to .env so docker containers can find it at run time
```bash
echo RAILS_MASTER_KEY=$(cat config/master.key) > .env
```
Note: config/master.key and .env should **NOT** be checked in to git or baked into the docker container. It's the master password. Store it someplace secure.

## Docker Image Build & Release
1. Bump version in docker-compose.yml
2. Build & run new Docker Image
```bash
docker compose build && docker compose up -d
```

3. Test Image. If good:
```bash
docker compose push
```

Image should now be hosted on [rooneyjohn/cal-app](https://hub.docker.com/r/rooneyjohn/cal-app/tags)

# References
- https://github.com/learn-co-curriculum/react-rails-project-setup-guide
