import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  User, CheckCircle, Percent, Shield, ArrowRight,
  TrendingUp, Calendar, Clock, DollarSign, Award, Bell
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const ScrollStorytelling = () => {
  const triggerRef = useRef(null);
  const containerRef = useRef(null);
  const deviceRef = useRef(null);
  
  // Refs for sequential text sections
  const textRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  // Refs for simulated dashboard screens
  const screenRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    if (!triggerRef.current || !containerRef.current) return;

    // Create GSAP Scroll Storytelling Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.8,
        pin: true,
        anticipatePin: 1
      }
    });

    // Initial setup: first text active, others hidden. First screen visible, others hidden.
    gsap.set(textRefs[0].current, { opacity: 1, y: 0 });
    for (let i = 1; i < textRefs.length; i++) {
      gsap.set(textRefs[i].current, { opacity: 0, y: 40 });
    }
    gsap.set(screenRefs[0].current, { opacity: 1, scale: 1 });
    for (let i = 1; i < screenRefs.length; i++) {
      gsap.set(screenRefs[i].current, { opacity: 0, scale: 0.95 });
    }

    // Step 1: Scale up device and pivot perspective (scroll 0% to 20%)
    tl.fromTo(deviceRef.current, 
      { scale: 0.8, rotateX: 10, rotateY: -10, transformPerspective: 1000 },
      { scale: 1.05, rotateX: 6, rotateY: 5, duration: 1, ease: 'none' }
    );

    // Step 2: Transition from slide 1 to slide 2 (scroll 20% to 45%)
    tl.to(textRefs[0].current, { opacity: 0, y: -40, duration: 0.5, ease: 'none' }, '+=0.2')
      .to(screenRefs[0].current, { opacity: 0, scale: 1.05, duration: 0.5, ease: 'none' }, '<')
      .to(textRefs[1].current, { opacity: 1, y: 0, duration: 0.5, ease: 'none' })
      .to(screenRefs[1].current, { opacity: 1, scale: 1, duration: 0.5, ease: 'none' }, '<')
      .to(deviceRef.current, { rotateX: -6, rotateY: -8, duration: 0.8, ease: 'none' }, '<');

    // Step 3: Transition from slide 2 to slide 3 (scroll 45% to 70%)
    tl.to(textRefs[1].current, { opacity: 0, y: -40, duration: 0.5, ease: 'none' }, '+=0.2')
      .to(screenRefs[1].current, { opacity: 0, scale: 1.05, duration: 0.5, ease: 'none' }, '<')
      .to(textRefs[2].current, { opacity: 1, y: 0, duration: 0.5, ease: 'none' })
      .to(screenRefs[2].current, { opacity: 1, scale: 1, duration: 0.5, ease: 'none' }, '<')
      .to(deviceRef.current, { rotateX: 5, rotateY: 8, duration: 0.8, ease: 'none' }, '<');

    // Step 4: Transition from slide 3 to slide 4 (scroll 70% to 100%)
    tl.to(textRefs[2].current, { opacity: 0, y: -40, duration: 0.5, ease: 'none' }, '+=0.2')
      .to(screenRefs[2].current, { opacity: 0, scale: 1.05, duration: 0.5, ease: 'none' }, '<')
      .to(textRefs[3].current, { opacity: 1, y: 0, duration: 0.5, ease: 'none' })
      .to(screenRefs[3].current, { opacity: 1, scale: 1, duration: 0.5, ease: 'none' }, '<')
      .to(deviceRef.current, { rotateX: 0, rotateY: 0, scale: 0.95, duration: 0.8, ease: 'none' }, '<');

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);

  return (
    <div ref={triggerRef} className="relative h-[400vh] w-full bg-[#10131e]">
      
      {/* Sticky Inner Container */}
      <div 
        ref={containerRef} 
        className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden py-16"
      >
        <div className="container mx-auto px-4 max-w-7xl h-full flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Left Side: Pinned Text Container */}
          <div className="w-full lg:w-5/12 h-[320px] relative flex flex-col justify-center select-none text-left">
            
            {/* Slide 1 Text */}
            <div ref={textRefs[0]} className="absolute inset-0 flex flex-col justify-center pointer-events-none">
              <span className="text-accent text-[10px] font-bold tracking-[0.25em] uppercase mb-3">Student Portal</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight leading-tight">
                Self-Service Portals <br />For Connected Students
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light max-w-md">
                Empower your students with unified access to schedules, grades, attendance reports, and homework assignments directly from their private dashboards.
              </p>
              <div className="flex items-center text-xs font-semibold text-accent gap-2">
                <span>Scroll to see teacher portal</span>
                <ArrowRight className="h-3.5 w-3.5 animate-bounce-horizontal" />
              </div>
            </div>

            {/* Slide 2 Text */}
            <div ref={textRefs[1]} className="absolute inset-0 flex flex-col justify-center pointer-events-none opacity-0">
              <span className="text-accent text-[10px] font-bold tracking-[0.25em] uppercase mb-3">Teacher Dashboard</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight leading-tight">
                Swift Operations <br />For Dedicated Faculty
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light max-w-md">
                Input marks sheets in 60 seconds, roll call classroom attendance with one tap, and generate automated academic trends without Excel sheets.
              </p>
              <div className="flex items-center text-xs font-semibold text-accent gap-2">
                <span>Scroll to see admin billing</span>
                <ArrowRight className="h-3.5 w-3.5 animate-bounce-horizontal" />
              </div>
            </div>

            {/* Slide 3 Text */}
            <div ref={textRefs[2]} className="absolute inset-0 flex flex-col justify-center pointer-events-none opacity-0">
              <span className="text-accent text-[10px] font-bold tracking-[0.25em] uppercase mb-3">Fee Management</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight leading-tight">
                Frictionless Collections <br />For Administrators
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light max-w-md">
                Automate parents billing cycles, issue invoices, track collections, and generate audit reports with zero manual calculation errors.
              </p>
              <div className="flex items-center text-xs font-semibold text-accent gap-2">
                <span>Scroll to see parent sync</span>
                <ArrowRight className="h-3.5 w-3.5 animate-bounce-horizontal" />
              </div>
            </div>

            {/* Slide 4 Text */}
            <div ref={textRefs[3]} className="absolute inset-0 flex flex-col justify-center pointer-events-none opacity-0">
              <span className="text-accent text-[10px] font-bold tracking-[0.25em] uppercase mb-3">Unified Operations</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight leading-tight">
                One Integrated System <br />For Your Whole School
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light max-w-md">
                Unify students database, marks entry, automatic alerts, parental sync, and audit logs. The ultimate school ERP platform for modern institutions.
              </p>
              <div className="flex items-center text-xs font-semibold text-accent gap-2">
                <span>Explore all offerings below</span>
              </div>
            </div>

          </div>

          {/* Right Side: 3D Tablet Mockup Frame */}
          <div className="w-full lg:w-7/12 flex items-center justify-center">
            
            <div 
              ref={deviceRef}
              className="w-full max-w-[580px] aspect-[16/10] bg-[#1a1f33] border-[6px] border-[#2c324c] rounded-[24px] shadow-2xl relative overflow-hidden transform-gpu"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Camera Lens Indicator */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#2c324c] z-40"></div>
              
              {/* Simulated Screens Overlay Wrapper */}
              <div className="absolute inset-2 bg-[#0c0e17] rounded-[16px] overflow-hidden border border-[#2c324c]/40 z-30">
                
                {/* 1. Student Dashboard Screen */}
                <div 
                  ref={screenRefs[0]} 
                  className="absolute inset-0 p-5 flex flex-col bg-[#0c0e17] select-none pointer-events-none"
                >
                  <div className="flex justify-between items-center border-b border-[#2c324c]/40 pb-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">Y</div>
                      <div>
                        <span className="block text-xs font-bold text-white">Yashas M.</span>
                        <span className="block text-[8px] text-gray-400">Student • Grade 10-A</span>
                      </div>
                    </div>
                    <div className="bg-[#24316B] text-white px-2 py-0.5 rounded text-[8px] font-bold">Term 2 Active</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3.5 mb-4">
                    {[
                      { icon: Clock, label: 'Timetable', val: '8:30 AM', color: 'text-indigo-400' },
                      { icon: Award, label: 'GPA Score', val: '4.8 / 5.0', color: 'text-yellow-400' },
                      { icon: Bell, label: 'Alerts', val: '2 New', color: 'text-rose-400' }
                    ].map((stat, i) => (
                      <div key={i} className="bg-[#15192c] p-3 rounded-lg border border-[#2c324c]/40">
                        <stat.icon className={`h-4 w-4 ${stat.color} mb-1.5`} />
                        <span className="block text-[8px] text-gray-400">{stat.label}</span>
                        <span className="block text-xs font-bold text-white mt-0.5">{stat.val}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#15192c] p-4 rounded-xl border border-[#2c324c]/40 flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-center border-b border-[#2c324c]/30 pb-2">
                      <span className="text-[9px] font-bold text-white uppercase tracking-wider">Today's Lectures</span>
                      <span className="text-[8px] text-accent font-bold">5 Lectures</span>
                    </div>
                    <div className="space-y-2 mt-2">
                      {[
                        { time: '08:30 - 09:30', subject: 'Advanced Physics', room: 'Lab 2' },
                        { time: '09:30 - 10:30', subject: 'Computer Applications', room: 'IT Hall' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[10px] text-gray-300">
                          <span className="text-gray-400">{item.time}</span>
                          <span className="font-bold text-white">{item.subject}</span>
                          <span className="bg-[#24316B]/40 px-2 py-0.5 rounded text-[8px]">{item.room}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Teacher Marks Entry Screen */}
                <div 
                  ref={screenRefs[1]} 
                  className="absolute inset-0 p-5 flex flex-col bg-[#0c0e17] select-none pointer-events-none opacity-0"
                >
                  <div className="flex justify-between items-center border-b border-[#2c324c]/40 pb-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">TM</div>
                      <div>
                        <span className="block text-xs font-bold text-white">Trishul M.</span>
                        <span className="block text-[8px] text-gray-400">Teacher • Physics Dept</span>
                      </div>
                    </div>
                    <span className="bg-green-500/10 text-green-500 border border-green-500/35 px-2 py-0.5 rounded text-[8px] font-bold">Portal Synced</span>
                  </div>

                  <div className="flex-1 bg-[#15192c] rounded-xl border border-[#2c324c]/40 p-4 flex flex-col">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold text-white">Marks Entry Sheet: Physics</span>
                      <span className="text-[8px] text-gray-400">Class: Grade 10-A</span>
                    </div>
                    <div className="space-y-2 flex-1">
                      {[
                        { roll: '1001', name: 'Abhishek R.', score: '92', status: 'Passed' },
                        { roll: '1002', name: 'Divya P.', score: '88', status: 'Passed' },
                        { roll: '1003', name: 'Nikhil S.', score: '38', status: 'Fails' }
                      ].map((student, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[10px] border-b border-[#2c324c]/20 pb-2">
                          <span className="text-gray-400 w-8">{student.roll}</span>
                          <span className="font-bold text-white flex-1">{student.name}</span>
                          <span className="bg-black/35 px-2 py-1 rounded text-white font-mono text-[9px] w-10 text-center">{student.score}</span>
                          <span className={`text-[8px] font-bold px-2 py-0.5 rounded ml-2 ${
                            student.status === 'Passed' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                          }`}>{student.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Admin Fee Billing Screen */}
                <div 
                  ref={screenRefs[2]} 
                  className="absolute inset-0 p-5 flex flex-col bg-[#0c0e17] select-none pointer-events-none opacity-0"
                >
                  <div className="flex justify-between items-center border-b border-[#2c324c]/40 pb-3 mb-4">
                    <div>
                      <span className="block text-xs font-bold text-white">Fee Management Console</span>
                      <span className="block text-[8px] text-gray-400">Academic Year 2026-27</span>
                    </div>
                    <div className="flex items-center space-x-1 text-[9px] text-green-400 bg-green-500/10 px-2 py-0.5 rounded">
                      <TrendingUp className="h-3 w-3" />
                      <span>+12.4% Collection</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 flex-1">
                    <div className="bg-[#15192c] p-4 rounded-xl border border-[#2c324c]/40 flex flex-col justify-between">
                      <div>
                        <span className="block text-[8px] text-gray-400 uppercase font-bold tracking-wider">Total Collection</span>
                        <span className="text-lg font-bold text-white mt-1">₹4.82 Lakhs</span>
                      </div>
                      <div className="text-[8px] text-green-400">92% target achieved</div>
                    </div>

                    <div className="bg-[#15192c] p-4 rounded-xl border border-[#2c324c]/40 flex flex-col justify-between">
                      <span className="text-[9px] font-bold text-white mb-2 border-b border-[#2c324c]/20 pb-1 block">Quick Statistics</span>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[9px]">
                          <span className="text-gray-400">Total Outstanding</span>
                          <span className="text-red-400 font-semibold">₹38,000</span>
                        </div>
                        <div className="flex justify-between text-[9px]">
                          <span className="text-gray-400">Invoiced Students</span>
                          <span className="text-white font-semibold">824</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Unified Overview System Screen */}
                <div 
                  ref={screenRefs[3]} 
                  className="absolute inset-0 p-5 flex flex-col bg-[#0c0e17] select-none pointer-events-none opacity-0 justify-between"
                >
                  <div className="flex justify-between items-center border-b border-[#2c324c]/40 pb-3">
                    <div>
                      <span className="block text-xs font-bold text-white">Central Operations Center</span>
                      <span className="block text-[8px] text-gray-400">System Status • Healthy</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></div>
                      <span className="text-[8px] text-green-500 font-bold uppercase">Online</span>
                    </div>
                  </div>

                  {/* Visual Node Diagram mockup */}
                  <div className="my-3 flex-1 flex items-center justify-center relative">
                    {/* Glowing mesh wires mockup */}
                    <div className="absolute w-[200px] h-[1px] bg-gradient-to-r from-accent via-indigo-500 to-accent"></div>
                    <div className="absolute w-[1px] h-[100px] bg-[#2c324c]"></div>
                    
                    {/* Node items */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#24316B] border border-white/20 p-2.5 rounded-xl z-20 text-[10px] font-bold shadow-lg">
                      ERP CORE
                    </div>
                    <div className="absolute top-2 left-6 bg-[#15192c] border border-accent/40 px-2 py-1 rounded text-[8px] text-accent">
                      STUDENTS
                    </div>
                    <div className="absolute top-2 right-6 bg-[#15192c] border border-[#2c324c]/60 px-2 py-1 rounded text-[8px]">
                      PARENTS
                    </div>
                    <div className="absolute bottom-2 left-6 bg-[#15192c] border border-[#2c324c]/60 px-2 py-1 rounded text-[8px]">
                      TEACHERS
                    </div>
                    <div className="absolute bottom-2 right-6 bg-[#15192c] border border-accent/40 px-2 py-1 rounded text-[8px] text-accent">
                      ADMINS
                    </div>
                  </div>

                  <div className="bg-[#15192c] p-2.5 rounded-lg border border-[#2c324c]/40 text-[8px] text-center text-gray-400 font-light">
                    Protected under ISO-27001 Data Security Guidelines. Active Backup Enabled.
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Embedded horizontal bounce style for arrows */}
      <style>{`
        @keyframes bounceHorizontal {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
        .animate-bounce-horizontal {
          animation: bounceHorizontal 1s infinite;
        }
      `}</style>
    </div>
  );
};
