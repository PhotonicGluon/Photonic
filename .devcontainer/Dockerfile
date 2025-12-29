FROM mcr.microsoft.com/devcontainers/base:bullseye AS devcontainer
USER root

# === BASE SETUP ===
# Install base dependencies
RUN apt-get update \
    && apt-get install -y curl \
    && apt-get -y autoclean

# === NODE.JS AND NPM ===
# Set up nvm environment variables
ENV NVM_VERSION=0.40.1
ENV NODE_VERSION=22.12.0
ENV NVM_DIR=/usr/local/nvm
RUN mkdir $NVM_DIR

# Install nvm
# https://github.com/creationix/nvm#install-script
RUN curl -k -o- https://raw.githubusercontent.com/nvm-sh/nvm/v${NVM_VERSION}/install.sh | bash

# Install node and npm
RUN echo "source $NVM_DIR/nvm.sh && \
    nvm install $NODE_VERSION && \
    nvm alias default $NODE_VERSION && \
    nvm use default" | bash

# Add node and npm to path so the commands are available
ENV NODE_PATH=$NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH=$NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# Confirm installation
RUN node -v && npm -v

# Bump npm version
RUN echo "Upgrading npm to latest" && \
    npm update -g npm && \ 
    node -v && npm -v

# === PYTHON SETUP ===
RUN apt-get install -y \
    python3 \
    python3-pip
RUN python3 -m pip install -U \
    pip \
    setuptools

# === PNPM ===
RUN npm install -g pnpm@10.26.2

# === MISC ===
# Switch back to vscode user
USER vscode
