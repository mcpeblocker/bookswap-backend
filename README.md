# BookSwap
## Backend

This repository contains the source code used to run the backend server of the project developed by team SSS (Swap Script Squad) for CS350 (Introduction to Software Engineering) course on 2024 Spring semester in KAIST.

The server is launched via nodejs runtime. The code is written in TypeScript language.
The libraries to be used include:
 - ExpressJS
 - mongoose
  
The database to be used is MongoDB

## Documentation
You can find documentation for the API in this repository - [API Documentation folder](/docs)

## 1. Project Introduction
### 1.1 Object
BookSwap is a collaborative book-sharing platform designed for KAIST students, enhancing their access to a diverse range of books beyond the library’s collection. It features a search function to locate specific titles, a book exchange system, and a messaging tool for easy communication on transaction details, promoting reading and cultural enrichment among students.

### 1.2 Teammate
- Alisher Ortiqov: Backend Development
- Haerin Seo: Frontend development
- Changsu Ham: UI/UX design, prototype
- Sejun Jung: Project management

### 1.3 Development Environment
- Backend: Node JS
- Frontend: React Native
- Design: Figma
- Project Management: Jira


## 2. System Overview
### 2.1 Setting Up Your Profile and Uploading Your First Book
- Log In: Access the login page and enter your credentials to log in.
- Initialize Your Profile: Once logged in, you'll be directed to initialize your profile. Here, choose a nickname for yourself and select your preferred genres.
- Upload Your Book: Navigate to the bookshelf page and find the option to upload your book. Fill in the necessary details about the book you wish to share.
- Check Your Bookshelf: After uploading, you'll be redirected to the bookshelf page where you can see your uploaded book among your listings.

### 2.2 Managing Your Bookshelf
- Access Your Bookshelf: Go to your bookshelf page where your listed books are displayed.
- Edit Your Book: Choose a book you want to modify and go to its edit page (the same as the upload page). Here, adjust the visibility options as desired.
- Confirm Changes: Save your changes, and you will be taken back to the bookshelf page. Ensure that the modifications are reflected correctly.

### 2.3 Searching and Requesting a Book Exchange
- Search for a Book: From the home page, use the search feature to find a specific book you're interested in.
- Request an Exchange: On the search result page, which displays a list of books matching your query, choose a book you want to exchange and submit a request for exchange.

### 2.4 Managing Exchange Requests and Communication
- View Notifications: Check your notifications for any exchange requests from other users.
- Accept the Request: Go to the request page through the notification link and accept the exchange request. Indicate that you want the specific book from the requester’s bookshelf.
