# Week 12 RMOR - Server-side Rendering with EJS

## Multiple Choice Questions

### 1. What are some recommended actions when you are stuck on a problem? (Select all that apply)
**Answers:**
- ✅ Debug: Go step by step through your solution to find where you went wrong.
- ✅ Reassess: Take a step back and look at the problem from a different perspective.
- ❌ Try random solutions: Continue trying different solutions until one works.
- ✅ Research: Look up solutions or similar problems to find help.

**Explanation:** Systematic approaches like debugging, reassessing, and researching are effective problem-solving strategies. Random trial-and-error is inefficient and doesn't build understanding.

### 2. Which statement best describes the approach of breaking down a problem into smaller sub-problems, as recommended in the article?
**Answer: Divide the problem into manageable sub-problems and solve each one individually.**

**Explanation:** Breaking complex problems into smaller, manageable pieces is a fundamental problem-solving strategy that makes solutions more achievable and maintainable.

### 3. What can you do if you find yourself unable to solve even a sub-problem? (Select all that apply)
**Answers:**
- ❌ Continue working on the same approach until you solve it.
- ✅ Take a break and come back to the problem later.
- ✅ Reassess the problem, debug step-by-step, and research potential solutions.
- ❌ Avoid seeking external help and try to solve it independently.

**Explanation:** Taking breaks and using systematic approaches (reassess, debug, research) are effective strategies. Persistence without strategy or avoiding help can lead to frustration and wasted time.

### 4. What is a useful practice for isolating the cause of a bug in your code?
**Answer: Isolating the problematic code by creating a minimal, reproducible example**

**Explanation:** Creating minimal reproducible examples helps identify the exact cause of bugs by removing unnecessary complexity and focusing on the core issue.

### 5. When asking a coding question, what is the most effective way to provide context for your problem?
**Answer: Provide a clear and concise description of the problem, including the relevant code snippet and any error messages**

**Explanation:** Clear problem descriptions with relevant code and error messages give others the context needed to provide effective help.

### 6. What is a common method for updating an application deployed on Render?
**Answer: Automatically updating by pushing changes to the connected Git repository**

**Explanation:** Render supports continuous deployment from Git repositories, automatically rebuilding and deploying when changes are pushed to the connected branch.

## Written Response Questions

### EJS Templating Description
EJS (Embedded JavaScript) is a templating language that allows developers to generate HTML markup with embedded JavaScript. It enables server-side rendering by executing JavaScript code on the server before sending the final HTML to the client. EJS uses special tags like `<%= %>` for outputting values, `<% %>` for control flow, and `<%- %>` for including other templates. This approach allows dynamic content generation while maintaining the familiar HTML structure.

### Server-Side Rendering vs Client-Side Rendering
Server-side rendering (SSR) generates HTML on the server before sending it to the browser, while client-side rendering (CSR) sends JavaScript to the browser which then generates the HTML. SSR provides faster initial page loads, better SEO, and works without JavaScript enabled. CSR offers more interactive user experiences and reduces server load after initial load. SSR is ideal for content-heavy sites and SEO-critical applications, while CSR works well for highly interactive applications.

### Session Management in Express
Session management in Express involves storing user data across multiple HTTP requests. Sessions use cookies to identify users and store data either in memory, databases, or external stores like MongoDB. The express-session middleware handles session creation, storage, and retrieval. Sessions are essential for maintaining user authentication state, shopping carts, and user preferences across page visits without requiring users to re-authenticate on every request.

### Flash Messages Implementation
Flash messages provide temporary user feedback that persists across redirects. The connect-flash middleware stores messages in the session and automatically removes them after display. Messages are categorized by type (error, info, success) and can be displayed in templates using EJS loops. This pattern is essential for user experience, providing feedback for form submissions, authentication attempts, and other user actions that result in redirects.

### EJS Partials and Code Reusability
EJS partials allow developers to break templates into reusable components like headers, footers, and navigation bars. Using `<%- include('partials/header') %>`, developers can maintain consistent layouts across multiple pages while avoiding code duplication. This modular approach improves maintainability, reduces errors, and enables consistent styling and functionality across the application. Partials can also accept parameters for dynamic content.

### MongoDB Session Store Benefits
Using MongoDB as a session store provides persistence across server restarts, scalability for multiple server instances, and durability for user sessions. Unlike memory-based storage, MongoDB sessions survive application crashes and allow horizontal scaling. The connect-mongodb-session package integrates seamlessly with express-session, automatically handling session cleanup and providing configurable expiration times. This approach is essential for production applications requiring reliable session management.