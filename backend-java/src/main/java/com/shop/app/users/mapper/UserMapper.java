package com.shop.app.users.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.shop.app.users.entity.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<User> {
}
