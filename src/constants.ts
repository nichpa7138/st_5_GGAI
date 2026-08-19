import { Member, ST5Question, ScoreOption, StressLevelDetail } from './types';

export const GOOGLE_SHEET_ID = '120WdyS_aqhebJFdvcxHNgvfG6XNERQtsA-b-BynZVsI';
export const GOOGLE_SHEET_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/edit`;

export const ST5_QUESTIONS: ST5Question[] = [
  {
    id: 'q1',
    title: '1. มีปัญหาการนอน นอนไม่หลับหรือนอนมากเกินไป',
    subtitle: 'นอนหลับยาก ตื่นกลางดึกบ่อย หรือนอนทั้งวันแต่ง่วงซึม'
  },
  {
    id: 'q2',
    title: '2. มีสมาธิน้อยลง ทำงานหรือเรียนได้ไม่ดีเท่าเดิม',
    subtitle: 'ใจลอย ลืมง่าย ตัดสินใจช้า โฟกัสกับสิ่งที่ทำได้ยาก'
  },
  {
    id: 'q3',
    title: '3. หงุดหงิด กระวนกระวาย หรือวุ่นวายใจ',
    subtitle: 'อารมณ์เสียได้ง่าย กระสับกระส่าย ควบคุมอารมณ์ยาก'
  },
  {
    id: 'q4',
    title: '4. รู้สึกเบื่อ เซ็ง ไม่อยากทำอะไร',
    subtitle: 'หมดความสนใจในสิ่งที่เคยชอบ ไม่อยากขยับตัว ทำอะไรก็ไม่สนุก'
  },
  {
    id: 'q5',
    title: '5. ไม่อยากพบปะผู้คน อยากอยู่คนเดียว',
    subtitle: 'เก็บตัว ปฏิเสธการเข้าสังคม ไม่อยากพูดคุยกับเพื่อนหรือครอบครัว'
  }
];

export const SCORE_OPTIONS: ScoreOption[] = [
  {
    score: 0,
    label: 'แทบไม่มี / น้อยมาก',
    description: '0-1 วัน/สัปดาห์'
  },
  {
    score: 1,
    label: 'เป็นบางครั้ง',
    description: '1-3 วัน/สัปดาห์'
  },
  {
    score: 2,
    label: 'เป็นบ่อยครั้ง',
    description: '4-5 วัน/สัปดาห์'
  },
  {
    score: 3,
    label: 'เป็นประจำ',
    description: 'เกือบทุกวัน 6-7 วัน/สัปดาห์'
  }
];

export const INITIAL_MEMBERS: Member[] = [
  {
    st_id: '6900000001',
    name: 'นิชาภา',
    lname: 'จำปาศรี',
    dob: '29102534'
  },
  {
    st_id: '6900000002',
    name: 'ณดา',
    lname: 'จำปาศรี',
    dob: '29102534'
  },
  {
    st_id: '6900000003',
    name: 'สมชาย',
    lname: 'มานะ',
    dob: '29102534'
  }
];

export const STRESS_LEVELS: Record<string, StressLevelDetail> = {
  low: {
    key: 'low',
    minScore: 0,
    maxScore: 4,
    label: 'ความเครียดระดับน้อย (Mild Stress)',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    emoji: '😊',
    subTitle: 'ภาวะปกติที่จัดการได้ยอดเยี่ยม',
    description: 'คุณมีความเครียดในเกณฑ์ปกติของชีวิตประจำวัน สามารถปรับตัวและจัดการกับสถานการณ์ต่างๆ ได้ดี เป็นระดับความเครียดที่เป็นพลังบวกในการดำเนินชีวิต',
    adviceList: [
      'พักผ่อนให้เพียงพอ 7-8 ชั่วโมงต่อวัน',
      'ทำกิจกรรมงานอดิเรกที่ชื่นชอบเพื่อผ่อนคลายจิตใจ',
      'ออกกำลังกายเบาๆ อย่างสม่ำเสมอสัปดาห์ละ 3-4 วัน',
      'รักษาความสมดุลระหว่างการเรียน/การทำงานและการใช้ชีวิต'
    ]
  },
  moderate: {
    key: 'moderate',
    minScore: 5,
    maxScore: 7,
    label: 'ความเครียดระดับปานกลาง (Moderate Stress)',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    emoji: '😐',
    subTitle: 'เริ่มมีแรงกดดัน ควรเริ่มผ่อนคลาย',
    description: 'คุณมีความเครียดในระดับที่อาจเริ่มส่งผลต่อสมาธิ อารมณ์ หรือการนอนหลับในบางช่วง แต่ยังสามารถควบคุมและดำเนินชีวิตประจำวันได้',
    adviceList: [
      'หาสาเหตุที่ทำให้เกิดความเครียดและจัดลำดับความสำคัญของงาน',
      'ฝึกเทคนิคการหายใจลึกๆ (Deep Breathing) หรือทำสมาธิ 10-15 นาที',
      'พูดคุยระบายความรู้สึกกับเพื่อนสนิทหรือคนในครอบครัว',
      'หลีกเลี่ยงคาเฟอีนและจัดตารางเวลาพักผ่อนให้เป็นเวลา'
    ]
  },
  high: {
    key: 'high',
    minScore: 8,
    maxScore: 9,
    label: 'ความเครียดระดับมาก (High Stress)',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
    emoji: '😟',
    subTitle: 'เครียดสะสมสูง ควรได้รับการดูแล',
    description: 'คุณมีความเครียดสะสมสูง เริ่มส่งผลกระทบชัดเจนต่อสุขภาพกาย จิตใจ ประสิทธิภาพการเรียน/การทำงาน และความสัมพันธ์กับคนรอบข้าง',
    adviceList: [
      'หยุดพักกิจกรรมที่สร้างความกดดันชั่วคราวเพื่อฟื้นฟูจิตใจ',
      'ลดภาระงานที่ไม่จำเป็นลง และขอความช่วยเหลือจากคนรอบข้าง',
      'ปรึกษาอาจารย์ที่ปรึกษา หรือหน่วยบริการสุขภาพจิตของสถาบัน',
      'โทรปรึกษาสายด่วนสุขภาพจิต 1323 (โทรฟรีตลอด 24 ชั่วโมง)'
    ]
  },
  severe: {
    key: 'severe',
    minScore: 10,
    maxScore: 15,
    label: 'ความเครียดระดับรุนแรง (Severe Stress)',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-700',
    borderColor: 'border-rose-200',
    emoji: '😫',
    subTitle: 'ระดับวิกฤต แนะนำให้ปรึกษาผู้เชี่ยวชาญทันที',
    description: 'ความเครียดอยู่ในระดับวิกฤต ส่งผลกระทบอย่างรุนแรงต่อการใช้ชีวิตประจำวัน มีความเสี่ยงต่อภาวะซึมเศร้า วิตกกังวล หรือปัญหาสุขภาพร้ายแรง',
    adviceList: [
      'ควรพบแพทย์ จิตแพทย์ หรือนักจิตวิทยาเพื่อรับการประเมินและการดูแลที่ถูกต้อง',
      'โทรสายด่วนสุขภาพจิต 1323 ได้ทันที (โทรฟรีตลอด 24 ชม.)',
      'อย่าเก็บปัญหาไว้คนเดียว ปรึกษาคนที่คุณไว้วางใจที่สุด',
      'หากมีความคิดทำร้ายตนเอง กรุณาติดต่อหน่วยฉุกเฉินหรือคนใกล้ชิดทันที'
    ]
  }
};

export function evaluateST5Score(total: number): StressLevelDetail {
  if (total <= 4) return STRESS_LEVELS.low;
  if (total <= 7) return STRESS_LEVELS.moderate;
  if (total <= 9) return STRESS_LEVELS.high;
  return STRESS_LEVELS.severe;
}

export function formatThaiDateTime(date: Date = new Date()): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const thaiYear = date.getFullYear() + 543;
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}/${month}/${thaiYear} ${hours}:${minutes}:${seconds}`;
}
