\# README

# This is the tutorial I used for creating the basic React / Rails application
https://github.com/learn-co-curriculum/react-rails-project-setup-guide

# Network Ports
22 - ssh
80 - http
443 - https
3000 - Rails Proxy
4000 - Frontend
5432- PostgreSQL

# Environments
- [dev](http://18.219.53.0:4000/calendar)

# Deployment

## Overview
- Clone this repo and somehow merge it with some other crap.

## Dependencies
- Ruby 2.7.4
- NodeJS (v16), and npm
- Postgresql

## Install Ruby on Rails
- Rails is used for the backend service

```bash
gem install rails
```

## Install latest Ruby
We need to do this to fix bundler so it can pull in dependencies.
Ruby comes with Bundler preinstalled by default.

```bash
rbenv install -l
```
- Pick the highest version (3.2.2 at the time of writing)
```bash
rbenv install 3.2.2 --verbose
rbenv global 3.2.2
```

## Install specific version of Ruby
- Install using instructions at https://github.com/rbenv/rbenv
- Use the git method with Ubuntu
- Install the Ruby Build plugin for rbenv at https://github.com/rbenv/ruby-build using the git method
```bash
rbenv install 2.7.4
rbenv global 2.7.4
```
- Restart your shell
- `ruby -v` should now show the correct version
- todo: is there a way to have this work without needing to restart your shell?

## Install Node.js v16
```bash
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash - && sudo apt-get install -y nodejs
node -v
```
- ref: https://github.com/nodesource/distributions#debinstall
- FYI: npm comes bundled with node

## Optional: Install nvm
- nvm allows you to quickly install and use different versions of node.js via the command line.
- If you need multiple versions of node on your machine use this:
- https://github.com/nvm-sh/nvm

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
nvm use 16
node -v
```

## Update npm
npm is a command-line tool that comes with the Node.js runtime environment and is used to install, manage, and share packages

- `npm i npm`
- note: you may have to run this multiple times if the output says "new version still available"

## Install React-Scripts
```bash
npm install react-scripts@latest
npx create-react-app cal-app
```

## Update Gem
```bash
gem update
```

### npx
npx is a package runner tool that comes with the Node.js runtime environment. It allows users to easily download and run any Node.js packages without installing them globally on the system.

I don't think we need this

## Install Postgressql client
sudo apt install libpq-dev

## Install Client Dependencies
```bash
cd client
npm install
```

# Running Dev environment

## Run Backend
```bash
cd cal-app
rails s
```

##
```bash
cd cal-app/client
npm start
```

# Building Production Release
```bash
cd cal-app/client
npm run build
sudo npm install -g serve
serve -s build
```

# Fix it up?
```bash
cd cal-app/client
npm install react-modal
```
todo: add to a list of dependencies

# Run Production locally
From the source root (probably `./cal-app`):
```bash
RAILS_ENV=production rake db:create db:migrate db:seed
sed -i 's/config.assets.compile = false/config.assets.compile = true/g' my-app/config/environments/production.rb
export SECRET_KEY_BASE=$(rake secret)
RAILS_ENV=production bundle exec rake assets:precompile
RAILS_ENV=production rails s
```

If you make changes:
```bash
RAILS_ENV=production rake assets:clobber
RAILS_ENV=production rake assets:precompile
```

Ref: https://medium.com/@mshostdrive/how-to-run-a-rails-app-in-production-locally-f29f6556d786

# Docker

## Install Docker Compose
- https://docs.docker.com/engine/install/ubuntu/#set-up-the-repository
- Optional but highly recommended: https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user

## Install specific bundle version
gem install bundler:2.4.7 -V

## Generate Docker config files
- Use https://github.com/fly-apps/dockerfile-rails to generate the Dockerfile and the docker-compose.yaml
```bash
rbenv global 3.2.2
bundle add dockerfile-rails --optimistic --group development
bundle install
bin/rails generate dockerfile --compose --postgresql
```

## Secrets
Must be used, else you get this error in the docker container:
```
ArgumentError: Missing `secret_key_base` for 'production' environment, set this string with `bin/rails credentials:edit
```

add `export EDITOR=vim` to .bashrc and restart shell
Note: config/master.key should not be checked in. It's the first password.

```bash
rails credentials:help
```

Set up master key and env key
```bash
cd cal-app
bin/rails credentials:edit
```
Save and exit. This will generate a random config/master.key.

```bash
export RAILS_MASTER_KEY=$(cat config/master.key)
```

## Build & Run
```bash
docker compose build
docker compose up -d
```

## Access
http://0.0.0.0:3000 but replace 0.0.0.0 with the IP of the server


# Round 2
1. Install fresh Ubuntu v22
1. Install SSH Key into ~/.ssh
1. Install rbenv
  1. Install the thing that makes rbenv install work
  1. Install the apt-get dependencies for the suggested dev environment
1. rbenv install 3.2.2
1. curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash - && sudo apt-get install -y nodejs
1. npm i npm
1. sudo apt install libpq-dev
1. bundle install
1. bundle add dockerfile-rails --optimistic --group development
1. bin/rails generate dockerfile --compose --postgresql
1. npm install react-scripts@latest
1. Install Docker following the instructions on the offical web page
1. docker compose build
1. bin/rails credentials:edit
1. docker compose up -d


# Running

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

- create a .env file and it's contents should be:
```text
RAILS_MASTER_KEY=passwordhere
```
