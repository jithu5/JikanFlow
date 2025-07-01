package com.core.jikanflow.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.Map;

public class CustomHandshakeHandler extends DefaultHandshakeHandler {
    private static final Logger log = LoggerFactory.getLogger(CustomHandshakeHandler.class);
    @Override
    protected Principal determineUser(
            ServerHttpRequest request,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes
    ) {
        log.info((String) attributes.get("username"));
        String username = (String) attributes.get("username");
        System.out.println("Determining principal for: " + attributes.get("username"));
        return username != null ? new StompPrincipal(username) : null;
    }
}
