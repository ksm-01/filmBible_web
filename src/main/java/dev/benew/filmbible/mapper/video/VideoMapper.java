package dev.benew.filmbible.mapper.video;

import dev.benew.filmbible.domain.dto.video.VideoDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface VideoMapper {


    List<VideoDto> findAllVideo();

    List<String> findAllVideoId();

    VideoDto findByVideoId(@Param("videoId") String videoId);

    List<VideoDto> homeVideoList();

}
