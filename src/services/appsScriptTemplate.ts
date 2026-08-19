import { GOOGLE_SHEET_ID } from '../constants';

export const APPS_SCRIPT_CODE = `/**
 * Google Apps Script Web App for ST-5 Stress Assessment System
 * เชื่อมโยง Google Sheet ID: ${GOOGLE_SHEET_ID}
 * Sheet: 'member' และ 'st_5'
 * 
 * วิธีติดตั้ง:
 * 1. เปิด Google Sheet (ID: ${GOOGLE_SHEET_ID})
 * 2. ไปที่เมนู ส่วนขยาย (Extensions) > Apps Script
 * 3. วางโค้ดนี้ทั้งหมดลงใน Code.gs
 * 4. คลิก จัดการการทำให้ใช้งานได้ (Deploy) > การทำให้ใช้งานได้ใหม่ (New deployment)
 * 5. เลือกประเภท: เว็บแอป (Web app)
 * 6. การเข้าถึง (Who has access): ทุกคน (Anyone)
 * 7. คลิก ทำให้ใช้งานได้ (Deploy) แล้วคัดลอก URL เว็บแอปมาใส่ในเว็บระบบ ST-5
 */

function setupSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // สร้าง Sheet 'member'
  var memberSheet = ss.getSheetByName('member');
  if (!memberSheet) {
    memberSheet = ss.insertSheet('member');
    memberSheet.appendRow(['st_id', 'name', 'lname', 'dob', 'created_at']);
    // Initial data
    memberSheet.appendRow(['6900000001', 'นิชาภา', 'จำปาศรี', '29102534', new Date()]);
    memberSheet.appendRow(['6900000002', 'ณดา', 'จำปาศรี', '29102534', new Date()]);
    memberSheet.appendRow(['6900000003', 'สมชาย', 'มานะ', '29102534', new Date()]);
    memberSheet.getRange(1, 1, 1, 5).setFontWeight('bold').setBackground('#FCE7F3');
  }

  // สร้าง Sheet 'st_5'
  var st5Sheet = ss.getSheetByName('st_5');
  if (!st5Sheet) {
    st5Sheet = ss.insertSheet('st_5');
    st5Sheet.appendRow(['no', 'dat_time', 'st_id', 'q1', 'q2', 'q3', 'q4', 'q5', 'total', 'result', 'emoji']);
    st5Sheet.getRange(1, 1, 1, 11).setFontWeight('bold').setBackground('#FCE7F3');
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);
    var action = data.action;

    setupSheets();

    if (action === 'registerMember') {
      var memberSheet = ss.getSheetByName('member');
      var member = data.member;
      
      // ตรวจสอบว่ามี st_id ซ้ำหรือไม่
      var values = memberSheet.getDataRange().getValues();
      for (var i = 1; i < values.length; i++) {
        if (String(values[i][0]) === String(member.st_id)) {
          return ContentService.createTextOutput(JSON.stringify({
            status: 'error',
            message: 'รหัสนักศึกษานี้มีในระบบแล้ว'
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }

      memberSheet.appendRow([
        "'" + String(member.st_id),
        member.name,
        member.lname,
        "'" + String(member.dob),
        new Date().toISOString()
      ]);

      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'ลงทะเบียนสมาชิกสำเร็จ'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'saveAssessment') {
      var st5Sheet = ss.getSheetByName('st_5');
      var item = data.assessment;

      st5Sheet.appendRow([
        item.no,
        item.dat_time,
        "'" + String(item.st_id),
        item.q1,
        item.q2,
        item.q3,
        item.q4,
        item.q5,
        item.total,
        item.result,
        item.emoji
      ]);

      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'บันทึกผลการประเมินลง Sheet สำเร็จ',
        data: item
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Unknown action'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    setupSheets();

    var memberSheet = ss.getSheetByName('member');
    var st5Sheet = ss.getSheetByName('st_5');

    var memberData = [];
    if (memberSheet) {
      var mRows = memberSheet.getDataRange().getValues();
      for (var i = 1; i < mRows.length; i++) {
        if (mRows[i][0]) {
          memberData.push({
            st_id: String(mRows[i][0]).replace(/^'/, ''),
            name: String(mRows[i][1] || ''),
            lname: String(mRows[i][2] || ''),
            dob: String(mRows[i][3] || '').replace(/^'/, '')
          });
        }
      }
    }

    var st5Data = [];
    if (st5Sheet) {
      var sRows = st5Sheet.getDataRange().getValues();
      for (var j = 1; j < sRows.length; j++) {
        if (sRows[j][0] !== '') {
          st5Data.push({
            no: Number(sRows[j][0]),
            dat_time: String(sRows[j][1]),
            st_id: String(sRows[j][2]).replace(/^'/, ''),
            q1: Number(sRows[j][3]),
            q2: Number(sRows[j][4]),
            q3: Number(sRows[j][5]),
            q4: Number(sRows[j][6]),
            q5: Number(sRows[j][7]),
            total: Number(sRows[j][8]),
            result: String(sRows[j][9]),
            emoji: String(sRows[j][10])
          });
        }
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      members: memberData,
      assessments: st5Data
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
`;
