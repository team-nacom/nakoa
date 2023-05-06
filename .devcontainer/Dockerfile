# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.163.1/containers/typescript-node/.devcontainer/base.Dockerfile

# [Choice] Node.js version: 14, 12, 10
ARG VARIANT="14-buster"
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:0-${VARIANT}

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>

# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

# [Optional] Uncomment if you want to install more global node packages
# RUN su node -c "npm install -g <your-package-list -here>"


FROM gitpod/workspace-mongodb:2023-01-16-03-31-28

# USER gitpod

# # Dazzle does not rebuild a layer until one of its lines are changed. Increase this counter to rebuild this layer.
# ENV TRIGGER_REBUILD=1

# # Install MongoDB
# # Source: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu-tarball/#install-mongodb-community-edition
# RUN mkdir -p /tmp/mongodb && \
#     cd /tmp/mongodb && \
#     wget -qOmongodb.tgz https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2004-5.0.2.tgz && \
#     tar xf mongodb.tgz && \
#     cd mongodb-* && \
#     sudo cp bin/* /usr/local/bin/ && \
#     rm -rf /tmp/mongodb && \
#     sudo mkdir -p /data/db && \
#     sudo chown gitpod:gitpod -R /data/db