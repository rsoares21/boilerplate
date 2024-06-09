package com.boilerplate.dto;

public class TransactionRequest {
    private String transactionHash;
    private String userAccount;
    private String generatedHash;

    public String getTransactionHash() {
        return transactionHash;
    }

    public void setTransactionHash(String transactionHash) {
        this.transactionHash = transactionHash;
    }

	public String getUserAccount() {
		return userAccount;
	}

	public void setUserAccount(String userAccount) {
		this.userAccount = userAccount;
	}

	public String getGeneratedHash() {
		return generatedHash;
	}
    
	public void setGeneratedHash(String generatedHash) {
		this.generatedHash = generatedHash;
	}
    
    
}
