package com.core.jikanflow.kanban.config;

import com.core.jikanflow.kanban.entities.User;
import com.core.jikanflow.kanban.service.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    private static final Logger log = LoggerFactory.getLogger(JwtHandshakeInterceptor.class);
    private final com.core.jikanflow.kanban.config.JwtUtils jwtUtils;
    private final UserService userService;

    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes
    ) {
        String query = request.getURI().getQuery(); // e.g., token=eyJhbGciOi...

        if (query != null && query.startsWith("token=")) {
            String token = query.substring(6); // Remove "token="

            log.info("WebSocket token from query: {}", token);

            if (jwtUtils.validateToken(token)) {
                String username = jwtUtils.getUsername(token);
                attributes.put("username", username);
                log.info("Users name ,"+ username);
                User user = userService.findByUsername(username);
                if (user == null){
                    throw new UsernameNotFoundException("User is not found");
                }
                // ✅ Set Authentication manually
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(user, null, List.of());

                SecurityContext context = SecurityContextHolder.createEmptyContext();
                context.setAuthentication(authentication);
                SecurityContextHolder.setContext(context);
                log.info("In JWT handshake "+context.getAuthentication().getName());
                return true;
            } else {
                log.warn("❌ Invalid JWT token");
            }
        } else {
            log.warn("❌ Token not found in query params");
        }

        return false;
    }

    @Override
    public void afterHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Exception exception
    ) {
        // no-op
    }
}
