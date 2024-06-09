package com.boilerplate.dto;

public class TransactionResponse {
    private String message;
    private String account;

    public TransactionResponse(String message, String account) {
        this.message = message;
        this.account = account;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }
}