package com.apostas.service;

import java.util.List;

record BetImportStoredPreview(List<BetImportData> validRows, Integer totalRows) {
}
