package dev.benew.filmbible.service;

import dev.benew.filmbible.domain.dto.video.VideoDto;
import dev.benew.filmbible.mapper.video.VideoMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VideoService {

    private final VideoMapper videoMapper;

    public VideoService(VideoMapper videoMapper) {
        this.videoMapper = videoMapper;
    }

    public List<VideoDto> homeVideoList() {
        return videoMapper.homeVideoList();
    }
}
