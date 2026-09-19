package com.agentflow.repository;

import com.agentflow.entity.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for TaskEntity.
 * Primary key type is String (the task_id column).
 */
@Repository
public interface TaskRepository extends JpaRepository<TaskEntity, String> {
    java.util.List<TaskEntity> findAllByOrderByCreatedAtDesc();
}
