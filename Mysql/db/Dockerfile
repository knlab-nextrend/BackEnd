FROM --platform=linux/x86_64 mysql:5.7

WORKDIR /usr/src/app

ENV MYSQL_ROOT_PASSWORD tony267


COPY ./testdata /docker-entrypoint-initdb.d


EXPOSE 3306


CMD ["mysqld"]