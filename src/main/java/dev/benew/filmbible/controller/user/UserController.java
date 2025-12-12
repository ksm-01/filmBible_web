package dev.benew.filmbible.controller.user;

import dev.benew.filmbible.domain.dto.user.UserDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Slf4j
@Controller
@RequestMapping("/user")
public class UserController {

    @GetMapping("/join")
    public String join(
    ) {
        return "/user/join";
    }

    @PostMapping("/save")
    public void save(
            UserDto userDto
    ) {

    }



}
