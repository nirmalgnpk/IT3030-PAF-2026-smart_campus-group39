package com.smartcampus.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    /**
     * Sends a styled HTML OTP email.
     *
     * @param to      recipient address
     * @param otp     6-digit code
     * @param purpose "REGISTER" | "RESET_PASSWORD"
     */
    public void sendOtp(String to, String otp, String purpose) throws MessagingException {

        boolean isRegister = "REGISTER".equals(purpose);

        String subject  = isRegister
                ? "Smart Campus — Verify Your Email"
                : "Smart Campus — Password Reset OTP";
        String heading  = isRegister
                ? "Verify your email address"
                : "Reset your password";
        String bodyText = isRegister
                ? "You're almost there! Use the OTP below to verify your email and complete your registration."
                : "Use the OTP below to verify your identity and reset your Smart Campus password.";

        MimeMessage       message = mailSender.createMimeMessage();
        MimeMessageHelper helper  = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setFrom(fromEmail);
        helper.setText(buildHtml(heading, bodyText, otp), true);

        mailSender.send(message);
    }

    // ── HTML builder ─────────────────────────────────────────────────────────

    private String buildHtml(String heading, String bodyText, String otp) {

        StringBuilder digits = new StringBuilder();
        for (char c : otp.toCharArray()) {
            digits.append(
                    "<span style='display:inline-block;width:44px;height:52px;line-height:52px;" +
                            "text-align:center;font-size:26px;font-weight:700;color:#0f172a;" +
                            "background:#f1f5f9;border:2px solid #e2e8f0;border-radius:10px;" +
                            "margin:0 4px;font-family:monospace;'>" + c + "</span>"
            );
        }

        return "<!DOCTYPE html><html><head><meta charset='UTF-8'></head>" +
                "<body style='margin:0;padding:0;background:#f8fafc;font-family:Segoe UI,Arial,sans-serif;'>" +
                "<table width='100%' cellpadding='0' cellspacing='0'>" +
                "<tr><td align='center' style='padding:40px 16px;'>" +
                "<table width='520' cellpadding='0' cellspacing='0' style='" +
                "background:#fff;border-radius:20px;border:1px solid #e2e8f0;" +
                "box-shadow:0 4px 40px rgba(0,0,0,0.07);overflow:hidden;'>" +

                // Header bar
                "<tr><td style='background:linear-gradient(135deg,#e84545,#c0392b);padding:28px 36px;'>" +
                "<span style='font-size:16px;font-weight:700;color:#fff;'>Smart Campus</span>" +
                "</td></tr>" +

                // Body
                "<tr><td style='padding:36px 36px 28px;'>" +
                "<h1 style='margin:0 0 10px;font-size:22px;font-weight:700;color:#0f172a;'>" + heading + "</h1>" +
                "<p style='margin:0 0 28px;font-size:14px;color:#64748b;line-height:1.65;'>" + bodyText + "</p>" +
                "<div style='text-align:center;margin:0 0 28px;'>" + digits + "</div>" +
                "<p style='margin:0;font-size:13px;color:#94a3b8;text-align:center;'>" +
                "This OTP is valid for <strong style='color:#0f172a;'>10 minutes</strong>. Do not share it with anyone." +
                "</p></td></tr>" +

                // Footer
                "<tr><td style='background:#f8fafc;padding:20px 36px;border-top:1px solid #e2e8f0;'>" +
                "<p style='margin:0;font-size:12px;color:#94a3b8;'>" +
                "If you didn't request this, you can safely ignore this email. " +
                "This message was sent by Smart Campus — SLIIT Campus Portal.</p>" +
                "</td></tr>" +
                "</table></td></tr></table></body></html>";
    }
}