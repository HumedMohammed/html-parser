# FROM alpine:latest

# # Set working directory
# WORKDIR /app

# # Install dependencies
# RUN apk add --no-cache \
#     ca-certificates \
#     unzip \
#     wget

# # Set PocketBase version
# ARG PB_VERSION=0.24.1

# # Download and unzip PocketBase
# RUN wget https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip \
#     && unzip pocketbase_${PB_VERSION}_linux_amd64.zip \
#     && chmod +x /app/pocketbase \
#     && rm pocketbase_${PB_VERSION}_linux_amd64.zip

# # Create a directory for persistent data
# RUN mkdir -p /pb_data

# # Copy migrations
# COPY ./pocketbase/pb_migrations /app/pb_migrations

# # Expose port
# EXPOSE 8090

# # Start PocketBase with data directory specified
# CMD ["/app/pocketbase", "serve", "--http=0.0.0.0:8090", "--dir=/pb_data"]


FROM alpine:latest

ARG PB_VERSION=0.24.1

RUN apk add --no-cache \
    unzip \
    ca-certificates

# download and unzip PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

# uncomment to copy the local pb_migrations dir into the image
COPY ./pocketbase/pb_migrations /pb/pb_migrations

# uncomment to copy the local pb_hooks dir into the image
COPY ./pocketbase/pb_hooks /pb/pb_hooks

VOLUME /pb/pb_data
EXPOSE 8090

# start PocketBase
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090"]