package com.agentflow.dto;

import java.io.Serializable;

/**
 * Data Transfer Object for incoming task submission requests.
 * Reconstructed from bytecode analysis of TaskRequest.class.
 */
public class TaskRequest implements Serializable {

    private String taskId;
    private String sapSourceSystem;
    private String taskType;
    private String payload;   // JSON-serialised task payload string

    public TaskRequest() {}

    public TaskRequest(String taskId, String sapSourceSystem, String taskType, String payload) {
        this.taskId          = taskId;
        this.sapSourceSystem = sapSourceSystem;
        this.taskType        = taskType;
        this.payload         = payload;
    }

    public String getTaskId()            { return taskId; }
    public void setTaskId(String taskId) { this.taskId = taskId; }

    public String getSapSourceSystem()                       { return sapSourceSystem; }
    public void setSapSourceSystem(String sapSourceSystem)   { this.sapSourceSystem = sapSourceSystem; }

    public String getTaskType()              { return taskType; }
    public void setTaskType(String taskType) { this.taskType = taskType; }

    public String getPayload()               { return payload; }
    public void setPayload(String payload)   { this.payload = payload; }
}
