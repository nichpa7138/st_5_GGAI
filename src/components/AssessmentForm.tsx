import React, { useState, useEffect } from 'react';
import { Member, ST5Assessment } from '../types';
import { ST5_QUESTIONS, SCORE_OPTIONS, formatThaiDateTime } from '../constants';
import { saveAssessment, getNextAssessmentNo } from '../services/storage';
import { CheckCircle2, RotateCcw, Send, Sparkles, AlertCircle, Info, Clock, User, Hash } from 'lucide-react';

interface AssessmentFormProps {
  currentUser: Member;
  onAssessmentCompleted: (assessment: ST5Assessment) => void;
}

export const AssessmentForm: React.FC<AssessmentFormProps> = ({
  currentUser,
  onAssessmentCompleted
}) => {
  const [answers, setAnswers] = useState<Record<string, number | null>>({
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    q5: null
  });

  const [currentDateTime, setCurrentDateTime] = useState(formatThaiDateTime());
  const [nextNo, setNextNo] = useState(getNextAssessmentNo());
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(formatThaiDateTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update nextNo on mount
  useEffect(() => {
    setNextNo(getNextAssessmentNo());
  }, []);

  const handleSelectScore = (questionId: string, score: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: score
    }));
    setErrorMessage('');
  };

  const answeredCount = Object.values(answers).filter((v) => v !== null).length;
  const currentTotal = Object.values(answers).reduce((acc: number, val) => (acc || 0) + (val !== null ? (val as number) : 0), 0);

  const handleReset = () => {
    if (window.confirm('คุณต้องการล้างคำตอบทั้งหมดและเริ่มตอบใหม่หรือไม่?')) {
      setAnswers({
        q1: null,
        q2: null,
        q3: null,
        q4: null,
        q5: null
      });
      setErrorMessage('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Verify all 5 answered
    const unanswered = ST5_QUESTIONS.filter((q) => answers[q.id] === null);
    if (unanswered.length > 0) {
      setErrorMessage(`กรุณาตอบคำถามให้ครบทุกข้อ (ยังขาดอีก ${unanswered.length} ข้อ)`);
      return;
    }

    setIsSubmitting(true);

    const saved = saveAssessment({
      dat_time: currentDateTime,
      st_id: currentUser.st_id,
      q1: answers.q1 as number,
      q2: answers.q2 as number,
      q3: answers.q3 as number,
      q4: answers.q4 as number,
      q5: answers.q5 as number
    });

    setTimeout(() => {
      setIsSubmitting(false);
      onAssessmentCompleted(saved);
    }, 400);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Info Card */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-pink-500/20 relative overflow-hidden">
        {/* Abstract decorative bubbles */}
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-32 h-32 bg-rose-400/30 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>แบบประเมินความเครียด 5 ข้อ (ST-5)</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            ประเมินระดับความเครียดของคุณ
          </h1>
          <p className="text-pink-100 text-sm max-w-xl leading-relaxed">
            ในช่วง 2 ถึง 4 สัปดาห์ที่ผ่านมาจนถึงปัจจุบัน ท่านมีความรู้สึกหรือมีอาการเหล่านี้บ่อยเพียงใด
          </p>

          {/* Auto Metadata badges */}
          <div className="mt-6 pt-4 border-t border-white/20 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2 bg-black/10 px-3 py-2 rounded-xl backdrop-blur-xs">
              <Hash className="w-4 h-4 text-pink-200 shrink-0" />
              <div>
                <span className="text-pink-200 block text-[10px]">ลำดับ (no)</span>
                <span className="font-bold text-sm">#{nextNo} (อัตโนมัติ)</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-black/10 px-3 py-2 rounded-xl backdrop-blur-xs">
              <User className="w-4 h-4 text-pink-200 shrink-0" />
              <div>
                <span className="text-pink-200 block text-[10px]">ผู้ประเมิน (st_id)</span>
                <span className="font-bold text-sm truncate">{currentUser.name} ({currentUser.st_id})</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-black/10 px-3 py-2 rounded-xl backdrop-blur-xs">
              <Clock className="w-4 h-4 text-pink-200 shrink-0" />
              <div>
                <span className="text-pink-200 block text-[10px]">วันเวลา (dat_time)</span>
                <span className="font-bold text-xs">{currentDateTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar & Realtime Score Preview */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-pink-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-2/3 space-y-1.5">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-1.5 text-pink-600">
              <CheckCircle2 className="w-4 h-4" />
              ตอบไปแล้ว {answeredCount} จาก 5 ข้อ
            </span>
            <span className="text-slate-400">{Math.round((answeredCount / 5) * 100)}%</span>
          </div>
          <div className="w-full bg-pink-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-pink-500 to-rose-500 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${(answeredCount / 5) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block font-medium">สถานะการตอบ</span>
            <span className={`text-sm font-bold ${answeredCount === 5 ? 'text-emerald-600' : 'text-pink-600'}`}>
              {answeredCount === 5 ? 'ตอบครบ 5 ข้อแล้ว' : `ยังเหลืออีก ${5 - answeredCount} ข้อ`}
            </span>
          </div>

          <button
            type="button"
            onClick={handleReset}
            title="ล้างคำตอบ"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer border border-slate-200"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error notification */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-700 text-sm animate-bounce">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* 5 Questions Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {ST5_QUESTIONS.map((question, index) => {
          const selectedVal = answers[question.id];
          const isAnswered = selectedVal !== null;

          return (
            <div
              key={question.id}
              className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all duration-200 shadow-xs ${
                isAnswered
                  ? 'border-pink-300 ring-1 ring-pink-100'
                  : 'border-slate-200/80 hover:border-pink-200'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-pink-100 text-pink-700 font-bold text-xs">
                      {index + 1}
                    </span>
                    <span className="text-xs font-semibold text-pink-600 uppercase tracking-wider font-mono">
                      ข้อ {question.id.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-800 leading-snug">
                    {question.title.replace(/^\d+\.\s*/, '')}
                  </h3>
                  {question.subtitle && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      {question.subtitle}
                    </p>
                  )}
                </div>

                {isAnswered && (
                  <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-pink-100 text-pink-700 border border-pink-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ตอบแล้ว</span>
                  </span>
                )}
              </div>

              {/* 4 Score Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {SCORE_OPTIONS.map((opt) => {
                  const isOptionActive = selectedVal === opt.score;
                  return (
                    <button
                      key={opt.score}
                      type="button"
                      onClick={() => handleSelectScore(question.id, opt.score)}
                      className={`relative p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                        isOptionActive
                          ? 'bg-gradient-to-b from-pink-50 to-rose-50/80 border-pink-400 ring-2 ring-pink-300/40 shadow-xs'
                          : 'bg-slate-50/70 border-slate-200/80 hover:bg-pink-50/40 hover:border-pink-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                            isOptionActive
                              ? 'border-pink-500 bg-pink-500 text-white shadow-xs'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isOptionActive && <span className="w-2 h-2 rounded-full bg-white" />}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {opt.description}
                        </span>
                      </div>

                      <div className="font-semibold text-xs sm:text-sm text-slate-800 leading-snug">
                        {opt.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Submit & Calculate Actions */}
        <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-base rounded-2xl shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 transition duration-200 transform active:scale-98 cursor-pointer disabled:opacity-70"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>คำนวณและบันทึกผลการประเมิน (Submit ST-5)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
