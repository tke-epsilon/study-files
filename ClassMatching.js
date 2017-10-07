const SHEET_ID = '1VWatN_3OOkUdMeaf4W_jx-NW1NKi2Krbqh-mHrBE0Dg';
const UPDATE_INTERVAL_MS = 60000;

const readGoogleSheet = require('./read-google-sheet').bind(null, SHEET_ID);

let entries = [];

const RE_CLASS = /^([a-z ]+)([0-9]+)$/i;
const COURSE_ALIASES = {

};

const parseClass = val => {
  const parsed = RE_CLASS.exec(val.trim());

  if (!parsed) {
    console.log('Failed to parse: ' + val);
    return null;
  }

  let cat = parsed[1].replace(/ /g, '').toUpperCase().trim();
  cat = COURSE_ALIASES[cat] || cat;

  return cat + parsed[2]
};
const parseTutor = (valA, valB) => {
  if (valA == 'No') {
    return false;
  } else if (valA == 'No, but I can help those who are struggling') {
    return true;
  } else {
    return valB.split(/\s*,\s*/).map(parseClass).filter(Boolean);
  }
};

const rowToEntry = row => ({
  netID:    row[12],
  semester: row[2],
  classes:  row.slice(3, 10).map(parseClass).filter(Boolean),
  tutor:    parseTutor(row[10], row[11]),
});

const updateEntries = () => {
  console.log('Updating entries...');
  readGoogleSheet('Form Responses 1!A2:M', (err, res) => {
    if (err) {
      console.log('There was an error: ' + err);
    } else {
      entries = res.values.map(rowToEntry);
      console.log(entries);
    }
  });
};

// Update every UPDATE_INTERVAL_MS.
updateEntries();
setInterval(updateEntries, UPDATE_INTERVAL_MS);

module.exports = {
  test: () => {
    console.log('Testing now...');
    console.log(entries);
  }
};
