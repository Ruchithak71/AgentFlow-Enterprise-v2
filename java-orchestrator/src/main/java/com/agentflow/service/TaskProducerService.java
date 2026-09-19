package com.agentflow.service;

import com.agentflow.config.RabbitMQConfig;
import com.agentflow.dto.TaskRequest;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Service layer responsible for publishing task messages to RabbitMQ.
 *
 * FIX C-3: Uses the three-argument convertAndSend(exchange, routingKey, message)
 * overload so messages flow through the declared agentflow_exchange.
 * Previously the two-argument form was used (queue name as routing key),
 * which bypassed the exchange and silently disabled dead-lettering.
 *
 * FIX C-11: TaskController now delegates to this service instead of calling
 * rabbitTemplate directly, so all retry/logging logic lives in one place.
 */
@Service
public class TaskProducerService {

    private final RabbitTemplate rabbitTemplate;

    @Autowired
    public TaskProducerService(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    /**
     * Publishes a task to the main exchange using the configured routing key.
     * Failed deliveries will be dead-lettered to sap_ai_tasks_dlq automatically.
     *
     * @param taskRequest the task DTO to publish
     */
    public void sendTaskToQueue(TaskRequest taskRequest) {
        System.out.printf("Pushing SAP Task [%s] to RabbitMQ via exchange '%s' / key '%s'...%n",
                taskRequest.getTaskId(),
                RabbitMQConfig.EXCHANGE,
                RabbitMQConfig.ROUTING_KEY);

        // FIX C-3: exchange + routingKey variant — routes through agentflow_exchange
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE,
                RabbitMQConfig.ROUTING_KEY,
                taskRequest
        );

        System.out.println("Task successfully queued!");
    }
}
