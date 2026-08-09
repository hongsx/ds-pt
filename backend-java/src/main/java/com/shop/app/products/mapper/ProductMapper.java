package com.shop.app.products.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.shop.app.products.entity.Product;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ProductMapper extends BaseMapper<Product> {
}
