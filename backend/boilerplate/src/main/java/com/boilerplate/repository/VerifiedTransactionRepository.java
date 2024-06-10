package com.boilerplate.repository;

import com.boilerplate.model.VerifiedTransaction;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface VerifiedTransactionRepository extends MongoRepository<VerifiedTransaction, String> {
}
