#docker build --platform linux/amd64 --tag yao-admin .
#docker run -d --restart unless-stopped --name yao-admin -p 5099:5099 yao-admin
FROM yaoapp/yao:0.10.2-amd64
ARG VERSION
WORKDIR /data

#COPY yao /usr/local/bin/yao
#RUN apk add git
RUN addgroup -S -g 1000 yao && adduser -S -G yao -u 999 yao
RUN mkdir -p /data/app && curl -fsSL "https://mirrors-1252011659.cos.ap-beijing.myqcloud.com/apps/yaoapp/yao-admin/docker/latest.zip" > /data/app/latest.zip && \
    unzip /data/app/latest.zip
RUN rm -rf /data/app/.git  && \
    rm -rf /data/app/data  &&  \
    rm -rf /data/app/db  && \
    rm -rf /data/app/*.sh  && \
    rm -rf /data/app/.env  && \
    mkdir -p /data/logs && \
    mkdir -p /data/charts && \
    mkdir -p /data/tables && \
    mkdir -p /data/models && \
    mkdir -p /data/forms && \
    mkdir -p /data/db && \
    mkdir -p /data/app/data && \
    mkdir -p /data/flows && \
    mkdir -p /data/flows/app && \
    mkdir -p /data/models && \
    chown -R yao:yao /data/app && \
    chown -R yao:yao /data/app/data && \
    chown -R yao:yao /data/logs && \
    chown -R yao:yao /data/db && \
    chmod +x /usr/local/bin/yao 

USER root
VOLUME [ "/data" ]
WORKDIR /data
EXPOSE 5099
CMD ["/usr/local/bin/yao", "start"]	
