# eng-gruposbf-backend-typescript

## Para executar o projeto execute npm install e após npm run dev


### Comando para subir docker com o mysql
docker run --name=sbf-mysql -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=sbf -e MYSQL_USER=root mysql/mysql-server:latest --default-authentication-plugin=mysql_native_password
