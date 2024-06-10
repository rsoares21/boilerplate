package com.boilerplate.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.boilerplate.model.TransactionLog;

public interface TransactionLogRepository extends MongoRepository<TransactionLog, String> {
}
