# ADR-002: Database Access Layer for Analytics (TimescaleDB)

**Status:** Accepted

---

## Context

The CQRS worker must perform extremely high-throughput bulk inserts of log events fetched from Redpanda into TimescaleDB. Additionally, the read model (dashboard) will require execution of highly specific TimescaleDB analytical functions (e.g., `time_bucket()`, `create_hypertable()`).

Traditional ORMs (like TypeORM or Prisma) introduce massive overhead during bulk operations (due to entity hydration, complex lifecycles, or heavy internal engines) and provide poor developer experience when writing raw, vendor-specific SQL extensions.

---

## Decision

We will use **Drizzle ORM** (backed by the highly performant `postgres.js` driver) as our primary query builder, encapsulated behind the **Repository Pattern**.

---

## Consequences

### ✅ Positive

#### Extreme Performance
- Drizzle executes raw SQL without the object-relational mapping overhead, ideal for micro-batching from message queues.
- `postgres.js` provides native, highly optimized array mapping for bulk inserts.

#### Type-Safe SQL and Native Features
- Drizzle allows the use of SQL fragments (`sql\`...\``) while maintaining TypeScript type safety, making it easy to invoke native TimescaleDB functions.

#### Architectural Decoupling
- Implementing the Repository Pattern ensures the application layer remains oblivious to Drizzle. If extreme scale eventually dictates a shift to pure raw queries via `postgres.js`, the swap will be isolated to the repository implementation.

---

### ⚠️ Negative

#### Migration Complexity
- Drizzle's automated migration generator does not support TimescaleDB extensions natively. We must manually append custom SQL (like `SELECT create_hypertable(...)`) to the generated migration files.

#### Learning Curve
- Developers must possess strong SQL knowledge, as the tool does not hide the database behind abstractions.