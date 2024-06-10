package com.boilerplate.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "verified_transactions")
public class VerifiedTransaction {

    @Id
    private String transactionId;
    private String userAccount;
    private Date verifiedAt;
    private String status;

    // Construtores, getters e setters

    public VerifiedTransaction() {
    }

    public VerifiedTransaction(String transactionId, String userAccount, Date verifiedAt, String status) {
        this.transactionId = transactionId;
        this.userAccount = userAccount;
        this.verifiedAt = verifiedAt;
        this.status = status;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}