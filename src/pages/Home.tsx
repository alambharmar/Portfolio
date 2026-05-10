import { motion } from "motion/react";
import Page from "../components/Page";
import { Shield, Mail, Phone, MapPin } from "lucide-react";

export default function Home() {
  return (
    <Page className="items-center text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-20 h-20 bg-gradient-to-tr from-[#2997ff] to-[#147ce5] rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(41,151,255,0.4)] mb-10"
      >
        <Shield className="w-10 h-10 text-white" />
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="text-[#86868b] uppercase tracking-[0.2em] text-sm font-medium mb-4"
      >
        Cybersecurity Specialist
      </motion.p>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-5xl md:text-8xl font-bold apple-heading text-gradient tracking-tight mb-8"
      >
        Muhammad <br className="hidden md:block" /> Alam.
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-xl md:text-2xl text-[#86868b] max-w-2xl font-light leading-relaxed mb-16"
      >
        BSc Computer Science final-year student at University of Wollongong Dubai. 
        Passionate about crafting AI-powered applications, elegant interfaces, and robust systems.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl"
      >
        {[
          { icon: Mail, label: "alam.bharmal@gmail.com", href: "mailto:alam.bharmal@gmail.com" },
          { icon: Phone, label: "+971 56 220 5866", href: "tel:+971562205866" },
          { icon: MapPin, label: "Dubai, UAE", href: null }
        ].map((contact, i) => (
          <div key={i} className="liquid-glass-card rounded-3xl p-6 flex flex-col items-center gap-4 transition-transform hover:scale-105 hover:bg-white/5 cursor-default">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
              <contact.icon className="w-5 h-5 text-[#f5f5f7]" />
            </div>
            {contact.href ? (
              <a href={contact.href} className="text-sm font-medium text-[#86868b] hover:text-[#f5f5f7] transition-colors">{contact.label}</a>
            ) : (
              <span className="text-sm font-medium text-[#86868b]">{contact.label}</span>
            )}
          </div>
        ))}
      </motion.div>
    </Page>
  );
}
