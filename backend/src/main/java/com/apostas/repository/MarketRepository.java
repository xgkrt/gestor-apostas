package com.apostas.repository;

import com.apostas.model.Market;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MarketRepository extends JpaRepository<Market, Long> {
    List<Market> findByActiveOrderByNameAsc(Boolean active);
    @Query("select m.id from Market m where lower(m.name) = lower(:name)")
    Optional<Long> findIdByNameIgnoreCase(@Param("name") String name);
    boolean existsByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);
}
