package com.agentflow.config;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

/**
 * RabbitMQ topology configuration.
 *
 * Queue/exchange/routing-key constants are declared as public statics so that
 * TaskProducerService and TaskController can reference them without magic strings.
 *
 * Topology:
 *   Publisher  →  agentflow_exchange  (DirectExchange)
 *              →  routing key: task.process
 *              →  sap_ai_tasks_queue  (main queue, durable)
 *              →  on NACK: agentflow_dlq_exchange → task.dlq → sap_ai_tasks_dlq
 */
@Configuration
public class RabbitMQConfig {

    // ---- Public constants used by publishers and the Python consumer ----
    public static final String MAIN_QUEUE    = "sap_ai_tasks_queue";
    public static final String DLQ_QUEUE     = "sap_ai_tasks_dlq";
    public static final String EXCHANGE      = "agentflow_exchange";
    public static final String DLQ_EXCHANGE  = "agentflow_dlq_exchange";
    public static final String ROUTING_KEY   = "task.process";
    public static final String DLQ_ROUTING_KEY = "task.dlq";

    // ---- Dead Letter Queue Beans ----

    @Bean
    public Queue deadLetterQueue() {
        return QueueBuilder.durable(DLQ_QUEUE).build();
    }

    @Bean
    public DirectExchange deadLetterExchange() {
        return new DirectExchange(DLQ_EXCHANGE);
    }

    @Bean
    public Binding dlqBinding() {
        return BindingBuilder
                .bind(deadLetterQueue())
                .to(deadLetterExchange())
                .with(DLQ_ROUTING_KEY);
    }

    // ---- Main Queue Beans ----

    @Bean
    public Queue mainQueue() {
        Map<String, Object> args = new HashMap<>();
        args.put("x-dead-letter-exchange",    DLQ_EXCHANGE);
        args.put("x-dead-letter-routing-key", DLQ_ROUTING_KEY);
        return QueueBuilder.durable(MAIN_QUEUE).withArguments(args).build();
    }

    @Bean
    public DirectExchange mainExchange() {
        return new DirectExchange(EXCHANGE);
    }

    @Bean
    public Binding mainBinding() {
        return BindingBuilder
                .bind(mainQueue())
                .to(mainExchange())
                .with(ROUTING_KEY);
    }

    @Bean
    public org.springframework.amqp.support.converter.MessageConverter jsonMessageConverter() {
        return new org.springframework.amqp.support.converter.Jackson2JsonMessageConverter();
    }

    @Bean
    public org.springframework.amqp.rabbit.core.RabbitTemplate rabbitTemplate(org.springframework.amqp.rabbit.connection.ConnectionFactory connectionFactory) {
        final org.springframework.amqp.rabbit.core.RabbitTemplate rabbitTemplate = new org.springframework.amqp.rabbit.core.RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter());
        return rabbitTemplate;
    }
}
