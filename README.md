
# ChatApp

ChatApp is a real-time chat application built with Node.js, Express, and Socket.IO, allowing users to create accounts, join chat rooms, and communicate with others in an interactive environment.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Registration & Login**: Users can sign up, log in, and manage their sessions securely.
- **Real-Time Communication**: Chat functionality is powered by WebSockets (Socket.IO) for instant messaging.
- **Multiple Chat Rooms**: Users can create and join various chat rooms.
- **Message Persistence**: Messages are stored in MongoDB and reloaded when users rejoin rooms.
- **Active Users and Rooms**: Displays active users and rooms for easier navigation.
- **Announcements**: Displays join and leave announcements for improved user interaction.

## Tech Stack

- **Backend**: Node.js, Express, Socket.IO
- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Database**: MongoDB
- **Authentication**: bcrypt, express-session

## Setup and Installation

### Prerequisites
I packaged my running environment so you can directly use it.
- For Windows:
```bash
.\venv\Scripts\activate
```
- For macOS/Linux:
```bash
source venv/bin/activate
```

### Installation

1. **Clone the repository**:
   ```bash
   unzip the zip file I emailed
   cd chat-App
   ```
   use .\venv\Scripts\activate or source venv/bin/activate to load running environment.
2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up MongoDB**:
   - Ensure MongoDB is running on `mongodb://localhost:27017/chatAppDB` or update the URI in your code if using a different database setup.

4. **Run the server**:
   ```bash
   npm start
   ```

5. **Access the app**:
   Open a browser and go to `http://localhost:5000`.

6. **Run the AQA test**:
   ```bash
   npm test
   ```
   Be sure the server is running.

---

### You may go through my TestPlan.md and cucumber_report.json file

---

## Usage

- **Sign Up/Login**: Register a new account or log in with an existing one.
- **Chat Rooms**: Create new rooms, join existing ones, and start messaging.
- **Send Messages**: Use the input box to send messages within a room.
- **Switch Rooms**: Join different rooms from the "Rooms" sidebar.
- **Logout**: Log out from the current session using the logout button.

## Project Structure

```
CHAT-APP/
├── features/                    # Cucumber feature files and step definitions for testing
│   ├── step_definitions/        # Step definitions for Cucumber tests
│   │   ├── login_steps.js
│   │   ├── message_steps.js
│   │   ├── multi_user_steps.js
│   │   └── unique_room_steps.js
│   ├── support/                 # Cucumber support files
│   │   ├── hook.js
│   │   └── world.js
│   ├── login.feature            
│   ├── message.feature          
│   ├── multi_user.feature       
│   └── unique_room.feature      
├── public/                      # Static files served by the server
│   ├── app.js                   
│   ├── index.html               
│   └── style.css                
├── .gitignore                   # Git ignore file
├── cucumber_report.html         
├── cucumber_report.json         
├── generateReport.js            # Script to generate Cucumber report
├── LICENSE                      
├── package-lock.json            # Lock file for npm dependencies
├── package.json                 # Project dependencies and scripts
├── Questions&Answers.md         # Questions I had during development  
├── TestPlan.md                                   
├── README.md                    
└── server.js                    # Main server application file

```

## API Endpoints

| Endpoint       | Method | Description                  |
|----------------|--------|------------------------------|
| `/signup`      | POST   | Register a new user         |
| `/login`       | POST   | Log in with an existing user|
| `/logout`      | POST   | Log out of the application  |

**Socket.IO Events**:
- **`sendMessage`**: Sends a message to the current room.
- **`createRoom`**: Creates a new chat room.
- **`updateRooms`**: Switches the user to a different room.
- **`createUser`**: Adds a new user to the list of active users.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/YourFeature`.
3. Commit your changes: `git commit -m 'Add YourFeature'`.
4. Push to the branch: `git push origin feature/YourFeature`.
5. Open a pull request.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
