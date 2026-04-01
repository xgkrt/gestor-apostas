package com.apostas.repository;

import com.apostas.model.Bookmaker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookmakerRepository extends JpaRepository<Bookmaker, Long> {
    List<Bookmaker> findByActiveOrderByNameAsc(Boolean active);
    @Query("select b.id from Bookmaker b where lower(b.name) = lower(:name)")
    Optional<Long> findIdByNameIgnoreCase(@Param("name") String name);
    boolean existsByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);
}
