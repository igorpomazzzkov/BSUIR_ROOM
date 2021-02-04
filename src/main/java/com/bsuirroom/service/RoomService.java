package com.bsuirroom.service;

import com.bsuirroom.entity.Room;
import com.bsuirroom.repository.RoomRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomService {
    @Autowired
    private RoomRepository roomRepository;

    public List<Room> getAllRooms(){
        return this.roomRepository.findAll();
    }

    public Room add(Room room){
        return this.roomRepository.save(room);
    }

    public void delete(Long id){
        this.roomRepository.deleteById(id);
    }

    public Room update(Room room) {
        System.out.println(room);
        Room roomFromDB = this.roomRepository.findById(room.getId()).get();
        if(roomFromDB != null){
            BeanUtils.copyProperties(room, roomFromDB, "id");
            return this.roomRepository.save(room);
        }
        return room;
    }

    public List<Room> search(Room room){
        System.out.println(room);
        List<Room> rooms = this.roomRepository.findAll();
        if(room.getCorpus() != null){
            rooms = rooms.stream()
                    .filter(item -> item.getCorpus().equals(room.getCorpus()))
                    .collect(Collectors.toList());
        }
        if(room.getNum() != null){
            rooms = rooms.stream()
                    .filter(item -> item.getNum().equals(room.getNum()))
                    .collect(Collectors.toList());
        }
        if(room.getType().getId() != null){
            rooms = rooms.stream()
                    .filter(item -> item.getType().equals(room.getType()))
                    .collect(Collectors.toList());
        }
        if(room.getSubdepartment().getDepartment().getId() != null){
            rooms = rooms.stream()
                    .filter(item -> item.getSubdepartment().getDepartment().getId().equals(room.getSubdepartment().getDepartment().getId()))
                    .collect(Collectors.toList());
        }
        if(room.getSubdepartment().getId() != null){
            rooms = rooms.stream()
                    .filter(item -> item.getSubdepartment().equals(room.getSubdepartment()))
                    .collect(Collectors.toList());
        }
        if(room.getSquar() != null){
            rooms = rooms.stream()
                    .filter(item -> item.getSquar().equals(room.getSquar()))
                    .collect(Collectors.toList());
        }
        if(room.getOwner() != null) {
            rooms = rooms.stream()
                    .filter(item -> item.getOwner().equals(room.getOwner()))
                    .collect(Collectors.toList());
        }
        return rooms;
    }


}
