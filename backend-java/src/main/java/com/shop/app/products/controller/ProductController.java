package com.shop.app.products.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.shop.app.products.entity.Product;
import com.shop.app.products.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<?> list(@RequestParam(value = "q", required = false) String q,
                                  @RequestParam(value = "page", required = false, defaultValue = "1") int page,
                                  @RequestParam(value = "pageSize", required = false, defaultValue = "10") int pageSize) {
        Page<Product> p = productService.list(q, page, pageSize);
        Map<String, Object> resp = new HashMap<>();
        resp.put("items", p.getRecords());
        Map<String, Object> meta = new HashMap<>();
        meta.put("total", p.getTotal());
        meta.put("page", p.getCurrent());
        meta.put("pageSize", p.getSize());
        meta.put("totalPages", p.getPages());
        resp.put("meta", meta);
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable Integer id) {
        Product prod = productService.getById(id);
        if (prod == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(prod);
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody ProductCreateRequest req) {
        Product p = new Product();
        p.setTitle(req.getTitle());
        p.setDescription(req.getDescription());
        p.setPrice(req.getPrice() != null ? req.getPrice() : BigDecimal.ZERO);
        Product created = productService.create(p);
        return ResponseEntity.status(201).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @Valid @RequestBody ProductCreateRequest req) {
        Product p = productService.getById(id);
        if (p == null) return ResponseEntity.notFound().build();
        p.setTitle(req.getTitle());
        p.setDescription(req.getDescription());
        p.setPrice(req.getPrice());
        Product updated = productService.update(p);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        productService.delete(id);
        return ResponseEntity.ok().build();
    }

    public static class ProductCreateRequest {
        private String title;
        private String description;
        private BigDecimal price;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }
    }
}
