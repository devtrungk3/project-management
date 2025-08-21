package com.example.server.config;

import com.example.server.exception.InactiveUserException;
import com.example.server.model.entity.UserStatus;
import com.example.server.service.security.CustomUserDetailsService;
import com.example.server.service.security.JWTService;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
    private final JWTService jwtService;
    private final CustomUserDetailsService customUserDetailsService;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        String token = null;
        int id = -1;
        String username = null;
        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
                id = jwtService.extractUserId(token);
                username = jwtService.extractUsername(token);
            }
            if (id != -1 && username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
                if (jwtService.isValidAccessToken(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
            request.setAttribute("userId", id);
            filterChain.doFilter(request, response);
        } catch (ExpiredJwtException e) {
            System.out.println(e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            Map<String, String> errorBody = Map.of(
                    "error_code", "EXPIRED_TOKEN",
                    "error", "This token has expired"
            );
            new ObjectMapper().writeValue(response.getWriter(), errorBody);
        } catch (InactiveUserException e) {
            System.out.println(e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            String errorMessage = e.getUserStatus() == UserStatus.SUSPENDED
                ? "Your account has been suspended. Please contact support for details"
                : "Your account has been permanently banned due to violations of our terms of service";
            Map<String, String> errorBody = Map.of(
                    "error_code", "INACTIVE",
                    "error", errorMessage
            );
            new ObjectMapper().writeValue(response.getWriter(), errorBody);
        }
    }
}
