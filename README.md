
# Bidding Application

A Next.js-based application for managing bids. Users can view ongoing and expired bids, and creators can create new bids. The application features real-time updates and a responsive design.

## Features

- **User Authentication**: Secure login and role-based access control.
- **Bid Management**: View ongoing and expired bids, create new bids (for creators).
- **Real-Time Updates**: Ongoing bids refresh every second.
- **Responsive Design**: Optimized for both desktop and mobile views.

## Technologies

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js
- **Database**: MongoDB Atlas

## Setup
### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/codewithdinesh/bidding-system.git
   ```

2. **Install Dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the root directory and add the following variables:

   ```plaintext
   MONGODB_URI=your-mongodb-connection-string
   NEXT_PUBLIC_API_URL=
   ```

4. **Run the Application**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The application will be available at `http://localhost:3000`.

### Running Tests

To run tests, use the following command:

```bash
npm test
# or
yarn test
```

## API Endpoints

### Bids

- **Get All Bids**: `GET /api/bids`  
  Fetches all bids, sorted by creation date in descending order.

- **Get Bid by ID**: `GET /api/bids/:id`  
  Fetches a specific bid by ID.

- **Get Bids by User**: `GET /api/bids/user/:userId`  
  Fetches bids created by a specific user.

### Authentication

- **Login**: `POST /api/auth/login`  
  Authenticates a user and returns a token.

  **Register**: `POST /api/auth/register`
  Authenticates a user and returns a token.

## Usage

### Frontend

- **Home Page**: Displays ongoing and expired bids. Refreshes ongoing bids every second.
- **Bid Page**: Displays details of a specific bid.
- **Create Bid**: Available for users with the "creator" role to create new bids.
- **Login and Register**: Secure login and registration forms with validation.



### Backend

- **Database**: MongoDB is used for storing bids and user information.
- **Models**: Mongoose schemas define the structure of bid and user documents.
