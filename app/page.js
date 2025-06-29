'use client';

import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { signOut } from '@/lib/supabase/client';
import AuthModal from './components/auth/AuthModal';
import ImageEditor from './components/editor/ImageEditor';
import { User, LogOut, Edit, Type, Download } from 'lucide-react';

export default function Home() {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Check if Supabase is configured
  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && 
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Configuration Required</h2>
          <p className="text-gray-600 mb-4">
            Supabase environment variables are not properly configured. Please check your deployment settings.
          </p>
                     <div className="text-sm text-gray-500">
             Missing: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Edit className="text-blue-500" size={32} />
              <h1 className="text-2xl font-bold text-gray-900">
                Text-in-Between Editor
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <User size={20} />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        {user ? (
          <ImageEditor />
        ) : (
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="bg-white rounded-lg shadow-lg p-12">
              <Edit className="mx-auto text-blue-500 mb-6" size={64} />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to Text-in-Between Editor
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Create stunning images with customizable text overlays. Drag and drop text elements, 
                apply beautiful effects, and export in multiple formats.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Edit className="text-blue-500" size={24} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Drag & Drop</h3>
                  <p className="text-gray-600">Easily position text elements with intuitive drag and drop functionality</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Type className="text-green-500" size={24} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Custom Fonts</h3>
                  <p className="text-gray-600">Choose from Google Fonts including CJK and English typefaces</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Download className="text-purple-500" size={24} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Export Ready</h3>
                  <p className="text-gray-600">Download your creations as PNG, JPEG, or WEBP files</p>
                </div>
              </div>

              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-blue-500 text-white px-8 py-3 rounded-md hover:bg-blue-600 transition-colors text-lg font-semibold"
              >
                Get Started - Sign In
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
}
