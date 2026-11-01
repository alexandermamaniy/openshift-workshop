FROM registry.access.redhat.com/ubi9/nginx-124:latest

# Static files served by nginx (listens on 8080)
COPY index.html app.js style.css /opt/app-root/src/
COPY images/redhat-logo.png images/ibm-logo-cropped.png /opt/app-root/src/images/

# Forward /api/ to the voting-api Service
COPY api-proxy.conf /opt/app-root/etc/nginx.default.d/api-proxy.conf

EXPOSE 8080

# Non-root user
USER 1001

CMD ["nginx", "-g", "daemon off;"]
