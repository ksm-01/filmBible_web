package dev.benew.filmbible;

import dev.benew.filmbible.mapper.video.VideoMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class FilmbibleApplicationTests {

    @Autowired
    VideoMapper videoMapper;

    @Test
    void contextLoads() {
    }

}
