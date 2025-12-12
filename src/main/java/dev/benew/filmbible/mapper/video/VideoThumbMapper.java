package dev.benew.filmbible.mapper.video;

import dev.benew.filmbible.domain.dto.video.VideoThumbDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface VideoThumbMapper {

    List<String> findAllVideoIdsByThumb();

    VideoThumbDto findThumbById(
            @Param("videoId") String videoId
    );


}
