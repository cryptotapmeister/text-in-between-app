# Text-in-Between Image Editor

A powerful Next.js web application for creating stunning images with customizable text overlays. Features drag-and-drop text positioning, Google Fonts integration (including CJK support), neon glow effects, and multi-format export capabilities.

## 🚀 Features

- **🔐 Supabase Authentication** - Secure email signup/login
- **🎨 Visual Text Editor** - Drag-and-drop text positioning on canvas
- **🔤 Rich Typography** - Google Fonts API integration with English and CJK fonts
- **✨ Text Effects** - Bold/italic toggles (disabled for CJK fonts) and customizable neon glow
- **🖼️ Background Support** - Upload and use custom background images
- **📤 Multi-format Export** - Download as PNG, JPEG, or WEBP
- **📱 Responsive Design** - Works on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Drag & Drop**: react-dnd with HTML5 backend
- **Authentication**: Supabase Auth
- **Image Processing**: HTML Canvas API (client-side)
- **Icons**: Lucide React
- **Fonts**: Google Fonts API

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and project

## ⚙️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd text-in-between-app
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Settings** > **API** and copy your project URL and anon key
3. Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_KEY=your_supabase_anon_key
```

### 3. Database Setup

Run this SQL in your Supabase SQL Editor to create the profiles table:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
```

### 4. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Usage Guide

### Getting Started

1. **Sign Up/Sign In** - Create an account or sign in with existing credentials
2. **Add Text** - Click "Add Text" to create a new text element
3. **Customize** - Use the properties panel to adjust font, size, color, and effects
4. **Position** - Drag text elements around the canvas to position them
5. **Background** - Upload a background image using "Upload Background"
6. **Export** - Download your creation in PNG, JPEG, or WEBP format

### Text Editing Features

- **Double-click** any text element to edit its content
- **Font Selection** - Choose from English and CJK Google Fonts
- **Styling** - Adjust font size, color, bold, and italic (CJK fonts exclude bold/italic)
- **Glow Effects** - Add neon glow with adjustable intensity
- **Layer Management** - View and manage all text elements in the sidebar

### Canvas Features

- **Drag & Drop** - Intuitive text positioning
- **Background Images** - Support for various image formats
- **Responsive Canvas** - 800x600px default size with overflow handling
- **Real-time Preview** - See changes instantly

## 🔧 Technical Implementation

### Architecture

```
app/
├── components/
│   ├── auth/
│   │   └── AuthModal.js          # Authentication modal
│   └── editor/
│       └── ImageEditor.js        # Main editor component
├── context/
│   └── AuthContext.js            # Authentication state management
├── lib/
│   └── supabase/
│       └── client.js             # Supabase client and auth functions
├── layout.js                     # Root layout with AuthProvider
└── page.js                       # Main page with conditional rendering
```

### Key Components

- **ImageEditor**: Main canvas and text manipulation
- **DraggableText**: Individual text elements with drag functionality
- **Canvas**: Drop zone for text positioning
- **TextPropertiesPanel**: Text styling controls
- **AuthModal**: Authentication forms

### Google Fonts Integration

The app automatically loads Google Fonts and categorizes them:

- **English Fonts**: Inter, Roboto, Open Sans, Lato, etc.
- **CJK Fonts**: Noto Sans CJK (SC/TC/JP/KR), Source Han Sans/Serif

Bold and italic toggles are automatically disabled for CJK fonts to ensure proper rendering.

### Export Functionality

Uses HTML5 Canvas API to:
1. Create an off-screen canvas
2. Draw background image (if uploaded)
3. Render text elements with all styling
4. Apply glow effects using canvas shadows
5. Export as blob and trigger download

## 🔒 Security Features

- **Row Level Security** - Supabase RLS policies protect user data
- **Client-side Processing** - No server-side image storage
- **Secure Authentication** - Supabase Auth handles security
- **Input Validation** - Form validation and error handling

## 🎨 Customization

### Adding New Fonts

Edit the `GOOGLE_FONTS` configuration in `ImageEditor.js`:

```javascript
const GOOGLE_FONTS = {
  english: ['YourFont', ...],
  cjk: ['YourCJKFont', ...]
};
```

### Styling

The app uses Tailwind CSS. Customize colors and styles in:
- `tailwind.config.js` - Theme configuration
- `globals.css` - Global styles
- Component files - Component-specific styles

### Canvas Settings

Modify canvas dimensions in `ImageEditor.js`:

```javascript
const [canvasSize, setCanvasSize] = useState({ 
  width: 1200, 
  height: 800 
});
```

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

```bash
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_KEY=your_production_supabase_anon_key
```

## 🐛 Troubleshooting

### Common Issues

1. **Fonts not loading**: Check Google Fonts API and internet connection
2. **Auth errors**: Verify Supabase credentials and project settings
3. **Export issues**: Ensure canvas content is fully loaded before export
4. **Drag issues**: Check if react-dnd backend is properly configured

### Debug Mode

Add console logs in development:

```javascript
// In ImageEditor.js
console.log('Text elements:', textElements);
console.log('Selected text:', selectedText);
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check existing issues for solutions
- Review the troubleshooting section

---

Built with ❤️ using Next.js, Supabase, and modern web technologies.
