package com.smartcampus.backend.model;

import java.time.LocalDateTime;

public class OtpRecord {

    private final String        code;
    private final LocalDateTime expiresAt;
    private boolean             used;

    public OtpRecord(String code, LocalDateTime expiresAt) {
        this.code      = code;
        this.expiresAt = expiresAt;
        this.used      = false;
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiresAt);
    }

    public String        getCode()               { return code; }
    public LocalDateTime getExpiresAt()          { return expiresAt; }
    public boolean       isUsed()                { return used; }
    public void          setUsed(boolean used)   { this.used = used; }
}