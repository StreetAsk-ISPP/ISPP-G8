package com.streetask.app.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.streetask.app.model.enums.ReportStatus;
import com.streetask.app.user.Admin;
import com.streetask.app.user.RegularUser;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "reports")
@Getter
@Setter
public class Report extends BaseEntity {

    @ManyToOne(optional = false)
    @JoinColumn(name = "reporter_id")
    private RegularUser reporter;

    private UUID contentId;

    private String description;

    @Enumerated(EnumType.STRING)
    private ReportStatus status;

    private LocalDateTime reportedAt;

    private LocalDateTime resolvedAt;

    @ManyToOne
    @JoinColumn(name = "resolved_by_admin_id")
    private Admin resolvedBy;

    @ManyToMany
    @JoinTable(name = "report_admin_reviews", joinColumns = @JoinColumn(name = "report_id"), inverseJoinColumns = @JoinColumn(name = "admin_id"))
    private List<Admin> reviewingAdmins;
}
