FROM nginx:latest

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.5.0/wait /wait
RUN chmod +x /wait

CMD /bin/bash -c "/wait && exec nginx -g 'daemon off;'"
