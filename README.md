# Study Buddy 📚

A comprehensive e-learning platform that connects students and professors, enabling seamless classroom management, PDF document analysis, and AI-powered learning assistance.

## 🌟 Features

### For Students 🎓
- **User Registration & Authentication**: Secure account creation and login system
- **Class Discovery**: Browse and explore available courses
- **Enrollment System**: Join classes using unique classroom passwords
- **PDF Management**: Upload, store, and organize study materials
- **AI-Powered PDF Analysis**: Chat with uploaded PDFs using AI assistance
- **Classroom Access**: View and download course materials
- **Profile Management**: Customize personal information and preferences

### For Professors 👨‍🏫
- **Educator Dashboard**: Comprehensive classroom management interface
- **Course Creation**: Set up new classes with descriptions, capacity limits, and access controls
- **Content Management**: Upload and organize course materials
- **Student Monitoring**: Track enrollment and student engagement
- **Secure Access**: Password-protected classrooms

### AI Integration 🤖
- **PDF Text Extraction**: Intelligent document parsing using PyPDF
- **AI Chat Assistant**: Powered by OpenAI's API for document analysis and Q&A
- **Smart Summarization**: Automatic PDF content summarization

## 🏗️ Architecture

### Backend (FastAPI)
```
backend/
├── main.py                 # Application entry point
├── requirements.txt        # Python dependencies
├── Dockerfile             # Container configuration
├── docker-compose.yml     # Multi-service orchestration
├── Controller/            # Business logic layer
├── Database/              # Database connection and configuration
├── Models/                # SQLAlchemy data models
├── Routes/                # API endpoint definitions
├── Schemas/               # Pydantic data validation schemas
└── Utils/                 # Utility functions and helpers
```

### Frontend (Next.js)
```
frontend/
├── src/
│   ├── app/               # Next.js app router pages
│   │   ├── Student_login/
│   │   ├── Student_register/
│   │   ├── Professor_login/
│   │   ├── Professor_register/
│   │   ├── classes_for_student/
│   │   ├── fetch_enrolled_classes/
│   │   ├── Professor_classrooms/
│   │   ├── create_classroom/
│   │   ├── student_profile/
│   │   ├── Professor_profile/
│   │   ├── student_pdf/
│   │   └── pdfanalyzer/
│   └── components/        # Reusable UI components
├── package.json           # Node.js dependencies
├── Dockerfile            # Container configuration
└── public/               # Static assets
```

## 🛠️ Technology Stack

### Backend Technologies
- **Framework**: FastAPI - High-performance Python web framework
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT tokens with python-jose
- **Password Security**: Bcrypt hashing
- **File Storage**: Cloudinary for image and document management
- **PDF Processing**: PyPDF for text extraction
- **AI Integration**: OpenAI API for intelligent document analysis
- **Validation**: Pydantic for data validation and serialization

### Frontend Technologies
- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS for responsive design
- **TypeScript**: Type-safe development
- **PDF Viewing**: React-PDF viewer integration
- **State Management**: React hooks and local storage
- **HTTP Client**: Native fetch API

### DevOps & Infrastructure
- **Containerization**: Docker and Docker Compose
- **Database**: PostgreSQL 15
- **Cloud Storage**: Cloudinary
- **Environment Management**: Python-dotenv

## 📊 Database Schema

### Core Models
- **Students**: User profiles, academic information, enrollment tracking
- **Professors**: Educator profiles, specializations, classroom ownership
- **Classes**: Course information, capacity, access controls
- **Enrolled_classes**: Student-course relationships
- **Classroom_Content**: Course materials and documents
- **Pdfinventory**: Student PDF document management

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js 22+ (for local frontend development)
- Python 3.12+ (for local backend development)

### Environment Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd studdy_buddy
```

2. **Backend Environment Variables**
Create a `.env` file in the backend directory:
```env
DATABASE_URL=postgresql://postgres:mohamed@localhost:5432/study_buddy
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SECRET_KEY=your_jwt_secret_key
OPENROUTER_API_KEY=your_openai_api_key
```

3. **Frontend Environment Variables**
Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

### Quick Start with Docker

1. **Start the entire application**
```bash
cd backend
docker-compose up --build
```

This will start:
- PostgreSQL database on port 5432
- FastAPI backend on port 8000
- Next.js frontend on port 3000 (if configured)

2. **Access the application**
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- Frontend: http://localhost:3000

### Local Development

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /register_student` - Student registration
- `POST /login_student` - Student authentication
- `POST /professor_registration` - Professor registration
- `POST /professor_login` - Professor authentication

### Classroom Management
- `POST /create_your_classroom` - Create new classroom (Professor)
- `GET /fetch_classes` - Get professor's classrooms
- `GET /fetch_classrooms_for_students` - Browse available classes
- `POST /enroll_in_a_course` - Enroll in a classroom (Student)
- `GET /fetch_your_enrolled_classes` - Get enrolled classes

### Content Management
- `POST /upload_content_as_professor` - Upload course materials
- `GET /view_classroom_content_as_professor/{class_id}` - View content
- `GET /fetch_content_for_enrolled_classes/{class_id}` - Access materials (Student)

### PDF Management & AI
- `POST /upload_student_pdf` - Upload PDF documents
- `GET /fetch_your_pdfs` - Get uploaded PDFs
- `GET /view_pdf_by_id/{pdf_id}` - View specific PDF
- `POST /view_pdf_by_id/{pdf_id}/chat` - AI chat with PDF content

### Profile Management
- `GET /view_profile` - Get user profile
- `PUT /edit_your_profile` - Update profile information

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt encryption for user passwords
- **CORS Configuration**: Controlled cross-origin resource sharing
- **Input Validation**: Pydantic schemas for data validation
- **File Upload Security**: Cloudinary integration with validation
- **Database Security**: SQL injection prevention with SQLAlchemy ORM

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern Interface**: Gradient backgrounds and glassmorphism effects
- **Interactive Components**: Smooth animations and transitions
- **Accessibility**: Proper semantic HTML and ARIA labels
- **Dark Mode Support**: Elegant color schemes
- **Loading States**: User-friendly loading indicators
- **Error Handling**: Comprehensive error messages and validation

## 🤖 AI Capabilities

### PDF Analysis
- **Text Extraction**: Intelligent parsing of PDF documents
- **Content Understanding**: AI-powered document comprehension
- **Interactive Chat**: Natural language queries about document content
- **Summarization**: Automatic content summarization
- **Context Awareness**: Maintains conversation context for follow-up questions

### Integration Details
- **OpenAI API**: Uses advanced language models for text analysis
- **Document Processing**: Multi-page PDF support with page-specific content
- **Response Generation**: Contextual and relevant answers to user queries

## 🔧 Configuration

### Docker Configuration
The application uses Docker Compose for orchestration:
- **Database**: PostgreSQL with persistent data volumes
- **Backend**: FastAPI with auto-reload for development
- **Health Checks**: Database connectivity verification
- **Environment Variables**: Secure configuration management

### Database Configuration
- **Connection Pooling**: Optimized database connections
- **Migration Support**: SQLAlchemy table creation
- **Relationship Management**: Proper foreign key constraints
- **Cascade Operations**: Automated cleanup of related records

## 📈 Performance Features

- **Database Optimization**: Indexed primary keys and foreign keys
- **File Storage**: Cloudinary CDN for fast asset delivery
- **Caching**: Browser caching for static assets
- **Lazy Loading**: On-demand content loading
- **API Efficiency**: RESTful design with minimal data transfer

## 🧪 Testing

The project includes test files for validation:
- `test_upload.py` - File upload functionality testing
- Comprehensive API endpoint testing
- Authentication flow validation

## 🚀 Deployment

### Production Considerations
- **Environment Variables**: Secure configuration management
- **Database**: Production PostgreSQL setup
- **File Storage**: Cloudinary production account
- **SSL/TLS**: HTTPS configuration for security
- **Monitoring**: Application and database monitoring
- **Backup**: Regular database backups

### Deployment Options
- **Docker Containers**: Containerized deployment
- **Cloud Platforms**: AWS, Google Cloud, Azure compatibility
- **Database Hosting**: Managed PostgreSQL services
- **CDN**: Cloudinary for global content delivery

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **l3arf** - mohamed chebbi 

## 🙏 Acknowledgments

- OpenAI for AI integration capabilities
- Cloudinary for file storage and management
- FastAPI community for excellent documentation
- Next.js team for the powerful React framework
- PostgreSQL for robust database solutions



**Study Buddy** - Empowering education through technology 🎓✨
