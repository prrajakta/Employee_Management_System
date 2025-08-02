package com.example.employee_management.security;

import com.example.employee_management.model.User;
import com.example.employee_management.repository.UserRepository;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtFilter implements Filter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;  // ✅ Add this to look up user role

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");

        if ("OPTIONS".equalsIgnoreCase(req.getMethod())) {
            res.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        String path = req.getRequestURI();
        String authHeader = req.getHeader("Authorization");

        System.out.println("🔒 Filter triggered for URI: " + path);
        System.out.println("🔐 Auth Header: " + authHeader);

        // ✅ Allow login and signup to pass
        if (path.contains("/auth/login") || path.contains("/auth/signup")) {
            chain.doFilter(request, response);
            return;
        }

        // ✅ Check token validity
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            boolean isValid = jwtUtil.isTokenValid(token);

            System.out.println("🧪 Token valid? " + isValid);

            if (isValid) {
                String username = jwtUtil.extractUsername(token);

                // ✅ NEW: Load user from DB to get role
                User user = userRepository.findByUsername(username).orElse(null);

                if (user != null) {
                    String role = user.getRole(); // must be ROLE_ADMIN or ROLE_USER
                    System.out.println("🔐 Found user role: " + role);

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    username,
                                    null,
                                    Collections.singleton(new SimpleGrantedAuthority(role))
                            );
                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    chain.doFilter(request, response);
                    return;
                }
            }
        }

        // ❌ Reject if invalid
        res.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or missing token");
    }
}
