package dev.benew.filmbible.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Slf4j
@Controller
@RequestMapping("/video")
public class VideoController {

    @GetMapping(value = {"", "/"})
    public String filmClass() {
        return "/filmClass";
    }
}
