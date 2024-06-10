package com.boilerplate.service;

import com.boilerplate.model.VerifiedTransaction;
import com.boilerplate.repository.VerifiedTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class TransactionService {

    @Autowired
    private VerifiedTransactionRepository verifiedTransactionRepository;

    public void saveVerifiedTransaction(String transactionId, String userAccount) {
        VerifiedTransaction verifiedTransaction = new VerifiedTransaction(transactionId, userAccount, new Date(), "VERIFIED");
        verifiedTransactionRepository.save(verifiedTransaction);
    }

    public boolean isTransactionVerified(String transactionId) {
        return verifiedTransactionRepository.existsById(transactionId);
    }
    
}
