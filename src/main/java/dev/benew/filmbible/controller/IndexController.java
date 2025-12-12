package dev.benew.filmbible.controller;

import dev.benew.filmbible.domain.dto.video.VideoDto;
import dev.benew.filmbible.service.VideoService;
import dev.benew.filmbible.service.banner.BannerService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Slf4j
@Controller
public class IndexController {

    private final BannerService bannerService;
    private final VideoService videoService;

    public IndexController(BannerService bannerService, VideoService videoService) {
        this.bannerService = bannerService;
        this.videoService = videoService;
    }

    @RequestMapping(value = {"", "/"})
    public String index(
            Model model
    ) {

        // 홈 배너
//        bannerService.homeBanner();

        // 영상강의 재생목록에서 최근등록된 영상 4개
        List<VideoDto> homeVideoList = videoService.homeVideoList();
        model.addAttribute("homeVideoList", homeVideoList);

        return "/index";
    }
}
