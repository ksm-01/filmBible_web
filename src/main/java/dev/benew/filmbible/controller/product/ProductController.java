package dev.benew.filmbible.controller.product;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Slf4j
@Controller
@RequestMapping("/product")
public class ProductController {

    @GetMapping(value = {"", "/"})
    public String product() {
        return "/product";
    }
}
