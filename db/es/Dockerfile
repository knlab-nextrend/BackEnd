FROM elasticsearch:7.9.1


ENV discovery.type=single-node
ENV cluster.name=index01

COPY ./backup1.json .

RUN /bin/bash
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
RUN source ~/.bashrc