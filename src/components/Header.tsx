import React from 'react';
import { Member } from '../types';
import { LogOut, History, HeartPulse, FileText } from 'lucide-react';

interface HeaderProps {
  currentUser: Member | null;
  activeTab: 'assessment' | 'history' | 'login' | 'register' | 'result';
  setActiveTab: (tab: 'assessment' | 'history' | 'login' | 'register' | 'result') => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onLogout
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-pink-100 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* App Logo & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (currentUser) setActiveTab('assessment');
                else setActiveTab('login');
              }}
              className="flex items-center gap-3 text-left group transition cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-400 to-pink-300 flex items-center justify-center text-white shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform duration-200">
                <HeartPulse className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg sm:text-xl text-slate-800 tracking-tight group-hover:text-pink-600 transition">
                    ST-5 Stress Check
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-pink-100 text-pink-700 border border-pink-200">
                    แบบประเมิน 5 ข้อ
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block">
                  ระบบคัดกรองและประเมินระดับความเครียด กรมสุขภาพจิต
                </p>
              </div>
            </button>
          </div>

          {/* Navigation & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentUser ? (
              <>
                {/* Tab buttons */}
                <div className="hidden md:flex items-center bg-pink-50/80 p-1 rounded-xl border border-pink-100">
                  <button
                    onClick={() => setActiveTab('assessment')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                      activeTab === 'assessment' || activeTab === 'result'
                        ? 'bg-white text-pink-700 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-pink-600'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>ทำแบบประเมิน</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('history')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                      activeTab === 'history'
                        ? 'bg-white text-pink-700 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-pink-600'
                    }`}
                  >
                    <History className="w-4 h-4" />
                    <span>ประวัติย้อนหลัง</span>
                  </button>
                </div>

                {/* Logged in User Pill */}
                <div className="flex items-center gap-2 pl-2 border-l border-pink-200">
                  <div className="hidden lg:flex flex-col text-right">
                    <span className="text-xs font-semibold text-slate-800">
                      {currentUser.name} {currentUser.lname}
                    </span>
                    <span className="text-[11px] text-pink-600 font-mono">
                      ID: {currentUser.st_id}
                    </span>
                  </div>

                  <div className="w-9 h-9 rounded-full bg-pink-100 border border-pink-300 flex items-center justify-center text-pink-700 font-bold text-sm shadow-xs">
                    {currentUser.name.charAt(0)}
                  </div>

                  <button
                    onClick={onLogout}
                    title="ออกจากระบบ (Log Out)"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                {activeTab === 'login' ? (
                  <button
                    onClick={() => setActiveTab('register')}
                    className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-xl shadow-xs shadow-pink-500/20 transition cursor-pointer"
                  >
                    สมัครสมาชิกใหม่
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('login')}
                    className="px-4 py-2 text-xs sm:text-sm font-semibold text-pink-700 bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded-xl transition cursor-pointer"
                  >
                    เข้าสู่ระบบ
                  </button>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Mobile secondary tab bar when logged in */}
        {currentUser && (
          <div className="flex md:hidden border-t border-pink-100 py-2 justify-around">
            <button
              onClick={() => setActiveTab('assessment')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg ${
                activeTab === 'assessment' || activeTab === 'result'
                  ? 'bg-pink-100 text-pink-700 font-bold'
                  : 'text-slate-600'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              ทำแบบประเมิน
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg ${
                activeTab === 'history'
                  ? 'bg-pink-100 text-pink-700 font-bold'
                  : 'text-slate-600'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              ประวัติย้อนหลัง
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
