# Use an Nginx image to serve the built React app
FROM nginx:alpine

# Copy build files to the Nginx web root
COPY dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
