package com.boilerplate.service;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import com.boilerplate.model.TransactionLog;
import com.boilerplate.model.VerifiedTransaction;
import com.boilerplate.repository.TransactionLogRepository;
import com.boilerplate.repository.VerifiedTransactionRepository;

@Service
public class TransactionService {

    @Autowired
    private VerifiedTransactionRepository verifiedTransactionRepository;
    
    @Autowired
    private TransactionLogRepository transactionLogRepository;

    @Autowired
    private StringRedisTemplate redisTemplate;

    public void saveVerifiedTransaction(String transactionId, String userAccount) {
        VerifiedTransaction verifiedTransaction = new VerifiedTransaction(transactionId, userAccount, new Date(), "VERIFIED");
        verifiedTransactionRepository.save(verifiedTransaction);
    }

    public void saveTransactionLog(String transactionId, String userAccount, String description) {
    	TransactionLog transactionLog = new TransactionLog(transactionId, userAccount, new Date(), description);
    	transactionLogRepository.save(transactionLog);
    }

    public boolean isTransactionAlreadyVerified(String transactionId) {
        return verifiedTransactionRepository.existsById(transactionId);
    }
    
    // Método para verificar se o hash gerado pelo backend está expirado
    public boolean isGeneratedHashExpired(String generatedHash, String userAccount) {

        // Verifica se o registro existe no redis para continuar o processo da verificacao da transacao
    	//return !redisTemplate.hasKey(generatedHash);
    	
        // Verifica se o registro existe no Redis e se corresponde ao userAccount
        String storedUserAccount = redisTemplate.opsForValue().get(generatedHash);
        return storedUserAccount == null || !storedUserAccount.equals(userAccount);
    	
    }
    
}
