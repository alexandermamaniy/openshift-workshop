# Docker Instructions - IBMeetingU

## Build the image

```bash
cd day-1/introduction-to-docker/lab
docker build -t ibmeetingu:latest .
```

## Run the container

```bash
docker run -d -p 8080:80 --name ibmeetingu ibmeetingu:latest
```

## Access the application

Open your browser at: http://localhost:8080

## Useful commands

### View container logs
```bash
docker logs ibmeetingu
```

### Stop the container
```bash
docker stop ibmeetingu
```

### Remove the container
```bash
docker rm ibmeetingu
```

### Remove the image
```bash
docker rmi ibmeetingu:latest
```

## Notes

- The application is served on port 80 inside the container
- It's mapped to port 8080 on your local machine
- Uses nginx:alpine as base (lightweight image)