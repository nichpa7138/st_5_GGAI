import React, { useState } from 'react';
import { Member } from '../types';
import { loginMember, getMembers } from '../services/storage';
import { User, Lock, ArrowRight, UserPlus, Sparkles, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';

interface LoginFormProps {
  onLoginSuccess: (member: Member) => void;
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLoginSuccess,
  onSwitchToRegister
}) => {
  const [studentId, setStudentId] = useState('');
  const [dob, setDob] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sampleMembers = getMembers().slice(0, 3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!studentId.trim()) {
      setErrorMsg('กรุณากรอกรหัสนักศึกษา (Username)');
      return;
    }

    if (studentId.trim().length !== 10) {
      setErrorMsg('รหัสนักศึกษาต้องเป็นตัวเลข 10 หลัก');
      return;
    }

    if (!dob.trim()) {
      setErrorMsg('กรุณากรอกวันเดือนปีเกิด (Password)');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = loginMember(studentId, dob);
      setIsLoading(false);
      if (res.success && res.member) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          onLoginSuccess(res.member!);
        }, 500);
      } else {
        setErrorMsg(res.message);
      }
    }, 300);
  };

  const handleQuickLogin = (member: Member) => {
    setStudentId(member.st_id);
    setDob(member.dob);
    setErrorMsg('');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Pink decorative card wrapper */}
      <div className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-pink-500/10 border border-pink-100 overflow-hidden">
        {/* Background glow circle */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-pink-100/70 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-rose-100/60 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white shadow-md shadow-pink-500/25 mb-3">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              เข้าสู่ระบบ (Log In)
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              ระบบประเมินความเครียด 5 ข้อ (ST-5)
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
            {/* Username / Student ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Username (รหัสนักศึกษา 10 หลัก) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  maxLength={10}
                  inputMode="numeric"
                  placeholder="เช่น 6900000001"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition text-base font-mono"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                กรอกรหัสนักศึกษา 10 หลักที่ลงทะเบียนไว้
              </p>
            </div>

            {/* Password / DOB */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password (วันเดือนปีเกิด ววดดปปปป) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  maxLength={8}
                  inputMode="numeric"
                  placeholder="เช่น 29102534 (ววดดปปปป)"
                  value={dob}
                  onChange={(e) => setDob(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition text-base font-mono tracking-wider"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                เช่น เกิดวันที่ 29 ตุลาคม 2534 ให้ใส่ <span className="font-semibold text-pink-600">29102534</span>
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
                  <span>เข้าสู่ระบบ</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Chips */}
          {sampleMembers.length > 0 && (
            <div className="mt-6 pt-5 border-t border-dashed border-pink-200">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-pink-700 mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                <span>คลิกทดสอบเข้าสู่ระบบด่วน (Demo Accounts):</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {sampleMembers.map((m) => (
                  <button
                    key={m.st_id}
                    type="button"
                    onClick={() => handleQuickLogin(m)}
                    className="w-full text-left px-3 py-2 bg-pink-50/70 hover:bg-pink-100/80 border border-pink-200 rounded-lg text-xs transition flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <span className="font-semibold text-slate-800">
                        {m.name} {m.lname}
                      </span>
                      <span className="text-slate-500 ml-2 font-mono">
                        ({m.st_id})
                      </span>
                    </div>
                    <span className="text-[11px] text-pink-600 group-hover:underline">
                      เลือกใช้นี้ &rarr;
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Switch to Register */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              ยังไม่มีบัญชีนักศึกษา?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="font-semibold text-pink-600 hover:text-pink-700 underline underline-offset-2 cursor-pointer inline-flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                สมัครสมาชิกที่นี่
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
