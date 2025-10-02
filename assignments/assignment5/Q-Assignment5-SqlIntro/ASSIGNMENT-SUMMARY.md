# Assignment 5 Complete - Introduction to Databases and SQL

## SQL Tasks Completed

### Task 1: Order Total Prices
**Query:** Find the total price of each of the first 5 orders, ordered by order_id
- **Joins:** orders → line_items → products
- **Aggregation:** SUM(price * quantity) as total_price
- **Grouping:** GROUP BY order_id
- **Ordering:** ORDER BY order_id
- **Limiting:** LIMIT 5

### Task 2: Customer Average Order Prices (Subquery)
**Query:** For each customer, find the average total price of their orders, ordered by customer name
- **Subquery:** Calculates total price per order (reuses Task 1 logic)
- **Main Query:** Joins customers with subquery results
- **Aggregation:** AVG(total_price) as average_order_price
- **Grouping:** GROUP BY customer_id, customer_name
- **Ordering:** ORDER BY customer_name

### Task 3: Creating New Order (Transaction)
**Multi-step Process:** Create order for "Perez and Sons" with 10 of each of the 5 least expensive products
- **Customer Lookup:** Find customer_id for "Perez and Sons"
- **Employee Lookup:** Find employee_id for "Miranda Harris"
- **Product Selection:** Get 5 least expensive products by price
- **Transaction Block:**
  - BEGIN transaction
  - INSERT new order with RETURNING order_id
  - INSERT 5 line_items (10 quantity each)
  - COMMIT transaction
- **Verification:** SELECT all line_items for the new order

### Task 4: Employee Order Aggregation (HAVING Clause)
**Query:** Find employees associated with more than 5 orders
- **Join:** employees → orders
- **Aggregation:** COUNT(order_id) as order_count
- **Grouping:** GROUP BY employee_id, first_name, last_name
- **Filtering:** HAVING COUNT(order_id) > 5
- **Ordering:** ORDER BY MIN(last_name)

## SQL Concepts Demonstrated

### Advanced Query Techniques:
- **JOINs** - Multiple table relationships (orders, line_items, products, customers, employees)
- **Subqueries** - Nested SELECT statements for complex data retrieval
- **Aggregation Functions** - SUM, COUNT, AVG for data analysis
- **GROUP BY** - Data grouping for aggregation operations
- **HAVING** - Filtering grouped results (vs WHERE for individual rows)
- **ORDER BY** - Result sorting with MIN() for grouped data

### Transaction Management:
- **BEGIN/COMMIT** - Transaction boundaries for data consistency
- **RETURNING** - Getting generated IDs from INSERT operations
- **Multi-step Operations** - Complex business logic in single transaction

### Data Manipulation:
- **INSERT** - Creating new records with calculated values
- **SELECT** - Complex queries with multiple joins and conditions
- **Parameterized Concepts** - Understanding of dynamic query building

### Query Optimization Techniques:
- **LIMIT/OFFSET** - Result pagination and selection
- **Aliasing** - Table and column aliases for readability
- **Qualified References** - Handling ambiguous column names in joins

## Key Learning Outcomes:
- Understanding relational database structure and relationships
- Complex JOIN operations across multiple tables
- Subquery usage for advanced data retrieval
- Transaction management for data integrity
- Aggregation and grouping for business intelligence
- Advanced SQL clauses (HAVING, RETURNING, etc.)

The assignment demonstrates comprehensive SQL skills including complex queries, transaction management, and advanced database operations essential for backend development.