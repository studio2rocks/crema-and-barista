import React, { useState, useRef } from 'react';
import {
  Shield,
  Database,
  Cloud,
  Download,
  Upload,
  RefreshCw,
  Server,
  Lock,
  Key,
  CheckCircle,
  AlertTriangle,
  FileJson,
  Trash2,
  Edit2,
  Plus,
  LogOut,
  Sparkles,
  Car,
  Coffee,
  Check,
  Globe,
  Sliders,
  Clock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { CarsAndCoffeeEntry, WorldwidePaddockDriver } from '../types/coffee';
import { GarageCar } from './MyGarage';
import {
  AdminSession,
  updateAdminCredentials,
  resetCredentialsToDefault,
} from '../utils/authService';
import {
  DatabaseHostConfig,
  DatabaseHostType,
  getStoredHostConfig,
  saveHostConfig,
  downloadDatabaseBackup,
  validateAndParseBackupJson,
  testHostConnection,
  uploadToDatabaseHost,
  pullFromDatabaseHost,
  getSyncLogs,
  SyncLogEntry,
  FullDatabaseSnapshot,
} from '../utils/databaseSyncService';

interface AdminPortalProps {
  session: AdminSession;
  onLogout: () => void;
  entries: CarsAndCoffeeEntry[];
  onUpdateEntries: (entries: CarsAndCoffeeEntry[]) => void;
  onEditEntry: (entry: CarsAndCoffeeEntry) => void;
  onDeleteEntry: (id: string) => void;
  onOpenLogModal: () => void;
  garageCars?: GarageCar[];
  onUpdateGarageCars?: (cars: GarageCar[]) => void;
  triggerToast: (msg: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  session,
  onLogout,
  entries,
  onUpdateEntries,
  onEditEntry,
  onDeleteEntry,
  onOpenLogModal,
  garageCars = [],
  onUpdateGarageCars,
  triggerToast,
}) => {
  const [activeTab, setActiveTab] = useState<'database' | 'ledger' | 'security'>('database');

  // Cloud Host State
  const [hostConfig, setHostConfig] = useState<DatabaseHostConfig>(getStoredHostConfig());
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [isTestingConnection, setIsTestingConnection] = useState<boolean>(false);
  const [connectionTestResult, setConnectionTestResult] = useState<{
    success: boolean;
    message: string;
    latencyMs?: number;
  } | null>(null);

  // Upload to Host State
  const [isUploadingToHost, setIsUploadingToHost] = useState<boolean>(false);
  const [isPullingFromHost, setIsPullingFromHost] = useState<boolean>(false);

  // File Restore State
  const [uploadedFileSnapshot, setUploadedFileSnapshot] = useState<FullDatabaseSnapshot | null>(null);
  const [fileValidationReport, setFileValidationReport] = useState<{
    valid: boolean;
    error?: string;
    details?: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Logs
  const [syncLogs, setSyncLogs] = useState<SyncLogEntry[]>(getSyncLogs());

  // Security Credentials form
  const [newUsername, setNewUsername] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [securityStatus, setSecurityStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Filter for ledger tab
  const [searchFilter, setSearchFilter] = useState<string>('');

  // 1. Download Backup
  const handleDownloadBackup = () => {
    const res = downloadDatabaseBackup(entries, garageCars);
    if (res.success) {
      triggerToast(`✓ Backup downloaded: ${res.filename}`);
      setSyncLogs(getSyncLogs());
    }
  };

  // 2. Handle Uploading a Backup File
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsed = validateAndParseBackupJson(text);

      if (parsed.valid && parsed.snapshot) {
        setUploadedFileSnapshot(parsed.snapshot);
        setFileValidationReport({
          valid: true,
          details: `Validated archive: ${parsed.snapshot.entries.length} runs, ${parsed.snapshot.garageCars.length} vehicles, ${parsed.snapshot.metadata.uniqueMakes.length} makers. Schema v${parsed.snapshot.schemaVersion}.`,
        });
      } else {
        setUploadedFileSnapshot(null);
        setFileValidationReport({
          valid: false,
          error: parsed.error || 'Failed to parse JSON file.',
        });
      }
    };
    reader.readAsText(file);
  };

  // 3. Confirm Restore
  const handleApplyRestore = (mode: 'replace' | 'merge') => {
    if (!uploadedFileSnapshot) return;

    if (mode === 'replace') {
      if (
        window.confirm(
          `Are you sure you want to REPLACE all current data with the ${uploadedFileSnapshot.entries.length} records from this backup?`
        )
      ) {
        onUpdateEntries(uploadedFileSnapshot.entries);
        if (onUpdateGarageCars && uploadedFileSnapshot.garageCars.length > 0) {
          onUpdateGarageCars(uploadedFileSnapshot.garageCars);
        }
        triggerToast(`✓ Database restored: ${uploadedFileSnapshot.entries.length} entries loaded.`);
        setUploadedFileSnapshot(null);
        setFileValidationReport(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } else {
      // Merge
      const existingIds = new Set(entries.map((e) => e.id));
      const newItems = uploadedFileSnapshot.entries.filter((e) => !existingIds.has(e.id));
      onUpdateEntries([...newItems, ...entries]);
      triggerToast(`✓ Merged ${newItems.length} new entries into database.`);
      setUploadedFileSnapshot(null);
      setFileValidationReport(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // 4. Test Cloud Host Connection
  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionTestResult(null);

    const res = await testHostConnection(hostConfig);
    setIsTestingConnection(false);
    setConnectionTestResult(res);

    // Refresh host config & logs
    setHostConfig(getStoredHostConfig());
    setSyncLogs(getSyncLogs());
  };

  // 5. Upload to Cloud Host
  const handleUploadToHost = async () => {
    setIsUploadingToHost(true);
    saveHostConfig(hostConfig);

    const res = await uploadToDatabaseHost(hostConfig, entries, garageCars);
    setIsUploadingToHost(false);

    if (res.success) {
      triggerToast(`✓ Database synchronized to ${hostConfig.hostName}!`);
    } else {
      triggerToast(`⚠️ Cloud upload: ${res.message}`);
    }

    setHostConfig(getStoredHostConfig());
    setSyncLogs(getSyncLogs());
  };

  // 6. Pull from Cloud Host
  const handlePullFromHost = async () => {
    if (
      !window.confirm(
        `Pull latest database snapshot from ${hostConfig.hostName}? Any matching records will be updated.`
      )
    ) {
      return;
    }

    setIsPullingFromHost(true);
    const res = await pullFromDatabaseHost(hostConfig);
    setIsPullingFromHost(false);

    if (res.success && res.snapshot) {
      onUpdateEntries(res.snapshot.entries);
      if (onUpdateGarageCars && res.snapshot.garageCars?.length) {
        onUpdateGarageCars(res.snapshot.garageCars);
      }
      triggerToast(`✓ Pulled ${res.snapshot.entries.length} records from ${hostConfig.hostName}!`);
    } else {
      triggerToast(`⚠️ Cloud pull failed: ${res.message}`);
    }

    setHostConfig(getStoredHostConfig());
    setSyncLogs(getSyncLogs());
  };

  // 7. Save Host Configuration
  const handleSaveHostConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveHostConfig(hostConfig);
    triggerToast(`✓ Saved configuration for ${hostConfig.hostName}`);
  };

  // 8. Update Security Credentials
  const handleUpdateCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityStatus(null);

    if (newPassword !== confirmPassword) {
      setSecurityStatus({
        type: 'error',
        message: 'New password and confirmation do not match.',
      });
      return;
    }

    const res = updateAdminCredentials(newUsername, newPassword);
    if (res.success) {
      setSecurityStatus({
        type: 'success',
        message: 'Admin credentials updated successfully! Use new credentials for next login.',
      });
      setNewPassword('');
      setConfirmPassword('');
      triggerToast('✓ Admin credentials updated');
    } else {
      setSecurityStatus({
        type: 'error',
        message: res.error || 'Failed to update credentials.',
      });
    }
  };

  const handleResetCreds = () => {
    if (window.confirm('Reset admin credentials back to default (admin / paddock2026!)?')) {
      resetCredentialsToDefault();
      setNewUsername('admin');
      setNewPassword('');
      setConfirmPassword('');
      setSecurityStatus({
        type: 'success',
        message: 'Reset credentials to default: username "admin", password "paddock2026!"',
      });
      triggerToast('✓ Admin credentials reset to default');
    }
  };

  // Filtered runs for ledger manager
  const filteredEntries = entries.filter((e) => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      e.carMake.toLowerCase().includes(q) ||
      e.carModel.toLowerCase().includes(q) ||
      e.carCategory.toLowerCase().includes(q) ||
      e.city.toLowerCase().includes(q) ||
      (e.mods && e.mods.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Admin Top Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-inner">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-[10px] font-mono font-bold text-amber-300 tracking-wider uppercase">
                Admin Control Hub
              </span>
              <span className="text-xs text-stone-400">
                Session Active (Logged in as <strong className="text-white">{session.username}</strong>)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-serif tracking-tight mt-1">
              Database Backup & Cloud Host Manager
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              Manage live records, export timestamped archives, and upload database snapshots to your chosen cloud database host.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onLogout}
            className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-300 hover:text-white text-xs font-bold transition-all flex items-center gap-2"
            title="Log out of Admin session"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
        <button
          onClick={() => setActiveTab('database')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'database'
              ? 'bg-amber-500 text-stone-950 shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Database & Cloud Host</span>
        </button>

        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'ledger'
              ? 'bg-amber-500 text-stone-950 shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Ledger Records ({entries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'security'
              ? 'bg-amber-500 text-stone-950 shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Admin Security</span>
        </button>
      </div>

      {/* TAB 1: DATABASE BACKUP & CLOUD HOST */}
      {activeTab === 'database' && (
        <div className="space-y-8">
          {/* Bento Strip: 1-Click Backup Export & File Restore */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Action Card A: Database Backup */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                    <Download className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-semibold">
                    JSON Archive v2.1
                  </span>
                </div>

                <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                  Export Database Backup
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Generate an archival JSON export containing all current Cars & Coffee runs, car build modifications, coffee counters, garage vehicles, and scoring metadata.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 my-5 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-750 text-center">
                  <div>
                    <div className="text-[10px] text-stone-400 uppercase font-semibold">Runs</div>
                    <div className="text-lg font-black font-mono text-stone-900 dark:text-white">
                      {entries.length}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-400 uppercase font-semibold">Garage Cars</div>
                    <div className="text-lg font-black font-mono text-stone-900 dark:text-white">
                      {garageCars.length}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-400 uppercase font-semibold">Total Points</div>
                    <div className="text-lg font-black font-mono text-amber-500">
                      {entries.reduce((s, e) => s + e.points.totalPoints, 0)}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleDownloadBackup}
                className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>Download Database Backup (.json)</span>
              </button>
            </div>

            {/* Action Card B: Upload & Restore Backup File */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center font-bold">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-semibold">
                    File Restore
                  </span>
                </div>

                <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                  Restore / Upload Backup File
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Upload a previously saved `.json` database file to restore runs, garage vehicles, and leaderboard standings.
                </p>

                {/* File Dropzone / Picker */}
                <div className="my-5">
                  <label className="border-2 border-dashed border-stone-200 dark:border-stone-700 hover:border-amber-500 dark:hover:border-amber-400 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-stone-50/50 dark:bg-stone-800/30">
                    <FileJson className="w-8 h-8 text-stone-400 mb-2" />
                    <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                      Choose or drop Cars & Coffee .json backup
                    </span>
                    <span className="text-[10px] text-stone-400 mt-0.5">
                      Accepts schema v2.x JSON exports
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json,application/json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* File Validation Status */}
                {fileValidationReport && (
                  <div
                    className={`p-3 rounded-xl text-xs mb-4 ${
                      fileValidationReport.valid
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                        : 'bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400'
                    }`}
                  >
                    {fileValidationReport.valid ? (
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>{fileValidationReport.details}</div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <div>{fileValidationReport.error}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {uploadedFileSnapshot ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleApplyRestore('merge')}
                    className="py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-white font-bold text-xs transition-colors"
                  >
                    Merge with Existing
                  </button>
                  <button
                    onClick={() => handleApplyRestore('replace')}
                    className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors"
                  >
                    Replace Entire DB
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 px-4 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-750 text-stone-900 dark:text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Select JSON File to Restore</span>
                </button>
              )}
            </div>
          </div>

          {/* Cloud Database Host Synchronization Panel */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-amber-600 dark:text-amber-400 font-bold uppercase">
                  <Cloud className="w-4 h-4" />
                  <span>Cloud Database Host Integration</span>
                </div>
                <h3 className="text-xl font-bold text-stone-900 dark:text-white mt-1">
                  Upload & Sync to Cloud Database Host
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-xl">
                  Connect Cars & Coffee to your designated database host (Firebase Firestore, Supabase, or Custom REST API). Synchronize entries and garage builds to the cloud.
                </p>
              </div>

              {/* Status Pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs shrink-0">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    hostConfig.lastSyncStatus === 'success'
                      ? 'bg-emerald-500 animate-pulse'
                      : hostConfig.lastSyncStatus === 'failed'
                      ? 'bg-red-500'
                      : 'bg-amber-400'
                  }`}
                />
                <span className="font-semibold text-stone-700 dark:text-stone-300">
                  {hostConfig.hostType === 'firebase'
                    ? 'Firebase Firestore'
                    : hostConfig.hostType === 'supabase'
                    ? 'Supabase Cloud'
                    : hostConfig.hostType === 'custom'
                    ? 'Custom REST Host'
                    : 'Cloud Sandbox'}
                </span>
              </div>
            </div>

            {/* Host Form */}
            <form onSubmit={handleSaveHostConfig} className="space-y-6">
              {/* Host Type Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
                  Select Database Host
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    {
                      type: 'firebase',
                      name: 'Firebase Firestore',
                      desc: 'Google Cloud NoSQL (Recommended)',
                    },
                    {
                      type: 'supabase',
                      name: 'Supabase Cloud',
                      desc: 'PostgreSQL Cloud REST',
                    },
                    {
                      type: 'custom',
                      name: 'Custom REST API',
                      desc: 'Webhook or Private Server',
                    },
                    {
                      type: 'mock',
                      name: 'Cloud Sandbox',
                      desc: 'Simulated High-Speed Host',
                    },
                  ].map((h) => (
                    <button
                      key={h.type}
                      type="button"
                      onClick={() =>
                        setHostConfig({
                          ...hostConfig,
                          hostType: h.type as DatabaseHostType,
                          hostName: h.name,
                          endpointUrl:
                            h.type === 'firebase'
                              ? 'https://firestore.googleapis.com/v1/projects/studio2rocks-paddock/databases/(default)/documents'
                              : h.type === 'supabase'
                              ? 'https://your-project.supabase.co/rest/v1/cars_and_coffee_paddock'
                              : h.type === 'custom'
                              ? 'https://api.yourdomain.com/v1/paddock/sync'
                              : 'https://sandbox.paddock.cloud/v1/sync',
                        })
                      }
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        hostConfig.hostType === h.type
                          ? 'border-amber-500 bg-amber-500/10 text-stone-900 dark:text-white shadow-sm ring-1 ring-amber-500'
                          : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 bg-stone-50/50 dark:bg-stone-850'
                      }`}
                    >
                      <div className="text-xs font-bold">{h.name}</div>
                      <div className="text-[10px] text-stone-400 mt-0.5">{h.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Endpoint & Key Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    Database Host Endpoint URL
                  </label>
                  <input
                    type="url"
                    value={hostConfig.endpointUrl}
                    onChange={(e) =>
                      setHostConfig({ ...hostConfig, endpointUrl: e.target.value })
                    }
                    placeholder="https://..."
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-[10px] text-stone-400 mt-1 block">
                    REST API document collection target or sync endpoint
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    API Key / Cloud Secret / Bearer Token
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={hostConfig.apiKey}
                      onChange={(e) =>
                        setHostConfig({ ...hostConfig, apiKey: e.target.value })
                      }
                      placeholder="Enter API token or key"
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3.5 top-2.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1 block">
                    Secured locally; passed in Authorization header during sync
                  </span>
                </div>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={isTestingConnection}
                    className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-white font-bold text-xs transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTestingConnection ? 'animate-spin' : ''}`} />
                    <span>{isTestingConnection ? 'Testing...' : 'Test Connection'}</span>
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs transition-colors"
                  >
                    Save Host Config
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePullFromHost}
                    disabled={isPullingFromHost}
                    className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-white font-bold text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isPullingFromHost ? 'Pulling...' : 'Pull from Host'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleUploadToHost}
                    disabled={isUploadingToHost}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all shadow-md flex items-center gap-2 disabled:opacity-50 active:scale-95"
                  >
                    <Cloud className={`w-4 h-4 ${isUploadingToHost ? 'animate-bounce' : ''}`} />
                    <span>{isUploadingToHost ? 'Uploading DB...' : 'Upload Database to Host'}</span>
                  </button>
                </div>
              </div>

              {/* Connection Test Banner Feedback */}
              {connectionTestResult && (
                <div
                  className={`p-3.5 rounded-2xl text-xs flex items-center justify-between animate-in fade-in ${
                    connectionTestResult.success
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                      : 'bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {connectionTestResult.success ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                    )}
                    <span>{connectionTestResult.message}</span>
                  </div>
                  {connectionTestResult.latencyMs !== undefined && (
                    <span className="font-mono text-[11px] opacity-80">
                      {connectionTestResult.latencyMs}ms
                    </span>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Recent Sync History Logs */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm">
            <h4 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Database Sync & Backup Activity History</span>
            </h4>

            {syncLogs.length === 0 ? (
              <p className="text-xs text-stone-400 italic py-4 text-center">
                No backup or sync operations logged yet in this session.
              </p>
            ) : (
              <div className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
                {syncLogs.slice(0, 6).map((log) => (
                  <div key={log.id} className="py-2.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          log.status === 'success'
                            ? 'bg-emerald-500'
                            : log.status === 'error'
                            ? 'bg-red-500'
                            : 'bg-amber-400'
                        }`}
                      />
                      <span className="font-mono text-[11px] text-stone-400">
                        {new Date(log.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </span>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">
                        {log.details}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800">
                      {log.action.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: LEDGER RECORDS MANAGER */}
      {activeTab === 'ledger' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-white">
                Paddock Ledger Management ({entries.length} entries)
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Administrative privileges: directly edit vehicle specifications, aftermarket mods, coffee scores, or purge records.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter by make, model, city..."
                className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                onClick={onOpenLogModal}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>New Entry</span>
              </button>
            </div>
          </div>

          {/* Entries Table / Card List */}
          <div className="divide-y divide-stone-100 dark:divide-stone-800">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/60 dark:hover:bg-stone-850/60 p-3 rounded-2xl transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={entry.carPhotoUrl}
                    alt={entry.carModel}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-stone-200 dark:border-stone-700"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-stone-900 dark:text-white">
                        {entry.carYear} {entry.carMake} {entry.carModel}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-semibold">
                        {entry.carCategory}
                      </span>
                    </div>
                    <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-2 mt-0.5">
                      <span>{entry.city}, {entry.country}</span>
                      <span>·</span>
                      <span className="capitalize">{entry.primaryCoffeeType.replace('_', ' ')} ({entry.coffeeCupsCount} cups)</span>
                      <span>·</span>
                      <span className="font-mono font-bold text-amber-500">
                        {entry.points.totalPoints} pts
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-400 font-mono line-clamp-1 mt-0.5">
                      {entry.mods || 'No mods specified'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => onEditEntry(entry)}
                    className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors"
                    title="Edit Entry"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `Delete run "${entry.carYear} ${entry.carMake} ${entry.carModel}"?`
                        )
                      ) {
                        onDeleteEntry(entry.id);
                      }
                    }}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 transition-colors"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ADMIN SECURITY & CREDENTIALS */}
      {activeTab === 'security' && (
        <div className="max-w-2xl bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-500" />
              <span>Admin Account & Authentication Settings</span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Update the admin username and password required to unlock this control panel and database operations.
            </p>
          </div>

          {securityStatus && (
            <div
              className={`p-3.5 rounded-2xl text-xs flex items-center gap-2 animate-in fade-in ${
                securityStatus.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                  : 'bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400'
              }`}
            >
              {securityStatus.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
              )}
              <span>{securityStatus.message}</span>
            </div>
          )}

          <form onSubmit={handleUpdateCredentials} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                New Admin Username
              </label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Current username: admin"
                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                New Admin Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleResetCreds}
                className="text-xs text-stone-500 hover:text-amber-500 underline"
              >
                Reset to Factory Credentials (admin / paddock2026!)
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all"
              >
                Update Credentials
              </button>
            </div>
          </form>

          {/* Danger Zone */}
          <div className="border-t border-stone-200 dark:border-stone-800 pt-6 mt-8">
            <h4 className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-2">
              Danger Zone
            </h4>
            <div className="p-4 rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-stone-900 dark:text-white">
                  Purge All Ledger Entries
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400">
                  Deletes all recorded cars and coffee runs from local memory.
                </div>
              </div>
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      'Are you sure you want to completely PURGE all entries from the paddock ledger? Download a backup first if needed!'
                    )
                  ) {
                    onUpdateEntries([]);
                    triggerToast('All runs purged from ledger');
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors shrink-0"
              >
                Purge All Records
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
