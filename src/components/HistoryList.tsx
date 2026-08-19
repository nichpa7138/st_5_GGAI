import React, { useState } from 'react';
import { Member, ST5Assessment } from '../types';
import { getAssessmentsByStudentId, exportToCSV } from '../services/storage';
import { evaluateST5Score, ST5_QUESTIONS } from '../constants';
import { History, RotateCcw, Download, Calendar, Sparkles, User, FileText, ChevronDown, ChevronUp, AlertCircle, TrendingUp, CheckCircle } from 'lucide-react';

interface HistoryListProps {
  currentUser: Member;
  onRetake: () => void;
  onSelectAssessment: (assessment: ST5Assessment) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  currentUser,
  onRetake,
  onSelectAssessment
}) => {
  const history = getAssessmentsByStudentId(currentUser.st_id);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (no: number) => {
    setExpandedId(expandedId === no ? null : no);
  };

  // Calculate statistics
  const totalCount = history.length;
  const avgScore = totalCount > 0 ? (history.reduce((acc, h) => acc + h.total, 0) / totalCount).toFixed(1) : '0';
  const latestAssessment = history[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Profile & Summary */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-md shadow-pink-500/5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-pink-500/20">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-800">
                  {currentUser.name} {currentUser.lname}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-100 text-pink-700">
                  นักศึกษา
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                รหัสนักศึกษา (st_id): <span className="font-semibold text-slate-700">{currentUser.st_id}</span>
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onRetake}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs rounded-xl shadow-xs shadow-pink-500/20 flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ทำแบบประเมินใหม่</span>
            </button>

            <button
              onClick={() => exportToCSV('st_5')}
              title="ส่งออกไฟล์ CSV"
              className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl transition flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-pink-50/60 border border-pink-100">
            <span className="text-xs text-slate-500 font-medium block">จำนวนครั้งที่ประเมิน</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-pink-700 font-mono">{totalCount}</span>
              <span className="text-xs text-slate-500">ครั้ง</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100">
            <span className="text-xs text-slate-500 font-medium block">คะแนนเฉลี่ย</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-rose-700 font-mono">{avgScore}</span>
              <span className="text-xs text-slate-500">/ 15 คะแนน</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs text-slate-500 font-medium block">ผลประเมินล่าสุด</span>
            <div className="flex items-center gap-2 mt-1">
              {latestAssessment ? (
                <>
                  <span className="text-xl">{latestAssessment.emoji}</span>
                  <span className="text-xs font-bold text-slate-800 truncate">
                    {latestAssessment.result} ({latestAssessment.total} คะแนน)
                  </span>
                </>
              ) : (
                <span className="text-xs text-slate-400">ยังไม่มีข้อมูล</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Historical List Items (Sorted Newest First) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <History className="w-4 h-4 text-pink-600" />
            <span>ประวัติการประเมินความเครียด ST-5 (ครั้งล่าสุดอยู่บนสุด)</span>
          </h3>
          <span className="text-xs text-slate-400">
            ทั้งหมด {history.length} รายการ
          </span>
        </div>

        {history.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-pink-100 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center mx-auto mb-3">
              <FileText className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-800 mb-1">ยังไม่มีประวัติการประเมิน</h4>
            <p className="text-xs text-slate-500 mb-5 max-w-sm mx-auto">
              คุณยังไม่เคยทำแบบประเมินความเครียด 5 ข้อ เริ่มทำแบบประเมินเพื่อติดตามสุขภาพจิตของคุณได้เลย
            </p>
            <button
              onClick={onRetake}
              className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs rounded-xl shadow-md shadow-pink-500/20 inline-flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>เริ่มทำแบบประเมิน ST-5</span>
            </button>
          </div>
        ) : (
          history.map((item, idx) => {
            const level = evaluateST5Score(item.total);
            const isExpanded = expandedId === item.no;
            const isLatest = idx === 0;

            return (
              <div
                key={item.no}
                className={`bg-white rounded-2xl border transition-all shadow-xs ${
                  isLatest
                    ? 'border-pink-300 ring-1 ring-pink-200'
                    : 'border-slate-200 hover:border-pink-200'
                }`}
              >
                {/* Header row */}
                <div
                  onClick={() => toggleExpand(item.no)}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    {/* Emoji badge */}
                    <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-2xl shrink-0">
                      {item.emoji}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-500 font-mono">
                          ลำดับ #{item.no}
                        </span>
                        {isLatest && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-pink-500 text-white uppercase tracking-wider">
                            ล่าสุด (Latest)
                          </span>
                        )}
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${level.badgeColor}`}>
                          {item.result}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.dat_time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Score & Toggle */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">คะแนนรวม</span>
                      <span className="text-lg sm:text-xl font-black text-pink-600 font-mono">
                        {item.total} <span className="text-xs text-slate-400 font-normal">/ 15</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Collapsible Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl space-y-4">
                    {/* Itemized Questions */}
                    <div>
                      <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        คะแนนรายข้อ
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {ST5_QUESTIONS.map((q) => (
                          <div
                            key={q.id}
                            className="bg-white p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs"
                          >
                            <span className="text-slate-600 truncate pr-2">{q.title}</span>
                            <span className="font-bold text-pink-600 font-mono shrink-0">
                              {item[q.id]} คะแนน
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Advice summary */}
                    <div className="p-3 bg-white rounded-xl border border-pink-100">
                      <div className="text-xs font-semibold text-slate-800 mb-1">
                        คำแนะนำสำหรับผลประเมินนี้:
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {level.description}
                      </p>
                    </div>

                    {/* View full result button */}
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => onSelectAssessment(item)}
                        className="text-xs font-semibold text-pink-600 hover:text-pink-700 underline underline-offset-2 cursor-pointer"
                      >
                        ดูหน้ารายงานผลฉบับเต็ม &rarr;
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
