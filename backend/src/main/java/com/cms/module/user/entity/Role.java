package com.cms.module.user.entity;

import com.cms.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "roles")
public class Role extends BaseEntity {
    
    @Column(nullable = false, unique = true)
    private String name;
}
