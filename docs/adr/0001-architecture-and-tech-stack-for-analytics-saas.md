# ADR-001: Architecture and Tech Stack for High-Throughput Analytics SaaS

**Status:** Accepted

---

## Context

The system must ingest high volumes of logs and metrics from 50 different external sources while simultaneously providing near real-time analytics to a client dashboard. 

Traditional CRUD operations on a single relational database for both paths would lead to:
- I/O bottlenecks and table locking during traffic spikes.
- Slow dashboard load times due to heavy analytical queries (e.g., `GROUP BY`) running on millions of raw rows.
- High risk of the database crashing under simultaneous heavy write and read loads.

---

## Decision

We will adopt a **CQRS (Command Query Responsibility Segregation)** architecture within a **Turborepo** monorepo setup.

- **Ingestion (Command):** NestJS API will act as an entry point, immediately pushing incoming logs to **Redpanda** (a high-performance, Kafka-compatible message broker) to buffer the load.
- **Storage & Processing:** Workers will consume events from Redpanda and insert them into **TimescaleDB** (PostgreSQL extension for time-series data) using Hyper-tables for rapid writes.
- **Analytics (Query):** The React + Vite dashboard will query **Continuous Aggregates** (Materialized Views) in TimescaleDB, avoiding scans of raw data.

---

## Consequences

### ✅ Positive

#### Performance & Resilience
- Redpanda acts as a shock absorber (Load Leveling), preventing database exhaustion during traffic spikes.
- TimescaleDB's Continuous Aggregates provide millisecond-latency responses for the dashboard.

#### Developer Experience (DX)
- Monorepo allows sharing TypeScript interfaces (e.g., log structures) directly between the NestJS backend and React frontend, ensuring type safety across the stack.

---

### ⚠️ Negative

#### Operational Complexity
- Introduces additional infrastructure components (Redpanda, TimescaleDB) requiring specialized knowledge to maintain and monitor.

#### Data Freshness
- Introduces a slight delay (Eventual Consistency on the Read Model) — the dashboard will display data aggregated up to the last minute, not up to the absolute last millisecond.

---

### ⚖️ Trade-offs

- Favoring **system resilience, ingestion throughput, and rapid analytical reads** over architectural simplicity and immediate data consistency on the dashboard.