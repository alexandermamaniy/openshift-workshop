FROM registry.access.redhat.com/ubi9/python-312-minimal:latest

WORKDIR /opt/app-root/src

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY server.py .

# Inside a container the server must listen on the pod network interface so the
# Service can reach it (the script itself defaults to 127.0.0.1).
ENV BIND_ADDRESS=0.0.0.0 \
    PORT=8080

EXPOSE 8080

# Non-root user (OpenShift runs the container with an arbitrary UID anyway)
USER 1001

CMD ["python", "server.py"]
