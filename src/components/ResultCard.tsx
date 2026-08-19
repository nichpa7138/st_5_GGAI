import React, { useEffect } from 'react';
import { Member, ST5Assessment } from '../types';
import { evaluateST5Score, STRESS_LEVELS, ST5_QUESTIONS } from '../constants';
import confetti from 'canvas-confetti';
import { RotateCcw, History, Sparkles, PhoneCall, HeartHandshake, CheckCircle2, AlertTriangle, ShieldCheck, Share2 } from 'lucide-react';

interface ResultCardProps {
  assessment: ST5Assessment;
  currentUser: Member;
  onRetake: () => void;
  onViewHistory: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  assessment,
  currentUser,
  onRetake,
  onViewHistory
}) => {
  const level = evaluateST5Score(assessment.total);

  // Trigger confetti if low or moderate stress
  useEffect(() => {
    if (level.key === 'low') {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  }, [level.key]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Main Result Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-xl shadow-pink-500/10 relative overflow-hidden">
        {/* Top Decorative accent header */}
        <div className={`h-3 w-full absolute top-0 left-0 ${
          level.key === 'low'
            ? 'bg-emerald-500'
            : level.key === 'moderate'
            ? 'bg-amber-500'
            : level.key === 'high'
            ? 'bg-orange-500'
            : 'bg-rose-600'
        }`} />

        <div className="text-center pt-2">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-pink-50 text-pink-700 border border-pink-200 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ผลการประเมิน ST-5 (ลำดับที่ #{assessment.no})</span>
          </div>

          {/* Big Emoji presentation */}
          <div className="relative inline-block mb-3">
            <div className="text-6xl sm:text-7xl filter drop-shadow-md animate-bounce">
              {level.emoji}
            </div>
          </div>

          {/* Stress Label & Score */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            {level.label.split(' (')[0]}
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            {level.subTitle}
          </p>

          {/* Total Score Gauge Display */}
          <div className="mt-6 max-w-sm mx-auto p-4 rounded-2xl bg-gradient-to-b from-pink-50/70 to-rose-50/50 border border-pink-100">
            <span className="text-xs text-slate-500 block font-medium">คะแนนรวมทั้งหมด (Total Score)</span>
            <div className="flex items-baseline justify-center gap-1 my-1">
              <span className="text-4xl sm:text-5xl font-black text-pink-600 font-mono">
                {assessment.total}
              </span>
              <span className="text-base text-slate-400 font-medium">/ 15 คะแนน</span>
            </div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${level.badgeColor}`}>
              {level.label}
            </span>
          </div>
        </div>

        {/* 4-tier Stress Scale visual reference */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 text-center sm:text-left">
            เกณฑ์การแปลผลความเครียด ST-5
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.values(STRESS_LEVELS).map((tier) => {
              const isCurrent = tier.key === level.key;
              return (
                <div
                  key={tier.key}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isCurrent
                      ? `${tier.bgColor} ${tier.borderColor} ring-2 ring-pink-400/40 shadow-xs`
                      : 'bg-slate-50/60 border-slate-100 opacity-60'
                  }`}
                >
                  <div className="text-lg mb-0.5">{tier.emoji}</div>
                  <div className="text-xs font-bold text-slate-800">{tier.minScore} - {tier.maxScore} คะแนน</div>
                  <div className="text-[11px] font-medium text-slate-600 truncate mt-0.5">
                    {tier.label.split(' (')[0].replace('ความเครียดระดับ', '')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Description & Recommendations */}
        <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
          <div>
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-pink-600" />
              <span>ความหมายและการแปลผล</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              {level.description}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>ข้อแนะนำการปฏิบัติตัว</span>
            </h4>
            <ul className="mt-2 space-y-1.5 text-xs sm:text-sm text-slate-600">
              {level.adviceList.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mental Health Hotline Box */}
          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-pink-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <PhoneCall className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  สายด่วนสุขภาพจิต กรมสุขภาพจิต
                </span>
                <span className="text-xs text-slate-500">
                  โทรฟรี 24 ชั่วโมง รับคำปรึกษาจากผู้เชี่ยวชาญ
                </span>
              </div>
            </div>
            <a
              href="tel:1323"
              className="w-full sm:w-auto px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition text-center shadow-xs cursor-pointer"
            >
              โทร 1323
            </a>
          </div>
        </div>

        {/* Detailed Breakdown per Question */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            คะแนนรายข้อ (Itemized Score)
          </h4>
          <div className="space-y-2">
            {ST5_QUESTIONS.map((q) => {
              const scoreVal = assessment[q.id];
              return (
                <div
                  key={q.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <span className="text-slate-700 truncate pr-2 font-medium">
                    {q.title}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-pink-100 text-pink-700 font-bold font-mono shrink-0">
                    {scoreVal} คะแนน
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Assessment Metadata */}
        <div className="mt-6 pt-4 border-t border-dashed border-slate-200 text-center text-xs text-slate-400">
          ผู้ประเมิน: <span className="font-semibold text-slate-700">{currentUser.name} {currentUser.lname}</span> ({currentUser.st_id}) | วันเวลาที่บันทึก: {assessment.dat_time}
        </div>
      </div>

      {/* Action Buttons: "คำนวณใหม่" and "ดูประวัติย้อนหลัง" */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onRetake}
          className="w-full py-3.5 px-5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-2xl shadow-md shadow-pink-500/20 flex items-center justify-center gap-2 transition duration-200 transform active:scale-98 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>คำนวณใหม่ / ทำแบบประเมินอีกครั้ง</span>
        </button>

        <button
          type="button"
          onClick={onViewHistory}
          className="w-full py-3.5 px-5 bg-white hover:bg-pink-50 text-pink-700 font-bold rounded-2xl border border-pink-200 shadow-xs flex items-center justify-center gap-2 transition duration-200 transform active:scale-98 cursor-pointer"
        >
          <History className="w-4 h-4" />
          <span>ดูประวัติย้อนหลัง (History)</span>
        </button>
      </div>
    </div>
  );
};
