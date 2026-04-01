package com.apostas.repository;

import com.apostas.model.Tipster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TipsterRepository extends JpaRepository<Tipster, Long> {
    List<Tipster> findByActiveOrderByNameAsc(Boolean active);
    @Query("select t.id from Tipster t where lower(t.name) = lower(:name)")
    Optional<Long> findIdByNameIgnoreCase(@Param("name") String name);
    boolean existsByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);
}
