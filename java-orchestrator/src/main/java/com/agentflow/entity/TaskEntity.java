package com.agentflow.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * JPA entity for persisting task records to PostgreSQL.
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

    @Column(name = "file_path", length = 500)
    private String filePath;

    @Column(name = "final_decision", length = 100)
    private String finalDecision;

    @Column(name = "risk_score")
    private Double riskScore;

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

    public TaskEntity(String taskId, String taskType, String rawPayload, String filePath, String status) {
        this.taskId     = taskId;
        this.taskType   = taskType;
        this.rawPayload = rawPayload;
        this.filePath   = filePath;
        this.status     = status;
        this.createdAt  = LocalDateTime.now();
    }

    public String getTaskId()                { return taskId; }
    public void setTaskId(String taskId)     { this.taskId = taskId; }

    public String getTaskType()              { return taskType; }
    public void setTaskType(String taskType) { this.taskType = taskType; }

    public String getRawPayload()                  { return rawPayload; }
    public void setRawPayload(String rawPayload)   { this.rawPayload = rawPayload; }

    public String getFilePath()                    { return filePath; }
    public void setFilePath(String filePath)       { this.filePath = filePath; }

    public String getFinalDecision()               { return finalDecision; }
    public void setFinalDecision(String finalDecision) { this.finalDecision = finalDecision; }

    public Double getRiskScore()                   { return riskScore; }
    public void setRiskScore(Double riskScore)     { this.riskScore = riskScore; }

    public String getStatus()                { return status; }
    public void setStatus(String status)     { this.status = status; }

    public LocalDateTime getCreatedAt()                    { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt)      { this.createdAt = createdAt; }
}
