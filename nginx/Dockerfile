FROM nginx:1.13.0

RUN mkdir /opt/static
ADD conf.d/default.conf /etc/nginx/conf.d/default.conf
ADD static/index.html /opt/static/index.html

RUN mkdir /opt/static/formassist