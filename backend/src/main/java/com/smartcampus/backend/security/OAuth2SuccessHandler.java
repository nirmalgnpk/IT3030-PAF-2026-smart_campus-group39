package com.smartcampus.backend.security;

import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.UserRepository;
import com.smartcampus.backend.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Optional;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    // Detect which frontend port is being used by checking the Referer / Origin header,
    // falling back to 5173 (Vite default). Change to 3000 if you use CRA.
    private String detectFrontendOrigin(HttpServletRequest request) {
        String origin = request.getHeader("Origin");
        if (origin != null && origin.contains("3000")) return "http://localhost:3000";
        String referer = request.getHeader("Referer");
        if (referer != null && referer.contains("3000")) return "http://localhost:3000";
        return "http://localhost:5173";
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email   = oAuth2User.getAttribute("email");
        String name    = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");

        // Determine provider from the request URI
        String requestUri = request.getRequestURI();
        String provider = "GOOGLE";
        if (requestUri.contains("github"))   provider = "GITHUB";
        else if (requestUri.contains("facebook")) provider = "FACEBOOK";

        if (email == null) {
            // Some providers don't expose email — redirect with error
            String frontendOrigin = detectFrontendOrigin(request);
            response.sendRedirect(frontendOrigin + "/login?error=no_email");
            return;
        }

        Optional<User> existing = userRepository.findByEmail(email.toLowerCase());
        User user;

        if (existing.isPresent()) {
            user = existing.get();
            // Update profile photo from Google if not already set
            if (picture != null && (user.getProfilePhotoUrl() == null || user.getProfilePhotoUrl().isBlank())) {
                user.setProfilePhotoUrl(picture);
                user.setUpdatedAt(LocalDateTime.now());
                userRepository.save(user);
            }
        } else {
            user = new User();
            user.setEmail(email.toLowerCase());
            user.setName(name != null ? name : email.split("@")[0]);
            user.setUserName(email.split("@")[0]);
            user.setRole("USER");
            user.setProvider(provider);
            user.setEnabled(true);
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());
            if (picture != null) user.setProfilePhotoUrl(picture);
            userRepository.save(user);
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole(), user.getId());

        String encodedName  = URLEncoder.encode(user.getName()     != null ? user.getName()     : "", StandardCharsets.UTF_8);
        String encodedEmail = URLEncoder.encode(user.getEmail()    != null ? user.getEmail()    : "", StandardCharsets.UTF_8);
        String encodedPhoto = URLEncoder.encode(user.getProfilePhotoUrl() != null ? user.getProfilePhotoUrl() : "", StandardCharsets.UTF_8);
        String encodedUname = URLEncoder.encode(user.getUserName() != null ? user.getUserName() : "", StandardCharsets.UTF_8);

        String frontendOrigin = detectFrontendOrigin(request);

        String redirectUrl = frontendOrigin + "/oauth-callback"
                + "?token="           + token
                + "&userId="          + user.getId()
                + "&role="            + user.getRole()
                + "&name="            + encodedName
                + "&email="           + encodedEmail
                + "&userName="        + encodedUname
                + "&profilePhotoUrl=" + encodedPhoto
                + "&provider="        + user.getProvider();

        response.sendRedirect(redirectUrl);
    }
}