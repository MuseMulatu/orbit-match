import React, { useState, useEffect } from 'react';
import { BarChart3, Users, DollarSign, Activity, Lock, Search } from 'lucide-react';

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [password, setPassword] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const fetchAdminData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [statsRes, usersRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/admin/dashboard`, { headers }),
        fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, { headers })
      ]);
      const statsData = await statsRes.json();
      const usersData = await usersRes.json();
      
      if (statsData.success) setStats(statsData);
      if (usersData.success) setUsers(usersData.users);
    } catch (err) {
      console.error("Admin fetch failed", err);
      handleLogout();
    }
  };

  useEffect(() => { if (token) fetchAdminData(); }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('admin_token', data.token);
      setToken(data.token);
    } else {
      alert("Wrong password!");
    }
  };

  const fetchUserDetails = async (id: string) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) setSelectedUser(data.user);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
  };

  // --- LOGIN SCREEN ---
  if (!token) {
    return (
      <div className="min-h-screen bg-[#030305] flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-[#0a0602] border-2 border-[#3d1c09] p-8 rounded-3xl w-full max-w-sm">
          <div className="flex justify-center mb-6"><Lock className="w-10 h-10 text-orange-500" /></div>
          <h2 className="text-white text-2xl font-bold text-center mb-6">Zabiya God Mode</h2>
          <input 
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#140a04] border border-[#3d1c09] p-3 rounded-xl text-white mb-4" placeholder="Enter Master Password"
          />
          <button className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold p-3 rounded-xl">Enter Command Center</button>
        </form>
      </div>
    );
  }

  // --- DASHBOARD SCREEN ---
  return (
    <div className="min-h-screen bg-[#030305] p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-black text-white">Orbit Command</h1>
          <button onClick={handleLogout} className="text-red-400 hover:text-red-300">Logout</button>
        </div>

        {/* STATS GRID */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#0a0602] border border-[#3d1c09] p-6 rounded-2xl">
              <DollarSign className="w-6 h-6 text-green-500 mb-2" />
              <p className="text-white/50 text-sm font-bold uppercase">Total Revenue</p>
              <p className="text-3xl font-black text-white">{stats.stats.totalRevenue} ETB</p>
              <p className="text-xs text-white/40 mt-2">{stats.stats.basicPurchases} Basic / {stats.stats.premiumPurchases} Premium</p>
            </div>
            <div className="bg-[#0a0602] border border-[#3d1c09] p-6 rounded-2xl">
              <Users className="w-6 h-6 text-blue-500 mb-2" />
              <p className="text-white/50 text-sm font-bold uppercase">Total Users</p>
              <p className="text-3xl font-black text-white">{stats.stats.totalUsers}</p>
            </div>
            <div className="bg-[#0a0602] border border-[#3d1c09] p-6 rounded-2xl">
              <Activity className="w-6 h-6 text-pink-500 mb-2" />
              <p className="text-white/50 text-sm font-bold uppercase">Total Matches</p>
              <p className="text-3xl font-black text-white">{stats.stats.totalMatches}</p>
            </div>
            <div className="bg-[#0a0602] border border-[#3d1c09] p-6 rounded-2xl overflow-y-auto max-h-32">
              <p className="text-white/50 text-sm font-bold uppercase mb-2">🔥 Leaderboard (Top Matched)</p>
              {stats.leaderboard.map((u: any, i: number) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-white">{u.phone}</span>
                  <span className="text-orange-400 font-bold">{u.total_matches}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USERS TABLE & DETAILS SPLIT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* USER LIST */}
          <div className="md:col-span-2 bg-[#0a0602] border border-[#3d1c09] rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-[#3d1c09] bg-[#140a04]"><h3 className="text-white font-bold">All Users</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-white/70">
                <thead className="bg-[#050301] text-xs uppercase">
                  <tr><th className="p-4">Phone</th><th className="p-4">Slots</th><th className="p-4">Aliases</th><th className="p-4">Joined</th><th className="p-4">Action</th></tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-[#1a0c04] hover:bg-[#140a04]">
                      <td className="p-4 font-mono">{u.phone}</td>
                      <td className="p-4">{u.slots}</td>
                      <td className="p-4">{u.alias_count}</td>
                      <td className="p-4">{new Date(u.joined).toLocaleDateString()}</td>
                      <td className="p-4">
                        <button onClick={() => fetchUserDetails(u.id)} className="text-orange-500 hover:text-orange-400 font-bold">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* USER DETAILS PANEL */}
          <div className="bg-[#0a0602] border border-[#3d1c09] p-6 rounded-2xl">
            {selectedUser ? (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-4">User Intel</h3>
                <div><p className="text-xs text-white/40 uppercase">Primary Phone</p><p className="text-white font-mono">{selectedUser.phone}</p></div>
                <div><p className="text-xs text-white/40 uppercase">TG Username</p><p className="text-white font-mono">{selectedUser.telegram || 'N/A'}</p></div>
                <div><p className="text-xs text-white/40 uppercase">Slots Balance</p><p className="text-orange-400 font-bold">{selectedUser.slots}</p></div>
                <div><p className="text-xs text-white/40 uppercase">Total Matches</p><p className="text-pink-400 font-bold">{selectedUser.total_matches}</p></div>
                
                <div className="pt-4 border-t border-[#3d1c09]">
                  <p className="text-xs text-white/40 uppercase mb-2">Vault Aliases</p>
                  {selectedUser.aliases.map((a: any, i: number) => (
                    <div key={i} className="text-sm text-white mb-1 bg-[#140a04] p-2 rounded">
                      <span className="text-orange-500 mr-2">[{a.type}]</span> {a.value}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-white/30 text-sm">Select a user to view details</div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}