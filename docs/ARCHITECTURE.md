# System Architecture

## Overview
Modular Monolith architecture.

## Layers
1. **Controller Layer:** Handles HTTP requests, input validation, and delegates to Service layer.
2. **Service Layer:** Contains core business logic, transactional boundaries.
3. **Repository Layer:** Data access using Spring Data JPA.\n