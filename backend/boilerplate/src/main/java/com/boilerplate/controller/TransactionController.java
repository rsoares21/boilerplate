package com.boilerplate.controller;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.boilerplate.dto.TransactionRequest;
import com.boilerplate.dto.TransactionResponse;
import com.boilerplate.service.TransactionService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
public class TransactionController {

    @Autowired
    private TransactionService transactionService;
    
    @Autowired
    private StringRedisTemplate redisTemplate;
    
	@PostMapping("/verifyTransaction")
	public ResponseEntity<?> verifyTransaction(@RequestBody TransactionRequest transactionRequest) {
        
		//TODO implementar logica de expiração da transacao
		
		String transactionId = transactionRequest.getTransactionHash(); // Obtém o hash da transação do request
        String verifyMemoHash = transactionRequest.getGeneratedHash(); // This is the hash you generated and stored earlier
        
        // Verifique se a transação já foi verificada anteriormente
        if (transactionService.isTransactionAlreadyVerified(transactionId)) {
            return ResponseEntity.status(400).body("{\"error\": \"Transaction already verified\"}");
        }

        // Verifique se o hash gerado pelo backend já expirou
        if (transactionService.isGeneratedHashExpired(transactionRequest.getGeneratedHash(), transactionRequest.getUserAccount())) {
            return ResponseEntity.status(400).body("{\"error\": \"Hash has expired, try again...\"}");
        }
        
        String endpoint = "https://wax.greymass.com/v1/history/get_transaction?id=" + transactionId; // URL do endpoint da API
        RestTemplate restTemplate = new RestTemplate();

        int maxAttempts = 5;  // Número máximo de tentativas
        int waitTime = 3000;   // Tempo de espera entre as tentativas em milissegundos

        try {
            for (int attempt = 1; attempt <= maxAttempts; attempt++) { // Loop para realizar múltiplas tentativas
                try {
                    System.out.println("Tentativa: " + attempt); // Log de tentativa
                    String result = restTemplate.getForObject(endpoint, String.class); // Faz a requisição à API

                    // Parseia a resposta JSON para extrair os detalhes
                    ObjectMapper objectMapper = new ObjectMapper();
                    JsonNode rootNode = objectMapper.readTree(result);

                    String verifyAccount = rootNode.path("trx").path("trx").path("actions").get(0).path("authorization").get(0)
                            .path("actor").asText(); // Extrai o ator da transação
                    
                    String txMemo = rootNode.path("trx").path("trx").path("actions").get(0).path("data").path("memo").asText();

                    String txUserAccount = transactionRequest.getUserAccount(); // Obtém a conta do usuário do request
                    
                    System.out.println("transactionId:"+transactionId);
                    
                    System.out.println("verifyAccount  :"+verifyAccount);
                    System.out.println("txUserAccount  :"+txUserAccount);
                    
                    System.out.println("verifyMemoHash :"+verifyMemoHash);
                    System.out.println("memo           :"+txMemo);
                    
                    
                    if (!txMemo.equals(verifyMemoHash)) return ResponseEntity.status(400).body("{\"error\": \"Hash mismatch\"}");

                    if (!txUserAccount.equals(verifyAccount)) return ResponseEntity.status(400).body("{\"error\": \"Account mismatch\"}");
                    
                    try {
                    	transactionService.saveVerifiedTransaction(transactionId, verifyAccount);	
                    } catch (Exception e) {
                    	System.out.println("database fail..." + e.getMessage());
					}
                    
                    TransactionResponse response = new TransactionResponse("Transaction Ok", verifyAccount);
                    
                    return ResponseEntity.ok(response);

                } catch (Exception e) {
                    // Se a tentativa falhar, espera antes de tentar novamente
                    if (attempt == maxAttempts) {
                        // Se for a última tentativa, lança a exceção
                        throw e;
                    }
                    Thread.sleep(waitTime); // Espera pelo tempo definido antes de tentar novamente
                }
            }
        } catch (Exception e) {
            System.out.println("error:" + e.getMessage()); // Log de erro
            return ResponseEntity.status(500)
                    .body("{\"error\": \"Error verifying transaction: " + e.getMessage() + "\"}"); // Retorna a resposta de erro
        }

        // Em caso de falha, retorna uma resposta de erro
        return ResponseEntity.status(500)
                .body("{\"error\": \"Transaction not found after multiple attempts\"}");
    }
	
    @GetMapping("/hash")
   	public ResponseEntity<String> generateHash(@RequestParam(value = "userAccount", required = true) String userAccount) {

        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[16];
        random.nextBytes(bytes);
        String hash = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        
        // Define a chave no Redis com o valor do hash e um tempo de expiração de 1 minuto
        redisTemplate.opsForValue().set(hash, userAccount, 1, TimeUnit.MINUTES);
        
        System.out.println("redis-save: key=" + hash + " value=" + userAccount);
        
        return ResponseEntity.ok(hash);
    }

}
