import React, { useState } from 'react';
import { Member } from '../types';
import { saveMember } from '../services/storage';
import { UserPlus, User, Lock, Calendar, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

interface RegisterFormProps {
  onRegisterSuccess: (member: Member) => void;
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegisterSuccess,
  onSwitchToLogin
}) => {
  const [stId, setStId] = useState('');
  const [name, setName] = useState('');
  const [lname, setLname] = useState('');
  const [dob, setDob] = useState('');
  
  // Date picker helper state
  const [calendarDate, setCalendarDate] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // When date picker changes (YYYY-MM-DD from HTML date input)
  const handleCalendarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value; // e.g. "2001-10-29"
    setCalendarDate(val);
    if (val) {
      const [year, month, day] = val.split('-');
      // Convert CE year to Thai BE year (+543) e.g. 1991 -> 2534
      const thaiYear = parseInt(year, 10) + 543;
      const formatted = `${day}${month}${thaiYear}`;
      setDob(formatted);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (stId.length !== 10) {
      setErrorMsg('รหัสนักศึกษาต้องเป็นตัวเลข 10 หลัก (เช่น 6900000004)');
      return;
    }

    if (!name.trim()) {
      setErrorMsg('กรุณากรอกชื่อ');
      return;
    }

    if (!lname.trim()) {
      setErrorMsg('กรุณากรอกนามสกุล');
      return;
    }

    const cleanDob = dob.replace(/\D/g, '');
    if (cleanDob.length !== 8) {
      setErrorMsg('วันเดือนปีเกิดต้องเป็นตัวเลข 8 หลัก ววดดปปปป (เช่น 29102534)');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = saveMember({
        st_id: stId,
        name: name.trim(),
        lname: lname.trim(),
        dob: cleanDob
      });

      setIsLoading(false);

      if (res.success && res.member) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          onRegisterSuccess(res.member!);
        }, 600);
      } else {
        setErrorMsg(res.message);
      }
    }, 400);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-pink-500/10 border border-pink-100 overflow-hidden">
        {/* Background glow circle */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-pink-100/70 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-rose-100/60 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white shadow-md shadow-pink-500/25 mb-3">
              <UserPlus className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              สมัครสมาชิกใหม่ (Register)
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              กรอกข้อมูลสมาชิกสำหรับเข้าใช้งานระบบประเมิน ST-5
            </p>
          </div>

          {/* Error / Success Alert */}
          {errorMsg && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-700 text-sm animate-fade-in">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-emerald-700 text-sm animate-fade-in">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Student ID (st_id) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                st_id : รหัสนักศึกษา (10 หลัก) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  maxLength={10}
                  inputMode="numeric"
                  placeholder="เช่น 6900000004"
                  value={stId}
                  onChange={(e) => setStId(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition text-base font-mono"
                  required
                />
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
                <span>ใช้เป็น Primary Key และ Username สำหรับเข้าสู่ระบบ</span>
                <span className={stId.length === 10 ? 'text-emerald-600 font-semibold' : 'text-slate-400'}>
                  {stId.length}/10
                </span>
              </div>
            </div>

            {/* Name & Lastname (Grid 2 cols) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  name : ชื่อ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="เช่น นิชาภา"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  lname : นามสกุล <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="เช่น จำปาศรี"
                  value={lname}
                  onChange={(e) => setLname(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition text-sm"
                  required
                />
              </div>
            </div>

            {/* Date of Birth (dob) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  dob : วันเดือนปีเกิด (ววดดปปปป) <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-pink-600">ใช้เป็น Password</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* 8-digit Direct format input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    maxLength={8}
                    inputMode="numeric"
                    placeholder="29102534 (ววดดปปปป)"
                    value={dob}
                    onChange={(e) => setDob(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition text-sm font-mono tracking-wider"
                    required
                  />
                </div>

                {/* Calendar helper input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    value={calendarDate}
                    onChange={handleCalendarChange}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition cursor-pointer"
                    title="เลือกจากปฏิทินเพื่อแปลงเป็น พ.ศ."
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                ตัวอย่าง: วันที่ 29 ต.ค. 2534 ให้ใส่ <span className="font-semibold text-pink-600">29102534</span> (หรือเลือกจากปฏิทิน)
              </p>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white font-semibold rounded-xl shadow-md shadow-pink-500/25 flex items-center justify-center gap-2 transition duration-200 transform active:scale-98 cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>บันทึกข้อมูลสมาชิก</span>
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 text-center pt-4 border-t border-pink-100">
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-sm font-medium text-slate-600 hover:text-pink-600 inline-flex items-center gap-1.5 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>มีบัญชีอยู่แล้ว? เข้าสู่ระบบ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
