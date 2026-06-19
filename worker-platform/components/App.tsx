'use client';

import { useState, useEffect } from 'react';
import BottomNav from './BottomNav';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ClockScreen from './screens/ClockScreen';
import OrdersScreen from './screens/OrdersScreen';
import OrderDetailScreen from './screens/OrderDetailScreen';
import ShiftsScreen from './screens/ShiftsScreen';
import ServiceCallScreen from './screens/ServiceCallScreen';
import ProfileScreen from './screens/ProfileScreen';
import { ORDERS_DATA, Order } from '@/lib/data';
import { subscribeOrders, setOrderStatus, firebaseEnabled } from '@/lib/db';

type Screen = 'login' | 'home' | 'clockin' | 'orders' | 'orderDetail' | 'shifts' | 'serviceCall' | 'profile';
type Role = 'employee' | 'technician';
type NavTab = 'home' | 'orders' | 'shifts' | 'profile';

export default function App() {
  const [screen, setScreen] = useState<Screen>('login');
  const [role, setRole] = useState<Role>('employee');
  const [clockedIn, setClockedIn] = useState(false);
  const [orders, setOrders] = useState<Order[]>(ORDERS_DATA);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  // When Firebase is configured, subscribe to the shared `orders` collection so
  // orders placed in the Customer app appear here live. Otherwise use sample data.
  useEffect(() => {
    if (!firebaseEnabled) return;
    return subscribeOrders(live => setOrders(live.length ? live : ORDERS_DATA));
  }, []);

  // Update status both locally (instant UI) and in Firestore (shared with Customer app).
  const changeOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => (o.id === id ? { ...o, status } : o)));
    setOrderStatus(id, status).catch(() => {});
  };

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const homeScreen: Screen = role === 'technician' ? 'serviceCall' : 'home';

  const handleNav = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === 'home') setScreen(homeScreen);
    else if (tab === 'orders') setScreen('orders');
    else if (tab === 'shifts') setScreen('shifts');
    else if (tab === 'profile') setScreen('profile');
  };

  const handleLogin = (r: Role) => {
    setRole(r);
    setScreen(r === 'technician' ? 'serviceCall' : 'home');
  };

  const showNav = screen !== 'login' && screen !== 'orderDetail';

  const getNavTab = (): NavTab => {
    if (screen === 'home') return 'home';
    if (screen === 'orders' || screen === 'orderDetail') return 'orders';
    if (screen === 'shifts') return 'shifts';
    if (screen === 'profile') return 'profile';
    if (screen === 'serviceCall') return 'home';
    if (screen === 'clockin') return 'home';
    return activeTab;
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div className="phone-shell">
        <div className="phone-screen">
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
            {screen === 'login' && <LoginScreen onLogin={handleLogin} />}
            {screen === 'home' && (
              <HomeScreen
                onNav={s => {
                  if (s === 'clockin') setScreen('clockin');
                  else if (s === 'orders') { setActiveTab('orders'); setScreen('orders'); }
                  else if (s === 'shifts') { setActiveTab('shifts'); setScreen('shifts'); }
                }}
                clockedIn={clockedIn}
                orderCount={pendingCount}
                onBell={() => { setActiveTab('orders'); setScreen('orders'); }}
              />
            )}
            {screen === 'clockin' && (
              <ClockScreen clockedIn={clockedIn} setClockedIn={setClockedIn} onBack={() => setScreen(homeScreen)} />
            )}
            {screen === 'orders' && (
              <OrdersScreen
                orders={orders}
                onStatusChange={changeOrderStatus}
                onSelect={o => { setSelectedOrder(o); setScreen('orderDetail'); }}
                onBack={() => setScreen(homeScreen)}
              />
            )}
            {screen === 'orderDetail' && selectedOrder && (
              <OrderDetailScreen
                order={selectedOrder}
                onBack={() => setScreen('orders')}
                onDeliver={id => changeOrderStatus(id, 'delivered')}
              />
            )}
            {screen === 'shifts' && <ShiftsScreen onBack={() => setScreen(homeScreen)} />}
            {screen === 'serviceCall' && <ServiceCallScreen onBack={() => setScreen(homeScreen)} />}
            {screen === 'profile' && <ProfileScreen role={role} onLogout={() => setScreen('login')} />}
          </div>

          {showNav && (
            <BottomNav
              active={getNavTab()}
              onNav={handleNav}
              orderBadge={pendingCount}
            />
          )}
        </div>
      </div>
    </div>
  );
}
