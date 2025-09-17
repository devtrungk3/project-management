package com.example.server.service.domain.currency;

import com.example.server.exception.IdNotFoundException;
import com.example.server.model.entity.Currency;
import com.example.server.repository.CurrencyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CurrencyServiceImpl implements CurrencyService{
    private final CurrencyRepository currencyRepository;
    @Override
    public List<Currency> getAllCurrenciesOrderById() {
        return currencyRepository.findByOrderByIdDesc();
    }

    @Override
    public List<Currency> getAllCurrenciesOrderByName() {
        return currencyRepository.findByOrderByNameAsc();
    }

    @Override
    public Currency addCurrency(Currency newCurrency) {
        newCurrency.setId(0);
        return currencyRepository.save(newCurrency);
    }

    @Override
    public void deleteCurrencyById(int deletedCurrencyId) {
        if (currencyRepository.existsById(deletedCurrencyId)) {
            currencyRepository.deleteById(deletedCurrencyId);
        } else {
            throw new IdNotFoundException("CurrencyId " + deletedCurrencyId + " not found");
        }

    }

    @Override
    public Currency updateCurrency(Currency updatedCurrency) {
        if (currencyRepository.existsById(updatedCurrency.getId())) {
            return currencyRepository.save(updatedCurrency);
        } else {
            throw new IdNotFoundException("CurrencyId " + updatedCurrency.getId() + " not found");
        }
    }
}
