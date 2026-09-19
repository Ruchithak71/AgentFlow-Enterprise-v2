-- ============================================================
-- V1__create_tasks_table.sql
-- FIX C-6: Flyway migration — creates the tasks table with
--          explicit column names matching TaskEntity @Column annotations.
--
-- This replaces spring.jpa.hibernate.ddl-auto=update.
-- Subsequent schema changes must be added as V2__, V3__, etc.
-- ============================================================

CREATE TABLE IF NOT EXISTS tasks (
    task_id     VARCHAR(255)    NOT NULL,
    task_type   VARCHAR(100)    NOT NULL,
    raw_payload TEXT,
    status      VARCHAR(50)     NOT NULL,
    created_at  TIMESTAMP       NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_tasks PRIMARY KEY (task_id)
);

-- Index for common polling query patterns
CREATE INDEX IF NOT EXISTS idx_tasks_status     ON tasks (status);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks (created_at DESC);
