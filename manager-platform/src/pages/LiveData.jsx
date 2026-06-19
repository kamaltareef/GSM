import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Fuel, ShoppingCart, Zap } from 'lucide-react';

const API_KEY = 'AIzaSyDZXAMpNCHlepD7HlnypSOGY99rW-CAJVY';
const BASE_URL = 'https://firestore.googleapis.com/v1/projects/gsm-db/databases/(default)/documents';

// Parse Firestore typed value into plain JS
function parseValue(val) {
    if (val === undefined || val === null) return null;
    if ('stringValue' in val) return val.stringValue;
    if ('integerValue' in val) return Number(val.integerValue);
    if ('doubleValue' in val) return val.doubleValue;
    if ('booleanValue' in val) return val.booleanValue;
    if ('nullValue' in val) return null;
    if ('arrayValue' in val) return (val.arrayValue.values || []).map(parseValue);
    if ('mapValue' in val) return parseFields(val.mapValue.fields || {});
    return null;
}

function parseFields(fields) {
    const obj = {};
    for (const [k, v] of Object.entries(fields)) {
        obj[k] = parseValue(v);
    }
    return obj;
}

function parseDoc(doc) {
    return {
        id: doc.name?.split('/').pop(),
        ...parseFields(doc.fields || {}),
    };
}

async function fetchCollection(collection) {
    const res = await fetch(`${BASE_URL}/${collection}?key=${API_KEY}`);
    if (!res.ok) throw new Error(`Failed to fetch ${collection}: ${res.status}`);
    const data = await res.json();
    return (data.documents || []).map(parseDoc);
}

async function patchFuelPrice(stationDocName, newPrice) {
    const url = `https://firestore.googleapis.com/v1/${stationDocName}?updateMask.fieldPaths=fuelPrice&key=${API_KEY}`;
    const body = {
        fields: {
            fuelPrice: { doubleValue: Number(newPrice) }
        }
    };
    const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`PATCH failed: ${res.status}`);
    return res.json();
}

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    ready: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

export default function LiveData() {
    const [transactions, setTransactions] = useState([]);
    const [orders, setOrders] = useState([]);
    const [stations, setStations] = useState([]);
    const [stationDocNames, setStationDocNames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [newFuelPrice, setNewFuelPrice] = useState('');
    const [patching, setPatching] = useState(false);
    const [patchMsg, setPatchMsg] = useState('');

    const loadAll = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [txDocs, orderDocs, stationDocs] = await Promise.all([
                fetchCollection('fuelTransactions'),
                fetchCollection('orders'),
                fetchCollection('stations'),
            ]);
            // Preserve raw doc names for PATCH
            const stationsRes = await fetch(`${BASE_URL}/stations?key=${API_KEY}`);
            const stationsRaw = await stationsRes.json();
            setStationDocNames((stationsRaw.documents || []).map(d => d.name));

            setTransactions(txDocs);
            setOrders(orderDocs);
            setStations(stationDocs);
            if (stationDocs[0]?.fuelPrice != null) setNewFuelPrice(String(stationDocs[0].fuelPrice));
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadAll(); }, [loadAll]);

    const totalSales = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);

    const handlePatch = async () => {
        if (!stationDocNames[0] || !newFuelPrice) return;
        setPatching(true);
        setPatchMsg('');
        try {
            await patchFuelPrice(stationDocNames[0], newFuelPrice);
            setPatchMsg('✓ מחיר עודכן בהצלחה');
            setStations(prev => {
                const updated = [...prev];
                if (updated[0]) updated[0] = { ...updated[0], fuelPrice: Number(newFuelPrice) };
                return updated;
            });
        } catch (e) {
            setPatchMsg(`שגיאה: ${e.message}`);
        } finally {
            setPatching(false);
        }
    };

    return (
        <div className="space-y-6" dir="rtl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">GSM Live Data</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">נתונים חיים מ-Firestore — משותפים עם אפליקציות הלקוח והעובד</p>
                </div>
                <Button variant="outline" size="sm" onClick={loadAll} disabled={loading}>
                    <RefreshCw className={`w-4 h-4 ml-1 ${loading ? 'animate-spin' : ''}`} />
                    רענן
                </Button>
            </div>

            {error && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-lg px-4 py-3">
                    שגיאת חיבור: {error}
                </div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg"><Fuel className="w-5 h-5 text-primary" /></div>
                            <div>
                                <p className="text-xs text-muted-foreground">סה"כ מכירות</p>
                                <p className="text-2xl font-bold">₪{totalSales.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-accent/10 rounded-lg"><Zap className="w-5 h-5 text-accent" /></div>
                            <div>
                                <p className="text-xs text-muted-foreground">עסקאות דלק/חשמל</p>
                                <p className="text-2xl font-bold">{transactions.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg"><ShoppingCart className="w-5 h-5 text-blue-600" /></div>
                            <div>
                                <p className="text-xs text-muted-foreground">הזמנות</p>
                                <p className="text-2xl font-bold">{orders.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Orders Table */}
                <Card className="lg:col-span-2">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">הזמנות</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="p-6 text-center text-muted-foreground text-sm">טוען...</div>
                        ) : orders.length === 0 ? (
                            <div className="p-6 text-center text-muted-foreground text-sm">אין הזמנות</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/30">
                                            <th className="text-right px-4 py-2 font-medium text-muted-foreground">סטטוס</th>
                                            <th className="text-right px-4 py-2 font-medium text-muted-foreground">פריטים</th>
                                            <th className="text-right px-4 py-2 font-medium text-muted-foreground">סכום</th>
                                            <th className="text-right px-4 py-2 font-medium text-muted-foreground">לוחית</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => {
                                            const items = Array.isArray(order.items)
                                                ? order.items.map(i => `${i?.name || '?'} ×${i?.qty || 1}`).join(', ')
                                                : '—';
                                            const colorClass = statusColors[order.status] || 'bg-gray-100 text-gray-700';
                                            return (
                                                <tr key={order.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                                                    <td className="px-4 py-2.5">
                                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
                                                            {order.status || '—'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2.5 text-muted-foreground max-w-[200px] truncate">{items}</td>
                                                    <td className="px-4 py-2.5 font-medium">₪{(order.total || 0).toFixed(2)}</td>
                                                    <td className="px-4 py-2.5 font-mono text-xs">{order.plate || '—'}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Station Fuel Price */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">מחיר דלק — {stations[0]?.name || 'תחנה ראשית'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {loading ? (
                            <div className="text-sm text-muted-foreground">טוען...</div>
                        ) : (
                            <>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">מחיר נוכחי לליטר</p>
                                    <p className="text-3xl font-bold text-primary">₪{stations[0]?.fuelPrice?.toFixed(2) || '—'}</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-muted-foreground">עדכון מחיר</label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={newFuelPrice}
                                        onChange={e => setNewFuelPrice(e.target.value)}
                                        placeholder="מחיר חדש"
                                        className="text-sm"
                                    />
                                    <Button onClick={handlePatch} disabled={patching || !newFuelPrice} className="w-full" size="sm">
                                        {patching ? 'שומר...' : 'עדכן ב-Firestore'}
                                    </Button>
                                    {patchMsg && (
                                        <p className={`text-xs ${patchMsg.startsWith('✓') ? 'text-primary' : 'text-destructive'}`}>
                                            {patchMsg}
                                        </p>
                                    )}
                                </div>
                                {stations[0] && (
                                    <div className="pt-2 border-t space-y-1 text-xs text-muted-foreground">
                                        <p>📍 {stations[0].address}</p>
                                        <p>⚡ מחיר חשמל: ₪{stations[0].evPrice?.toFixed(2) || '—'}/קוט"ש</p>
                                        <p>⛽ משאבות פנויות: {stations[0].pumpsFree ?? '—'}</p>
                                        <p>🔌 עמדות EV פנויות: {stations[0].evFree ?? '—'}</p>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}