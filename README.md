# High-Throughput Analytical SaaS Engine (WIP)

## 🎯 Project Goal
A production-grade, distributed Proof of Concept (PoC) for an analytical platform designed to ingest massive volumes of log events from up to 50 concurrent external sources. The system uses the **CQRS (Command Query Responsibility Segregation)** pattern to completely isolate high-frequency write operations from complex analytical read queries, preventing performance degradation and ensuring sub-second metrics availability.

## 🏗️ Architecture Overview

The system is split into two independent flows to guarantee extreme throughput and fault tolerance:

1. **Ingestion Path (Command):** High-frequency log packets hit the NestJS API gateway, which immediately offloads them to a high-performance **Redpanda** queue (acting as a shock absorber/load leveler) and returns a fast `202 Accepted` status.
2. **Processing & Storage Path:** Scalable background workers consume items from Redpanda and execute idempotent bulk inserts into **TimescaleDB** time-series hyper-tables.
3. **Analytical Path (Query):** The React dashboard fetches pre-calculated metrics directly from TimescaleDB **Continuous Aggregates** (Materialized Views) rather than scanning millions of raw database records, ensuring sub-second response times.

## 🛠️ Monorepo Structure & Tooling
This project is orchestrated as a single type-safe **Turborepo** monorepo using `pnpm` workspaces:

```text
├── apps/
│   ├── api/                # NestJS API (CQRS Commands/Queries & Ingestion Gateway)
│   └── dashboard/          # React + Vite (Analytical Dashboard & Charts)
├── packages/
│   ├── shared-types/       # Shared TypeScript contracts & event schemas
│   ├── eslint-config/      # Modular ESLint configurations (Flat Config)
│   └── typescript-config/  # Centrally managed tsconfig profiles
└── docker-compose.yml      # Local infrastructure infrastructure (Redpanda, TimescaleDB)