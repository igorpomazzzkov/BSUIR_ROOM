package com.bsuirroom.controller;

import com.bsuirroom.entity.Room;
import com.bsuirroom.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("rooms")
public class RoomController {
    @Autowired
    private RoomService roomService;

    @GetMapping
    public List<Room> getAllRooms(){
        return this.roomService.getAllRooms();
    }

    @PostMapping("add")
    public Room addRoom(@RequestBody Room room){
        return this.roomService.add(room);
    }

    @DeleteMapping("delete")
    public void deleteRoom(@RequestParam Long id){
        this.roomService.delete(id);
    }

    @PutMapping("move")
    public Room update(@RequestBody Room  room){
        return this.roomService.update(room);
    }

    @PutMapping("edit")
    public Room edit(@RequestBody Room room){
        return this.roomService.update(room);
    }

    @PostMapping("search")
    public List<Room> search(@RequestBody Room room){
        System.out.println(room);
        return this.roomService.search(room);
    }
}
