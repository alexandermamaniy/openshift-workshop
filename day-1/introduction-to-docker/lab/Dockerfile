FROM nginx:alpine

# Copiar los archivos de la aplicación al directorio de nginx
COPY src/ /usr/share/nginx/html/

# Exponer el puerto 80
EXPOSE 80

# nginx se ejecuta automáticamente con la imagen base
CMD ["nginx", "-g", "daemon off;"]

# Made with Bob
