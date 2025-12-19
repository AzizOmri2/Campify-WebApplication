# Campify : Web Application

**Campify** is a modern e-commerce platform for camping enthusiasts, offering a seamless experience to discover, browse, and purchase camping gear. It features an intuitive user interface, a dynamic admin dashboard for product and order management, and secure online payment integration.

The goal of **Campify** is to provide a fast, scalable, and user-friendly platform that enhances the shopping experience for camping enthusiasts while enabling store owners to efficiently manage products and orders. Key focus areas include a smooth and intuitive e-commerce experience, dynamic admin dashboard, secure online payment integration, and optimized data structure for scalability and performance.

## Features

**User Features**
- Browse camping products by category, price, or popularity  
- Search and filter products for a personalized experience  
- Add items to the cart and manage orders  
- Secure checkout using Stripe payment processing  
- Order history and status tracking  

**Admin Features**
- Dynamic dashboard to manage products, categories, and orders  
- Real-time monitoring of orders and customer activity  
- User management and moderation  
- Analytics for sales and product performance  

**Performance & UX**
- Fully responsive design for mobile and desktop  
- Optimized MongoDB database for fast data retrieval  
- Clean, modern, and intuitive user interface  

**Security**
- JWT-based authentication for secure user sessions  
- Secure Stripe payment processing  
- Input validation and API request protection  

## Tech Stack

**Frontend:** React.js, JavaScript (ES6+), HTML5 & CSS3  
**Backend:** Django, Django REST Framework  
**Database:** MongoDB (NoSQL)  
**Payment:** Stripe API  

## Prerequisites

Before running the project, ensure you have the following installed:  

- Python >= 3.10  
- Django >= 4.x  
- Node.js >= 18.x  
- npm >= 9.x  
- MongoDB (local or cloud)  
- Stripe account (for API keys)  
- Git  

## Run Locally

**Backend Setup (`/backend`)**  
1. Navigate to the backend directory:  
```bash
cd backend
```

2. Create a virtual environment and activate it:  
```bash
python -m venv venv
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows
```

3. Install dependencies

4. Configure environment variables in .env

5. Apply migrations and start the server :
```bash
python manage.py migrate
python manage.py runserver
```

**Frontend Setup (`/frontend`)**  
***NB : Same work for Admin Setup***

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend:
```bash
npm run dev
```

## Contact

Maintainer: [Mohamed Aziz Omri](mailto:azizomriomri@gmail.com)  
Project Link: [https://github.com/AzizOmri2/Campify-WebApplication.git](https://github.com/AzizOmri2/Campify-WebApplication.git)  
Portfolio: [https://mohamedazizomri.netlify.app/](https://mohamedazizomri.netlify.app/)