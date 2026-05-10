import { useState, useEffect } from "react";
import Page from "../components/Page";
import { motion } from "motion/react";
import { db, auth } from "../firebase";
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, User as FirebaseUser, signInWithEmailAndPassword } from "firebase/auth";
import { Calendar, Clock, CheckCircle2, XCircle, LogOut, Mail, MessageSquare, LogIn } from "lucide-react";

export default function Admin() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [isAuthSubmit, setIsAuthSubmit] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const isAdmin = user?.email === "admin@gmail.com";

  useEffect(() => {
    if (!user || !isAdmin) return;
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bks: any[] = [];
      snapshot.forEach((doc) => {
        bks.push({ id: doc.id, ...doc.data() });
      });
      setBookings(bks);
    });
    return () => unsubscribe();
  }, [user, isAdmin]);

  const handleGoogleLogin = async () => {
    setLoginError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Login failed", error);
      if (error.code === 'auth/unauthorized-domain') {
        const domain = window.location.hostname;
        setLoginError(`Domain not authorized.\n\nPlease add this domain to your Firebase Console:\n\n1. Go to Firebase Console > Authentication\n2. Click "Settings" (or "Settings" tab)\n3. Click "Authorized domains"\n4. Add domain: ${domain}`);
      } else {
        setLoginError(error.message || "Failed to login.");
      }
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsAuthSubmit(true);
    try {
      await signInWithEmailAndPassword(auth, emailInput, passwordInput);
    } catch (error: any) {
      console.error("Auth failed", error);
      if (error.code === 'auth/operation-not-allowed') {
        setLoginError("Email/Password accounts are disabled. Please enable them in your Firebase Console > Authentication > Sign-in Method.");
      } else {
        setLoginError(error.message || "Invalid email or password.");
      }
    } finally {
      setIsAuthSubmit(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const updateBookingStatus = async (id: string, status: 'approved' | 'cancelled') => {
    try {
      await updateDoc(doc(db, "bookings", id), { status });
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  if (loading) {
    return <Page className="items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-[#2997ff] border-t-transparent animate-spin"></div></Page>;
  }

  if (!user) {
    return (
      <Page className="items-center justify-center pt-32 pb-48">
        <div className="text-center mb-10 w-full max-w-sm">
          <h2 className="text-4xl font-bold apple-heading tracking-tight mb-4 text-[#f5f5f7]">Admin Portal</h2>
          <p className="text-[#86868b] mb-8">Please sign in to manage bookings.</p>
          
          <form onSubmit={handleEmailLogin} className="space-y-4 mb-6 text-left">
            {loginError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm whitespace-pre-wrap">
                {loginError}
              </div>
            )}
            <input 
              type="email" 
              required
              placeholder="Admin Email" 
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-2xl p-4 text-[#f5f5f7] placeholder-[#86868b] focus:outline-none focus:border-[#2997ff] transition-all"
            />
            <input 
              type="password" 
              required
              placeholder="Password" 
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-2xl p-4 text-[#f5f5f7] placeholder-[#86868b] focus:outline-none focus:border-[#2997ff] transition-all"
            />
            <button 
              type="submit"
              disabled={isAuthSubmit}
              className="flex items-center justify-center gap-3 w-full px-8 py-4 rounded-2xl bg-[#2997ff] text-white font-semibold hover:bg-[#147ce5] transition-colors mt-2 disabled:opacity-50"
            >
              <Mail className="w-5 h-5" />
              {isAuthSubmit ? 'Signing in...' : 'Sign in with Email'}
            </button>
          </form>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-white/10 flex-1"></div>
            <span className="text-xs text-[#86868b] uppercase tracking-wider font-semibold">OR</span>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>

          <button 
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-3 w-full px-8 py-4 rounded-2xl bg-white text-black hover:bg-gray-200 font-semibold transition-all"
          >
            <LogIn className="w-5 h-5" />
            Sign in with Google
          </button>
        </div>
      </Page>
    );
  }

  if (!isAdmin) {
    return (
      <Page className="items-center justify-center pt-32 pb-48">
        <div className="text-center mb-10 w-full max-w-sm">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-3xl font-bold apple-heading tracking-tight mb-4 text-[#f5f5f7]">Access Denied</h2>
          <p className="text-[#86868b] mb-8">Your account ({user.email}) is not authorized to view the admin portal.</p>
          
          <button 
            onClick={handleLogout}
            className="w-full bg-white/10 hover:bg-white/20 border border-white/10 px-8 py-4 rounded-2xl text-[#f5f5f7] font-medium transition-all"
          >
            Sign out and try another account
          </button>
        </div>
      </Page>
    );
  }

  return (
    <Page className="items-center justify-start pt-32 pb-48">
      <div className="w-full max-w-5xl px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold apple-heading tracking-tight mb-2 text-[#f5f5f7]">Bookings</h2>
            <p className="text-[#86868b] text-lg">Manage your schedule</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-[#86868b] hover:text-[#f5f5f7] transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign out</span>
          </button>
        </div>

        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="liquid-glass-card rounded-[2rem] p-12 text-center text-[#86868b]">
              No bookings found.
            </div>
          ) : (
            bookings.map((booking) => (
              <motion.div 
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="liquid-glass-card rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center"
              >
                <div className="space-y-4 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-semibold text-[#f5f5f7]">{booking.name}</h3>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${
                      booking.status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/20' :
                      booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400 border border-red-500/20' :
                      'bg-orange-500/20 text-orange-400 border border-orange-500/20'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#86868b]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {booking.time}
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <a href={`mailto:${booking.email}`} className="hover:text-white truncate">{booking.email}</a>
                    </div>
                  </div>

                  {booking.context && (
                    <div className="flex items-start gap-2 bg-black/20 p-4 rounded-xl text-sm text-[#a1a1a6] mt-4">
                      <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p className="leading-relaxed">{booking.context}</p>
                    </div>
                  )}
                  <div className="text-xs text-white/30 pt-2">
                    Booked on: {new Date(booking.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
                  {booking.status !== 'approved' && (
                    <button 
                      onClick={() => updateBookingStatus(booking.id, 'approved')}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#2997ff] text-white font-medium hover:bg-[#147ce5] transition-colors shadow-lg shadow-[#2997ff]/20"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Approve
                    </button>
                  )}
                  {booking.status !== 'cancelled' && (
                    <button 
                      onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 text-red-500 font-medium hover:bg-red-500/20 transition-colors border border-red-500/20"
                    >
                      <XCircle className="w-5 h-5" />
                      Cancel
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </Page>
  );
}
