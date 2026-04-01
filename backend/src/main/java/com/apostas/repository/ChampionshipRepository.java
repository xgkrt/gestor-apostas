package com.apostas.repository;

import com.apostas.model.Championship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChampionshipRepository extends JpaRepository<Championship, Long> {
    List<Championship> findByActiveOrderByNameAsc(Boolean active);
    List<Championship> findBySportIdAndActiveOrderByNameAsc(Long sportId, Boolean active);
    boolean existsByNameIgnoreCaseAndSportId(String name, Long sportId);
    boolean existsByNameIgnoreCaseAndSportIdAndIdNot(String name, Long sportId, Long id);
}
