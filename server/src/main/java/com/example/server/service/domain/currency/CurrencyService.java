package com.example.server.service.domain.currency;

import com.example.server.model.entity.Currency;

import java.util.List;

public interface CurrencyService {
    List<Currency> getAllCurrenciesOrderById();
    List<Currency> getAllCurrenciesOrderByName();
    Currency addCurrency(Currency newCurrency);
    void deleteCurrencyById(int id);
    Currency updateCurrency(Currency updatedCurrency);
}
