# GSM — Smart Gas Station Management System

A connected fueling-station platform built as three apps that share one backend, so data flows between them in real time: a customer places an order in one app, and it shows up live in another.

## Platforms

| Platform | Stack | Role | Code |
|---|---|---|---|
| **Customer App** | Next.js 15 + TypeScript | ALPR fueling, EV charging, in-car convenience store, wallet, history | [`customer-platform/`](./customer-platform) |
| **Employee App** | Next.js 15 + TypeScript | Live order queue, order fulfillment, shift schedule, service calls | [`worker-platform/`](./worker-platform) |
| **Manager App** | Base44 (no-code) | Sales dashboard, fuel/EV pricing, station inventory | [`manager-platform/`](./manager-platform) — exported reference code; live app: https://gsm-manager-platform.base44.app |

Each platform has its own `README.md` with full feature lists and run instructions — this file covers how they fit together. The Customer and Employee apps run locally with `npm run dev`; the Manager app runs on Base44's hosting, with its exported source kept in `manager-platform/` for reference.

## Architecture

All three platforms read and write the same Firebase/Firestore database:

```
Customer App ──┐  places store orders, logs fuel/EV transactions
Employee App ──┼──►   Shared Firestore   ◄── prepares orders, updates status
Manager App  ──┘   (orders, fuelTransactions, stations)   sets prices, views sales
```

Example of the connection working: a customer confirms a coffee order in the Customer app → it appears instantly in the Employee app's order queue → the employee marks it ready → the status updates back in the Customer app. Every fuel/EV sale is logged for the Manager dashboard, and fuel prices set by the Manager are read live by the Customer app.

## Getting started

```bash
git clone https://github.com/kamaltareef/GSM.git

cd GSM/customer-platform && npm install && npm run dev          # http://localhost:3000
cd GSM/worker-platform   && npm install && npm run dev -- -p 3001   # http://localhost:3001
```

Without any setup, both apps run fine on local sample data. To connect them (and the Manager app) to one live shared database, follow [`GSM_FIREBASE_SETUP.md`](./GSM_FIREBASE_SETUP.md).

## Assignment

- Repo: https://github.com/kamaltareef/GSM
- Assignment: https://classroom.github.com/a/BdPS5veC
- Student: Kamal Tareef
