package com.pooja.product.config

import org.apache.kafka.clients.admin.NewTopic
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.kafka.config.TopicBuilder

@Configuration
class KafkaConfig {
    @Bean fun productCreatedTopic(): NewTopic = TopicBuilder.name("product.created").partitions(3).replicas(1).build()
    @Bean fun productUpdatedTopic(): NewTopic = TopicBuilder.name("product.updated").partitions(3).replicas(1).build()
    @Bean fun productApprovedTopic(): NewTopic = TopicBuilder.name("product.approved").partitions(3).replicas(1).build()
    @Bean fun productStockTopic(): NewTopic = TopicBuilder.name("product.stock.updated").partitions(3).replicas(1).build()
}
