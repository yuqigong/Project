#
# FE-Dev Dockerfile
#
# https://github.com/dockerfile/nginx
#

# Pull base image.
FROM ubuntu

MAINTAINER Richie <yuqi.gong.home@gmail.com>

# Install build-essential libssl-dev Nginx git curl.
RUN \
  apt-get update && \
  apt-get install -y build-essential libssl-dev
  apt-get install -y nginx && \
  apt-get install -y git && \
  apt-get install -y curl

# Install nvm and Node.
RUN \
  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash && \
  source ~/.profile

RUN \
  nvm install node

# Define mountable directories.
VOLUME ["/etc/nginx/sites-enabled", "/etc/nginx/certs", "/etc/nginx/conf.d", "/var/log/nginx", "/var/www/html/website"]

# Define working directory.
WORKDIR /etc/nginx

ADD ./self.conf /etc/nginx/conf.d/
ADD ./nginx.conf /etc/nginx/nginx.conf

# Define default command.
CMD ["nginx"]

# Expose ports.
EXPOSE 80
EXPOSE 443
