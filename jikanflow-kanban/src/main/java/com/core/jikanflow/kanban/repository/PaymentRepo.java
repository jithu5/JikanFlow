package com.core.jikanflow.kanban.repository;

import com.core.jikanflow.kanban.entities.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PaymentRepo extends JpaRepository<Payment, UUID> {
}
