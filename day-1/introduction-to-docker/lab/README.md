# Instrucciones Docker - IBMeetingU

## Construir la imagen

```bash
cd day-1/topic-1/lab
docker build -t ibmeetingu:latest .
```

## Ejecutar el contenedor

```bash
docker run -d -p 8080:80 --name ibmeetingu ibmeetingu:latest
```

## Acceder a la aplicación

Abre tu navegador en: http://localhost:8080

## Comandos útiles

### Ver logs del contenedor
```bash
docker logs ibmeetingu
```

### Detener el contenedor
```bash
docker stop ibmeetingu
```

### Eliminar el contenedor
```bash
docker rm ibmeetingu
```

### Eliminar la imagen
```bash
docker rmi ibmeetingu:latest
```

## Notas

- La aplicación se sirve en el puerto 80 dentro del contenedor
- Se mapea al puerto 8080 en tu máquina local
- Usa nginx:alpine como base (imagen ligera)