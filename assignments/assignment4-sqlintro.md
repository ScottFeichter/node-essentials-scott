# **Assignment 4 — Introduction to Databases and SQL**

## **Assignment Instructions**

You create your homework file in the node-homework folder.  First, create a branch for this week's homework.  It should be called assignment4.  Next, start sqlcommand as you did for the lesson.  For each of the following tasks, you should get your SQL statements running in sqlcommand first, and then add them to your homework file.  It may be helpful to have two terminal sessions within VSCode, one for sqlcommand, and one to run your homework.  Change to the assignment4 directory within node-homework.  Create a file called assignment4-sql.txt within that directory.  Each line in the file should be an SQL command, as described in the task.  If the line begins with a `#`, it is a comment.  As you add SQL commands to this file, you can test them with the following command:
```bash
npx jest assignment4-test.js --bail
```
The test will stop at the first failure.

The [SQL section of w3schools](https://www.w3schools.com/sql/default.asp) is a good reference to assist you with this assignment.

### **Preparation and Practice**

Within sqlcommand, practice doing various SQL statements: SELECT, INSERT, UPDATE, DELETE, BEGIN, COMMIT, ROLLBACK.  Your practice SQL statements should include use of JOIN, GROUP BY, ORDER BY, HAVING, SUM, COUNT, etc.  Do this until you feel confident in your SQL skills.  Remember that you can reload the database as needed.  You should try subqueries as well.  Then proceed to the following tasks.

### **Task 1: Find the total price of each of the first 5 orders, as ordered by order_id.**

There are several steps.  You are going to have to use the price from the products table, and the quantity from the line_items table, so you are going to have to join these with the orders table.  You need to GROUP BY the order_id.  You are grouping line_items.  You need to select the order_id and the sum of the products price times the line_items quantity.  The columns returned should be order_id and total_price. You use aliasing to specify total_price for the sum of price times quantity.

When you have this running in sqlcommand, add the SQL statement to assignment4-sql.txt.

Run the jest test until the first test completes.

### **Task 2: Understanding Subqueries**

For each customer, find the average price of their orders.  This can be done with a subquery.  The subquery you want is the SQL statement from Task 1, but in this case, you don't use LIMIT, because you want all the orders.  Also, you want to alias the results of the subquery as total_price_subquery:
```
... (subquery) AS t ...
```

  This is to facilitate the JOIN.  You want the customer_name, so you need to join the customers table with the results of the subquery, using customer_id in the ON statement.  Then, at the end, you GROUP BY customer_id.  Note that you have two customer_id columns after the join, one being customers.customer_id and the other being t.customer_id, so you have to fully qualify your references to customer_id.  You return the following columns: the customer name, and the AVG of the total_price as average_order_price.

  Once you have this running in sqlcommand, add the statement to assignment4-sql.txt.  Run the jest test until the second test completes.

  ### **Task 3: Creating a New Order**

  Create a new order for the customer named Perez and Sons.  The customer wants 10 of the 5 least expensive products.  The employee to be associated with the order is Miranda Harris.  First, create the statement that finds the customer_id for Perez and Sons.  When that works in sqlcommand, add it to assignment4-sql.txt.  Next, create the statement that finds the employee_id for Miranda Harris.  When that works, add it to assignment4-sql.txt.  Next, create the statement that gets the product_ids for the 5 least expensive products.  Add that the the assignment file too.  Then, do a BEGIN, followed by an INSERT for the orders record with a RETURNING for the order_id, followed by an INSERT for the 5 line_items corresponding to the 5 least expensive products, followed by a COMMIT.  Once you have this sequence working in sqlcommand, add those 4 statements to the assignment file.  Then do a SELECT to find all line_items corresponding to the new order_id.  When this works, add that statement to the assignment file.

  Then run the jest test until the third test completes.

  ### **Task 4: Aggregation with Having**

  Find all employees associated with more than 5 orders.  You want the first_name, the last_name, and the count of the orders.  You need to do a JOIN on the employees and orders table, and then use GROUP BY, COUNT, and HAVING.  Get this statement working in sqlcommand, and then add it to the assignment file.

  Then run the jest test until the fourth test completes.

## **Submit Your Assignment on GitHub**  

📌 **Follow these steps to submit your work:**  

#### **1️⃣ Add, Commit, and Push Your Changes**  
- Within your node-homework folder, do a git add and a git commit for the files you have created, so that they are added to the `assignment4` branch.
- Push that branch to GitHub. 

#### **2️⃣ Create a Pull Request**  
- Log on to your GitHub account.
- Open your `node-homework` repository.
- Select your `assignment4` branch.  It should be one or several commits ahead of your main branch.
- Create a pull request.

#### **3️⃣ Submit Your GitHub Link**  
- Your browser now has the link to your pull request.  Copy that link. 
- Paste the URL into the **assignment submission form**. 
