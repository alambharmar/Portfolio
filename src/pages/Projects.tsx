import { motion } from "motion/react";
import Page from "../components/Page";

const PROJECTS = [
  { title: "Memoria", sub: "AI Health Assistant", tech: "Python, AI/ML", desc: "Symptom and medication logger. Auto-escalates high-severity cases for actionable real doctor consultations." },
  { title: "RTA Dubai Metro", sub: "Dynamic Scheduling", tech: "scikit-learn, Q-Learning", desc: "Predictive scheduling on real RTA data. Random Forest forecasts ridership; Reinforcement Learning agent recommends frequency." },
  { title: "AirEase", sub: "Family Travel Assistant", tech: "Figma, UX/UI", desc: "Strategic end-to-end UX for parents travelling with children — covering trip planning, airport navigation, and in-flight." },
  { title: "Wasl", sub: "Ecosystem Namaz App", tech: "Swift, Apple Ecosystem", desc: "Islamic prayer app Native on iOS/macOS/watchOS/iPadOS. Features prayer times, Qaza tracker, and Tasbeeh." },
  { title: "Password Advisor", sub: "Security Tool", tech: "Python, ML", desc: "Evaluates password strength in real time with highly actionable, context-aware suggestions." },
];

const SKILLS = [
  { category: "Technical Stack", items: ["Python", "SQL", "PL/SQL", "HTML/CSS/JS", "Swift", "C++", "MongoDB", "Random Forest", "Q-Learning", "UX/UI Prototyping"] },
  { category: "Professional Tools", items: ["Figma", "Xcode", "VS Code", "Wireshark", "Zenmap", "Odoo"] },
  { category: "Core Competencies", items: ["Problem Solving", "Critical Thinking", "Team Collaboration", "Communication Skills"] }
];

export default function Projects() {
  return (
    <Page className="justify-start pt-32">
      <div className="mb-24 text-center">
        <h2 className="text-5xl md:text-7xl font-bold apple-heading mb-6 tracking-tight text-gradient">Selected Work.</h2>
        <p className="text-[#86868b] text-xl md:text-2xl font-light">Innovation through cybersecurity, AI, and design.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-32">
        {PROJECTS.map((proj, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`liquid-glass-card rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between group hover:bg-white/5 transition-colors ${i === 0 || i === 3 ? "md:col-span-2" : ""}`}
          >
            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                <div>
                  <h3 className="text-3xl font-semibold text-[#f5f5f7] mb-2">{proj.title}</h3>
                  <h4 className="text-[#2997ff] font-medium text-lg">{proj.sub}</h4>
                </div>
                <span className="inline-flex px-4 py-2 bg-black/40 border border-white/5 rounded-full text-xs font-medium text-[#86868b] whitespace-nowrap">
                  {proj.tech}
                </span>
              </div>
              <p className="text-[#86868b] leading-relaxed text-lg max-w-3xl">{proj.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mb-16">
         <h2 className="text-5xl md:text-7xl font-bold apple-heading text-gradient tracking-tight">Expertise.</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {SKILLS.map((skill, i) => (
          <motion.div 
            key={skill.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + (i * 0.1), duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="liquid-glass-card rounded-[2.5rem] p-8 md:p-10"
          >
            <h3 className="text-xl font-semibold mb-8 text-[#f5f5f7]">{skill.category}</h3>
            <div className="flex flex-wrap gap-2.5">
               {skill.items.map(item => (
                 <span key={item} className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-sm font-medium text-[#86868b]">
                   {item}
                 </span>
               ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Page>
  );
}
