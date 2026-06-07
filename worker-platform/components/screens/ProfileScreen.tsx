import StatusBar from '../StatusBar';
import Icon from '../Icon';

type Role = 'employee' | 'technician';

interface ProfileScreenProps {
  role: Role;
  onLogout: () => void;
}

export default function ProfileScreen({ role, onLogout }: ProfileScreenProps) {
  const personalInfo = [
    ['שם מלא', 'דניאל כהן'],
    ['תעודת זהות', '302-456-789'],
    ['תאריך לידה', '15.03.1994'],
  ];

  const employmentInfo = [
    ['מזהה עובד', 'EMP-00214'],
    ['תפקיד', role === 'employee' ? 'עובד חנות' : 'טכנאי רובוטיקה'],
    ['תחנה', 'תחנה ראשית'],
    ['תאריך התחלה', '01.09.2021'],
    ['סטטוס', 'פעיל'],
  ];

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', background: '#f7fafc' }}>
      <StatusBar />
      <div style={{ background: '#1A365D', padding: '28px 20px 32px', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, background: 'rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
          <Icon name="profile" size={36} color="#fff" />
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>דניאל כהן</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 4 }}>{role === 'employee' ? 'עובד חנות' : 'טכנאי רובוטיקה'}</div>
        <span className="badge badge-green" style={{ marginTop: 10, display: 'inline-flex' }}>מחובר</span>
      </div>

      <div className="screen-scroll" style={{ padding: '16px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: 1, marginBottom: 8, paddingRight: 4 }}>פרטים אישיים</div>
        {personalInfo.map(([k, v]) => (
          <div key={k} className="card" style={{ marginBottom: 8, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, color: '#94a3b8' }}>{k}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#1A365D' }}>{v}</span>
          </div>
        ))}

        <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: 1, margin: '16px 0 8px', paddingRight: 4 }}>פרטי העסקה</div>
        {employmentInfo.map(([k, v]) => (
          <div key={k} className="card" style={{ marginBottom: 8, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, color: '#94a3b8' }}>{k}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: k === 'סטטוס' ? '#38A169' : '#1A365D' }}>{v}</span>
          </div>
        ))}

        <button className="btn-primary" style={{ marginTop: 16, background: '#E53E3E' }} onClick={onLogout}>
          יציאה מהמערכת
        </button>
      </div>
    </div>
  );
}
