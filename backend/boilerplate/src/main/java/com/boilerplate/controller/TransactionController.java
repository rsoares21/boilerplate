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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
public class TransactionController {

	private static final Logger logger = LoggerFactory.getLogger(TransactionController.class);

	@Autowired
	private TransactionService transactionService;

	@Autowired
	private StringRedisTemplate redisTemplate;

	@PostMapping("/verifyTransaction")
	public ResponseEntity<?> verifyTransaction(@RequestBody TransactionRequest transactionRequest) {

		// TODO implementar logica de expiração da transacao

		String transactionId = transactionRequest.getTransactionHash(); // Obtém o hash da transação do request
		String verifyMemoHash = transactionRequest.getGeneratedHash(); // This is the hash you generated and stored
																		// earlier

		// Verifica se a transação já foi verificada anteriormente
		if (transactionService.isTransactionAlreadyVerified(transactionId)) {
			return ResponseEntity.status(400).body("{\"error\": \"Transaction already verified\"}");
		}

		// Verifica se o hash gerado pelo backend já expirou
		if (transactionService.isGeneratedHashExpired(transactionRequest.getGeneratedHash(),
				transactionRequest.getUserAccount())) {
			return ResponseEntity.status(400).body("{\"error\": \"Hash has expired, try again...\"}");
		}

		String endpoint = "https://wax.greymass.com/v1/history/get_transaction?id=" + transactionId; // URL do endpoint
																										// da API
		RestTemplate restTemplate = new RestTemplate();

		int maxAttempts = 5; // Número máximo de tentativas
		int waitTime = 3000; // Tempo de espera entre as tentativas em milissegundos

		try {
			for (int attempt = 1; attempt <= maxAttempts; attempt++) { // Loop para realizar múltiplas tentativas
				try {

					logger.info("Tentativa: " + attempt);

					String result = restTemplate.getForObject(endpoint, String.class); // Faz a requisição à API

					// Parseia a resposta JSON para extrair os detalhes
					ObjectMapper objectMapper = new ObjectMapper();
					JsonNode rootNode = objectMapper.readTree(result);
					
					//logger.info("result:" + result);

					String verifyAccount = rootNode.path("trx").path("trx").path("actions").get(0).path("authorization")
							.get(0).path("actor").asText(); // Extrai o ator da transação

					String txMemo = rootNode.path("trx").path("trx").path("actions").get(0).path("data").path("memo")
							.asText();

					String txUserAccount = transactionRequest.getUserAccount(); // Obtém a conta do usuário do request

					logger.info("transactionId:" + transactionId);

					logger.info("verifyAccount  :" + verifyAccount);
					logger.info("txUserAccount  :" + txUserAccount);

					logger.info("verifyMemoHash :" + verifyMemoHash);
					logger.info("memo           :" + txMemo);

					String transactionStatus = rootNode.path("trx").path("receipt").path("status").asText();

					if (!transactionStatus.equals("executed"))
						return ResponseEntity.status(400).body("{\"error\": \"Transaction status mismatch\"}");
					
					if (!txMemo.equals(verifyMemoHash))
						return ResponseEntity.status(400).body("{\"error\": \"Hash mismatch\"}");

					if (!txUserAccount.equals(verifyAccount))
						return ResponseEntity.status(400).body("{\"error\": \"Account mismatch\"}");

					try {
						transactionService.saveVerifiedTransaction(transactionId, verifyAccount);
					} catch (Exception e) {
						logger.info("database fail..." + e.getMessage());
					}

					try {
						transactionService.saveTransactionLog(transactionId, txUserAccount,
								"LOGIN SUCCESSFUL With hash:" + txMemo);
					} catch (Exception e) {
						logger.info("database fail..." + e.getMessage());
					}

					TransactionResponse response = new TransactionResponse("Transaction Ok", verifyAccount);

					return ResponseEntity.ok(response);

				} catch (Exception e) {
					if (attempt == maxAttempts) {
						throw e;
					}
					
					Thread.sleep(waitTime);
				}
			}
		} catch (Exception e) {
			logger.error("error:" + e.getMessage());

			return ResponseEntity.status(500)
					.body("{\"error\": \"Error verifying transaction: " + e.getMessage() + "\"}"); 
		}

		// Em caso de falha, retorna uma resposta de erro
		return ResponseEntity.status(500).body("{\"error\": \"Transaction not found after multiple attempts\"}");
	}

	@GetMapping("/hash")
	public ResponseEntity<String> generateHash(
			@RequestParam(value = "userAccount", required = true) String userAccount) {

		SecureRandom random = new SecureRandom();
		byte[] bytes = new byte[16];
		random.nextBytes(bytes);
		String hash = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

		// Define a chave no Redis com o valor do hash e um tempo de expiração de 30s
		redisTemplate.opsForValue().set(hash, userAccount, 30, TimeUnit.SECONDS);

		// System.out.println("redis-save: key=" + hash + " value=" + userAccount);

		return ResponseEntity.ok(hash);
	}

}
