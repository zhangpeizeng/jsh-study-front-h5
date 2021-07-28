FROM nginx:1.15.8

MAINTAINER zhaozh "zhaozhonghua@jsh.com"

COPY dist /usr/share/nginx/html/h5
COPY jsh-study-front-h5.conf /etc/nginx/conf.d
