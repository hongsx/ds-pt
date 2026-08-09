package com.shop.app.auth;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface RefreshTokenMapper extends BaseMapper<RefreshToken> {

    @Select("SELECT * FROM refresh_tokens WHERE token = #{token} LIMIT 1")
    RefreshToken findByToken(String token);

    @Delete("DELETE FROM refresh_tokens WHERE token = #{token}")
    int deleteByToken(String token);

    @Delete("DELETE FROM refresh_tokens WHERE user_id = #{userId}")
    int deleteByUserId(Integer userId);
}
