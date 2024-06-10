package com.boilerplate.service;

import org.springframework.stereotype.Service;

import redis.clients.jedis.Jedis;

@Service
public class HashValidationService {

    private final Jedis jedis;

    public HashValidationService() {
        this.jedis = new Jedis("redis://localhost:6379"); // Conexão com o servidor Redis
    }

    public boolean isHashValid(String hash) {
        return jedis.exists(hash); // Verifica se o hash está presente no Redis
    }

    public void storeHash(String hash) {
        jedis.set(hash, "valid"); // Armazena o hash no Redis
        jedis.expire(hash, 60); // Define o tempo de expiração para 1 minuto (60 segundos)
    }

    public void recreateExpiredHash(String hash) {
        if (!isHashValid(hash)) {
            // Se o hash expirou, recrie-o e armazene-o novamente
            storeHash(hash);
        }
    }
}
