const fs = require('fs');
const Google = require('googleapis');
const Sheets = Google.sheets('v4');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = './keys/epsilon-study-files.json';
const keyFile = JSON.parse(fs.readFileSync(TOKEN_PATH));

//const GoogleAuth = require('google-auth-library');
const auth = new Google.auth.JWT(
  keyFile.client_email,
  null,
  keyFile.private_key,
  SCOPES,
  null
);

module.exports = function(sheetID, range, callback) {
  Sheets.spreadsheets.values.get({
    auth,
    spreadsheetId: sheetID,
    range,
    key: 'AIzaSyDG45mZBhrfdFvwTrSEXpzHJW0eCCzPUhY',
  }, (err, res) => {
    err ? callback(err) : callback(undefined, res);
  });
};
