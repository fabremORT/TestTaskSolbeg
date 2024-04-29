# Project Name Setup Guide

This guide will help you set up the development environment for this project.

## Prerequisites

Before you begin, ensure you have the following installed:

- Visual Studio (preferably the latest version)
- Node.js
- npm (Node Package Manager)

## Setup Instructions

Follow these steps to set up the development environment:

### 1. Create a New Connection to an MDL File

Create a new connection to the MDL file that contains your project's database schema. You can do this in Visual Studio by following these steps:

- In Visual Studio, open the "View" menu and select "SQL Server Object Explorer".
- Right-click on "Data Connections" and select "Add Connection".
- Enter the necessary connection details to connect to your MDL file.

### 2. Set the Connection String in the appsettings.json

Update the connection string in the `appsettings.json` file of your ASP.NET Core project to point to the database created in the previous step.

`json
{
  "ConnectionStrings": {
    "TaskTestDb": "Your_Connection_String_Here"
  }
}`

### 3. Set the React Server Project as the Startup Project
Set the ASP.NET Core React Server project as the startup project in Visual Studio. You can do this by right-clicking on the project in Solution Explorer and selecting "Set as Startup Project".

### 4. Open the Package Manager Console in Visual Studio
Open the Package Manager Console in Visual Studio by going to the "Tools" menu and selecting "NuGet Package Manager" > "Package Manager Console".

### 5. Run the Command Update-Database
In the Package Manager Console, run the Update-Database command to apply any pending migrations and update the database schema.

### 6. Set the React Server and React Client as the Startup Projects
Set both the React Server and React Client projects as startup projects in Visual Studio. You can do this by right-clicking on the solution in Solution Explorer, selecting "Set Startup Projects", and then selecting "Multiple startup projects". Set both projects to "Start".

### 7. Run the Project
Press F5 or click the "Start" button in Visual Studio to run the project. This will launch both the React Server and React Client applications in your default web browser