# EduVision AI - Multimodal Learning Platform

EduVision AI is an advanced educational platform that leverages cutting-edge artificial intelligence to transform how students learn. The platform offers multimodal capabilities including document analysis, visual question answering, text summarization, and personalized learning features.

## 🚀 Features

### Core AI Capabilities
- **Document Question Answering**: Upload lecture slides and ask questions about the content
- **Visual Question Answering**: Analyze diagrams, graphs, and figures with AI
- **Text Summarization**: Generate concise summaries from lengthy lectures
- **Text-to-Speech**: Convert summaries to audio for accessibility
- **Sentence Similarity**: Detect duplicate or overlapping content in study materials

### Platform Features
- **Student Profiles**: Individual accounts with personal chat history tracking
- **Admin Dashboard**: Comprehensive analytics and user activity monitoring
- **External Integrations**: Google Drive, OneDrive, and YouTube transcript APIs
- **Modern UI**: Built with Next.js, TailwindCSS, and Framer Motion

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with React 18
- **Styling**: TailwindCSS + shadcn/ui components
- **Animations**: Framer Motion
- **Language**: TypeScript

### Backend
- **Framework**: FastAPI (Python)
- **AI/ML**: Hugging Face Transformers, PyTorch
- **Database**: PostgreSQL + Redis for caching
- **Authentication**: JWT with secure password hashing

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Deployment**: Production-ready with environment configurations
- **CI/CD**: GitHub Actions ready

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- Docker and Docker Compose (optional)

### Option 1: Local Development

#### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
The frontend will be available at `http://localhost:3000`

#### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
python main.py
```
The backend API will be available at `http://localhost:8000`

### Option 2: Docker Deployment

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d
```

This will start:
- Frontend at `http://localhost:3000`
- Backend API at `http://localhost:8000`
- PostgreSQL database at `localhost:5432`
- Redis cache at `localhost:6379`

## 📁 Project Structure

```
eduvision-ai/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles with shadcn/ui theme
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Homepage component
├── backend/               # FastAPI backend
│   ├── main.py           # Main FastAPI application
│   └── requirements.txt  # Python dependencies
├── components/           # Reusable React components (to be added)
├── lib/                 # Utility functions (to be added)
├── docker-compose.yml   # Multi-service Docker setup
├── package.json        # Node.js dependencies and scripts
├── tailwind.config.js  # TailwindCSS configuration
├── tsconfig.json      # TypeScript configuration
└── README.md         # This file
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/eduvision_ai
REDIS_URL=redis://localhost:6379

# API Keys (get from respective providers)
HUGGINGFACE_API_KEY=your_key_here
GOOGLE_DRIVE_API_KEY=your_key_here
ONEDRIVE_API_KEY=your_key_here
YOUTUBE_API_KEY=your_key_here

# Security
SECRET_KEY=your_secure_secret_key
```

## 📚 API Documentation

Once the backend is running, visit:
- **Interactive API Docs**: `http://localhost:8000/docs`
- **ReDoc Documentation**: `http://localhost:8000/redoc`

### Key Endpoints

- `POST /api/document-qa` - Ask questions about uploaded documents
- `POST /api/visual-qa` - Analyze images and answer visual questions
- `POST /api/summarize` - Generate text summaries
- `POST /api/text-to-speech` - Convert text to speech
- `POST /api/similarity` - Check text similarity
- `POST /api/upload` - Upload educational documents
- `GET /api/analytics` - Get platform usage statistics

## 🎨 UI Components

The platform uses shadcn/ui components for a consistent, modern interface:
- Toast notifications
- Dialog modals
- Form inputs and validation
- Loading skeletons
- Navigation components

## 🔮 Future Enhancements

- Real AI model integration (currently using placeholders)
- Advanced user authentication and authorization
- Real-time collaboration features
- Mobile app development
- Advanced analytics and reporting
- Integration with Learning Management Systems (LMS)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@eduvision-ai.com or join our Discord community.

---

**EduVision AI** - Transforming education through artificial intelligence 🎓✨
