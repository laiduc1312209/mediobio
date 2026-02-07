# Medical Bio Web App - Server

Backend API for the Medical Bio web application.

## Tech Stack

- **Node.js** + **Express** - REST API server
- **TypeScript** - Type-safe development
- **PostgreSQL** - Relational database
- **JWT** - Authentication
- **AES-256-GCM** - Data encryption
- **Cloudinary** - Image storage
- **Bcrypt** - Password hashing

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update with your values:

```bash
cp .env.example .env
```

### 3. Setup PostgreSQL Database

Create a PostgreSQL database and run the schema:

```bash
psql -U your_username -d your_database -f schema.sql
```

Or use a hosted service like Railway, Supabase, or AWS RDS.

### 4. Update .env with Database URL

```env
DATABASE_URL=postgresql://username:password@localhost:5432/medibio
```

### 5. Run Development Server

```bash
npm run dev
```

Server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout (protected)

### Medical Profile
- `POST /api/profile` - Create profile (protected)
- `GET /api/profile` - Get own profile (protected)
- `PUT /api/profile` - Update profile (protected)
- `DELETE /api/profile` - Delete profile (protected)
- `POST /api/profile/avatar` - Upload avatar (protected)

### Public Bio
- `GET /api/bio/:username` - Get public bio page
- `POST /api/bio/:username/verify-pin` - Verify PIN for protected bio

### Emergency Contacts
- `GET /api/contacts` - Get all contacts (protected)
- `POST /api/contacts` - Create contact (protected)
- `PUT /api/contacts/:contactId` - Update contact (protected)
- `DELETE /api/contacts/:contactId` - Delete contact (protected)

## Security Features

- **JWT Authentication** - Secure token-based auth
- **AES-256-GCM Encryption** - Medical data encrypted at rest
- **Bcrypt Password Hashing** - Secure password storage
- **Rate Limiting** - Prevent brute force attacks
- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing control
- **Access Logging** - Track bio page access

## Development

```bash
npm run dev   # Development with hot reload
npm run build # Build TypeScript to JavaScript
npm start     # Run production build
```

## Deployment

Recommended platforms:
- **Railway** (easiest)
- **Render**
- **AWS EC2**
- **Heroku**

Make sure to:
1. Set all environment variables
2. Update `FRONTEND_URL` for CORS
3. Enable SSL for production
4. Use managed PostgreSQL service

## License

MIT
