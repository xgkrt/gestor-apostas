package com.apostas.repository;

import com.apostas.model.Sport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SportRepository extends JpaRepository<Sport, Long> {
    List<Sport> findByActiveOrderByNameAsc(Boolean active);
    @Query("select s.id from Sport s where lower(s.name) = lower(:name)")
    Optional<Long> findIdByNameIgnoreCase(@Param("name") String name);
    boolean existsByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);
}
