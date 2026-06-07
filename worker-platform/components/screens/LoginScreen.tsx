'use client';

import { useState } from 'react';
import StatusBar from '../StatusBar';
import Icon from '../Icon';

type Role = 'employee' | 'technician';

interface LoginScreenProps {
  onLogin: (role: Role) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<Role>('employee');

  const handleLogin = (r?: Role) => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(r || role); }, 1200);
  };

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <StatusBar />
      <div style={{ background: '#1A365D', padding: '28px 24px 32px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.15)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.8"/>
              <path d="M12 6v6l4 2" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 500, letterSpacing: 2 }}>GSM SYSTEM</div>
            <div style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>פלטפורמת עובדים</div>
          </div>
        </div>
      </div>

      <div className="screen-scroll" style={{ padding: '28px 24px 24px' }}>
        <div style={{ display: 'flex', background: '#f0f4f8', borderRadius: 14, padding: 4, marginBottom: 24, gap: 4 }}>
          {([['employee', 'עובד חנות'], ['technician', 'טכנאי רובוטיקה']] as [Role, string][]).map(([r, label]) => (
            <button key={r} onClick={() => setRole(r)} style={{
              flex: 1, padding: '10px 8px', borderRadius: 10, border: 'none', cursor: 'pointer',
              fontFamily: 'Heebo, sans-serif', fontWeight: 600, fontSize: 13,
              background: role === r ? '#1A365D' : 'transparent',
              color: role === r ? '#fff' : '#8fa0b0',
              transition: 'all 0.2s',
            }}>{label}</button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#4a5568', marginBottom: 6 }}>שם משתמש</div>
            <input className="field" placeholder="הכנס שם משתמש" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#4a5568', marginBottom: 6 }}>סיסמה</div>
            <input className="field" type="password" placeholder="הכנס סיסמה" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
        </div>

        <button className="btn-primary" style={{ marginTop: 24, height: 52 }} onClick={() => handleLogin()}>
          {loading ? (
            <div style={{ width: 20, height: 20, border: '2.5px solid rgba(255,255,255,0.3)', borderTop: '2.5px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          ) : 'כניסה למערכת'}
        </button>

        <div style={{ textAlign: 'center', margin: '20px 0 8px' }}>
          <div style={{ color: '#a0aec0', fontSize: 13, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            <span>או</span>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
          </div>
          <button onClick={() => handleLogin()} style={{
            width: 72, height: 72, borderRadius: '50%', border: '2px solid #e2e8f0',
            background: '#f7fafc', cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto', transition: 'all 0.2s',
          }}>
            <Icon name="fingerprint" size={36} color="#1A365D" />
          </button>
          <div style={{ fontSize: 12, color: '#a0aec0', marginTop: 8 }}>כניסה ביומטרית</div>
        </div>
      </div>
    </div>
  );
}
