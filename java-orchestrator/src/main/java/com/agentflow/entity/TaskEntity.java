package com.agentflow.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * JPA entity for persisting task records to PostgreSQL.
 *
 * FIX C-5: All fields now have explicit @Column annotations so that
 * Hibernate's naming strategy cannot silently alter column names between
 * schema migrations, regardless of spring.jpa.hibernate.naming.strategy setting.
 *
 * FIX C-6: ddl-auto is set to 'validate' in application.properties.
 * The actual table DDL lives in db/migration/V1__create_tasks_table.sql (Flyway).
 */
@Entity
@Table(name = "tasks")
public class TaskEntity {

    @Id
    @Column(name = "task_id", nullable = false, updatable = false, length = 255)
    private String taskId;

    @Column(name = "task_type", nullable = false, length = 100)
    private String taskType;

    @Column(name = "raw_payload", columnDefinition = "TEXT")
    private String rawPayload;

    @Column(name = "status", nullable = false, length = 50)
    private String status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public TaskEntity() {}

    public TaskEntity(String taskId, String taskType, String rawPayload, String status) {
        this.taskId     = taskId;
        this.taskType   = taskType;
        this.rawPayload = rawPayload;
        this.status     = status;
        this.createdAt  = LocalDateTime.now();
    }

    public String getTaskId()                { return taskId; }
    public void setTaskId(String taskId)     { this.taskId = taskId; }

    public String getTaskType()              { return taskType; }
    public void setTaskType(String taskType) { this.taskType = taskType; }

    public String getRawPayload()                  { return rawPayload; }
    public void setRawPayload(String rawPayload)   { this.rawPayload = rawPayload; }

    public String getStatus()                { return status; }
    public void setStatus(String status)     { this.status = status; }

    public LocalDateTime getCreatedAt()                    { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt)      { this.createdAt = createdAt; }
}
