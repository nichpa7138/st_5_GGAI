import { Member, ST5Assessment } from '../types';
import { INITIAL_MEMBERS, evaluateST5Score } from '../constants';

const STORAGE_KEYS = {
  MEMBERS: 'st5_members_v1',
  ASSESSMENTS: 'st5_assessments_v1',
  CURRENT_USER: 'st5_current_user_v1',
  WEB_APP_URL: 'st5_gas_url_v1',
  AUTO_SYNC: 'st5_auto_sync_v1'
};

// Seed some initial realistic assessment history so user can see history immediately
const INITIAL_ASSESSMENTS: ST5Assessment[] = [
  {
    no: 1,
    dat_time: '18/08/2569 09:30:15',
    st_id: '6900000001',
    q1: 1,
    q2: 1,
    q3: 0,
    q4: 1,
    q5: 0,
    total: 3,
    result: 'ความเครียดระดับน้อย',
    emoji: '😊',
    levelKey: 'low'
  },
  {
    no: 2,
    dat_time: '18/08/2569 16:45:20',
    st_id: '6900000001',
    q1: 2,
    q2: 2,
    q3: 1,
    q4: 1,
    q5: 0,
    total: 6,
    result: 'ความเครียดระดับปานกลาง',
    emoji: '😐',
    levelKey: 'moderate'
  },
  {
    no: 3,
    dat_time: '18/08/2569 10:15:00',
    st_id: '6900000002',
    q1: 0,
    q2: 1,
    q3: 1,
    q4: 0,
    q5: 0,
    total: 2,
    result: 'ความเครียดระดับน้อย',
    emoji: '😊',
    levelKey: 'low'
  }
];

export function getMembers(): Member[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(INITIAL_MEMBERS));
      return INITIAL_MEMBERS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(INITIAL_MEMBERS));
      return INITIAL_MEMBERS;
    }
    return parsed;
  } catch (e) {
    console.error('Error reading members from localStorage', e);
    return INITIAL_MEMBERS;
  }
}

export function saveMember(newMember: Member): { success: boolean; message: string; member?: Member } {
  const members = getMembers();
  
  // Format check
  const cleanId = newMember.st_id.trim();
  if (cleanId.length !== 10 || !/^\d{10}$/.test(cleanId)) {
    return { success: false, message: 'รหัสนักศึกษาต้องเป็นตัวเลข 10 หลักเท่านั้น' };
  }

  if (!newMember.name.trim()) {
    return { success: false, message: 'กรุณาระบุชื่อ' };
  }

  if (!newMember.lname.trim()) {
    return { success: false, message: 'กรุณาระบุนามสกุล' };
  }

  const cleanDob = newMember.dob.trim().replace(/\D/g, '');
  if (cleanDob.length !== 8) {
    return { success: false, message: 'วันเดือนปีเกิดต้องอยู่ในรูปแบบ ววดดปปปป 8 หลัก (เช่น 29102534)' };
  }

  // Check duplicate
  const exists = members.find((m) => m.st_id === cleanId);
  if (exists) {
    return { success: false, message: `รหัสนักศึกษา ${cleanId} มีในระบบแล้ว กรุณาเข้าสู่ระบบ` };
  }

  const sanitizedMember: Member = {
    st_id: cleanId,
    name: newMember.name.trim(),
    lname: newMember.lname.trim(),
    dob: cleanDob,
    createdAt: new Date().toISOString()
  };

  const updatedMembers = [...members, sanitizedMember];
  localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(updatedMembers));

  // Try background sync to Google Apps Script if URL configured
  syncMemberToGoogleAppsScript(sanitizedMember);

  return {
    success: true,
    message: 'ลงทะเบียนสมาชิกสำเร็จ! ยินดีต้อนรับสู่ระบบประเมินความเครียด',
    member: sanitizedMember
  };
}

export function loginMember(st_id: string, dob: string): { success: boolean; message: string; member?: Member } {
  const members = getMembers();
  const cleanId = st_id.trim();
  const cleanDob = dob.trim().replace(/\D/g, '');

  const member = members.find((m) => m.st_id === cleanId && m.dob === cleanDob);
  if (!member) {
    return {
      success: false,
      message: 'รหัสนักศึกษาหรือวันเดือนปีเกิดไม่ถูกต้อง หรือยังไม่ได้ลงทะเบียน'
    };
  }

  setCurrentUser(member);
  return {
    success: true,
    message: `ยินดีต้อนรับคุณ ${member.name} ${member.lname}`,
    member
  };
}

export function getCurrentUser(): Member | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function setCurrentUser(member: Member | null) {
  if (member) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(member));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

export function getAssessments(): ST5Assessment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ASSESSMENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(INITIAL_ASSESSMENTS));
      return INITIAL_ASSESSMENTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    console.error('Error reading assessments', e);
    return [];
  }
}

export function getAssessmentsByStudentId(stId: string): ST5Assessment[] {
  const all = getAssessments();
  // Filter by st_id and sort descending (latest first)
  return all
    .filter((a) => a.st_id === stId)
    .sort((a, b) => b.no - a.no);
}

export function getNextAssessmentNo(): number {
  const all = getAssessments();
  if (all.length === 0) return 1;
  const maxNo = Math.max(...all.map((a) => a.no || 0));
  return maxNo + 1;
}

export function saveAssessment(item: Omit<ST5Assessment, 'no' | 'total' | 'result' | 'emoji' | 'levelKey'>): ST5Assessment {
  const total = item.q1 + item.q2 + item.q3 + item.q4 + item.q5;
  const evalResult = evaluateST5Score(total);
  const nextNo = getNextAssessmentNo();

  const newAssessment: ST5Assessment = {
    ...item,
    no: nextNo,
    total,
    result: evalResult.label.split(' (')[0], // Extract Thai name e.g. "ความเครียดระดับน้อย"
    emoji: evalResult.emoji,
    levelKey: evalResult.key,
    syncedToGoogleSheet: false
  };

  const all = getAssessments();
  const updated = [...all, newAssessment];
  localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(updated));

  // Sync to Google Apps Script if URL provided
  syncAssessmentToGoogleAppsScript(newAssessment);

  return newAssessment;
}

export function getGoogleWebAppUrl(): string {
  return localStorage.getItem(STORAGE_KEYS.WEB_APP_URL) || '';
}

export function setGoogleWebAppUrl(url: string) {
  localStorage.setItem(STORAGE_KEYS.WEB_APP_URL, url.trim());
}

export async function syncMemberToGoogleAppsScript(member: Member): Promise<boolean> {
  const url = getGoogleWebAppUrl();
  if (!url) return false;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({
        action: 'registerMember',
        member
      })
    });
    const resData = await response.json();
    return resData.status === 'success';
  } catch (err) {
    console.warn('Failed to sync member to Google Apps Script:', err);
    return false;
  }
}

export async function syncAssessmentToGoogleAppsScript(assessment: ST5Assessment): Promise<boolean> {
  const url = getGoogleWebAppUrl();
  if (!url) return false;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({
        action: 'saveAssessment',
        assessment
      })
    });
    const resData = await response.json();
    if (resData.status === 'success') {
      // Mark as synced in local storage
      const all = getAssessments();
      const updated = all.map((a) => (a.no === assessment.no ? { ...a, syncedToGoogleSheet: true } : a));
      localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(updated));
      return true;
    }
    return false;
  } catch (err) {
    console.warn('Failed to sync assessment to Google Apps Script:', err);
    return false;
  }
}

export async function pullDataFromGoogleSheet(): Promise<{ success: boolean; message: string; membersCount?: number; assessmentsCount?: number }> {
  const url = getGoogleWebAppUrl();
  if (!url) {
    return { success: false, message: 'กรุณาระบุ URL ของ Google Apps Script Web App ในการตั้งค่า' };
  }

  try {
    const res = await fetch(`${url}?action=getData&t=${Date.now()}`);
    const data = await res.json();

    if (data.status === 'success') {
      if (Array.isArray(data.members) && data.members.length > 0) {
        localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(data.members));
      }
      if (Array.isArray(data.assessments) && data.assessments.length > 0) {
        // Hydrate levelKey for each
        const hydrated = data.assessments.map((a: any) => {
          const evalRes = evaluateST5Score(a.total);
          return {
            ...a,
            levelKey: evalRes.key,
            syncedToGoogleSheet: true
          };
        });
        localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(hydrated));
      }
      return {
        success: true,
        message: `ซิงค์สำเร็จ! โหลดสมาชิก ${data.members?.length || 0} คน และผลประเมิน ${data.assessments?.length || 0} รายการ`,
        membersCount: data.members?.length || 0,
        assessmentsCount: data.assessments?.length || 0
      };
    }
    return { success: false, message: data.message || 'ไม่สามารถดึงข้อมูลจาก Google Sheet ได้' };
  } catch (err: any) {
    return { success: false, message: `เกิดข้อผิดพลาดในการเชื่อมต่อ: ${err.message || err}` };
  }
}

export function exportToCSV(type: 'member' | 'st_5'): void {
  let csvContent = '\uFEFF'; // UTF-8 BOM for Excel Thai text display
  let filename = '';

  if (type === 'member') {
    const members = getMembers();
    csvContent += 'st_id,name,lname,dob\n';
    members.forEach((m) => {
      csvContent += `"${m.st_id}","${m.name}","${m.lname}","${m.dob}"\n`;
    });
    filename = `member_export_${new Date().toISOString().slice(0, 10)}.csv`;
  } else {
    const list = getAssessments();
    csvContent += 'no,dat_time,st_id,q1,q2,q3,q4,q5,total,result,emoji\n';
    list.forEach((item) => {
      csvContent += `${item.no},"${item.dat_time}","${item.st_id}",${item.q1},${item.q2},${item.q3},${item.q4},${item.q5},${item.total},"${item.result}","${item.emoji}"\n`;
    });
    filename = `st_5_export_${new Date().toISOString().slice(0, 10)}.csv`;
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
