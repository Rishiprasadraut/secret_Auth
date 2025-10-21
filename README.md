# Secrets - Anonymous Sharing Platform


#LIVE PREVIEW:-



<img width="1351" height="943" alt="image" src="https://github.com/user-attachments/assets/39fb9682-216e-4fca-ab3a-14ea2bac1d08" />


A secure web application that allows users to share their thoughts and secrets anonymously in a safe environment.

## Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Password Security**: Bcrypt hashing for password protection
- **Anonymous Sharing**: Share secrets without revealing identity
- **Modern UI**: Responsive design with glassmorphism effects
- **Real-time Validation**: Client-side form validation and feedback
- **Session Management**: Secure cookie-based authentication

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) + bcrypt
- **Frontend**: EJS templating, Bootstrap 5, FontAwesome
- **Styling**: Custom CSS with modern glassmorphism design

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Make sure MongoDB is running on your system

4. Start the application:
   ```bash
   npm start
   ```
   Or for development:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
├── app.js              # Main application file
├── package.json        # Dependencies and scripts
├── public/
│   └── css/
│       └── style.css   # Custom styling
├── views/
│   ├── partials/
│   │   ├── header.ejs  # Common header
│   │   └── footer.ejs  # Common footer
│   ├── home.ejs        # Landing page
│   ├── login.ejs       # Login form
│   ├── register.ejs    # Registration form
│   ├── secret.ejs      # Protected dashboard
│   └── submit.ejs      # Secret submission form
└── README.md
```

## Security Features

- Password hashing with bcrypt (salt rounds: 10)
- JWT token authentication with HTTP-only cookies
- Input validation and sanitization
- Protected routes with authentication middleware
- Email format validation
- Password length requirements (6-8 characters)

## API Endpoints

- `GET /` - Home page
- `GET /register` - Registration page
- `POST /register` - User registration
- `GET /login` - Login page
- `POST /login` - User authentication
- `GET /secret` - Protected dashboard (requires auth)
- `GET /submit` - Secret submission page (requires auth)
- `POST /submit` - Submit new secret (requires auth)
- `GET /logout` - User logout

## Environment Variables

The application uses the following configuration:
- Port: 3000
- MongoDB URI: `mongodb://localhost:27017/secretDB`
- JWT Secret: `thisislittlesecretkey.` (change in production)

## Development

To run in development mode with auto-restart:
```bash
npm run dev
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
