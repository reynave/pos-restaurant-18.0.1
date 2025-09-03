# POS Restaurant (Localhost, Server, Exe)

Here are the steps to install and run this application.  
Global settings are in the **.env** file (set according to your server, port, and database).

## Prerequisites for Windows

1. **Install Node.js v22.x or higher (LTS recommended)**  
    [Download Node.js](https://nodejs.org/en)
2. **Install MySQL user friendly**  
    [Download XAMPP](https://www.apachefriends.org/)

    [mysql editor] (https://www.heidisql.com/)

#### Clone or Download the Project

1. **Install GitHub Command Line**  
    [Download GitHub CLI](https://cli.github.com/)  
    Enter your project folder.  
    Open Command Line (cmd) in Windows, set it in the system variable, and check with `git version`.

2. **Clone the repository**  
    Run the following command in your project folder:
    ```
    git clone https://github.com/reynave/pos-restaurant-18.0.1
    ```
    Or download manually (without GitHub):
    1. Download (click CODE, then Download ZIP)
    2. Extract the *.zip file
    3. Continue to **SERVER INSTALLATION**

#### Install SERVER

Open **CMD / Command Prompt / Windows PowerShell** and navigate to your current project folder  
*Example: c:\nodejs\server\ (your current project folder)*
```
c:\nodejs\server\npm install
c:\nodejs\server\npm i nodemon
```

#### Install LOCALHOST

Open **CMD / Command Prompt / Windows PowerShell** and navigate to your current project folder  
*Example: c:\nodejs\localhost\ (your current project folder)*
```
c:\nodejs\localhost\npm install
c:\nodejs\localhost\npm i nodemon
```

# Run Server

### 1. For DEVELOPMENT / UAT / Testing
```
node index.js
```
OR  
Using nodemon (install first: https://www.npmjs.com/package/nodemon)  
```npm install -g nodemon```

```
nodemon index.js
```

### 2. For Production (**PM2** is required)  
https://pm2.keymetrics.io/

### 3. Update Patch Code - Only with GitHub CMD
```
git pull
```
In the current folder (see step 2: Clone the repository)  
Or, without GitHub, just overwrite the folder and files.
