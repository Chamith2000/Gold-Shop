package com.example.gayangold.repository;

import com.example.gayangold.entity.OrderEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<OrderEntity, String> {
    List<OrderEntity> findByUserIdOrderByCreatedAtDesc(String userId);
    Optional<OrderEntity> findByOrderNumber(String orderNumber);
    List<OrderEntity> findAllByOrderByCreatedAtDesc();

    @EntityGraph(attributePaths = {"items"})
    @Query("select o from OrderEntity o where o.id = :id")
    Optional<OrderEntity> findWithItemsById(@Param("id") String id);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM OrderEntity o")
    java.math.BigDecimal sumTotalRevenue();

    long countByOrderStatus(OrderEntity.OrderStatus status);
}
