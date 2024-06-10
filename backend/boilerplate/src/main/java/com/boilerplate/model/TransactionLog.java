package com.boilerplate.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "transaction_logs")
public class TransactionLog {

    @Id
    private String logId;
    private String userAccount;
    private Date verifiedAt;
    private String description;

    // Construtores, getters e setters

    public TransactionLog() {
    }

    public TransactionLog(String transactionId, String userAccount, Date verifiedAt, String description) {
        this.logId = transactionId;
        this.userAccount = userAccount;
        this.verifiedAt = verifiedAt;
        this.description = description;
    }

    public String getTransactionId() {
        return logId;
    }

    public void setTransactionId(String transactionId) {
        this.logId = transactionId;
    }

    public String getUserAccount() {
        return userAccount;
    }

    public void setUserAccount(String userAccount) {
        this.userAccount = userAccount;
    }

    public Date getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(Date verifiedAt) {
        this.verifiedAt = verifiedAt;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}