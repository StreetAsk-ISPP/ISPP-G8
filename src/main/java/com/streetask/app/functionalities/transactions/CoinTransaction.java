package com.streetask.app.model;

import java.time.LocalDateTime;
import java.util.UUID;

import com.streetask.app.model.enums.CoinTransactionType;
import com.streetask.app.user.RegularUser;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "coin_transactions")
@Getter
@Setter
public class CoinTransaction extends BaseEntity {

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private RegularUser user;

    @Enumerated(EnumType.STRING)
    private CoinTransactionType type;

    private Integer amount;

    private Integer balanceBefore;

    private Integer balanceAfter;

    private UUID referenceId;

    private LocalDateTime createdAt;
}
