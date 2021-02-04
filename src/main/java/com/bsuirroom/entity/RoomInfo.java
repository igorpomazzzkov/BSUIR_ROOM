package com.bsuirroom.entity;

import lombok.*;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "room_info")
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode
public class RoomInfo implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "seet_count")
    private int sitCount;

    @Column(name = "pc_count")
    private int pcCount;

    @Column(name = "printer_count")
    private int printCount;

    @Column(name = "data_repair")
    private Date repair;

    private String telephone;

    @Column(name = "is_ethernet")
    private Boolean isEthernet;

    private Boolean plumbing;

    @Column(name = "signal_system")
    private Boolean signalSystem;

    @Column(name = "socket_220")
    private Boolean socket220;

    @Column(name = "socket_360")
    private Boolean socket360;

    @Column(name = "worker_count")
    private Byte countOfWorker;

    private Boolean equipment;

    @Column(name = "eq_named")
    private String equipmentName;

    @Column(name = "eq_desc")
    private String equipmentDesc;
}
