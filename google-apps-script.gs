/**
 * APPS SCRIPT — RSVP ke Google Sheet
 * ------------------------------------------------
 * CARA PASANG:
 * 1. Buka Google Sheet baru (atau yang sudah ada) untuk menampung data RSVP.
 * 2. Buat baris header di baris pertama: Waktu | Nama | Kehadiran | Ucapan
 * 3. Menu Extensions → Apps Script.
 * 4. Hapus kode default, tempel seluruh isi file ini.
 * 5. Klik Deploy → New deployment.
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Klik Deploy, izinkan akses saat diminta.
 * 7. Salin URL Web App yang muncul (formatnya https://script.google.com/macros/s/.../exec)
 * 8. Tempel URL tersebut ke script.js pada bagian GOOGLE_SCRIPT_URL.
 */

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    data.name || '',
    data.attendance || '',
    data.message || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const rows = sheet.getDataRange().getValues();
  const header = rows.shift();

  const entries = rows.map(row => ({
    time: row[0],
    name: row[1],
    attendance: row[2],
    message: row[3]
  }));

  return ContentService
    .createTextOutput(JSON.stringify(entries))
    .setMimeType(ContentService.MimeType.JSON);
}
