package dev.benew.filmbible.controller.portfolio;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Slf4j
@Controller
@RequestMapping("/Portfolio ")
public class PortfolioController {

    @GetMapping(value = {"", "/" })
    public String portfolio() {
        return "/Portfolio ";
    }
}
