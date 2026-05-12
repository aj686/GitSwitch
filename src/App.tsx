import React, { useState, useEffect } from 'react';
import { 
  Github, 
  Gitlab, 
  LayoutDashboard, 
  Users, 
  Terminal, 
  Settings, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Shield,
  HardDrive
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GitAccount, ActivityLog, GitProvider } from './types';

// Mock Initial Data
const INITIAL_ACCOUNTS: GitAccount[] = [
  {
    id: '1',
    name: 'Work Profile',
    username: 'jdoe-work',
    email: 'john.doe@enterprise.com',
    provider: 'GitLab',
    isDefault: true
  },
  {
    id: '2',
    name: 'Personal Dev',
    username: 'johndoe-dev',
    email: 'john@personal.me',
    provider: 'GitHub',
    isDefault: false
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'accounts' | 'logs'>('dashboard');
  const [accounts, setAccounts] = useState<GitAccount[]>(INITIAL_ACCOUNTS);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Stats
  const activeAccount = accounts.find(a => a.isDefault);

  const addLog = (action: string, details: string, status: 'success' | 'error' | 'info' = 'info') => {
    const newLog: ActivityLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      action,
      details,
      status
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  const handleSwitchAccount = (id: string) => {
    const account = accounts.find(a => a.id === id);
    if (!account) return;

    setAccounts(prev => prev.map(a => ({
      ...a,
      isDefault: a.id === id
    })));

    addLog('Identity Switched', `Active user changed to ${account.name} (${account.email})`, 'success');
  };

  const deleteAccount = (id: string) => {
    const account = accounts.find(a => a.id === id);
    if (account?.isDefault) {
      addLog('Action Rejected', 'Cannot delete the active default account', 'error');
      return;
    }
    setAccounts(prev => prev.filter(a => a.id !== id));
    addLog('Account Removed', `Deleted profile for ${account?.name}`, 'info');
  };

  const syncWithMachine = async () => {
    addLog('System Sync', 'Initiating connection to OS credential store...', 'info');
    
    // Check if running in Electron environment
    if ((window as any).electronAPI) {
      try {
        const result = await (window as any).electronAPI.clearCredentials();
        if (result.success) {
          addLog('System Sync', 'Successfully purged OS git credentials', 'success');
          addLog('System Sync', 'Identity detached from Windows/Mac Vault', 'success');
        } else {
          addLog('System Sync', `OS Error: ${result.message}`, 'error');
        }
      } catch (err) {
        addLog('System Sync', 'Native Bridge failure', 'error');
      }
    } else {
      // Mock behavior for browser preview
      setTimeout(() => {
        addLog('System Sync', 'Successfully purged git credentials from OS store (SIMULATED)', 'success');
        addLog('System Sync', 'System ready for new login authentication', 'success');
      }, 1500);
    }
  };

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-gray-100 font-sans selection:bg-cyan-500/30">
      {/* Sidebar */}
      <nav className="w-64 border-r border-white/5 bg-[#0F0F0F] flex flex-col pt-8">
        <div className="px-6 mb-12 flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center">
            <Github className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white">GitSwitch</span>
        </div>

        <div className="flex-1 px-4 space-y-2">
          <SidebarItem 
            icon={<LayoutDashboard size={18} />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <SidebarItem 
            icon={<Users size={18} />} 
            label="Accounts" 
            active={activeTab === 'accounts'} 
            onClick={() => setActiveTab('accounts')} 
          />
          <SidebarItem 
            icon={<Terminal size={18} />} 
            label="Activity Logs" 
            active={activeTab === 'logs'} 
            onClick={() => setActiveTab('logs')} 
          />
          <SidebarItem 
            icon={<Settings size={18} />} 
            label="Integration" 
            active={activeTab === 'settings' as any} 
            onClick={() => setActiveTab('settings' as any)} 
          />
        </div>

        <div className="p-6 border-t border-white/5 space-y-4">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
              <HardDrive size={12} />
              Host Status
            </div>
            <div className="text-sm font-medium text-white">Win/Mac Compatible</div>
            <div className="text-[10px] text-gray-500 mt-1">Cross-platform Ready</div>
          </div>
          <button 
            onClick={syncWithMachine}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium"
          >
            <Shield size={14} className="text-cyan-500" />
            Clear Credentials
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-[#0A0A0A] to-[#121212]">
        <header className="h-16 px-8 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0A0A0A]/80 backdrop-blur-md z-10">
          <h1 className="text-lg font-medium text-white flex items-center gap-2 capitalize">
            {activeTab}
          </h1>
          <div className="flex items-center gap-4">
            {activeAccount && (
              <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                <span className="text-xs font-mono text-cyan-400">{activeAccount.username}</span>
              </div>
            )}
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {activeAccount ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-[#121212] border border-white/5 rounded-2xl p-8 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        {activeAccount.provider === 'GitHub' ? <Github size={120} /> : <Gitlab size={120} />}
                      </div>
                      <div className="relative z-10">
                        <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold uppercase tracking-widest border border-cyan-500/20">Active Profile</span>
                        <h2 className="text-4xl font-bold mt-4 mb-2 text-white">{activeAccount.name}</h2>
                        <p className="text-gray-400 font-mono text-sm">{activeAccount.email}</p>
                        
                        <div className="mt-8 flex gap-4">
                          <StatusBadge icon={<Github size={14}/>} label="Auth Verified" active />
                          <StatusBadge icon={<Clock size={14}/>} label="Sync: Periodic" active />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-[#121212] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Quick Switch</h3>
                        <div className="space-y-3">
                          {accounts.filter(a => !a.isDefault).map(acc => (
                            <button 
                              key={acc.id}
                              onClick={() => handleSwitchAccount(acc.id)}
                              className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all flex items-center justify-between group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-cyan-400 transition-colors font-bold text-xs">
                                  {acc.name[0]}
                                </div>
                                <span className="text-sm font-medium">{acc.name}</span>
                              </div>
                              <Plus size={14} className="text-gray-600 group-hover:text-cyan-400" />
                            </button>
                          ))}
                        </div>
                      </div>
                      <button 
                        onClick={() => setActiveTab('accounts')}
                        className="mt-6 text-xs text-cyan-500 hover:text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-2"
                      >
                        Manage All Accounts <Plus size={12} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                    <Users size={48} className="mx-auto text-gray-600 mb-4" />
                    <h2 className="text-2xl font-bold text-white">No Accounts Connected</h2>
                    <p className="text-gray-500 mt-2 mb-8">Add your first Git profile to start managing identities.</p>
                    <button 
                      onClick={() => setShowAddModal(true)}
                      className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all"
                    >
                      Add Account
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                   <div className="bg-[#121212] border border-white/5 rounded-2xl p-6">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Local Environment</h3>
                      <div className="space-y-4">
                        <EnvItem label="Git Version" value="2.45.0" />
                        <EnvItem label="OS Platform" value="Win32 x64" />
                        <EnvItem label="Credential Helper" value="manager-core" />
                      </div>
                   </div>
                   <div className="bg-[#121212] border border-white/5 rounded-2xl p-6">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6 font-mono">Recent Log</h3>
                      <div className="space-y-3">
                        {logs.slice(0, 3).map(log => (
                          <div key={log.id} className="flex gap-4 p-2 rounded-lg hover:bg-white/5 transition-colors">
                            <LogStatusIcon status={log.status} />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold text-white">{log.action}</div>
                              <div className="text-[10px] text-gray-500 truncate">{log.details}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'accounts' && (
              <motion.div 
                key="accounts"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Git Accounts</h2>
                    <p className="text-gray-500 text-sm">Stored identities on this workstation</p>
                  </div>
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold transition-all text-sm shadow-lg shadow-cyan-600/20"
                  >
                    <Plus size={16} /> New Identity
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {accounts.map(acc => (
                    <div 
                      key={acc.id} 
                      className={`p-6 rounded-2xl border transition-all ${acc.isDefault ? 'bg-cyan-500/5 border-cyan-500/30 ring-1 ring-cyan-500/20' : 'bg-[#121212] border-white/5'}`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${acc.provider === 'GitHub' ? 'bg-[#1F2328]' : 'bg-[#E24329]/10'} border border-white/10`}>
                            {acc.provider === 'GitHub' ? <Github className="text-white" size={28} /> : <Gitlab className="text-[#E24329]" size={28} />}
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="text-xl font-bold text-white">{acc.name}</h3>
                              {acc.isDefault && (
                                <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase border border-cyan-500/30">Active</span>
                              )}
                            </div>
                            <p className="text-gray-500 font-mono text-xs mt-1">{acc.username} • {acc.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {!acc.isDefault && (
                            <button 
                              onClick={() => handleSwitchAccount(acc.id)}
                              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 transition-colors border border-white/5"
                            >
                              Use as Default
                            </button>
                          )}
                          <button 
                            onClick={() => deleteAccount(acc.id)}
                            className="p-2.5 rounded-lg bg-red-500/5 hover:bg-red-500/10 text-red-500/50 hover:text-red-500 transition-colors border border-red-500/10"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'logs' && (
              <motion.div 
                key="logs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-[#0D0D0D] border border-white/5 rounded-2xl overflow-hidden shadow-2xl h-[calc(100vh-180px)] flex flex-col"
              >
                <div className="px-6 py-4 border-b border-white/5 bg-[#121212] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-gray-400 uppercase tracking-widest">
                    <Terminal size={14} /> session_logs.tty
                  </div>
                  <button 
                    onClick={() => setLogs([])}
                    className="text-[10px] text-gray-600 hover:text-gray-300 uppercase font-bold"
                  >
                    Clear Terminal
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 font-mono text-sm leading-relaxed">
                  {logs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-700 opacity-20 select-none">
                      <Terminal size={64} />
                      <div className="mt-4">NO ACTIVITY CAPTURED</div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {logs.map(log => (
                        <div key={log.id} className="group">
                          <div className="flex items-start gap-4">
                            <span className="text-gray-600 shrink-0 text-xs mt-0.5">[{log.timestamp.toLocaleTimeString([], { hour12: false })}]</span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className={`font-bold ${log.status === 'success' ? 'text-green-500' : log.status === 'error' ? 'text-red-500' : 'text-cyan-500'}`}>
                                  {log.action}
                                </span>
                                <span className="text-[10px] bg-white/5 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">ID: {log.id}</span>
                              </div>
                              <div className="text-gray-400 mt-1">{log.details}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="text-cyan-500 animate-pulse text-xs mt-8 leading-none">_</div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {(activeTab as string) === 'settings' && (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-2xl font-bold text-white">Desktop Integration</h2>
                  <p className="text-gray-500 text-sm">How to install GitSwitch on your local machine</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#121212] border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <HardDrive size={24} />
                      </div>
                      <h3 className="font-bold text-white">Windows Installer</h3>
                    </div>
                    <ul className="space-y-3 text-sm text-gray-400 mb-8">
                       <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Native `.exe` executable</li>
                       <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Windows Credential Manager Link</li>
                       <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Context Menu Integration (Right-click)</li>
                    </ul>
                    <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">Download for Windows</button>
                  </div>

                  <div className="bg-[#121212] border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                        <Shield size={24} />
                      </div>
                      <h3 className="font-bold text-white">macOS (Apple Silicon)</h3>
                    </div>
                    <ul className="space-y-3 text-sm text-gray-400 mb-8">
                       <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Apple Keychain Integration</li>
                       <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Menubar Quick-Switch</li>
                       <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> ZSH/Bash Profile Sync</li>
                    </ul>
                    <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">Download for macOS</button>
                  </div>
                </div>

                <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-cyan-400 mb-2 uppercase tracking-wide">Developer Note</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    This prototype is built using React. For the CTO real-world implementation, we use <strong>Electron</strong> to bridge this web frontend with native Node.js system APIs. This allows the "Clear Credentials" button to directly access <code>C:\Windows\System32\cmdkey.exe</code> or <code>/usr/bin/security</code> on Mac.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Account Modal (Simulated) */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-[#121212] border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">Add Identity</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <Trash2 size={20} className="text-gray-500 rotate-45" />
                </button>
              </div>

              <form className="space-y-5" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get('name') as string;
                const email = formData.get('email') as string;
                const username = formData.get('username') as string;
                const provider = formData.get('provider') as GitProvider;

                const newAccount: GitAccount = {
                  id: Math.random().toString(36).substr(2, 9),
                  name,
                  email,
                  username,
                  provider,
                  isDefault: false
                };

                setAccounts(prev => [...prev, newAccount]);
                addLog('Account Created', `Provisioned profile for ${name}`, 'success');
                setShowAddModal(false);
              }}>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Profile Name</label>
                  <input required name="name" placeholder="e.g. Work Laptop" className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-cyan-500/50 transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Username</label>
                    <input required name="username" placeholder="gh-user" className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-cyan-500/50 transition-colors" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Provider</label>
                    <select name="provider" className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-cyan-500/50 transition-colors appearance-none">
                      <option className="bg-[#121212]">GitHub</option>
                      <option className="bg-[#121212]">GitLab</option>
                      <option className="bg-[#121212]">Kubernetes</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Email Address</label>
                  <input required name="email" type="email" placeholder="user@company.com" className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-cyan-500/50 transition-colors" />
                </div>

                <div className="pt-4 flex gap-4">
                   <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 px-4 rounded-xl font-bold bg-white/5 hover:bg-white/10 transition-colors">Cancel</button>
                   <button type="submit" className="flex-1 py-3 px-4 rounded-xl font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors shadow-lg shadow-cyan-600/20">Create Identity</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
        active 
          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
          : 'text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent'
      }`}
    >
      <span className={`${active ? 'text-cyan-400' : 'text-gray-500 group-hover:text-gray-400'}`}>{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function StatusBadge({ icon, label, active }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-colors ${
      active ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
    }`}>
      {icon}
      {label}
    </div>
  );
}

function EnvItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 hover:bg-white/5 px-2 rounded-lg transition-colors">
      <span className="text-xs text-gray-500 font-medium">{label}</span>
      <span className="text-xs font-mono text-gray-300">{value}</span>
    </div>
  );
}

function LogStatusIcon({ status }: { status: ActivityLog['status'] }) {
  if (status === 'success') return <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5" />;
  if (status === 'error') return <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5" />;
  return <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5" />;
}
