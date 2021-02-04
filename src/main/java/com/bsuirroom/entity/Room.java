package com.bsuirroom.entity;

import lombok.*;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode
public class Room implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Byte corpus;

    private String num;

    @ManyToOne
    @JoinColumn(name = "subdepartment")
    private Subdepartment subdepartment;

    private Double squar;

    private String owner;

    @ManyToOne
    private Type type;

    @OneToOne(cascade = CascadeType.ALL)
    private RoomInfo roomInfo;
}
