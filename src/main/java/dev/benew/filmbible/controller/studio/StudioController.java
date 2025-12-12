package dev.benew.filmbible.controller.studio;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Slf4j
@Controller
@RequestMapping("/studio")
public class StudioController {

    @GetMapping(value = {"", "/"})
    public String  student() {
        return "/studio ";
    }

}
