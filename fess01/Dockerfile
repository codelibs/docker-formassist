FROM ghcr.io/codelibs/fess:13.4.3

ADD config/doc.json /usr/share/fess/app/WEB-INF/classes/fess_indices/fess/doc.json
ADD config/fess_config.properties /etc/fess/fess_config.properties

RUN mkdir /opt/sample-data
ADD sample-data /opt/sample-data
