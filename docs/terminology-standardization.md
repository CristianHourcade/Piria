# Terminology Standardization Guide

## Overview

This document outlines the standardized terminology used throughout the Piria Digital system. Consistent terminology is crucial for clear communication, efficient data handling, and a cohesive user experience.

## Core Entities and Relationships

### Client (`Cliente`)

A **Client** represents a business entity that contracts services from Piria Digital. Each client can have multiple projects and services associated with them.

- Primary identifier: `id`
- Key attributes: `name`, `company`, `status`, `services`
- Relationship to Projects: One-to-many (one client can have many projects)

### Project (`Proyecto`)

A **Project** represents a specific engagement or work initiative for a client. Projects are the primary work units that contain tasks and are assigned to collaborators.

- Primary identifier: `id`
- Key attributes: `name`, `clientId`, `status`, `progress`, `responsible`
- Relationship to Clients: Many-to-one (many projects can belong to one client)
- Relationship to Tasks: One-to-many (one project can have many tasks)

### Service (`Servicio`)

A **Service** represents a specific type of work or expertise offered to clients. Services can be associated with both clients (as contracted services) and projects (as the service category).

- Primary identifier: `id` (for ClientService)
- Key attributes: `name`, `price`, `status`
- Relationship to Clients: Many-to-one (many services can be contracted by one client)

### Task (`Tarea`)

A **Task** represents a specific work item within a project. Tasks are assigned to collaborators and have their own lifecycle.

- Primary identifier: `id`
- Key attributes: `title`, `projectId`, `clientId`, `status`, `assignee`
- Relationship to Projects: Many-to-one (many tasks can belong to one project)

## Terminology Usage Guidelines

1. **Consistency in UI Labels**:
   - Always use the standardized terms in UI labels, buttons, and messages
   - Use the appropriate singular or plural form based on context

2. **Data References**:
   - When referring to a client's projects, use "Proyectos del cliente"
   - When referring to a project's tasks, use "Tareas del proyecto"

3. **Search and Filtering**:
   - All search functions should handle both terms appropriately
   - Use the `unifiedSearch` and `unifiedFilter` utilities for consistent behavior

4. **API Endpoints**:
   - Endpoint naming should follow the standardized terminology
   - Response data should use consistent property names

## Implementation Details

The system implements this terminology standardization through:

1. **Terminology Context**: A React context that provides consistent terms throughout the application
2. **Data Models**: Clear interface definitions that establish entity relationships
3. **Search Utilities**: Functions that handle terminology variations in search and filtering
4. **UI Components**: Components that use the terminology context for consistent labeling

## Extending the System

When adding new features or entities:

1. Update the data models to clearly define relationships to existing entities
2. Use the terminology context to ensure consistent labeling
3. Extend search utilities if needed for new entity types
4. Document any new terminology in this guide
\`\`\`

Finally, let's create a utility function to help with data conversion between different terminology contexts:
