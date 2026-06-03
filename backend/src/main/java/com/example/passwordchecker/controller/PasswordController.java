package com.example.passwordchecker.controller;

import com.example.passwordchecker.dto.PasswordCheckRequest;
import com.example.passwordchecker.dto.PasswordCheckResponse;
import com.example.passwordchecker.dto.PasswordGenerateResponse;
import com.example.passwordchecker.service.PasswordService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/password")
public class PasswordController {

    private final PasswordService passwordService;

    public PasswordController(PasswordService passwordService) {
        this.passwordService = passwordService;
    }

    @PostMapping("/check")
    public ResponseEntity<PasswordCheckResponse> checkPassword(@RequestBody PasswordCheckRequest request) {
        PasswordCheckResponse response = passwordService.checkPassword(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/generate")
    public ResponseEntity<PasswordGenerateResponse> generatePassword(
            @RequestParam(defaultValue = "12") int length,
            @RequestParam(defaultValue = "true") boolean uppercase,
            @RequestParam(defaultValue = "true") boolean lowercase,
            @RequestParam(defaultValue = "true") boolean digits,
            @RequestParam(defaultValue = "true") boolean specialChars
    ) {
        PasswordGenerateResponse response = passwordService.generatePassword(length, uppercase, lowercase, digits, specialChars);
        return ResponseEntity.ok(response);
    }
}