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

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email   = oAuth2User.getAttribute("email");
        String name    = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");

        String requestUri = request.getRequestURI();
        String provider = "GOOGLE";
        if (requestUri.contains("github"))   provider = "GITHUB";
        else if (requestUri.contains("facebook")) provider = "FACEBOOK";

        Optional<User> existing = userRepository.findByEmail(email);
        User user;

        if (existing.isPresent()) {
            user = existing.get();
            if (picture != null && user.getProfilePhotoUrl() == null) {
                user.setProfilePhotoUrl(picture);
                userRepository.save(user);
            }
        } else {
            user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setUserName(email != null ? email.split("@")[0] : "user_" + System.currentTimeMillis());
            user.setRole("USER");
            user.setProvider(provider);
            user.setEnabled(true);
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());
            if (picture != null) user.setProfilePhotoUrl(picture);
            userRepository.save(user);
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole(), user.getId());
        String encodedName = URLEncoder.encode(user.getName() != null ? user.getName() : "", StandardCharsets.UTF_8);

        String redirectUrl = "http://localhost:3000/oauth-callback"
                + "?token="  + token
                + "&userId=" + user.getId()
                + "&role="   + user.getRole()
                + "&name="   + encodedName;

        response.sendRedirect(redirectUrl);
    }
}