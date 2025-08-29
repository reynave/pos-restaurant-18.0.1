// start.js
const { exec } = require("child_process");  
function runCommand(cmd, callback) {
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(stdout);
    if (callback) callback();
  });
}
const appConfigs = [
    { name: "host", path: "host.js" }, 
];

appConfigs.forEach(({ name, path }) => {
    exec(`pm2 list | findstr ${name}`, (error, stdout, stderr) => {
        if (stdout && stdout.includes(name)) {
            console.log(`${name} sudah jalan, restart...`);

            runCommand(`pm2 restart ${name}`);
            exec(`start "" "http://localhost"`);
        } else {
            console.log(`${name} belum ada, start baru...`);
            runCommand(`pm2 start ${path} --name ${name}`);
            exec(`start "" "http://localhost"`);
        }
    });

     
});
