# High-Throughput Analytical SaaS Engine

Production-grade, distributed Proof of Concept (PoC) for an analytics platform built to ingest high-volume log traffic from up to 50 concurrent external sources while serving near real-time metrics to a dashboard.

The system is designed around **CQRS (Command Query Responsibility Segregation)** so that write-heavy ingestion and read-heavy analytics can scale independently without degrading each other.

## Project Goals

- Sustain high-throughput event ingestion under bursty traffic.
- Keep analytical queries fast and predictable under load.
- Isolate write and read concerns through CQRS.
- Provide a clean monorepo foundation for backend, frontend, and shared contracts.

## Architecture at a Glance

The platform is split into two independent flows:

1. **Ingestion path (Command)**  
   External sources send log batches to a NestJS API gateway. The API acknowledges the request quickly with `202 Accepted` and pushes payloads into **Redpanda**, which acts as a buffering layer and absorbs spikes in traffic.

2. **Processing and storage path**  
   Background workers consume events from Redpanda and perform idempotent bulk inserts into **TimescaleDB** hyper-tables optimized for time-series workloads.

3. **Analytical path (Query)**  
   The React dashboard reads pre-computed metrics from **Continuous Aggregates** in TimescaleDB rather than scanning raw event tables, enabling sub-second analytical responses.

## Why This Architecture

Traditional CRUD-style applications tend to break down in this kind of workload because ingestion and analytics compete for the same database resources.

This design favors:

- high ingestion throughput,
- resilience during traffic spikes,
- predictable read performance,
- a controlled level of eventual consistency for dashboard data.

## Tech Stack

- **Monorepo:** Turborepo
- **Package manager:** pnpm workspaces
- **Backend:** NestJS
- **Frontend:** React + Vite
- **Message broker:** Redpanda
- **Database:** TimescaleDB
- **Language:** TypeScript

## Monorepo Structure

```text
.
├── apps/
│   ├── api/                # NestJS API gateway and CQRS application layer
│   └── dashboard/          # React dashboard for analytical insights
├── packages/
│   ├── shared-types/       # Shared contracts, DTOs, and event schemas
│   ├── eslint-config/      # Reusable ESLint flat configs
│   └── typescript-config/  # Shared tsconfig presets
├── docs/
│   └── adr/                # Architecture Decision Records
└── docker-compose.yml      # Local infrastructure for Redpanda and TimescaleDB
```

## Getting Started

### Prerequisites

- Node.js `18+` or `20+`
- `pnpm` installed globally
- Docker and Docker Compose

### 1. Start Infrastructure

```bash
docker compose up -d
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Run the Monorepo in Development Mode

```bash
pnpm dev
```

### Local Endpoints

- API Gateway: [http://localhost:3000](http://localhost:3000)
- Dashboard: [http://localhost:5173](http://localhost:5173)

## Documentation

- [ADR-001: Architecture and Tech Stack for High-Throughput Analytics SaaS](./docs/adr/0001-architecture-and-tech-stack-for-analytics-saas.md)

## Roadmap

- [ ] Implement robust event validation with NestJS Pipes and `class-validator`
- [ ] Set up Redpanda producers and consumers inside NestJS services
- [ ] Design TimescaleDB hyper-tables and retention policies via migrations
- [ ] Configure Continuous Aggregates for real-time `GROUP BY` analytics
- [ ] Build the first analytical dashboard experience with modern charting

## Current Status

This repository is an early-stage PoC focused on establishing the architectural backbone for a scalable analytics SaaS platform. The next milestones are infrastructure integration, ingestion flow implementation, and the first query-ready dashboard metrics.
