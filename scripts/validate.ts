// this script was used to validate that the addresses are valid 
// this script would also write the valid addresses into a valid.json file


const fs = require("fs");
const { parse } = require("csv-parse");
const WAValidator = require('wallet-address-validator');


let data_ : any = [];



async function main() {
  fs.createReadStream(`${__dirname}/valid.csv`)
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (row : any) {
    var valid = WAValidator.validate(row[0], 'ETH');
    if(valid) {
      data_.push(row[0]);
    }
  })
  .on("error", function (error : any) {
    console.log(error.message);
  })
  .on("end", function () {
    console.log("finished");
    console.log(data_.length);
    const data = JSON.stringify(data_);

    fs.writeFile(`${__dirname}/valid.json`, data, (err : any) =>{
      if(err){
        console.log("Error writing file" ,err)
      } else {
        console.log('JSON data is written to the file successfully')
      }
     })
  });
}



main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });