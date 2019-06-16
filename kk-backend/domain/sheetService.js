var debug = require('debug')('kk-backend:api')

var uuidv4 = require('uuid/v4');

const {google} = require('googleapis');
const fs = require('fs');
const readline = require('readline');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = 'token.json';

// exports.updateSheet = function (value, callback) {

//     // return new Promise((resolve, reject) =>
      
//     // Load client secrets from a local file.
//     fs.readFile('credentials.json', (err, content) => {
      
//       if (err) {
//         debug('Error loading client secret file:', err);
//         return reject(err);
//       }

//       // Authorize a client with credentials, then call the Google Sheets API.
//       authorize(JSON.parse(content), function(auth) {
             
//           const sheets = google.sheets({
//               version: 'v4'
//           });

//           let writeParameters = {
//               spreadsheetId: "1sD_WE2iLoVKW9zAZ05y9XtqB7ufJ3OftXiM4buNDEG4",
//               range: "A1",
//               valueInputOption: "RAW",
//               key: "AIzaSyCfOcdiVRqxMFFcHolF585FmXfxyR3aCKQ"
//           };
          
//           let writeRequest = {
//             resource: {
//                 range: "A1",
//                 values: [ [ value ] ],
//                 majorDimension: "ROWS"
//             },
            
//             // auth
//           };
              
//           sheets.spreadsheets.values.update(writeParameters, writeRequest, function(err, response) {
//             if (err) {
//               debug('The API returned an error: ' + err);
//                 //return reject(err);
//                 callback(err);
//             }
//             else {
//               // TODO: Change code below to process the `response` object:
//               debug(response.status);
              
//               // return resolve(response.status);
//               callback(null, response.status);
//             }
//           });

//       });
//     });
// }


exports.updateSheet = function(req, res, next) {
    
    // Load client secrets from a local file.
    fs.readFile('credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Sheets API.
        authorize(JSON.parse(content), function(auth) {
                
            const sheets = google.sheets({
                version: 'v4',
                auth: auth
            });

            let writeParameters = {
                spreadsheetId: "1sD_WE2iLoVKW9zAZ05y9XtqB7ufJ3OftXiM4buNDEG4",
                range: "A1",
                valueInputOption: "RAW",
                key: "AIzaSyCfOcdiVRqxMFFcHolF585FmXfxyR3aCKQ"
            };
            
              let writeRequest = {
                resource: {
                            range: "A2",
                            values: [ [ "454 km" ] ],
                            majorDimension: "ROWS"
                        },

                        auth
                  };
                
            sheets.spreadsheets.values.update(writeParameters, writeRequest, function(err, response) {
                if (err) {
                    console.log('The API returned an error: ' + err);
                    return res.sendStatus(400); 
                }
                else {
                  // TODO: Change code below to process the `response` object:
                  console.log(response.statusText);
                  return res.sendStatus(200);
                }
            });

        });
    });
}

exports.createSheet = function(req, res, next) {
    
  // Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      // Authorize a client with credentials, then call the Google Sheets API.
      authorize(JSON.parse(content), function(auth) {
              
          const sheets = google.sheets({
              version: 'v4',
              auth
          });

          let writeRequest = {
              resource: {
                  properties: {
                    title: "test"
                  }
                },
                auth
              };
              
          sheets.spreadsheets.create(writeRequest, function(err, response) {
              if (err) {
                  console.log('The API returned an error: ' + err);
                  res.sendStatus(400); 
              }
              else {
                // TODO: Change code below to process the `response` object:
                console.log(response.status);
                res.sendStatus(200);
              }
              
              return next();
          });

      });
  });
}

exports.readSheet = function(req, res, next) {
    
  // Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      // Authorize a client with credentials, then call the Google Sheets API.
      authorize(JSON.parse(content), function(auth, res, next) {
              
          const sheets = google.sheets({
              version: 'v4',
              auth
          });

          let readParameters = {
            spreadsheetId: "18ujAphsE6GsPBgyrF6lHtRX1MNFAfMLQEhk5aVjBVSM",
            range: "A1",
          };

          sheets.spreadsheets.values.get(readParameters, (err, res) => {
              if (err) return console.log('The API returned an error: ' + err);
              const rows = res.data.values;
              if (rows.length) {
                console.log('READ: ');

                rows.map((row) => {
                  console.log(`${row[0]}`);
                });

                res.json(rows[0]);

              } else {
                console.log('No data found.');
                res.sendStatus(404);
              }

              next();
            });
      });
  });
}
   
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
  
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getNewToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }
  
  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */
  function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });

    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error while trying to retrieve access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }