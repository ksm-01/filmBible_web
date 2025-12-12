package dev.benew.filmbible.mapper.video;

import dev.benew.filmbible.domain.dto.video.VideoTagDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface VideoTagMapper {

    List<String> findAllVideoIdsByTag();

    VideoTagDto findTagById(
            @Param("videoId") String videoId
    );


}
