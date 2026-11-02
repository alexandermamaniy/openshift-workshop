FROM registry.access.redhat.com/ubi9/python-312-minimal:latest

COPY stress.py /app/stress.py

USER 1001

ENTRYPOINT ["python3", "/app/stress.py"]
