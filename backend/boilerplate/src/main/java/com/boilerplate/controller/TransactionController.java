package com.boilerplate.controller;

import java.security.SecureRandom;
import java.util.Base64;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.boilerplate.dto.TransactionRequest;
import com.boilerplate.dto.TransactionResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
public class TransactionController {

	@PostMapping("/verifyTransaction")
	public ResponseEntity<?> verifyTransaction(@RequestBody TransactionRequest transactionRequest) {
        String transactionId = transactionRequest.getTransactionHash(); // Obtém o hash da transação do request
        String verifyMemoHash = transactionRequest.getGeneratedHash(); // This is the hash you generated and stored earlier

        String endpoint = "https://wax.greymass.com/v1/history/get_transaction?id=" + transactionId; // URL do endpoint da API
        RestTemplate restTemplate = new RestTemplate();

        int maxAttempts = 10;  // Número máximo de tentativas
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
                    
                    System.out.println("verifyAccount:"+verifyAccount);
                    System.out.println("txUserAccount:"+txUserAccount);
                    
                    System.out.println("verifyMemoHash:"+verifyMemoHash);
                    System.out.println("memo:"+txMemo);
                    
                    
                    if (!txMemo.equals(verifyMemoHash)) return ResponseEntity.status(400).body("{\"error\": \"Hash mismatch\"}");

                    if (!txUserAccount.equals(verifyAccount)) return ResponseEntity.status(400).body("{\"error\": \"Account mismatch\"}");
                    
                    //return ResponseEntity.ok("{ \"message\": \"Transaction Ok: " + account + "\" }"); // Retorna a resposta com a conta
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
    public ResponseEntity<String> generateHash() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[16];
        random.nextBytes(bytes);
        String hash = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        return ResponseEntity.ok(hash);
    }

}
