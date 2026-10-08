/**
 * Open Spaces Small Group Feedback -> Google Sheet
 * Paste into Extensions > Apps Script on the response spreadsheet,
 * then Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).
 */

const SHEET_NAME = 'Responses';

// Column order in the sheet. Keys must match the question ids in small-group-feedback.html.
const COLUMNS = [
  ['submitted_at', 'Submitted at'],
  // Section 1: Overall experience
  ['q1',  'Overall helpfulness (1–5)'],
  ['q2',  'How supported do you feel now?'],
  ['q3',  'Likelihood to recommend (1–5)'],
  // Section 2: What helped and what was missing
  ['q4',  'Most helpful parts'],
  ['q5',  'Most helpful part, and why'],
  ['q6',  'How the no cross-talk format felt'],
  ['q7',  'Enough time to share?'],
  ['q8',  'Story guide helpfulness (1–5)'],
  ['q9',  'Story guide: unnecessary / leave out'],
  ['q10', 'How sharing your story felt'],
  ['q11', 'Anything to know about sharing your story'],
  ['q12', 'What felt missing / do differently'],
  // Section 3: Format
  ['q13', '2-hour sessions'],
  ['q14', '6-week length'],
  ['q15', 'Ideal number of weeks'],
  ['q16', 'Ideal meeting frequency'],
  ['q17', 'Group size'],
  ['q18', 'Day and time worked?'],
  ['q19', 'Other format changes'],
  // Section 4: Looking ahead
  ['q20', 'Hear about other Open Spaces resources?'],
  ['q21', 'What would make it better for future women'],
  // Section 5: Closing
  ['q22', 'Anything else to share'],
  ['q23', 'OK to share anonymous quote?'],
  ['q24', 'Fair price for a 6-week group'],
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    // Honeypot: bots fill the hidden "website" field. Pretend success, store nothing.
    if (data.website) return json({ ok: true });

    const sheet = getSheet_();
    const row = COLUMNS.map(([key]) => key === 'submitted_at' ? new Date() : clean_(data[key]));
    sheet.appendRow(row);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: 'Could not save response' });
  } finally {
    lock.releaseLock();
  }
}

// Visiting the web app URL in a browser confirms it's live.
function doGet() {
  return json({ ok: true, message: 'Open Spaces feedback endpoint is running.' });
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  // Rewrite the header row every time so new questions get a column label automatically.
  const header = sheet.getRange(1, 1, 1, COLUMNS.length);
  header.setValues([COLUMNS.map(([, label]) => label)]).setFontWeight('bold').setWrap(true);
  sheet.setFrozenRows(1);
  return sheet;
}

// Trim, cap length, and neutralize spreadsheet formula injection.
function clean_(v) {
  if (v === undefined || v === null) return '';
  let s = String(v).trim().slice(0, 5000);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
