#!/bin/bash

echo "🚀 Starting VibeTribe deployment..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit for VibeTribe deployment"
fi

# Check if remote is set
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 Please add your GitHub repository as remote origin:"
    echo "git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
    echo "git push -u origin main"
fi

echo "✅ Deployment files created successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Prepare for deployment'"
echo "   git push origin main"
echo ""
echo "2. Go to https://render.com and sign up with GitHub"
echo ""
echo "3. Create two new Web Services:"
echo "   - Backend: Connect your repo, set environment variables"
echo "   - Frontend: Create static site from your repo"
echo ""
echo "4. Set environment variables in Render:"
echo "   Backend:"
echo "   - MONGODB_URI: mongodb+srv://shivamgupta15347:TPPua8xf5MBFXMbP@cluster0.22qa79k.mongodb.net/vibetribe?retryWrites=true&w=majority"
echo "   - JWT_SECRET: (auto-generated)"
echo "   - NODE_ENV: production"
echo "   - PORT: 10000"
echo ""
echo "   Frontend:"
echo "   - REACT_APP_API_URL: https://vibetribe-backend.onrender.com"
echo ""
echo "🎉 Your VibeTribe app will be live at:"
echo "   Frontend: https://vibetribe-frontend.onrender.com"
echo "   Backend: https://vibetribe-backend.onrender.com"
