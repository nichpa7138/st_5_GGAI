import React, { useState } from 'react';
import { GOOGLE_SHEET_ID, GOOGLE_SHEET_URL } from '../constants';
import { APPS_SCRIPT_CODE } from '../services/appsScriptTemplate';
import { getGoogleWebAppUrl, setGoogleWebAppUrl, pullDataFromGoogleSheet, exportToCSV } from '../services/storage';
import { X, ExternalLink, Copy, Check, FileSpreadsheet, RefreshCw, Download, Layers, ShieldCheck, Sparkles } from 'lucide-react';

interface GoogleSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataSynced: () => void;
}

export const GoogleSheetModal: React.FC<GoogleSheetModalProps> = ({
  isOpen,
  onClose,
  onDataSynced
}) => {
  const [copied, setCopied] = useState(false);
  const [webAppUrl, setWebAppUrlState] = useState(getGoogleWebAppUrl());
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveUrl = () => {
    setGoogleWebAppUrl(webAppUrl);
    setSyncStatus({ success: true, message: 'บันทึก URL เว็บแอปเรียบร้อยแล้ว' });
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const handlePullSync = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    const result = await pullDataFromGoogleSheet();
    setIsSyncing(false);
    setSyncStatus(result);
    if (result.success) {
      onDataSynced();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-pink-100 p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0 shadow-xs">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              การเชื่อมต่อ Google Sheets
            </h3>
            <p className="text-xs text-slate-500">
              เชื่อมโยงข้อมูลชีท <span className="font-semibold text-emerald-700">member</span> และ <span className="font-semibold text-emerald-700">st_5</span>
            </p>
          </div>
        </div>

        {/* Sheet ID Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Google Sheet ID
            </span>
            <a
              href={GOOGLE_SHEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>เปิด Google Sheet</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono text-xs text-slate-800 break-all select-all font-semibold">
            {GOOGLE_SHEET_ID}
          </div>
        </div>

        {/* 2 Sheet Tabs overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="p-3.5 rounded-xl border border-pink-200 bg-pink-50/50">
            <div className="font-bold text-xs text-pink-700 mb-1 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>ชีท member (สมาชิก)</span>
            </div>
            <p className="text-[11px] text-slate-600">
              คอลัมน์: <code className="bg-white px-1 py-0.5 rounded text-pink-700">st_id</code>, <code className="bg-white px-1 py-0.5 rounded text-pink-700">name</code>, <code className="bg-white px-1 py-0.5 rounded text-pink-700">lname</code>, <code className="bg-white px-1 py-0.5 rounded text-pink-700">dob</code>
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50">
            <div className="font-bold text-xs text-rose-700 mb-1 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>ชีท st_5 (ผลประเมิน)</span>
            </div>
            <p className="text-[11px] text-slate-600">
              คอลัมน์: <code className="bg-white px-1 py-0.5 rounded text-rose-700">no</code>, <code className="bg-white px-1 py-0.5 rounded text-rose-700">dat_time</code>, <code className="bg-white px-1 py-0.5 rounded text-rose-700">st_id</code>, <code className="bg-white px-1 py-0.5 rounded text-rose-700">q1-q5</code>, <code className="bg-white px-1 py-0.5 rounded text-rose-700">total</code>, <code className="bg-white px-1 py-0.5 rounded text-rose-700">result</code>, <code className="bg-white px-1 py-0.5 rounded text-rose-700">emoji</code>
            </p>
          </div>
        </div>

        {/* Setup Web App URL Section */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-pink-50/60 to-rose-50/40 border border-pink-200 mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-pink-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>ตั้งค่า Google Apps Script Web App URL (สำหรับซิงค์ออนไลน์สด)</span>
            </h4>
          </div>

          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://script.google.com/macros/s/.../exec"
              value={webAppUrl}
              onChange={(e) => setWebAppUrlState(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs bg-white border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 font-mono text-slate-800 placeholder:text-slate-400"
            />
            <button
              onClick={handleSaveUrl}
              className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl transition shadow-xs cursor-pointer shrink-0"
            >
              บันทึก URL
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handlePullSync}
              disabled={isSyncing || !webAppUrl}
              className="px-4 py-2 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'กำลังดึงข้อมูล...' : 'ดึงข้อมูลจาก Google Sheet'}</span>
            </button>
            <span className="text-[11px] text-slate-400">
              *ข้อมูลจะถูกสำรองไว้ใน LocalStorage อัตโนมัติด้วย
            </span>
          </div>

          {syncStatus && (
            <div
              className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                syncStatus.success
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}
            >
              <span>{syncStatus.message}</span>
            </div>
          )}
        </div>

        {/* Step-by-Step Code Instructions */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              โค้ด Google Apps Script (พร้อมคัดลอกไปวาง)
            </h4>
            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>คัดลอกแล้ว!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>คัดลอกโค้ดทั้งหมด (Copy)</span>
                </>
              )}
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono max-h-48 overflow-y-auto leading-relaxed border border-slate-800">
            <pre>{APPS_SCRIPT_CODE}</pre>
          </div>

          <ol className="list-decimal list-inside text-xs text-slate-600 space-y-1 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <li>เปิด Google Sheet &rarr; เมนู <b>ส่วนขยาย (Extensions) &gt; Apps Script</b></li>
            <li>วางโค้ดที่คัดลอกลงในไฟล์ Code.gs แล้วกด บันทึก</li>
            <li>กด <b>การทำให้ใช้งานได้ (Deploy) &gt; การทำให้ใช้งานได้ใหม่ (New deployment)</b></li>
            <li>เลือกประเภท <b>เว็บแอป (Web app)</b> และสิทธิ์การเข้าถึงเป็น <b>ทุกคน (Anyone)</b></li>
            <li>คัดลอก URL เว็บแอปที่ได้มาใส่ในช่องด้านบน</li>
          </ol>
        </div>

        {/* Offline CSV Download Options */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600 text-center sm:text-left">
            <span className="font-bold text-slate-800 block">ดาวน์โหลดสำรองเป็นไฟล์ CSV</span>
            <span>สามารถนำเข้าสู่ Google Sheet ได้ทันที</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => exportToCSV('member')}
              className="px-3 py-1.5 bg-white hover:bg-pink-50 text-pink-700 border border-pink-200 text-xs font-semibold rounded-xl transition flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV สมาชิก (member)</span>
            </button>
            <button
              onClick={() => exportToCSV('st_5')}
              className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold rounded-xl transition flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV ผลประเมิน (st_5)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
