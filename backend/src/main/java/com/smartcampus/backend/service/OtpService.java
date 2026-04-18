package com.smartcampus.backend.service;

import com.smartcampus.backend.model.OtpRecord;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private static final int OTP_EXPIRY_MINUTES = 10;

    private final Map<String, OtpRecord> otpStore = new ConcurrentHashMap<>();

    /** Generates a 6-digit OTP, stores it keyed by email, and returns the code. */
    public String generateAndStore(String email) {
        String code = String.format("%06d", new Random().nextInt(1_000_000));
        otpStore.put(
                email.trim().toLowerCase(),
                new OtpRecord(code, LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES))
        );
        return code;
    }

    /** Returns true if the code is correct, unused, and not expired. Marks it used on success. */
    public boolean verify(String email, String code) {
        String    key    = email.trim().toLowerCase();
        OtpRecord record = otpStore.get(key);

        if (record == null)                 return false;
        if (record.isUsed())                return false;
        if (record.isExpired())             { otpStore.remove(key); return false; }
        if (!record.getCode().equals(code)) return false;

        record.setUsed(true);
        return true;

    }

    /** Removes the OTP entry after successful registration or password reset. */
    public void remove(String email) {
        otpStore.remove(email.trim().toLowerCase());
    }
}