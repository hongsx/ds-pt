package com.shop.app.products.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.shop.app.products.entity.Product;
import com.shop.app.products.mapper.ProductMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductMapper productMapper;

    public Page<Product> list(String q, int page, int pageSize) {
        Page<Product> p = new Page<>(page, pageSize);
        QueryWrapper<Product> qw = new QueryWrapper<>();
        if (q != null && !q.trim().isEmpty()) {
            qw.and(wrapper -> wrapper.like("title", q).or().like("description", q));
        }
        return productMapper.selectPage(p, qw);
    }

    public Product getById(Integer id) {
        return productMapper.selectById(id);
    }

    public int create(Product product) {
        return productMapper.insert(product);
    }

    public int update(Product product) {
        return productMapper.updateById(product);
    }

    public int delete(Integer id) {
        return productMapper.deleteById(id);
    }
}
