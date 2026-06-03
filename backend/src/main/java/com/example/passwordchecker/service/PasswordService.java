package com.example.passwordchecker.service;

import com.example.passwordchecker.dto.PasswordCheckRequest;
import com.example.passwordchecker.dto.PasswordCheckResponse;
import com.example.passwordchecker.dto.PasswordGenerateResponse;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class PasswordService {

    private static final String UPPERCASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String LOWERCASE_CHARS = "abcdefghijklmnopqrstuvwxyz";
    private static final String DIGIT_CHARS = "0123456789";
    private static final String SPECIAL_CHARS = "!@#$%^&*()-_=+[]{}|;:,.<>?";

    public PasswordCheckResponse checkPassword(PasswordCheckRequest request) {
        String password = request.getPassword();

        if (password == null || password.isEmpty()) {
            return new PasswordCheckResponse(0, "Slaba", List.of("Lozinka ne smije biti prazna."));
        }

        int score = 0;
        List<String> suggestions = new ArrayList<>();

        // Length scoring
        int len = password.length();
        if (len < 8) {
            suggestions.add("Lozinka treba imati najmanje 8 znakova.");
        } else if (len <= 11) {
            score += 2;
        } else if (len <= 15) {
            score += 3;
        } else {
            score += 4;
        }

        // Character category bonuses
        boolean hasUppercase = password.chars().anyMatch(Character::isUpperCase);
        boolean hasLowercase = password.chars().anyMatch(Character::isLowerCase);
        boolean hasDigit = password.chars().anyMatch(Character::isDigit);
        boolean hasSpecial = password.chars().anyMatch(c -> SPECIAL_CHARS.indexOf(c) >= 0);

        if (hasUppercase) score++;
        else suggestions.add("Dodaj velika slova (A-Z).");

        if (hasLowercase) score++;
        else suggestions.add("Dodaj mala slova (a-z).");

        if (hasDigit) score++;
        else suggestions.add("Dodaj cifre (0-9).");

        if (hasSpecial) score++;
        else suggestions.add("Dodaj specijalne znakove (!@#$...).");

        // Penalize patterns
        if (hasSequentialChars(password)) {
            score = Math.max(0, score - 1);
            suggestions.add("Izbjegavaj sekvence poput 'abc' ili '123'.");
        }

        if (hasRepeatingChars(password)) {
            score = Math.max(0, score - 1);
            suggestions.add("Izbjegavaj ponavljanje istih znakova (npr. 'aaa').");
        }

        // Cap score at 8
        score = Math.min(score, 8);

        String label;
        if (score < 8) {
            label = "Slaba";
        } else if (score <= 11) {
            label = "Zadovoljavajuća";
        } else if (score <= 15) {
            label = "Dobra";
        } else {
            label = "Jaka";
        }

        // Remap to 0–4 for frontend display convenience
        int displayScore;
        if (score < 3) displayScore = 0;
        else if (score < 5) displayScore = 1;
        else if (score < 7) displayScore = 2;
        else if (score < 8) displayScore = 3;
        else displayScore = 4;

        return new PasswordCheckResponse(displayScore, label, suggestions);
    }

    public PasswordGenerateResponse generatePassword(int length, boolean uppercase, boolean lowercase,
                                                      boolean digits, boolean specialChars) {
        if (length < 8) length = 8;
        if (length > 128) length = 128;

        StringBuilder charset = new StringBuilder();
        if (uppercase) charset.append(UPPERCASE_CHARS);
        if (lowercase) charset.append(LOWERCASE_CHARS);
        if (digits) charset.append(DIGIT_CHARS);
        if (specialChars) charset.append(SPECIAL_CHARS);

        // Default to lowercase if nothing selected
        if (charset.isEmpty()) charset.append(LOWERCASE_CHARS);

        SecureRandom random = new SecureRandom();
        List<Character> passwordChars = new ArrayList<>();

        // Ensure at least one char from each selected category
        if (uppercase) passwordChars.add(UPPERCASE_CHARS.charAt(random.nextInt(UPPERCASE_CHARS.length())));
        if (lowercase) passwordChars.add(LOWERCASE_CHARS.charAt(random.nextInt(LOWERCASE_CHARS.length())));
        if (digits) passwordChars.add(DIGIT_CHARS.charAt(random.nextInt(DIGIT_CHARS.length())));
        if (specialChars) passwordChars.add(SPECIAL_CHARS.charAt(random.nextInt(SPECIAL_CHARS.length())));

        String charsetStr = charset.toString();
        while (passwordChars.size() < length) {
            passwordChars.add(charsetStr.charAt(random.nextInt(charsetStr.length())));
        }

        Collections.shuffle(passwordChars, random);

        StringBuilder password = new StringBuilder();
        for (char c : passwordChars) {
            password.append(c);
        }

        return new PasswordGenerateResponse(password.toString());
    }

    private boolean hasSequentialChars(String password) {
        String lower = password.toLowerCase();
        for (int i = 0; i < lower.length() - 2; i++) {
            char a = lower.charAt(i);
            char b = lower.charAt(i + 1);
            char c = lower.charAt(i + 2);
            if (b == a + 1 && c == b + 1) return true;
        }
        return false;
    }

    private boolean hasRepeatingChars(String password) {
        for (int i = 0; i < password.length() - 2; i++) {
            if (password.charAt(i) == password.charAt(i + 1)
                    && password.charAt(i + 1) == password.charAt(i + 2)) {
                return true;
            }
        }
        return false;
    }
}