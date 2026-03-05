# POS Restaurant (Localhost, Server, Exe)

Here are the steps to install and run this application.  
Global settings are in the **.env** file (set according to your server, port, and database).

## Prerequisites for Windows

1. **Install Node.js v24.14.0 (LTS)**  
    [Download Node.js](https://nodejs.org/en)
    download windows installer (.msi)
2. **Install MySQL user friendly**  
    [Download XAMPP](https://www.apachefriends.org/)
    [mysql editor] (https://www.heidisql.com/)

#### Clone / Download and install the Project
```
git clone https://github.com/reynave/pos-restaurant-18.0.1
```

Go to the `service` folder and install the Node.js packages:

```bash
cd service
npm install
```

Start Server 

 ```bash
npm start
```

# Install NPM (ALTERNATVIE)
Using nodemon (install first: https://www.npmjs.com/package/nodemon)  
```npm install -g nodemon```

 
# Run Server Production
 
###  **PM2** is required
https://pm2.keymetrics.io/


###  Update Patch Code
```
git pull
```
In the current folder (see step 2: Clone the repository)  
Or, without GitHub, just overwrite the folder and files.
