package com.pooja.auth.config

import org.apache.kafka.clients.admin.NewTopic
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.kafka.config.TopicBuilder

@Configuration
class KafkaConfig {

    @Bean
    fun userCreatedTopic(): NewTopic = TopicBuilder.name("user.created").partitions(3).replicas(1).build()

    @Bean
    fun userUpdatedTopic(): NewTopic = TopicBuilder.name("user.updated").partitions(3).replicas(1).build()

    @Bean
    fun userApprovedTopic(): NewTopic = TopicBuilder.name("user.approved").partitions(3).replicas(1).build()
}
