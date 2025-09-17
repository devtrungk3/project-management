package com.example.server.repository;

import com.example.server.model.entity.Currency;
import org.springframework.data.repository.CrudRepository;

import java.util.List;


public interface CurrencyRepository extends CrudRepository<Currency, Integer> {
    List<Currency> findByOrderByIdDesc();
    List<Currency> findByOrderByNameAsc();
}
