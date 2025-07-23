package com.core.jikanflow.kanban.controllers;

import com.core.jikanflow.kanban.service.PaymentService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/main/payments")
@AllArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;


}
