# MSA_Project by Dingyang Zuo

## Web App Link
https://scenerysharingfrontend.azurewebsites.net

## Presentation Video Link
https://drive.google.com/file/d/1hLOksxqfhOQy-6hrJcyvnH3CMdkZQqom/view?usp=drive_link

## Full-page screenshos of the two Azure SQL modules
https://drive.google.com/drive/folders/1sasfMupfEFyswoiJ8CruDty3fRGs9PqK?usp=drive_link

## Brief Introduction
The project is a web application built on .NET8 as backend and React(TypeScript) as frontend that allows users to upload, share, and manage scenic  photographs. It includes functionalities for user authentication, scenery management, and collection tracking.

## One Thing I am Very Proud Of
One of the things that I feel very proud of is the strategy for manipulating image data I developed.
Initially I set image data as byte[] in backend, set image data as Blob in frontend and transfer image data to byte[] via controller in backend. But it never works.
After encountering 8 hours' attempts, trying to transfer the image data into different format and trying to use azure blob to store image file but all with fail results, 
I successfully implemented a method. I adapted DTOs to receive image data as files from the frontend and converted them into byte[] on the backend. I made smooth transfer of image data as byte[] from the backend to the frontend, where it is converted into URLs for displaying.

## Implemented Features

### Basic Features
- **Homepage:** Displays a slideshow of scenic images using React Slick for a visually appealing presentation.
- **Sceneries Page:** Lists various scenic images with pagination, searching, and sorting functionalities.
- **About Page:** Provides detailed information about a specific scenery, including operations for Update, Delete, and Collect.
- **Upload Page:** Provides detailed information about a specific scenery, including operations for Update, Delete, and Collect.
- **User Authentication:** Includes login and registration functionalities with authentication tokens stored securely. Implemented user authentication and authorization using ASP.NET Identity and JWT tokens.
- **API Endpoints**: Created CRUD operations for managing sceneries and collections.
- **Database Integration**: Utilized Entity Framework Core with SQL Server for database operations.
- **Error Handling:** Implemented centralized error handling and logging on the backend. Created a custom error page (404) with a user-friendly message and navigation options on the frontend.

### Advanced Features
- **Dynamic Routing:** Utilizes React Router to handle dynamic routes for pages like `about/:Id`, `mycollection/:Id`, `myupload/:Id`, and `update/:Id` for specific scenery and user-related operations.
- **Dark/Light Mode:** Enhances user experience with a dual-mode switch, allowing users to switch between dark and light themes based on their preference..
- **Azure database:** Storages SqlServer database at Azure cloud.
- **State Management:** Implements Redux for managing application-wide state, ensuring efficient data flow and consistency across components.
- **User Collection Management:** Allows users to add scenic images to their personal collection and manage them accordingly.
- **User Uploads Management:** Allows users to manage and edit scenic images uploaded by themselves.
- **Responsive Design:** Ensures the application is responsive across different devices, enhancing usability and accessibility.
- **Xunit Test:** Implements Xunit for unit testing, ensuring the reliability and correctness of individual components and functions.
- **Cypress E2E Test:** Implements Cypress for end-to-end testing, validating application workflows and interactions across multiple layers.
- **Storybook:** Utilizes Storybook for component-driven development and testing, enabling isolated development and documentation of UI components.

## Technologies Used in Frontend
- React(TypeScript)
- Redux Toolkit
- React Router
- Material-UI
- Azure
- Docker
- Cypress E2E Test
- Storybook
- Axios
- React Slick

## Technologies Used in Backend
- ASP.NET Core
- Entity Framework Core
- C#
- SQL Server with Azure
- Xunit Test
- JWT (JSON Web Token)
- Azure
- Docker
