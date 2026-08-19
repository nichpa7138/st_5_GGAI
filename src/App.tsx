/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Member, ST5Assessment } from './types';
import { getCurrentUser, setCurrentUser } from './services/storage';
import { Header } from './components/Header';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { AssessmentForm } from './components/AssessmentForm';
import { ResultCard } from './components/ResultCard';
import { HistoryList } from './components/HistoryList';

export default function App() {
  const [currentUser, setCurrentUserState] = useState<Member | null>(null);
  const [activeTab, setActiveTab] = useState<'assessment' | 'history' | 'login' | 'register' | 'result'>('login');
  const [currentAssessment, setCurrentAssessment] = useState<ST5Assessment | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Initialize current user from storage
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUserState(user);
      setActiveTab('assessment');
    } else {
      setActiveTab('login');
    }
  }, []);

  const handleLoginSuccess = (member: Member) => {
    setCurrentUserState(member);
    setActiveTab('assessment');
  };

  const handleRegisterSuccess = (member: Member) => {
    setCurrentUserState(member);
    setActiveTab('assessment');
  };

  const handleLogout = () => {
    if (window.confirm('คุณต้องการออกจากระบบหรือไม่?')) {
      setCurrentUser(null);
      setCurrentUserState(null);
      setCurrentAssessment(null);
      setActiveTab('login');
    }
  };

  const handleAssessmentCompleted = (assessment: ST5Assessment) => {
    setCurrentAssessment(assessment);
    setActiveTab('result');
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleRetake = () => {
    setCurrentAssessment(null);
    setActiveTab('assessment');
  };

  const handleViewHistory = () => {
    setActiveTab('history');
  };

  const handleSelectAssessmentFromHistory = (assessment: ST5Assessment) => {
    setCurrentAssessment(assessment);
    setActiveTab('result');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50/50 via-rose-50/30 to-slate-100/60 text-slate-800 antialiased selection:bg-pink-200 selection:text-pink-900">
      {/* Top Navigation Bar */}
      <Header
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

        {/* View Routing */}
        {!currentUser ? (
          <div className="py-4 sm:py-8">
            {activeTab === 'register' ? (
              <RegisterForm
                onRegisterSuccess={handleRegisterSuccess}
                onSwitchToLogin={() => setActiveTab('login')}
              />
            ) : (
              <LoginForm
                onLoginSuccess={handleLoginSuccess}
                onSwitchToRegister={() => setActiveTab('register')}
              />
            )}
          </div>
        ) : (
          <div className="transition-all duration-300">
            {activeTab === 'assessment' && (
              <AssessmentForm
                currentUser={currentUser}
                onAssessmentCompleted={handleAssessmentCompleted}
              />
            )}

            {activeTab === 'result' && currentAssessment && (
              <ResultCard
                assessment={currentAssessment}
                currentUser={currentUser}
                onRetake={handleRetake}
                onViewHistory={handleViewHistory}
              />
            )}

            {activeTab === 'history' && (
              <HistoryList
                key={refreshTrigger}
                currentUser={currentUser}
                onRetake={handleRetake}
                onSelectAssessment={handleSelectAssessmentFromHistory}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-pink-100 bg-white/70 backdrop-blur-sm py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 space-y-2">
          <div className="flex items-center justify-center gap-1 text-slate-600 font-medium">
            <span>แบบประเมินความเครียด 5 ข้อ (ST-5) กรมสุขภาพจิต กระทรวงสาธารณสุข</span>
          </div>
          <p className="text-slate-400">
            เหมาะสำหรับการคัดกรองความเครียดเบื้องต้น สำหรับนักเรียน นักศึกษา และบุคคลทั่วไป
          </p>
          <div className="pt-2 flex items-center justify-center gap-4 text-[11px]">
            <a
              href="tel:1323"
              className="hover:underline text-rose-600 font-semibold inline-flex items-center gap-1"
            >
              สายด่วนสุขภาพจิต 1323 (โทรฟรีตลอด 24 ชั่วโมง)
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
