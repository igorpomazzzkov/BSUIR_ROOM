package com.bsuirroom.repository;

import com.bsuirroom.entity.Room;
import com.bsuirroom.entity.Subdepartment;
import com.bsuirroom.entity.Type;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findRoomByCorpus(Byte corpus);
    List<Room> findRoomByNum(String num);
    List<Room> findRoomByType(Type type);
    List<Room> findRoomBySubdepartment(Subdepartment subdepartment);
    List<Room> findRoomBySquar(Double squar);
    List<Room> findRoomByOwner(String owner);
}
