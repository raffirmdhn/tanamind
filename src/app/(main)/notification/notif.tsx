import React from 'react';

const Notif = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'Nunito', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      {/* Header */}
      <div style={{ padding: '24px 24px 0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 22, color: '#4CB782', fontWeight: 600 }}>Notifications</span>
          <span style={{ fontSize: 24, color: '#4CB782' }}>⚙️</span>
        </div>
        <div style={{ marginTop: 24, color: '#A3A3A3', fontSize: 15, fontWeight: 500 }}>Today</div>
        {/* Notifikasi 1 */}
        <div style={{ background: '#EAF7F0', borderRadius: 16, display: 'flex', alignItems: 'center', padding: '14px 16px', marginTop: 16, marginBottom: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#D1F2E0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
            <span style={{ fontSize: 24 }}>💧</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#4B4B4B', fontSize: 15, fontWeight: 500 }}>Your mustard green hasn't been watered yet.</div>
          </div>
          <div style={{ color: '#A3A3A3', fontSize: 13, marginLeft: 10 }}>3:30 PM</div>
        </div>
        {/* Notifikasi 2 */}
        <div style={{ background: '#EAF7F0', borderRadius: 16, display: 'flex', alignItems: 'center', padding: '14px 16px', marginBottom: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#D1F2E0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
            <span style={{ fontSize: 24 }}>🌱</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#4B4B4B', fontSize: 15, fontWeight: 500 }}>You've successfully planted!</div>
          </div>
          <div style={{ color: '#A3A3A3', fontSize: 13, marginLeft: 10 }}>10:20 AM</div>
        </div>
      </div>
      {/* Bottom Navigation */}
      <div style={{ width: '100%', padding: '0 0 16px 0', background: 'transparent', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 340, height: 60, background: '#fff', borderRadius: 32, boxShadow: '0 2px 8px #0001', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#A3A3A3', fontSize: 13 }}>
              <span style={{ fontSize: 24 }}>🏠</span>
              <span>Home</span>
            </div>
            <div style={{ position: 'relative', top: -28, background: '#4CB782', borderRadius: '50%', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px #0002', border: '4px solid #fff' }}>
              <span style={{ fontSize: 32, color: '#fff' }}>🌱</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#4CB782', fontSize: 13, fontWeight: 600 }}>
              <span style={{ fontSize: 24 }}>🔔</span>
              <span>Notifications</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notif;
