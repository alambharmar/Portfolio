import { motion, AnimatePresence } from "motion/react";
import Page from "../components/Page";
import { useState, useEffect } from "react";
import { CheckCircle2, Calendar, Clock, User, ArrowRight, LogOut, LogIn, Mail } from "lucide-react";
import { collection, addDoc, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase";
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, User as FirebaseUser, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default function Booking() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthSubmit, setIsAuthSubmit] = useState(false);

  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isBooked, setIsBooked] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [context, setContext] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myBookings, setMyBookings] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setName(currentUser.displayName || "");
        setEmail(currentUser.email || "");
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setMyBookings([]);
      return;
    }
    const q = query(
      collection(db, "bookings"),
      where("userId", "==", user.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bks: any[] = [];
      snapshot.forEach((doc) => {
        bks.push({ id: doc.id, ...doc.data() });
      });
      // Sort by creation time manually to avoid needing a composite index
      bks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setMyBookings(bks);
    });
    return () => unsubscribe();
  }, [user]);

  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(new Date().getDate() + i + 1);
    return d;
  });

  const timeSlots = ["09:00 AM", "10:00 AM", "11:30 AM", "01:00 PM", "02:30 PM", "04:00 PM", "05:00 PM"];

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Login failed", error);
      if (error.code === 'auth/unauthorized-domain') {
        alert("Domain not authorized. Please add this app's domain to Firebase Authorized Domains.");
      } else {
        alert(error.message || "Failed to login.");
      }
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsAuthSubmit(true);
    try {
      if (authMode === 'register') {
        await createUserWithEmailAndPassword(auth, emailInput, passwordInput);
      } else {
        await signInWithEmailAndPassword(auth, emailInput, passwordInput);
      }
    } catch (error: any) {
      console.error("Auth failed", error);
      if (error.code === 'auth/operation-not-allowed') {
        setAuthError("Email/Password accounts are disabled. Please enable them in your Firebase Console > Authentication > Sign-in Method.");
      } else {
        setAuthError(error.message || "Authentication failed.");
      }
    } finally {
      setIsAuthSubmit(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setSelectedDate(null);
    setSelectedTime(null);
    setContext("");
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate === null || !selectedTime || !user) return;
    
    setIsSubmitting(true);
    try {
      const dateVal = dates[selectedDate];
      await addDoc(collection(db, "bookings"), {
        date: dateVal.toISOString(),
        time: selectedTime,
        name,
        email,
        context,
        userId: user.uid,
        status: "pending",
        createdAt: new Date().toISOString()
      });
      setIsBooked(true);
      setTimeout(() => {
        setIsBooked(false);
        setSelectedDate(null);
        setSelectedTime(null);
        setContext("");
      }, 5000);
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (authLoading) {
    return <Page className="items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-[#2997ff] border-t-transparent animate-spin"></div></Page>;
  }

  return (
    <Page className="items-center justify-start pt-20 sm:pt-32 pb-48">
      <div className="text-center mb-16 max-w-2xl w-full">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl font-bold apple-heading tracking-tight mb-6 text-[#f5f5f7]"
        >
          Let's connect.
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[#86868b] text-xl font-light"
        >
          Select a date and time for a professional consultation.
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-3xl"
      >
        {!user ? (
          <div className="liquid-glass-card rounded-[2.5rem] p-8 md:p-12 text-center shadow-2xl flex flex-col items-center">
            <div className="w-16 h-16 bg-[#2997ff]/10 rounded-full flex items-center justify-center mb-6">
              <User className="w-8 h-8 text-[#2997ff]" />
            </div>
            <h3 className="text-2xl font-semibold mb-2 text-[#f5f5f7]">
              {authMode === 'login' ? 'Sign in to Book' : 'Create an Account'}
            </h3>
            <p className="text-[#86868b] mb-8 max-w-sm">
              Please sign in to schedule an appointment.
            </p>

            <form onSubmit={handleEmailAuth} className="w-full max-w-sm space-y-4 mb-6">
              {authError && (
                 <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm whitespace-pre-wrap text-left">
                   {authError}
                 </div>
              )}
              <div className="space-y-3">
                <input 
                  type="email" 
                  required
                  placeholder="Email Address" 
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
              </div>
              
              <button 
                type="submit"
                disabled={isAuthSubmit}
                className="flex items-center justify-center gap-3 w-full px-8 py-4 rounded-2xl bg-white text-black font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <Mail className="w-5 h-5" />
                {isAuthSubmit ? 'Please wait...' : (authMode === 'login' ? 'Sign in with Email' : 'Sign up with Email')}
              </button>

              <div className="pt-2">
                <button 
                  type="button" 
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} 
                  className="text-sm text-[#86868b] hover:text-[#f5f5f7] transition-colors"
                >
                  {authMode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>
            </form>

            <div className="flex items-center w-full max-w-sm gap-4 mb-6">
              <div className="h-px bg-white/10 flex-1"></div>
              <span className="text-xs text-[#86868b] uppercase tracking-wider font-semibold">OR</span>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>

            <button 
              onClick={handleLogin}
              className="flex items-center justify-center gap-3 w-full max-w-sm px-8 py-4 rounded-2xl bg-[#2997ff]/10 text-[#2997ff] hover:bg-[#2997ff]/20 font-semibold transition-colors"
            >
              <LogIn className="w-5 h-5" />
              Continue with Google
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8 px-4">
              <div className="text-[#86868b] text-sm">
                Signed in as <span className="text-[#f5f5f7] font-medium">{user.email}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-[#86868b] hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>

            <AnimatePresence mode="wait">
              {isBooked ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="liquid-glass-card rounded-[2.5rem] flex flex-col items-center justify-center p-12 md:p-16 text-center shadow-2xl"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2, damping: 20 }}
                    className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(34,197,94,0.3)] ring-1 ring-green-500/50"
                  >
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                  </motion.div>
                  <h3 className="text-4xl font-semibold mb-4 tracking-tight apple-heading text-[#f5f5f7]">Booking Request Sent</h3>
                  <p className="text-[#86868b] text-lg max-w-md">
                    Thank you. Your booking request has been sent for approval. You can check its status in your bookings list below.
                  </p>
                </motion.div>
              ) : (
                <form key="form" onSubmit={handleBook} className="space-y-6">
                  
                  {/* STEP 1: DATE */}
                  <div className="liquid-glass-card rounded-[2.5rem] p-6 md:p-10 shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-2xl font-semibold text-[#f5f5f7] flex items-center gap-4 tracking-tight">
                         <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                           <Calendar className="w-5 h-5 text-[#f5f5f7]" />
                         </div>
                         Date
                       </h3>
                       {selectedDate !== null && (
                         <span className="text-sm font-medium text-[#f5f5f7] bg-white/10 border border-white/10 px-4 py-1.5 rounded-full">
                           {dates[selectedDate].toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                         </span>
                       )}
                    </div>

                    <div className="flex gap-4 overflow-x-auto pt-4 pb-8 scrollbar-hide snap-x -mx-4 px-4">
                      {dates.map((date, i) => {
                        const isSelected = selectedDate === i;
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                               setSelectedDate(i);
                               if (selectedTime) setSelectedTime(null);
                            }}
                            className={`relative flex-shrink-0 snap-center w-[96px] h-[116px] rounded-[1.75rem] flex flex-col items-center justify-center transition-all duration-300 outline-none focus:outline-none border ${
                              isSelected
                                ? 'bg-[#2997ff] border-[#2997ff] shadow-[0_8px_30px_rgba(41,151,255,0.4)] text-white scale-[1.02]'
                                : 'bg-white/5 border-white/5 text-[#86868b] hover:bg-white/10 hover:text-white hover:border-white/20 focus:border-[#2997ff]/50'
                            }`}
                          >
                            <span className={`text-[11px] font-semibold uppercase tracking-wider mb-2 ${isSelected ? 'text-white/90' : 'text-[#86868b]'}`}>
                              {date.toLocaleDateString('en-US', { weekday: 'short' })}
                            </span>
                            <span className="text-4xl font-semibold apple-heading">{date.getDate()}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* STEP 2: TIME */}
                  <motion.div 
                    animate={{
                      opacity: selectedDate !== null ? 1 : 0.4,
                      filter: selectedDate !== null ? 'blur(0px)' : 'blur(4px)',
                    }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="liquid-glass-card rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden shadow-2xl"
                  >
                    {selectedDate === null && <div className="absolute inset-0 z-10 cursor-not-allowed" />}

                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-2xl font-semibold text-[#f5f5f7] flex items-center gap-4 tracking-tight">
                         <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-500 ${selectedDate !== null ? 'bg-[#2997ff]/10 border-[#2997ff]/20' : 'bg-white/5 border-white/10'}`}>
                           <Clock className={`w-5 h-5 ${selectedDate !== null ? 'text-[#2997ff]' : 'text-[#f5f5f7]'}`} />
                         </div>
                         Time
                       </h3>
                       {selectedTime !== null && selectedDate !== null && (
                         <span className="text-sm font-medium text-[#f5f5f7] bg-white/10 border border-white/10 px-4 py-1.5 rounded-full">
                           {selectedTime}
                         </span>
                       )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                      {timeSlots.map((time) => {
                        const isSelected = selectedTime === time;
                        return (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setSelectedTime(time)}
                            className={`py-4 rounded-[1.25rem] text-sm font-semibold transition-all duration-300 outline-none focus:outline-none border ${
                              isSelected
                                ? 'bg-[#2997ff] text-white border-[#2997ff] shadow-[0_8px_30px_rgba(41,151,255,0.4)] scale-105'
                                : 'bg-white/5 border-white/5 text-[#86868b] hover:bg-white/10 hover:text-white hover:border-white/20 focus:border-[#2997ff]/50'
                            }`}
                          >
                            {time}
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>

                  {/* STEP 3: DETAILS */}
                  <AnimatePresence>
                    {selectedDate !== null && selectedTime !== null && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: -20 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -20 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="liquid-glass-card rounded-[2.5rem] p-6 md:p-10 mb-4 shadow-2xl">
                           <div className="flex items-center justify-between mb-8">
                             <h3 className="text-2xl font-semibold text-[#f5f5f7] flex items-center gap-4 tracking-tight">
                               <div className="w-12 h-12 rounded-full bg-[#2997ff]/10 border border-[#2997ff]/20 flex items-center justify-center">
                                 <User className="w-5 h-5 text-[#2997ff]" />
                               </div>
                               Your Details
                             </h3>
                           </div>

                           <div className="space-y-4">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <input 
                                 type="text" 
                                 required 
                                 placeholder="Full Name" 
                                 value={name}
                                 onChange={e => setName(e.target.value)}
                                 className="w-full bg-black/30 border border-white/10 rounded-2xl p-5 text-[#f5f5f7] placeholder-[#86868b]/50 focus:outline-none focus:border-[#2997ff] focus:ring-1 focus:ring-[#2997ff] focus:bg-black/50 transition-all text-base shadow-inner"
                               />
                               <input 
                                 type="email" 
                                 required 
                                 placeholder="Email Address"
                                 value={email}
                                 readOnly
                                 className="w-full bg-black/30 border border-white/10 rounded-2xl p-5 text-[#f5f5f7] placeholder-[#86868b] opacity-50 cursor-not-allowed focus:outline-none transition-all text-base shadow-inner"
                               />
                             </div>

                             <textarea 
                                placeholder="Any context for the meeting? (Optional)" 
                                rows={3}
                                value={context}
                                onChange={(e) => setContext(e.target.value)}
                                className="w-full bg-black/30 border border-white/10 rounded-2xl p-5 text-[#f5f5f7] placeholder-[#86868b]/50 focus:outline-none focus:border-[#2997ff] focus:ring-1 focus:ring-[#2997ff] focus:bg-black/50 transition-all text-base resize-none shadow-inner"
                             ></textarea>

                             <button 
                               type="submit"
                               disabled={isSubmitting}
                               className="w-full mt-4 py-5 rounded-2xl bg-[#f5f5f7] text-black font-semibold text-lg hover:bg-white transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group outline-none focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                             >
                               {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
                               {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                             </button>
                           </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </form>
              )}
            </AnimatePresence>

            {myBookings.length > 0 && (
              <div className="mt-16 text-left">
                <h3 className="text-2xl font-semibold mb-6 text-[#f5f5f7]">Your Bookings</h3>
                <div className="space-y-4">
                  {myBookings.map((booking) => (
                    <div key={booking.id} className="liquid-glass-card rounded-[2rem] p-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                           <h4 className="text-lg font-medium text-white">{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} at {booking.time}</h4>
                        </div>
                        <p className="text-sm text-[#86868b]">{booking.context || "No additional context provided."}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider whitespace-nowrap ${
                        booking.status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/20' :
                        booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400 border border-red-500/20' :
                        'bg-orange-500/20 text-orange-400 border border-orange-500/20'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </Page>
  );
}
