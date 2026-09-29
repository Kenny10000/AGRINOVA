import React, { useState } from 'react';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Auth Modal State: 'none' | 'login' | 'signup' | 'otp'
  const [authMode, setAuthMode] = useState('none');
  
  // Form States
  const [role, setRole] = useState('farmer'); // 'farmer' | 'buyer'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState(''); // Unique username field replacing gender
  const [otpCode, setOtpCode] = useState('');
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle Sign Up Submission (Triggers Backend OTP Email)
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, username, email, password, phone, role })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');

      setSuccessMessage('OTP sent to your email! Please check your inbox.');
      setAuthMode('otp'); // Switch view to OTP modal screen
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmitted(false);
    }
  };

  // Handle OTP Code Verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpCode })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Verification failed');

      alert(`Account verified successfully! Welcome ${data.user.fullName} (@${data.user.username})!`);
      setAuthMode('none');
      setSuccessMessage('');
      setOtpCode('');
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmitted(false);
    }
  };

  // Handle Standard Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');

      alert(`Successfully logged in as ${data.user.fullName}! Redirecting to dashboard...`);
      setAuthMode('none');
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmitted(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50/20 font-sans text-slate-900 selection:bg-emerald-500 selection:text-white flex flex-col relative">
      
      {/* Top Notification Banner */}
      <div className="bg-emerald-950 text-emerald-100 text-xs sm:text-sm font-medium py-2.5 px-4 text-center tracking-wide flex items-center justify-center gap-2 shadow-sm">
        <span className="bg-emerald-800 text-emerald-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-emerald-700">Jim Leech MVP</span>
        <span>Empowering African Agriculture through Digital Infrastructure & Direct Market Access</span>
      </div>

      {/* 1. Navbar */}
      <nav className="bg-white/95 backdrop-blur-xl shadow-xs sticky top-0 z-40 border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            {/* Logo */}
            <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center space-x-3 cursor-pointer group">
              <div className="w-11 h-11 bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white flex items-center justify-center rounded-2xl font-bold text-xl shadow-lg shadow-emerald-600/20 group-hover:scale-105 transition duration-300">
                🌱
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-slate-900">AGRINOVA</span>
                <span className="text-[10px] block text-emerald-600 font-extrabold uppercase tracking-widest">TechSolution</span>
              </div>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
              <a href="#pitch" className="hover:text-emerald-600 transition">Pitch Deck</a>
              <a href="#problem" className="hover:text-emerald-600 transition">The Mission</a>
              <a href="#features" className="hover:text-emerald-600 transition">Ecosystem</a>
              <a href="#impact" className="hover:text-emerald-600 transition">Impact</a>
              <a href="#contact" className="hover:text-emerald-600 transition">Contact</a>
            </div>

            {/* Action Buttons (Desktop) */}
            <div className="hidden md:flex items-center gap-3">
              <button 
                onClick={() => setAuthMode('login')}
                className="text-slate-700 hover:text-emerald-600 font-bold px-4 py-2.5 text-sm transition"
              >
                Sign In
              </button>
              <button 
                onClick={() => setAuthMode('signup')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/25 transition duration-300 transform hover:-translate-y-0.5"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition focus:outline-none"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-emerald-100 px-6 pt-4 pb-6 space-y-4 shadow-xl animate-fadeIn">
            <div className="flex flex-col space-y-3 font-semibold text-slate-700 text-base">
              <a href="#pitch" onClick={() => setMobileMenuOpen(false)} className="hover:text-emerald-600 py-1 border-b border-emerald-50">Pitch Deck</a>
              <a href="#problem" onClick={() => setMobileMenuOpen(false)} className="hover:text-emerald-600 py-1 border-b border-emerald-50">The Mission</a>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="hover:text-emerald-600 py-1 border-b border-emerald-50">Ecosystem</a>
              <a href="#impact" onClick={() => setMobileMenuOpen(false)} className="hover:text-emerald-600 py-1 border-b border-emerald-50">Impact</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-emerald-600 py-1">Contact</a>
            </div>

            <div className="pt-4 border-t border-emerald-100 flex flex-col gap-3">
              <button 
                onClick={() => { setMobileMenuOpen(false); setAuthMode('login'); }}
                className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold py-3 rounded-xl transition text-center"
              >
                Sign In
              </button>
              <button 
                onClick={() => { setMobileMenuOpen(false); setAuthMode('signup'); }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-md transition text-center"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Auth & OTP Modal Overlay */}
      {authMode !== 'none' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-emerald-100 relative my-8">
            
            {/* Close Button */}
            <button 
              onClick={() => setAuthMode('none')}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 mx-auto rounded-2xl flex items-center justify-center text-2xl font-bold mb-3 shadow-xs">
                🌱
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                {authMode === 'login' ? 'Welcome Back to Agrinova' : authMode === 'signup' ? 'Create Your Account' : 'Verify Email OTP 🔐'}
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                {authMode === 'login' ? 'Access your agricultural dashboard & weather alerts' : authMode === 'signup' ? 'Join the digital infrastructure transforming African farming' : `Enter the 6-digit verification code sent to ${email}`}
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl font-medium">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs p-3 rounded-xl font-medium">
                {successMessage}
              </div>
            )}

            {/* LOGIN FORM */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-sm outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
                  <input 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-sm outline-none transition"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitted}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-600/30 transition duration-300 text-sm flex items-center justify-center gap-2 mt-2"
                >
                  {isSubmitted ? 'Signing In...' : 'Sign In to Dashboard'}
                </button>
              </form>
            )}

            {/* SIGN UP FORM */}
            {authMode === 'signup' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Select Account Role</label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setRole('farmer')}
                      className={`py-2 rounded-lg transition ${role === 'farmer' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      🌾 Farmer / Cooperative
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('buyer')}
                      className={`py-2 rounded-lg transition ${role === 'buyer' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      🛒 Commercial Buyer
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name / Cooperative Name</label>
                  <input 
                    type="text" 
                    required 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rapheal Adeyemi" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-sm outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Username</label>
                  <input 
                    type="text" 
                    required 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. raphael_agrinova" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-sm outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    required 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 906 000 0000" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-sm outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-sm outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
                  <input 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-sm outline-none transition"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitted}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-600/30 transition duration-300 text-sm flex items-center justify-center gap-2 mt-2"
                >
                  {isSubmitted ? 'Sending OTP Code...' : 'Continue to Email Verification'}
                </button>
              </form>
            )}

            {/* OTP VERIFICATION SCREEN */}
            {authMode === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">6-Digit Verification Code</label>
                  <input 
                    type="text" 
                    maxLength="6"
                    required 
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456" 
                    className="w-full px-4 py-3 rounded-xl border border-emerald-400 bg-emerald-50/50 text-center text-2xl tracking-widest font-mono outline-none focus:ring-2 focus:ring-emerald-600/20 transition"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitted}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-600/30 transition duration-300 text-sm flex items-center justify-center gap-2 mt-2"
                >
                  {isSubmitted ? 'Verifying Code...' : 'Verify OTP & Complete Account'}
                </button>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
              {authMode === 'login' ? (
                <p>
                  Don't have an account yet?{' '}
                  <button onClick={() => setAuthMode('signup')} className="text-emerald-700 font-bold hover:underline">
                    Sign up free
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button onClick={() => setAuthMode('login')} className="text-emerald-700 font-bold hover:underline">
                    Sign in here
                  </button>
                </p>
              )}
            </div>

          </div>
        </div>
      )}
      
      {/* Main Content Area */}
      <main className="flex-grow">

        {/* 2. Hero Section */}
        <header className="relative bg-gradient-to-b from-emerald-100/70 via-emerald-50/30 to-white overflow-hidden pt-20 pb-32 lg:pt-28 lg:pb-40 border-b border-emerald-100/60">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-radial from-emerald-300/50 to-transparent blur-3xl pointer-events-none -z-10"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-emerald-200/90 border border-emerald-300 text-emerald-900 text-xs font-black uppercase tracking-wider px-4 py-2 rounded-full mb-8 shadow-sm">
              <span>🌾</span> Next-Gen Agri-Tech Infrastructure for Africa
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.08]">
              Empowering Smallholder Farmers with <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">Real-Time Intelligence</span> & Direct Markets
            </h1>
            
            <p className="mt-6 text-lg sm:text-xl text-slate-700 leading-relaxed max-w-2xl mx-auto font-medium">
              Bridging the agricultural gap by connecting local farming cooperatives straight to commercial buyers, real-time climate insights, and zero middlemen.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => setAuthMode('signup')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-emerald-600/30 transition duration-300 text-base flex items-center justify-center gap-2"
              >
                <span>🚀</span> Get Started Free
              </button>
              
              <a 
                href="#pitch" 
                className="bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold px-8 py-4 rounded-2xl shadow-sm transition duration-300 text-base flex items-center justify-center gap-2"
              >
                <span>▶</span> Watch Pitch Deck
              </a>
            </div>

            {/* Trust Badges */}
            <div className="mt-16 pt-12 border-t border-emerald-200/60 grid grid-cols-2 md:grid-cols-4 gap-6 text-emerald-900 text-sm font-semibold">
              <div className="flex flex-col items-center bg-white/60 backdrop-blur-xs p-4 rounded-2xl border border-emerald-100 shadow-xs">
                <span className="text-2xl font-black text-emerald-700">40%</span>
                <span className="text-slate-600">Margin Retention</span>
              </div>
              <div className="flex flex-col items-center bg-white/60 backdrop-blur-xs p-4 rounded-2xl border border-emerald-100 shadow-xs">
                <span className="text-2xl font-black text-emerald-700">48-Hour</span>
                <span className="text-slate-600">Weather Advisory</span>
              </div>
              <div className="flex flex-col items-center bg-white/60 backdrop-blur-xs p-4 rounded-2xl border border-emerald-100 shadow-xs">
                <span className="text-2xl font-black text-emerald-700">100%</span>
                <span className="text-slate-600">Traceable Supply</span>
              </div>
              <div className="flex flex-col items-center bg-white/60 backdrop-blur-xs p-4 rounded-2xl border border-emerald-100 shadow-xs">
                <span className="text-2xl font-black text-emerald-700">Jim Leech</span>
                <span className="text-slate-600">Fellowship MVP</span>
              </div>
            </div>
          </div>
        </header>

        {/* 3. Founder Pitch Video Section */}
        <section id="pitch" className="py-24 bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-emerald-300 font-bold text-xs uppercase tracking-widest bg-emerald-800/90 px-4 py-1.5 rounded-full border border-emerald-600/70 shadow-inner">
                Founder's Masterclass
              </span>
              <h2 className="text-3xl sm:text-4xl font-black mt-4 tracking-tight text-white">The Agrinova Vision Pitch Deck</h2>
              <p className="text-emerald-100/80 mt-3 text-base">Watch founder Rapheal Adeyemi explain how Agrinova transforms agricultural supply chains, market accessibility, and smallholder revenue.</p>
            </div>
            
            <div className="max-w-4xl mx-auto bg-emerald-900/50 backdrop-blur-xl p-4 sm:p-6 rounded-3xl border border-emerald-600/50 shadow-2xl">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-inner">
                <iframe 
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/qXA1GKqKQUs" 
                  title="Agrinova Pitch Deck - Rapheal Adeyemi"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen>
                </iframe>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between px-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-red-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-xs">YouTube HD</div>
                  <div className="text-sm text-emerald-100">
                    Presented by <span className="font-bold text-white">Rapheal Adeyemi</span>
                    <a href="https://www.youtube.com/@raphealadeyemi1951" target="_blank" rel="noopener noreferrer" className="block text-xs text-emerald-300 hover:underline mt-0.5">
                      @raphealadeyemi1951 ↗
                    </a>
                  </div>
                </div>
                <a 
                  href="https://youtu.be/qXA1GKqKQUs" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs bg-emerald-800 hover:bg-emerald-700 text-emerald-100 px-5 py-3 rounded-xl font-bold transition duration-200 border border-emerald-600"
                >
                  Open Full Screen on YouTube ↗
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Problem vs Solution Section */}
        <section id="problem" className="py-24 bg-gradient-to-b from-white via-emerald-50/20 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-emerald-700 font-bold text-xs uppercase tracking-widest bg-emerald-100 px-3.5 py-1.5 rounded-full border border-emerald-200">The Mission</span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">The Challenge We Are Solving</h2>
              <p className="text-slate-600 mt-3 text-base">Smallholder farmers lose up to 40% of their margins to exploitative intermediaries and unpredictable climate shocks.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-rose-50/50 p-8 sm:p-10 rounded-3xl border border-rose-100/80 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100/40 rounded-full blur-2xl pointer-events-none"></div>
                <div className="inline-block bg-rose-100 text-rose-700 font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-xl mb-4">
                  ❌ The Traditional Broken Model
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">High Friction & Low Yield Returns</h3>
                <ul className="space-y-4 text-slate-700 text-sm sm:text-base">
                  <li className="flex items-start gap-3">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>Multiple speculative middlemen eating up hard-earned profit margins.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>Guesswork planting due to zero accurate local weather insights.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>Limited local market reach restricted strictly to village brokers.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-emerald-100/60 p-8 sm:p-10 rounded-3xl border border-emerald-300/80 shadow-md shadow-emerald-900/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-300/50 rounded-full blur-2xl pointer-events-none"></div>
                <div className="inline-block bg-emerald-300 text-emerald-950 font-black text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-xl mb-4 shadow-xs">
                  ✅ The Agrinova Smart Solution
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Optimized, Direct & Traceable</h3>
                <ul className="space-y-4 text-slate-700 text-sm sm:text-base">
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-700 font-bold">✓</span>
                    <span>Direct B2B trade connection straight to verified commercial buyers.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-700 font-bold">✓</span>
                    <span>Hyper-localized 48-hour climate, rainfall, and crop health advisory.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-700 font-bold">✓</span>
                    <span>Transparent digital marketplace with secure, guaranteed payments.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Core Features Grid */}
        <section id="features" className="py-24 bg-emerald-50/40 border-t border-emerald-100/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-emerald-700 font-bold text-xs uppercase tracking-widest bg-emerald-200/80 px-3.5 py-1.5 rounded-full border border-emerald-300">Core Pillars</span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-4 tracking-tight">Built for Scalable Agricultural Impact</h2>
              <p className="text-slate-600 mt-3 text-base">Everything a modern farming collective, commercial buyer, or agro-admin needs in one platform.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: "Real-Time Weather", desc: "Location-based climate tracking optimized specifically for planting, weeding, and harvesting.", icon: "⛅" },
                { title: "Input Marketplace", desc: "Direct access to certified hybrid seeds, organic fertilizers, and reliable tool rentals.", icon: "🛒" },
                { title: "Guaranteed Buyers", desc: "Direct digital B2B matching linking harvests straight to bulk food processors.", icon: "🤝" },
                { title: "Agronomic Advisory", desc: "AI-powered tips and agricultural expert guides designed to maximize farm yield per hectare.", icon: "📈" }
              ].map((f, idx) => (
                <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1 transition duration-300 group">
                  <div className="text-3xl mb-6 bg-emerald-100/70 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition duration-300 shadow-xs border border-emerald-200">
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Impact Metrics Section */}
        <section id="impact" className="py-24 bg-white border-t border-emerald-100/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-emerald-700 font-bold text-xs uppercase tracking-widest bg-emerald-100 px-3.5 py-1.5 rounded-full border border-emerald-200">Jim Leech Fellowship Goals</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-4 tracking-tight mb-16">Target Impact Metrics for Phase 1</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-b from-emerald-100/50 to-emerald-50/20 p-10 rounded-3xl border border-emerald-200 shadow-sm">
                <div className="text-5xl font-black text-emerald-700 tracking-tight">+35%</div>
                <p className="text-slate-900 font-bold text-base mt-3">Average Farmer Income Growth</p>
                <p className="text-slate-600 text-xs mt-1">Eliminating intermediaries to ensure maximum profit retention.</p>
              </div>
              
              <div className="bg-gradient-to-b from-emerald-100/50 to-emerald-50/20 p-10 rounded-3xl border border-emerald-200 shadow-sm">
                <div className="text-5xl font-black text-emerald-700 tracking-tight">5,000+</div>
                <p className="text-slate-900 font-bold text-base mt-3">Smallholder Farmers Targeted</p>
                <p className="text-slate-600 text-xs mt-1">Cooperative onboarding planned across pilot regions.</p>
              </div>
              
              <div className="bg-gradient-to-b from-emerald-100/50 to-emerald-50/20 p-10 rounded-3xl border border-emerald-200 shadow-sm">
                <div className="text-5xl font-black text-emerald-700 tracking-tight">100%</div>
                <p className="text-slate-900 font-bold text-base mt-3">Traceable Supply Chain</p>
                <p className="text-slate-600 text-xs mt-1">Full transparency from seed planting to final B2B delivery.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Pro Support & Contact Section */}
        <section id="contact" className="py-24 bg-emerald-50/30 border-t border-emerald-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 mb-20 relative overflow-hidden border border-emerald-800">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="max-w-2xl relative z-10">
                <span className="bg-emerald-800 text-emerald-200 text-xs font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-emerald-700">
                  Support Center
                </span>
                <h2 className="text-3xl sm:text-4xl font-black mt-4 tracking-tight">Need Partnership or Fellowship Support?</h2>
                <p className="text-emerald-100/90 mt-3 text-base font-normal leading-relaxed">
                  Whether you're looking to explore pilot onboarding, investor queries, or review code architecture, reach out directly to founder Rapheal Adeyemi.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto relative z-10">
                <a 
                  href="mailto:adeyemi094@gmail.com" 
                  className="bg-white hover:bg-emerald-50 text-slate-900 font-bold px-7 py-4 rounded-2xl shadow-lg transition duration-300 text-center flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5 text-emerald-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Email Support</span>
                </a>
                <a 
                  href="https://wa.me/2349061573615" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black px-7 py-4 rounded-2xl shadow-lg transition duration-300 text-center flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5 text-slate-950 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pt-6">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-xl">🌱</span>
                  <span className="font-black tracking-wider text-slate-900 text-lg">AGRINOVA</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Empowering African agricultural cooperatives through real-time climate telemetry, direct B2B market matching, and transparent supply frameworks.
                </p>
              </div>

              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 mb-4">Platform Architecture</h3>
                <ul className="space-y-3 text-sm font-medium text-slate-600">
                  <li><a href="#pitch" className="hover:text-emerald-700 transition">Pitch Deck & Video</a></li>
                  <li><a href="#problem" className="hover:text-emerald-700 transition">Mission & Problem</a></li>
                  <li><a href="#features" className="hover:text-emerald-700 transition">Core Ecosystem</a></li>
                  <li><a href="#impact" className="hover:text-emerald-700 transition">Jim Leech Impact Metrics</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 mb-4">Contact Details</h3>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-emerald-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href="mailto:adeyemi094@gmail.com" className="hover:text-emerald-700 font-semibold underline">adeyemi094@gmail.com</a>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-emerald-700 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    <a href="https://wa.me/2349061573615" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-700 font-semibold">+234 906 157 3615</a>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-emerald-700 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    <a href="https://www.linkedin.com/in/rapheal-adeyemi-67ab82315?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-700 font-semibold underline">LinkedIn Profile</a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 mb-4">System Status</h3>
                <div className="bg-emerald-100/70 border border-emerald-200 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    <span>Server Status: 100% Operational</span>
                  </div>
                  <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                    All telemetry servers, climate APIs, and matching layers run continuously 24/7 across distribution tiers.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-emerald-200 text-slate-600 py-8 shadow-inner mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p>&copy; 2026 Agrinova TechSolution. Built by Rapheal Adeyemi for the Jim Leech Mastercard Foundation Fellowship.</p>
          <div className="flex items-center gap-4 font-semibold">
            <a href="mailto:adeyemi094@gmail.com" className="hover:text-emerald-700 transition">Email Founder</a>
            <span className="text-emerald-300">•</span>
            <a href="https://www.linkedin.com/in/rapheal-adeyemi-67ab82315?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-700 transition">LinkedIn</a>
          </div>
        </div>
      </footer>

    </div>
  );
}