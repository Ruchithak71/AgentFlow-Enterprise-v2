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
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

/**
 * REST controller exposing task submission (JSON & Multipart Document Upload)
 * and result retrieval endpoints.
 */
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskProducerService taskProducerService;

    @Autowired
    private StringRedisTemplate redisTemplate;

    @Autowired
    private TaskRepository taskRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String uploadDir = "/app/uploads";

    // ----------------------------------------------------------------
    // POST /api/tasks — Submit a JSON task
    // ----------------------------------------------------------------
    @PostMapping
    public ResponseEntity<?> submitTask(@RequestBody Map<String, Object> taskPayload) {
        try {
            String taskId = "TASK-" + System.currentTimeMillis();
            String taskType = (String) taskPayload.getOrDefault("taskType", "INVOICE_AUDIT");
            String jsonPayload = objectMapper.writeValueAsString(taskPayload);

            TaskEntity taskEntity = new TaskEntity(taskId, taskType, jsonPayload, "QUEUED");
            taskRepository.save(taskEntity);

            TaskRequest taskRequest = new TaskRequest(taskId, "S4H_PRD_100", taskType, jsonPayload);
            taskProducerService.sendTaskToQueue(taskRequest);

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
    // POST /api/tasks/upload — Submit an invoice document (PDF/Image)
    // ----------------------------------------------------------------
    @PostMapping("/upload")
    public ResponseEntity<?> uploadInvoiceTask(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "vendorId", defaultValue = "VEN-1001") String vendorId,
            @RequestParam(value = "invoiceAmount", defaultValue = "0") Double invoiceAmount,
            @RequestParam(value = "containsPII", defaultValue = "false") Boolean containsPII,
            @RequestParam(value = "poNumber", required = false) String poNumber
    ) {
        try {
            String taskId = "TASK-" + System.currentTimeMillis();
            String originalFileName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "invoice.pdf";
            String savedFileName = taskId + "_" + originalFileName.replaceAll("[^a-zA-Z0-9.-]", "_");

            // Ensure upload directory exists
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            Path destinationPath = Paths.get(uploadDir, savedFileName);
            Files.write(destinationPath, file.getBytes());

            // Build payload with document metadata
            Map<String, Object> payloadMap = new HashMap<>();
            payloadMap.put("taskId", taskId);
            payloadMap.put("vendorId", vendorId);
            payloadMap.put("invoiceAmount", invoiceAmount);
            payloadMap.put("containsPII", containsPII);
            payloadMap.put("poNumber", poNumber != null ? poNumber : "PO-1001");
            payloadMap.put("fileName", originalFileName);
            payloadMap.put("filePath", destinationPath.toString());
            payloadMap.put("taskType", "MULTIMODAL_INVOICE_AUDIT");

            String jsonPayload = objectMapper.writeValueAsString(payloadMap);

            // Persist with file path
            TaskEntity taskEntity = new TaskEntity(taskId, "MULTIMODAL_INVOICE_AUDIT", jsonPayload, destinationPath.toString(), "QUEUED");
            taskRepository.save(taskEntity);

            // Enqueue message
            TaskRequest taskRequest = new TaskRequest(taskId, "S4H_PRD_100", "MULTIMODAL_INVOICE_AUDIT", jsonPayload);
            taskProducerService.sendTaskToQueue(taskRequest);

            Map<String, Object> response = new HashMap<>();
            response.put("status", "ACCEPTED");
            response.put("taskId", taskId);
            response.put("fileName", originalFileName);
            response.put("filePath", destinationPath.toString());
            response.put("message", "Document received, queued for multi-agent audit.");
            return ResponseEntity.accepted().body(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Failed to upload and queue document: " + e.getMessage() + "\"}");
        }
    }

    // ----------------------------------------------------------------
    // GET /api/tasks/{taskId} — Poll for cached result
    // ----------------------------------------------------------------
    @GetMapping(value = "/{taskId}", produces = "application/json")
    public ResponseEntity<String> getTaskResult(@PathVariable String taskId) {
        try {
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
