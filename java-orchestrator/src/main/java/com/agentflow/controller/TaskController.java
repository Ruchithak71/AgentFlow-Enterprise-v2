package com.agentflow.controller;

import com.agentflow.dto.TaskRequest;
import com.agentflow.entity.TaskEntity;
import com.agentflow.repository.TaskRepository;
import com.agentflow.service.TaskProducerService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * REST controller exposing the task submission and result retrieval endpoints.
 *
 * Endpoints:
 *   POST  /api/tasks          — submit a new AI audit task
 *   GET   /api/tasks/{taskId} — poll for cached result from Redis
 *
 * FIX C-11: rabbitTemplate is no longer injected here. Publishing is fully
 * delegated to TaskProducerService, ensuring the exchange/routing-key fix
 * (C-3) in that service is always exercised.
 */
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskProducerService taskProducerService;   // FIX C-11: delegate, not bypass

    @Autowired
    private StringRedisTemplate redisTemplate;

    @Autowired
    private TaskRepository taskRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    // ----------------------------------------------------------------
    // POST /api/tasks — Submit a new task
    // ----------------------------------------------------------------
    @PostMapping
    public ResponseEntity<?> submitTask(@RequestBody Map<String, Object> taskPayload) {
        try {
            // Generate a time-based unique task ID
            String taskId = "TASK-" + System.currentTimeMillis();

            // Extract or default the task type
            String taskType = (String) taskPayload.getOrDefault("taskType", "INVOICE_AUDIT");

            // Serialise the full incoming payload to a JSON string for persistence
            String jsonPayload = objectMapper.writeValueAsString(taskPayload);

            // Persist the task record with QUEUED status
            TaskEntity taskEntity = new TaskEntity(taskId, taskType, jsonPayload, "QUEUED");
            taskRepository.save(taskEntity);

            // Build the message map for the queue
            Map<String, Object> message = new HashMap<>();
            message.put("taskId",   taskId);
            message.put("taskType", taskType);
            message.put("payload",  taskPayload);

            // FIX C-11 / C-3: publish via TaskProducerService (exchange + routing key)
            TaskRequest taskRequest = new TaskRequest(taskId, "S4H_PRD_100", taskType, jsonPayload);
            taskProducerService.sendTaskToQueue(taskRequest);

            // Return 202 Accepted
            Map<String, String> response = new HashMap<>();
            response.put("status",  "ACCEPTED");
            response.put("taskId",  taskId);
            response.put("message", "Task successfully queued and persisted in database.");
            return ResponseEntity.accepted().body(response);

        } catch (Exception e) {
            System.err.println("Error processing task submission: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // ----------------------------------------------------------------
    // GET /api/tasks/{taskId} — Poll for cached result
    // ----------------------------------------------------------------
    @GetMapping(value = "/{taskId}", produces = "application/json")
    public ResponseEntity<String> getTaskResult(@PathVariable String taskId) {
        try {
            // Redis key format: "task:{taskId}" — matches the Python worker's cache key
            String cacheKey = "task:" + taskId;
            String taskJson  = redisTemplate.opsForValue().get(cacheKey);

            if (taskJson == null) {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("{\"status\": \"NOT_FOUND\", \"message\": \"Task ID not found in Redis cache or still processing.\"}");
            }

            return ResponseEntity.ok(taskJson);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // ----------------------------------------------------------------
    // GET /api/tasks — List all tasks in database
    // ----------------------------------------------------------------
    @GetMapping
    public ResponseEntity<?> getAllTasks() {
        try {
            return ResponseEntity.ok(taskRepository.findAllByOrderByCreatedAtDesc());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
