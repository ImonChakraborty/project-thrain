# Thrain: The Hidden Resource Access Info Network

A secure application for transferring code between computers using Vercel Postgres. Thrain allows you to securely upload code files from one computer and download them on another, with automatic cleanup to manage storage.

## Features

- Secure authentication system
- Drag and drop file uploads
- Secure file downloads
- Individual and bulk file deletion
- Dark theme interface
- Built with TypeScript and Express
- JWT-based authentication
- Vercel Postgres storage

## Setup

1. Clone the repository:
```bash
git clone https://github.com/ImonChakraborty/project-thrain.git
cd thrain
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```env
POSTGRES_URL=your_vercel_postgres_url
JWT_SECRET=your_jwt_secret
```

4. Deploy to Vercel:
```bash
vercel deploy
```

## Development

Run the development server:
```bash
npm run dev
```

Build the project:
```bash
npm run build
```

## Security Features

- JWT-based authentication
- Secure file storage
- User-specific file access
- Password hashing with bcrypt
- Automatic token expiration

## Environment Variables

- `POSTGRES_URL`: Vercel Postgres connection URL
- `JWT_SECRET`: Secret key for JWT token generation
- `PORT`: (Optional) Port for local development (default: 3000)

## Deployment

1. Push your changes:
```bash
git push
```

2. Deploy to Vercel:
```bash
vercel deploy --prod
```

3. Set up environment variables in Vercel dashboard:
   - Add `POSTGRES_URL`
   - Add `JWT_SECRET`

## Technology Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express, TypeScript
- Database: Vercel Neon Postgres
- Authentication: JWT
- Deployment: Vercel

## License

This project is licensed under the ----- License.