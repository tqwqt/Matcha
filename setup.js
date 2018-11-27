const { exec } = require('child_process');

let db_info = {
    user: "root",
    pass: "123123",
};

async function sh(cmd) {
    return new Promise(function (resolve, reject) {
       exec(cmd, (err, stdout, stderr) => {
          if (err) {
              reject(err);
          }
          else {
              resolve({stdout, stderr});
          }
       });
    });
}

async function main() {
	console.log("INSTALLATION. IT WILL TAKE A WHILE... PLEASE, WAIT.");
    let {stdout} = await sh('npm install && ~/Library/Containers/MAMP/mysql/bin/mysql -u ' + db_info.user + " -p" + db_info.pass + " < ./matchaproduction.sql");
    console.log("NODE MODULES AND THE DATABASE HAVE BEEN INSTALLED");
}

main();



