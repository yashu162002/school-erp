// src/features/landing/pages/LandingPage.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Import local assets
import Image1 from "../../../assets/1.webp";
import Image2 from "../../../assets/2.webp";
import Image3 from "../../../assets/3.webp";
import Image4 from "../../../assets/4.webp";
import Image5 from "../../../assets/5.webp";

// Import icons
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Award, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail,
  ChevronRight,
  Clock,
  Star,
  School,
  Target,
  Sparkles,
  ArrowRight,
  Menu,
  X,
  Shield,
  Zap,
  ExternalLink,
  CheckCircle,
  Building2,
  Bus,
  Utensils,
  Wifi,
  Monitor,
  TrendingUp,
  Trophy,
  ThumbsUp,
  Send,
  Loader2,
  Medal,
  ChevronLeft,
  Quote,
  Image as ImageIcon
} from 'lucide-react';
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaLinkedinIn
} from "react-icons/fa";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Import custom premium interactive components
import { PageLoader } from '../components/PageLoader';
import { WebGLHeroBackground } from '../components/WebGLHeroBackground';
import { DistortionImageReveal } from '../components/DistortionImageReveal';
import { ScrollStorytelling } from '../components/ScrollStorytelling';

// Contact / School configuration
const CONFIG = {
  contact: {
    phone: "8073845050",
    phoneAlt: "9844064320",
    email: "trishulschool1999@gmail.com",
    address: "KB Extension, Davanagere, Karnataka - 577002",
    hours: "Mon-Fri: 8:30 AM - 3:30 PM"
  },
  social: {
    facebook: "#",
    twitter: "#",
    instagram: "#",
    youtube: "#",
    linkedin: "#"
  }
};

const StatItem = ({ stat }) => {
  const [count, setCount] = React.useState(0);
  const [offset, setOffset] = React.useState(251.2);
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obj = { val: 0 };
    const circumference = 251.2;
    const targetOffset = circumference - (stat.progress / 100) * circumference;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(obj, {
          val: stat.number,
          duration: 2.2,
          ease: 'power2.out',
          onUpdate: () => {
            setCount(stat.number === 4.8 ? obj.val.toFixed(1) : Math.floor(obj.val));
          }
        });

        gsap.to({ val: circumference }, {
          val: targetOffset,
          duration: 2.2,
          ease: 'power2.out',
          onUpdate: function() {
            setOffset(this.targets()[0].val);
          }
        });
      }
    });

    return () => {
      trigger.kill();
    };
  }, [stat.number, stat.progress]);

  return (
    <div ref={containerRef} className="text-center flex flex-col items-center">
      {/* SVG progress indicator */}
      <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle 
            cx="48" 
            cy="48" 
            r="40" 
            stroke="rgba(255,255,255,0.08)" 
            strokeWidth="5" 
            fill="transparent" 
          />
          {/* Animated circle */}
          <circle 
            cx="48" 
            cy="48" 
            r="40" 
            stroke="#C98A00" 
            strokeWidth="5" 
            fill="transparent" 
            strokeDasharray="251.2"
            strokeDashoffset={offset}
          />
        </svg>
        
        {/* Centered Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <stat.icon className="h-6 w-6 text-accent" />
        </div>
      </div>

      {/* Counter Text */}
      <div className="text-3xl sm:text-4xl font-bold flex items-baseline justify-center">
        <span>{count}</span>
        <span className="text-accent ml-0.5">{stat.suffix}</span>
      </div>

      {/* Label */}
      <p className="text-[10px] sm:text-xs font-bold tracking-widest text-white/70 uppercase mt-2">
        {stat.label}
      </p>
    </div>
  );
};

const LandingPage = () => {
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Disable body scroll when loading screen is active
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoading]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [formErrors, setFormErrors] = useState({});
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Refs
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const heroSliderRef = useRef(null);
  const enrollBtnRef = useRef(null);
  const applyBtnRef = useRef(null);
  const ctaBtnRef = useRef(null);
  const noticeBoardRef = useRef(null);

  // Cards Ref map for 3D hover tilt
  const programCardRefs = [useRef(null), useRef(null), useRef(null)];

  // Memoized Data
  const heroSlides = useMemo(() => [
    {
      image: Image3,
      tagline: "Inspiring Academic Leadership",
      titlePart1: "Nurturing Minds,",
      titlePart2: "Shaping Futures",
      desc: "Providing a world-class educational foundation that challenges students to excel, innovate, and lead."
    },
    {
      image: Image2,
      tagline: "Smart Digital Infrastructure",
      titlePart1: "State-of-the-Art",
      titlePart2: "Computer Lab",
      desc: "Equipping students with modern computational skills and tech literacy for a digital-first global landscape."
    },
    {
      image: Image5,
      tagline: "Hands-on Scientific Learning",
      titlePart1: "Advanced",
      titlePart2: "Science Labs",
      desc: "Fostering analytical thinking, inquiry-based learning, and experimental physics, chemistry, and biology curricula."
    },
    {
      image: Image4,
      tagline: "Athletics & Character",
      titlePart1: "Sports &",
      titlePart2: "Physical Excellence",
      desc: "Promoting physical fitness, sportsmanship, and discipline through competitive sports and team events."
    },
    {
      image: Image1,
      tagline: "Discipline & Integrity",
      titlePart1: "Values-Based",
      titlePart2: "Daily Prayer",
      desc: "Instilling moral character, respect, mindfulness, and discipline from the start of every academic day."
    }
  ], []);

  const stats = useMemo(() => [
    { number: 850, suffix: "+", label: "Active Students", icon: Users, progress: 85 },
    { number: 96, suffix: "%", label: "Board Passing Rate", icon: Award, progress: 96 },
    { number: 15, suffix: "+", label: "Years of Legacy", icon: BookOpen, progress: 75 },
    { number: 4.8, suffix: "", label: "Parent Rating", icon: Star, progress: 96 }
  ], []);


  const programs = useMemo(() => [
    {
      title: "Kindergarten",
      age: "Ages 3-6",
      color: "from-primary/10 to-primary/5",
      borderColor: "border-primary/20 hover:border-accent",
      icon: School,
      features: ["Play-based interactive learning", "Social & sensory development", "Creative arts & foundational phonics"],
      description: "A warm, nurturing environment designed to foster curiosity and build essential early-childhood capabilities."
    },
    {
      title: "Primary School",
      age: "Grades 1-5",
      color: "from-accent/10 to-accent/5",
      borderColor: "border-accent/20 hover:border-primary",
      icon: BookOpen,
      features: ["Core logic & language curriculum", "Inquiry-led environmental studies", "Co-curricular activity blocks"],
      description: "Building academic confidence, critical conceptual understanding, and strong peer relationship skills."
    },
    {
      title: "High School",
      age: "Grades 6-10",
      color: "from-primary/10 to-primary/5",
      borderColor: "border-primary/20 hover:border-accent",
      icon: Award,
      features: ["State-board preparation protocols", "Advanced math & science labs", "Career counseling & leadership clubs"],
      description: "Preparing students for academic excellence and future careers."
    }
  ], []);

  const facilities = useMemo(() => [
    { icon: Building2, label: "Digital Classrooms", description: "Vibrant visual learning aids" },
    { icon: Monitor, label: "Advanced IT Center", description: "1-to-1 computer stations" },
    { icon: BookOpen, label: "Vast Library", description: "5000+ curriculum & fiction titles" },
    { icon: Bus, label: "Secure Transport", description: "GPS tracking & certified drivers" },
    { icon: Utensils, label: "Healthy Cafeteria", description: "Nutritious meal options" },
    { icon: Wifi, label: "Smart Campus", description: "Safe and monitored connectivity" }
  ], []);

  const notices = useMemo(() => [
    { id: 1, date: "15", month: "JUL", category: "Admissions", title: "Final Call for Admissions (Academic Year 2026-27)", important: true },
    { id: 2, date: "24", month: "JUL", category: "Academics", title: "Parent-Teacher Association Meet: Grade 6 to 10", important: false },
    { id: 3, date: "05", month: "AUG", category: "Science", title: "Annual Science & IT exhibition: Register projects by July 30", important: false },
    { id: 4, date: "12", month: "AUG", category: "Sports", title: "Selection trials for High School inter-school sports meet", important: false }
  ], []);

  const testimonials = useMemo(() => [
    {
      name: "Ramesh Kumar",
      role: "Parent of Grade 8 Student",
      text: "Trishul High School has transformed my daughter's academic path. The faculty does not just teach subjects; they develop character and problem-solving skills.",
      rating: 5,
      image: "https://ui-avatars.com/api/?name=Ramesh+Kumar&background=24316B&color=fff&size=80"
    },
    {
      name: "Sangeetha N.",
      role: "Parent of Grade 5 Student",
      text: "The infrastructure is stellar, but it's the care and dedication of the teaching staff that makes Trishul stand out. My son looks forward to school every single day.",
      rating: 5,
      image: "https://ui-avatars.com/api/?name=Sangeetha+N&background=C98A00&color=fff&size=80"
    },
    {
      name: "Prakash Rao",
      role: "Parent of Grade 10 Student",
      text: "As parents of a graduating student, we couldn't be happier with our choice. The guidance given for state-board preparation was highly structured and stress-free.",
      rating: 5,
      image: "https://ui-avatars.com/api/?name=Prakash+Rao&background=24316B&color=fff&size=80"
    },
    {
      name: "Deepa Patil",
      role: "Parent of Grade 3 Student",
      text: "The combination of moral values, smart labs, and physical training is fantastic. It's truly holistic education in Davanagere.",
      rating: 5,
      image: "https://ui-avatars.com/api/?name=Deepa+Patil&background=C98A00&color=fff&size=80"
    }
  ], []);

  const galleryImages = useMemo(() => [
    { url: Image3, title: "Our Campus Infrastructure", desc: "A modern, secure building designed for progressive learning." },
    { url: Image2, title: "Computer Lab Session", desc: "Interactive computer classes driven by active inquiry." },
    { url: Image5, title: "Practical Science Lab", desc: "Equipped with state-of-the-art experiment stations." },
    { url: Image4, title: "Sports Day Events", desc: "Competitive and recreational physical activity programs." },
    { url: Image1, title: "Morning Assembly", desc: "Cultivating focus, prayer, and moral values." }
  ], []);

  // Custom Split-Text Component for animations
  const splitTextWords = (text) => {
    return text.split(" ").map((word, i) => (
      <span key={i} className="inline-block overflow-hidden mr-2 md:mr-3">
        <span className="gsap-reveal-word inline-block origin-left transform">
          {word}
        </span>
      </span>
    ));
  };

  // Lenis & GSAP Animation Setup
  useEffect(() => {
    // 1. Initialize Lenis Smooth Scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // 2. Set Up GSAP Animations using context for safe cleanups in React
    const ctx = gsap.context(() => {
      // Sticky header scroll shadow
      ScrollTrigger.create({
        start: 'top -50',
        onUpdate: (self) => {
          setScrolled(self.scroll() > 50);
        }
      });

      // Hero Title Stagger Word Reveal
      gsap.fromTo('.gsap-reveal-word', 
        { yPercent: 100, rotate: 3, opacity: 0 },
        { 
          yPercent: 0, 
          rotate: 0, 
          opacity: 1, 
          duration: 1.2, 
          stagger: 0.08, 
          ease: 'power4.out',
          delay: 0.2
        }
      );

      // Hero subtitle, badge, and CTA button reveals
      gsap.fromTo('.hero-anim-item',
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: 'power3.out', delay: 0.6 }
      );

      // Slow random drifting bg shapes (Hero Section)
      gsap.to('.hero-blob-1', {
        x: 'random(-40, 40)',
        y: 'random(-40, 40)',
        scale: 'random(0.95, 1.1)',
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
      gsap.to('.hero-blob-2', {
        x: 'random(-45, 45)',
        y: 'random(-45, 45)',
        scale: 'random(0.9, 1.05)',
        duration: 11,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // About Section: Title reveal + stagger cards
      gsap.from('.about-stagger-item', {
        scrollTrigger: {
          trigger: '#about',
          start: 'top 80%',
        },
        opacity: 0,
        y: 45,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
      });

      // Principal's Message & Notice Board Stagger
      gsap.from('.principal-card-anim', {
        scrollTrigger: {
          trigger: '#principal-notice',
          start: 'top 80%',
        },
        opacity: 0,
        x: -40,
        duration: 1,
        ease: 'power3.out'
      });

      gsap.from('.notice-anim-item', {
        scrollTrigger: {
          trigger: '#principal-notice',
          start: 'top 80%',
        },
        opacity: 0,
        x: 40,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out'
      });

      // Programs Stagger
      gsap.from('.program-card-anim', {
        scrollTrigger: {
          trigger: '#programs',
          start: 'top 80%',
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
      });

      // Gallery Images Grid - Scroll Reveal
      gsap.from('.gallery-grid-item', {
        scrollTrigger: {
          trigger: '#gallery',
          start: 'top 80%',
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power2.out'
      });

      // Gallery Parallax effect
      const parallaxImages = gsap.utils.toArray('.parallax-image');
      parallaxImages.forEach((img) => {
        gsap.fromTo(img, 
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: img.parentElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          }
        );
      });

      // Testimonial Scroll-Trigger Horizontal stack on desktop (md+)
      ScrollTrigger.matchMedia({
        "(min-width: 768px)": function() {
          const wrapper = document.querySelector('.testimonials-slider');
          if (wrapper) {
            gsap.to(wrapper, {
              x: () => -(wrapper.scrollWidth - window.innerWidth + 120),
              ease: 'none',
              scrollTrigger: {
                trigger: '#testimonials',
                pin: true,
                scrub: 1.2,
                start: 'top 15%',
                end: () => `+=${wrapper.scrollWidth - window.innerWidth + 200}`
              }
            });
          }
        }
      });

      // Footer stagger columns entrance
      gsap.from('.footer-anim-col', {
        scrollTrigger: {
          trigger: 'footer',
          start: 'top 90%',
        },
        y: 35,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out'
      });
    }, containerRef);

    // Auto-advance hero slides every 5s
    const heroTimer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => {
      clearInterval(heroTimer);
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
      ctx.revert();
    };
  }, [heroSlides.length]);

  // 3D Card Hover Tilt Effects
  const handleMouseMove3D = (e, index) => {
    const card = programCardRefs[index].current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Normalize coordinates (-0.5 to 0.5) and multiply by tilt limit (e.g. 10 degrees)
    const rotateY = (x / (rect.width / 2)) * 12;
    const rotateX = -(y / (rect.height / 2)) * 12;

    gsap.to(card, {
      rotateY,
      rotateX,
      transformPerspective: 1000,
      scale3d: 1.02,
      boxShadow: '0 20px 40px rgba(36,49,107,0.15)',
      duration: 0.4,
      ease: 'power3.out'
    });
  };

  const handleMouseLeave3D = (index) => {
    const card = programCardRefs[index].current;
    if (!card) return;
    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      scale3d: 1,
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
      duration: 0.5,
      ease: 'power3.out'
    });
  };

  // Magnetic Button Hover Effects
  const handleMagneticHover = (e, ref) => {
    const button = ref.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Move button 35% of vector distance
    gsap.to(button, {
      x: x * 0.35,
      y: y * 0.35,
      scale: 1.05,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const handleMagneticLeave = (ref) => {
    const button = ref.current;
    if (!button) return;
    gsap.to(button, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: 'elastic.out(1.1, 0.4)'
    });
  };

  // Scroll to anchor handler
  const scrollToSection = useCallback((id) => {
    const element = document.getElementById(id);
    if (element) {
      // Calculate top position with header offset
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsMenuOpen(false);
    }
  }, []);

  // Form Handlers
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [formErrors]);

  const validateForm = useCallback(() => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Full Name is required';
    if (!formData.email.trim()) errors.email = 'Email Address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email address format';
    }
    if (!formData.message.trim()) errors.message = 'Message text is required';
    return errors;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    // Simulate contact form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setFormData({ name: '', email: '', phone: '', message: '' });
    alert('Message sent successfully! The Trishul administration will get back to you shortly.');
  }, [formData, validateForm]);

  // Gallery lightbox controls
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextLightboxImage = () => {
    setLightboxIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevLightboxImage = () => {
setLightboxIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-background font-sans antialiased text-foreground overflow-x-hidden">
      {isLoading && <PageLoader onComplete={() => setIsLoading(false)} />}
      
      {/* Skip to Content */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-surface focus:p-4 focus:shadow-xl focus:border focus:border-accent">
        Skip to main content
      </a>

      {/* Top Utility Bar */}
      <div className="hidden md:block bg-primary text-white/90 text-xs py-2.5 border-b border-accent/30 font-medium">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <a href={`tel:${CONFIG.contact.phone}`} className="hover:text-accent transition-colors flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-accent" /> 
                <span>+91 {CONFIG.contact.phone}</span>
              </a>
              <span className="text-white/20">|</span>
              <a href={`mailto:${CONFIG.contact.email}`} className="hover:text-accent transition-colors flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-accent" /> 
                <span>{CONFIG.contact.email}</span>
              </a>
              <span className="text-white/20">|</span>
              <span className="text-white/70 flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-accent" /> 
                <span>{CONFIG.contact.hours}</span>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white/50 text-[10px] tracking-wider uppercase font-semibold">Connect with us:</span>
              <a href={CONFIG.social.facebook} className="hover:text-accent transition-colors" aria-label="Facebook">
                <FaFacebookF className="h-3.5 w-3.5" />
              </a>
              <a href={CONFIG.social.twitter} className="hover:text-accent transition-colors" aria-label="Twitter">
                <FaTwitter className="h-3.5 w-3.5" />
              </a>
              <a href={CONFIG.social.instagram} className="hover:text-accent transition-colors" aria-label="Instagram">
                <FaInstagram className="h-3.5 w-3.5" />
              </a>
              <a href={CONFIG.social.youtube} className="hover:text-accent transition-colors" aria-label="YouTube">
                <FaYoutube className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header 
        ref={headerRef}
        className={`sticky top-0 z-50 transition-all duration-300 w-full ${
          scrolled ? 'bg-surface/95 backdrop-blur-md shadow-md py-3' : 'bg-surface py-5'
        } border-b border-border`}
        role="banner"
      >
        <div className="container mx-auto px-4 max-w-7xl flex justify-between items-center">
          
          {/* Logo & School Name */}
          <Link to="/" className="flex items-center space-x-3 group" aria-label="Trishul High School Home">
            <div className="relative">
              <div className="bg-primary p-2.5 rounded-xl border border-accent/40 shadow-inner group-hover:scale-105 transition-transform duration-300">
                <GraduationCap className="h-7 w-7 text-accent" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-ping"></div>
            </div>
            <div>
              <span className="text-xl font-bold text-primary tracking-tight block leading-tight">Trishul High School</span>
              <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase block">Davanagere • Est. 2010</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1" role="navigation" aria-label="Primary navigation">
            {['About', 'Curriculum', 'Facilities', 'Gallery', 'Testimonials', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item === 'Curriculum' ? 'programs' : item.toLowerCase())}
                className="px-4 py-2 text-xs font-bold tracking-wider uppercase text-primary/80 hover:text-accent transition-colors relative group cursor-pointer"
              >
                {item}
                <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-accent group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
              </button>
            ))}
          </nav>

          {/* Call-to-action buttons */}
          <div className="flex items-center space-x-3">
            <Link 
              to="/login" 
              className="hidden sm:block px-5 py-2.5 text-xs font-bold tracking-wider uppercase text-primary border border-primary hover:bg-primary hover:text-white rounded-lg transition-all duration-300 active:scale-[0.97]"
              aria-label="Login to portal"
            >
              Portal Login
            </Link>
            <Link 
              to="/login" 
              ref={applyBtnRef}
              onMouseMove={(e) => handleMagneticHover(e, applyBtnRef)}
              onMouseLeave={() => handleMagneticLeave(applyBtnRef)}
              className="px-5 py-2.5 text-xs font-bold tracking-wider uppercase bg-accent text-accent-foreground rounded-lg transition-all duration-300 shadow-md hover:shadow-lg border border-accent/20 active:scale-[0.97]"
              aria-label="Online application"
            >
              Apply Online
            </Link>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors border border-border"
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-6 w-6 text-primary" /> : <Menu className="h-6 w-6 text-primary" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-surface border-b border-border shadow-xl py-4 px-6 animate-fadeIn">
            <nav className="flex flex-col space-y-3" role="navigation">
              {['About', 'Curriculum', 'Facilities', 'Gallery', 'Testimonials', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item === 'Curriculum' ? 'programs' : item.toLowerCase())}
                  className="py-2.5 text-sm font-bold tracking-wider uppercase text-left text-primary hover:text-accent border-b border-border/40"
                >
                  {item}
                </button>
              ))}
              <div className="flex flex-col space-y-2 pt-3">
                <Link to="/login" className="py-3 text-center text-sm font-bold tracking-wider uppercase border border-primary text-primary rounded-lg active:scale-[0.98]">Portal Login</Link>
                <Link to="/login" className="py-3 text-center text-sm font-bold tracking-wider uppercase bg-accent text-accent-foreground rounded-lg active:scale-[0.98]">Apply Online</Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content Sections */}
      <main id="main-content">
        {/* Hero Section: Slider with Fullscreen WebGL particles & 3D Distortion Image Reveal card */}
        <section 
          ref={heroSliderRef}
          className="relative min-h-[85vh] lg:min-h-screen flex items-center overflow-hidden bg-[#10131e]" 
          aria-label="Welcome banner"
        >
          {/* WebGL Particle Background */}
          {!isLoading && <WebGLHeroBackground />}

          {/* Subtle Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#10131e]/20 via-transparent to-[#10131e]/50 z-20 pointer-events-none"></div>

          {/* Decorative floating blurred blobs (GSAP animated) */}
          <div className="absolute inset-0 z-25 pointer-events-none overflow-hidden">
            <div className="hero-blob-1 absolute -top-16 -right-16 w-80 h-80 rounded-full bg-accent/10 blur-3xl"></div>
            <div className="hero-blob-2 absolute bottom-12 left-1/3 w-96 h-96 rounded-full bg-primary/5 blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 max-w-7xl relative z-30 py-20 text-white w-full">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Text & CTAs */}
              <div className="lg:col-span-7 max-w-2xl text-left">
                
                {/* Badge */}
                <div className="hero-anim-item inline-flex items-center bg-accent/25 text-accent px-4 py-1.5 shadow-sm border-l-4 border-accent rounded-r-lg mb-6">
                  <Sparkles className="h-4 w-4 mr-2 text-accent" />
                  <span className="text-[10px] font-bold tracking-widest uppercase">Admissions Open • Academic Year 2026-27</span>
                </div>
                
                {/* Tagline: Dual Color with premium glow contrast */}
                <div className="hero-anim-item mb-3 uppercase font-bold text-xs tracking-[0.25em]">
                  <span className="text-white">
                    {heroSlides[currentHeroIndex].tagline.split(" ")[0]}
                  </span>{" "}
                  <span className="text-accent">
                    {heroSlides[currentHeroIndex].tagline.split(" ").slice(1).join(" ")}
                  </span>
                </div>

                {/* Title: Dual Color (Part 1 White, Part 2 Gold/Accent) */}
                <div className="mb-6">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
                    <span className="text-white mr-3 inline-block">
                      {splitTextWords(heroSlides[currentHeroIndex].titlePart1)}
                    </span>
                    <span className="text-accent inline-block">
                      {splitTextWords(heroSlides[currentHeroIndex].titlePart2)}
                    </span>
                  </h1>
                </div>
                
                {/* Description */}
                <p className="hero-anim-item text-white/80 text-base md:text-lg mb-10 leading-relaxed font-light">
                  {heroSlides[currentHeroIndex].desc}
                </p>
                
                {/* Buttons */}
                <div className="hero-anim-item flex flex-wrap gap-4">
                  <Link 
                    to="/login"
                    ref={enrollBtnRef}
                    onMouseMove={(e) => handleMagneticHover(e, enrollBtnRef)}
                    onMouseLeave={() => handleMagneticLeave(enrollBtnRef)}
                    className="px-8 py-4 bg-accent text-accent-foreground hover:bg-accent/90 font-bold tracking-wider uppercase text-xs rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center border border-accent/20 active:scale-[0.97]"
                  >
                    Enroll Your Child
                    <ArrowRight className="ml-2 h-4 w-4 text-accent-foreground" />
                  </Link>
                  <button 
                    onClick={() => scrollToSection('about')}
                    className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold tracking-wider uppercase text-xs rounded-lg shadow-sm transition-all duration-300 backdrop-blur-sm active:scale-[0.97]"
                  >
                    Discover More
                  </button>
                </div>

              </div>

              {/* Right Column: 3D Mask reveal image card */}
              <div className="lg:col-span-5 w-full flex flex-col items-center">
                <div className="w-full max-w-[460px] aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(201,138,0,0.12)] border border-accent/20 bg-[#15192c] relative">
                  <DistortionImageReveal 
                    key={currentHeroIndex}
                    src={heroSlides[currentHeroIndex].image} 
                    alt={heroSlides[currentHeroIndex].tagline}
                  />
                </div>

                {/* Slider Indicators centered under the image card on mobile, right-aligned on desktop */}
                <div className="flex space-x-2 mt-6">
                  {heroSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentHeroIndex(index)}
                      className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                        index === currentHeroIndex ? 'w-8 bg-accent' : 'w-2.5 bg-white/40 hover:bg-white/60'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Breaking News Marquee */}
        <div className="bg-[#1a1a1a] text-white py-3.5 border-y border-accent/30 overflow-hidden select-none">
          <div className="container mx-auto px-4 max-w-7xl flex items-center">
            <div className="flex items-center bg-accent text-accent-foreground px-4 py-1 rounded-md mr-6 shadow-sm z-10">
              <Zap className="h-4 w-4 mr-1.5 fill-current" />
              <span className="text-[10px] font-bold tracking-widest uppercase whitespace-nowrap">Announcements</span>
            </div>
            <div className="relative flex-1 overflow-hidden flex">
              <div className="animate-marquee whitespace-nowrap text-xs tracking-wider text-white/90 font-medium flex-shrink-0">
                {notices.map((n) => (
                  <span key={n.id} className="mx-12 hover:text-accent transition-colors cursor-pointer">
                    <span className="text-accent font-bold">[{n.category}]</span> {n.title}
                  </span>
                ))}
              </div>
              <div className="animate-marquee whitespace-nowrap text-xs tracking-wider text-white/90 font-medium flex-shrink-0" aria-hidden="true">
                {notices.map((n) => (
                  <span key={`dup-${n.id}`} className="mx-12 hover:text-accent transition-colors cursor-pointer">
                    <span className="text-accent font-bold">[{n.category}]</span> {n.title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* About Section: Core Strengths (Stagger entrance) */}
        <section id="about" className="py-24 bg-surface relative overflow-hidden">
          <div className="absolute inset-y-0 right-0 w-1/3 bg-muted/40 rounded-l-3xl -z-10"></div>
          
          <div className="container mx-auto px-4 max-w-7xl">
            
            {/* Header Title */}
            <div className="about-stagger-item text-center max-w-2xl mx-auto mb-16">
              <span className="bg-primary/5 text-primary border border-primary/20 px-4 py-1.5 rounded-md text-[10px] font-bold tracking-widest uppercase mb-4 inline-block">
                Who We Are
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4 tracking-tight leading-tight">
                Nurturing Character, Fostering Innovation
              </h2>
              <p className="text-muted-foreground text-base">
                Trishul High School integrates classical values with advanced technological infrastructure to build competent, responsible global citizens.
              </p>
            </div>

            {/* Core Pillars Cards (Staggered on Scroll) */}
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: GraduationCap,
                  title: "Academic Rigor",
                  desc: "Concept-driven instruction structured to exceed state-board requirements, ensuring excellence in competitive performance."
                },
                {
                  icon: Target,
                  title: "Holistic Development",
                  desc: "Equal emphasis on sports, lab experiments, visual arts, and leadership activities to develop balanced mindsets."
                },
                {
                  icon: Shield,
                  title: "Safe & Active Campus",
                  desc: "Safe facilities, GPS-tracked transportation, and active digital security, creating a worry-free environment for kids."
                }
              ].map((card, i) => (
                <div 
                  key={i}
                  className="about-stagger-item bg-surface p-8 border border-border hover:border-accent hover:shadow-2xl hover:shadow-accent/5 rounded-xl transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-accent scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom"></div>
                  <div className="bg-primary/5 w-14 h-14 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                    <card.icon className="h-7 w-7 text-primary group-hover:text-accent transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">{card.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Scroll Storytelling Section */}
        <ScrollStorytelling />

        {/* Dual Message & Notices Section (GSAP Reveal) */}
        <section id="principal-notice" className="py-24 bg-muted/40 border-y border-border">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid lg:grid-cols-12 gap-12 items-start">
              
              {/* Message from Principal (Left - Slide in) */}
              <div className="principal-card-anim lg:col-span-7 bg-surface p-8 sm:p-10 border border-border hover:border-accent/40 rounded-2xl shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 relative">
                <div className="absolute top-6 right-6 text-primary/10">
                  <Quote className="h-16 w-16 fill-current" />
                </div>
                <span className="text-accent uppercase font-bold text-[10px] tracking-widest block mb-2">Welcome Address</span>
                <h3 className="text-2xl sm:text-3xl font-bold text-primary mb-6">From the Principal's Desk</h3>
                
                <div className="flex flex-col sm:flex-row gap-6 items-start mb-6">
                  {/* Mock profile picture for principal */}
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xl font-bold border-2 border-white shadow-md flex-shrink-0">
                    TM
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 italic">
                      "At Trishul High School, our core philosophy centers on opening doors of intellectual curiosity and building robust foundations. We believe discipline is not a restriction, but a pathway to personal liberty. Our state-of-the-art scientific and IT laboratories empower children to apply textbook theory directly to live experimentation."
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed font-light">
                      We invite you to explore our campus features, review our academic track records, and secure your child's seat in an ecosystem designed to accelerate success.
                    </p>
                  </div>
                </div>

                <div className="border-t border-border/80 pt-4 flex justify-between items-center">
                  <div>
                    <h5 className="font-bold text-primary text-sm">Trishul M.</h5>
                    <p className="text-xs text-muted-foreground">Principal, Trishul High School</p>
                  </div>
                  <div className="font-serif italic text-primary/60 text-lg tracking-wider">
                    Trishul M.
                  </div>
                </div>
              </div>

              {/* Notice Board (Right - Slide in / Stagger items) */}
              <div ref={noticeBoardRef} className="lg:col-span-5 space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-xl font-bold text-primary flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-accent" />
                    Notice Board
                  </h3>
                  <Link to="/login" className="text-xs font-bold text-accent hover:underline flex items-center">
                    Portal view <ChevronRight className="h-3 w-3 ml-0.5" />
                  </Link>
                </div>

                <div className="space-y-4">
                  {notices.map((notice) => (
                    <div 
                      key={notice.id}
                      className="notice-anim-item bg-surface p-4 border border-border rounded-xl hover:border-accent hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 flex items-start space-x-4"
                    >
                      {/* Date Badge */}
                      <div className="bg-primary/5 border border-primary/10 rounded-lg p-2.5 w-14 text-center flex-shrink-0">
                        <span className="block text-lg font-bold text-primary leading-none">{notice.date}</span>
                        <span className="block text-[8px] font-bold text-accent tracking-widest mt-0.5">{notice.month}</span>
                      </div>
                      
                      {/* Title & Tag */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase">
                            {notice.category}
                          </span>
                          {notice.important && (
                            <span className="bg-red-500/10 text-red-600 px-2 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase animate-pulse">
                              Important
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-primary hover:text-accent cursor-pointer transition-colors line-clamp-2">
                          {notice.title}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Academic Curriculum Section: 3D Tilt Card Effects */}
        <section id="programs" className="py-24 bg-surface">
          <div className="container mx-auto px-4 max-w-7xl">
            
            {/* Title */}
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="bg-accent/10 text-accent border border-accent/20 px-4 py-1.5 rounded-md text-[10px] font-bold tracking-widest uppercase mb-4 inline-block">
                Academic Offerings
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4 tracking-tight">
                Curriculum Structured for Growth
              </h2>
              <p className="text-muted-foreground text-sm">
                Providing comprehensive curricula starting from early development stages to rigorous state-board preparatory matrices.
              </p>
            </div>

            {/* 3D hover cards */}
            <div className="grid md:grid-cols-3 gap-8">
              {programs.map((program, index) => (
                <div
                  key={index}
                  ref={programCardRefs[index]}
                  onMouseMove={(e) => handleMouseMove3D(e, index)}
                  onMouseLeave={() => handleMouseLeave3D(index)}
                  className="program-card-anim bg-surface border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col h-full transform-gpu"
                >
                  <div className={`p-8 bg-gradient-to-br ${program.color} border-b border-border/60 relative`}>
                    <div className="absolute top-4 right-4 opacity-10">
                      <program.icon className="h-16 w-16 text-primary" />
                    </div>
                    <span className="text-[10px] font-bold text-accent tracking-widest uppercase block mb-1">
                      {program.age}
                    </span>
                    <h3 className="text-2xl font-bold text-primary">{program.title}</h3>
                    <p className="text-muted-foreground text-xs mt-3 leading-relaxed">
                      {program.description}
                    </p>
                  </div>
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <ul className="space-y-3.5 mb-8">
                      {program.features.map((feature, i) => (
                        <li key={i} className="flex items-start text-xs text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-accent mr-3 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link 
                      to="/login" 
                      className="inline-flex items-center text-primary hover:text-accent text-xs font-bold tracking-wider uppercase transition-colors group"
                    >
                      Enquire Program 
                      <ArrowRight className="ml-2 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Statistics count up and animated SVGs */}
        <section id="statistics" className="py-20 bg-primary text-white relative overflow-hidden">
          {/* Subtle floating background circles */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
            <div className="stat-float-blob absolute -top-10 -left-10 w-64 h-64 rounded-full bg-accent/20 blur-2xl"></div>
            <div className="stat-float-blob absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-white/10 blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              
              {stats.map((stat, i) => (
                <StatItem key={i} stat={stat} />
              ))}

            </div>
          </div>
        </section>

        {/* Premium Campus Facilities */}
        <section id="facilities" className="py-24 bg-muted/40">
          <div className="container mx-auto px-4 max-w-7xl">
            
            {/* Title */}
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="bg-primary/5 text-primary border border-primary/20 px-4 py-1.5 rounded-md text-[10px] font-bold tracking-widest uppercase mb-4 inline-block">
                Campus Resources
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4 tracking-tight">
                Academic & Support Facilities
              </h2>
              <p className="text-muted-foreground text-sm">
                Creating an environment where infrastructure enables education and security keeps minds focused on progress.
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {facilities.map((fac, idx) => (
                <div 
                  key={idx} 
                  className="bg-surface p-6 border border-border rounded-xl hover:border-accent hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex items-start space-x-4 group"
                >
                  <div className="bg-primary/5 p-3 rounded-lg group-hover:bg-primary transition-colors duration-300">
                    <fac.icon className="h-6 w-6 text-primary group-hover:text-accent transition-colors duration-300" />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary text-sm sm:text-base mb-1">{fac.label}</h4>
                    <p className="text-muted-foreground text-xs leading-relaxed">{fac.description}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Interactive Campus Gallery with Parallax & Lightbox */}
        <section id="gallery" className="py-24 bg-surface">
          <div className="container mx-auto px-4 max-w-7xl">
            
            {/* Title */}
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="bg-accent/10 text-accent border border-accent/20 px-4 py-1.5 rounded-md text-[10px] font-bold tracking-widest uppercase mb-4 inline-block">
                Vibrant Campus Life
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4 tracking-tight">
                Our Campus In Focus
              </h2>
              <p className="text-muted-foreground text-sm">
                A visual showcase of daily life, infrastructure, assemblies, and athletic days at Trishul.
              </p>
            </div>

            {/* Responsive grid displaying assets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {galleryImages.map((image, index) => (
                <div 
                  key={index}
                  onClick={() => openLightbox(index)}
                  className={`gallery-grid-item relative overflow-hidden rounded-xl shadow-sm border border-border group cursor-pointer aspect-video ${
                    index === 0 ? 'sm:col-span-2' : ''
                  }`}
                >
                  {/* Distortion Image Reveal container */}
                  <div className="absolute inset-0 overflow-hidden">
                    <DistortionImageReveal 
                      src={image.url} 
                      alt={image.title} 
                    />
                  </div>
                  
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>
                  
                  {/* Glassmorphic Floating Caption Card */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 text-white bg-primary/45 backdrop-blur-md border border-white/10 rounded-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-30 shadow-lg">
                    <h4 className="font-bold text-xs sm:text-sm flex items-center">
                      <ImageIcon className="h-4 w-4 mr-2 text-accent" />
                      {image.title}
                    </h4>
                    <p className="text-[10px] sm:text-xs text-white/80 mt-1">{image.desc}</p>
                  </div>
                  
                  {/* Circular Zoom Icon */}
                  <div className="absolute top-4 right-4 bg-white/25 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 hover:bg-white/40 transition-all duration-300 z-30 shadow-md">
                    <ExternalLink className="h-4 w-4 text-white" />
                  </div>
                </div>
              ))}

            </div>

          </div>
        </section>

        {/* Lightbox Dialog Modal */}
        {lightboxOpen && (
          <div 
            onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-black/98 flex items-center justify-center p-4 select-none cursor-zoom-out"
          >
            {/* Close Button */}
            <button 
              onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
              className="absolute top-6 right-6 text-white hover:text-accent p-3 bg-white/10 hover:bg-white/25 rounded-full transition-all duration-300 z-50 cursor-pointer"
              aria-label="Close image lightbox"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Left navigation arrow */}
            <button 
              onClick={(e) => { e.stopPropagation(); prevLightboxImage(); }}
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:text-accent p-3 bg-white/10 hover:bg-white/25 rounded-full transition-all duration-300 z-50 cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Lightbox image content */}
            <div 
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl max-h-[80vh] flex flex-col items-center cursor-default z-40"
            >
              <img 
                src={galleryImages[lightboxIndex].url} 
                alt={galleryImages[lightboxIndex].title} 
                className="max-w-full max-h-[70vh] object-contain rounded-lg border border-white/10 shadow-2xl"
              />
              <div className="text-center mt-6 text-white max-w-lg select-text">
                <h4 className="text-lg font-bold text-accent">{galleryImages[lightboxIndex].title}</h4>
                <p className="text-sm text-gray-300 mt-1.5 leading-relaxed">{galleryImages[lightboxIndex].desc}</p>
              </div>
            </div>

            {/* Right navigation arrow */}
            <button 
              onClick={(e) => { e.stopPropagation(); nextLightboxImage(); }}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:text-accent p-3 bg-white/10 hover:bg-white/25 rounded-full transition-all duration-300 z-50 cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Image counter */}
            <div className="absolute bottom-6 bg-white/10 px-4 py-1.5 rounded-full text-white text-xs font-semibold">
              {lightboxIndex + 1} / {galleryImages.length}
            </div>
          </div>
        )}



        {/* Testimonials horizontal scrolling stack on desktop, regular on mobile */}
        <section id="testimonials" className="py-24 bg-muted/40 border-y border-border overflow-hidden">
          <div className="container mx-auto px-4 max-w-7xl">
            
            {/* Title */}
            <div className="max-w-2xl mb-12 md:mb-16">
              <span className="bg-primary/5 text-primary border border-primary/20 px-4 py-1.5 rounded-md text-[10px] font-bold tracking-widest uppercase mb-4 inline-block">
                Trust Indicators
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4 tracking-tight">
                Feedback from Parents
              </h2>
              <p className="text-muted-foreground text-sm">
                Hear what our school community thinks about academic rigor, facilities, and staff commitment.
              </p>
            </div>

            {/* Scrolling wrapper for GSAP pin animation */}
            <div className="testimonials-slider flex flex-col md:flex-row gap-6 md:w-[150vw]">
              {testimonials.map((test, index) => (
                <div 
                  key={index}
                  className="bg-surface p-8 border border-border rounded-2xl shadow-sm md:w-[350px] flex-shrink-0 flex flex-col justify-between hover:border-accent hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300"
                >
                  <div>
                    {/* Stars */}
                    <div className="flex text-accent mb-4">
                      {[...Array(test.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    {/* Quote text */}
                    <p className="text-muted-foreground text-xs leading-relaxed italic mb-6">
                      "{test.text}"
                    </p>
                  </div>

                  {/* Profile info */}
                  <div className="flex items-center space-x-3 pt-4 border-t border-border/80">
                    <img 
                      src={test.image} 
                      alt={test.name} 
                      className="w-12 h-12 rounded-full border border-accent/25"
                      loading="lazy"
                    />
                    <div>
                      <h4 className="font-bold text-primary text-xs sm:text-sm">{test.name}</h4>
                      <p className="text-[10px] text-muted-foreground font-medium">{test.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Admissions CTA Section: Magnetic Button & Glow Reveal */}
        <section className="py-24 bg-primary text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl -translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl translate-x-32 translate-y-32"></div>
          </div>
          
          <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
            <div className="bg-accent/15 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border border-accent/30 shadow-inner">
              <Zap className="h-7 w-7 text-accent" />
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
              Ready to Accelerate Your Child's Education?
            </h2>
            
            <p className="text-white/80 text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed font-light">
              Admissions are open for the academic year 2026-27. Enroll early to secure positions in our smart classrooms and specialized curriculum blocks.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/login"
                ref={ctaBtnRef}
                onMouseMove={(e) => handleMagneticHover(e, ctaBtnRef)}
                onMouseLeave={() => handleMagneticLeave(ctaBtnRef)}
                className="px-10 py-4 bg-accent text-accent-foreground font-bold tracking-wider uppercase text-xs rounded-lg shadow-xl hover:shadow-2xl border border-accent/20 transition-all duration-300 active:scale-[0.97]"
              >
                Apply for Admission
              </Link>
              <button 
                onClick={() => scrollToSection('contact')}
                className="px-10 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/50 font-bold tracking-wider uppercase text-xs rounded-lg transition-all duration-300 active:scale-[0.97]"
              >
                Get Callback Support
              </button>
            </div>
          </div>
        </section>

        {/* Contact & Location */}
        <section id="contact" className="py-24 bg-surface">
          <div className="container mx-auto px-4 max-w-7xl">
            
            {/* Title */}
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="bg-primary/5 text-primary border border-primary/20 px-4 py-1.5 rounded-md text-[10px] font-bold tracking-widest uppercase mb-4 inline-block">
                Locate & Contact
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4 tracking-tight">
                Connect With Our Team
              </h2>
              <p className="text-muted-foreground text-sm">
                Have enquiries about academic calendars, fee structures, or boarding protocols? Drop us a line.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              
              {/* Info columns */}
              <div className="space-y-6">
                {[
                  {
                    icon: MapPin,
                    title: "Campus Address",
                    content: (
                      <>
                        Trishul Campus, KB Extension,<br />
                        Near Trishul Kala Bhavana, Davanagere,<br />
                        Karnataka - 577002
                      </>
                    ),
                    action: "Get Directions",
                    href: "https://maps.google.com"
                  },
                  {
                    icon: Phone,
                    title: "Call Administration",
                    content: (
                      <>
                        <a href={`tel:${CONFIG.contact.phone}`} className="hover:text-accent transition-colors font-bold block">
                          +91 {CONFIG.contact.phone}
                        </a>
                        <a href={`tel:${CONFIG.contact.phoneAlt}`} className="hover:text-accent transition-colors font-bold block mt-1">
                          +91 {CONFIG.contact.phoneAlt}
                        </a>
                        <p className="text-xs text-muted-foreground mt-2">{CONFIG.contact.hours}</p>
                      </>
                    )
                  },
                  {
                    icon: Mail,
                    title: "Email Channels",
                    content: (
                      <>
                        <a href={`mailto:${CONFIG.contact.email}`} className="hover:text-accent transition-colors font-bold block">
                          {CONFIG.contact.email}
                        </a>
                        <p className="text-xs text-muted-foreground mt-1">Direct replies within 24 hours.</p>
                      </>
                    )
                  }
                ].map((item, index) => (
                  <div 
                    key={index} 
                    className="p-6 bg-muted/30 border-l-4 border-accent rounded-r-xl flex items-start space-x-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="bg-primary/5 p-3 rounded-lg">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary text-sm sm:text-base mb-1">{item.title}</h4>
                      <div className="text-muted-foreground text-xs leading-relaxed">{item.content}</div>
                      {item.action && (
                        <a 
                          href={item.href}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center mt-3 text-accent hover:underline text-xs font-bold uppercase tracking-wider"
                        >
                          {item.action} <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Form columns */}
              <div className="bg-muted/30 p-8 border border-border rounded-2xl">
                <h3 className="text-xl font-bold text-primary mb-6">Send an Online Enquiry</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-primary font-bold text-[10px] tracking-wider uppercase mb-1">
                      Full Name *
                    </label>
                    <input 
                      id="name"
                      name="name"
                      type="text" 
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${
                        formErrors.name ? 'border-red-500' : 'border-border'
                      } focus:outline-none focus:ring-1 focus:ring-accent rounded-lg bg-surface text-xs`}
                      placeholder="Enter full name"
                      aria-invalid={!!formErrors.name}
                      required
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-[10px] text-red-500 font-bold">{formErrors.name}</p>
                    )}
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-primary font-bold text-[10px] tracking-wider uppercase mb-1">
                        Email Address *
                      </label>
                      <input 
                        id="email"
                        name="email"
                        type="email" 
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border ${
                          formErrors.email ? 'border-red-500' : 'border-border'
                        } focus:outline-none focus:ring-1 focus:ring-accent rounded-lg bg-surface text-xs`}
                        placeholder="parent@example.com"
                        aria-invalid={!!formErrors.email}
                        required
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-[10px] text-red-500 font-bold">{formErrors.email}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-primary font-bold text-[10px] tracking-wider uppercase mb-1">
                        Contact Number
                      </label>
                      <input 
                        id="phone"
                        name="phone"
                        type="tel" 
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-border focus:outline-none focus:ring-1 focus:ring-accent rounded-lg bg-surface text-xs"
                        placeholder="Enter mobile number"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-primary font-bold text-[10px] tracking-wider uppercase mb-1">
                      Enquiry Message *
                    </label>
                    <textarea 
                      id="message"
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${
                        formErrors.message ? 'border-red-500' : 'border-border'
                      } focus:outline-none focus:ring-1 focus:ring-accent rounded-lg bg-surface text-xs resize-none`}
                      placeholder="Specify program grade, admission queries, or requests..."
                      aria-invalid={!!formErrors.message}
                      required
                    ></textarea>
                    {formErrors.message && (
                      <p className="mt-1 text-[10px] text-red-500 font-bold">{formErrors.message}</p>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white font-bold tracking-wider uppercase text-xs rounded-lg transition-all duration-300 flex items-center justify-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin text-accent" />
                        Submitting Enquiry...
                      </>
                    ) : (
                      <>
                        Submit Enquiry Message
                        <Send className="ml-2 h-4 w-4 text-accent" />
                      </>
                    )}
                  </button>
                </form>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* Footer Section (GSAP Columns Reveal) */}
      <footer className="bg-primary text-white pt-16 pb-8 border-t-2 border-accent relative">
        <div className="container mx-auto px-4 max-w-7xl">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            
            {/* Column 1: School Info */}
            <div className="footer-anim-col">
              <Link to="/" className="flex items-center space-x-3 mb-6 group">
                <div className="bg-accent p-2 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <span className="text-lg font-bold block">
                    <span className="text-white">Trishul</span>{" "}
                    <span className="text-accent">School</span>
                  </span>
                  <span className="text-[8px] text-gray-400 tracking-widest uppercase block">Nurturing Leaders</span>
                </div>
              </Link>
              <p className="text-gray-300 text-xs leading-relaxed mb-6 font-light">
                Providing structured, value-integrated, and technology-enabled learning ecosystems since 2010.
              </p>
              <div className="flex space-x-3.5">
                {[
                  { Icon: FaFacebookF, href: CONFIG.social.facebook, label: 'Facebook' },
                  { Icon: FaTwitter, href: CONFIG.social.twitter, label: 'Twitter' },
                  { Icon: FaInstagram, href: CONFIG.social.instagram, label: 'Instagram' }
                ].map((soc, idx) => (
                  <a 
                    key={idx}
                    href={soc.href} 
                    className="text-gray-400 hover:text-accent transition-colors bg-white/5 p-2 rounded"
                    aria-label={soc.label}
                  >
                    <soc.Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="footer-anim-col">
              <h4 className="font-bold text-sm tracking-wider uppercase mb-6 border-l-2 border-accent pl-3">
                <span className="text-accent">Quick</span> <span className="text-white">Navigation</span>
              </h4>
              <ul className="space-y-3.5 text-gray-300 text-xs font-normal">
                {['About', 'Curriculum', 'Facilities', 'Gallery', 'Testimonials'].map((link) => (
                  <li key={link}>
                    <button 
                      onClick={() => scrollToSection(link === 'Curriculum' ? 'programs' : link.toLowerCase())} 
                      className="hover:text-accent hover:translate-x-1 transition-all flex items-center cursor-pointer"
                    >
                      <ChevronRight className="h-3 w-3 mr-1.5 text-accent/70" /> {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Portals */}
            <div className="footer-anim-col">
              <h4 className="font-bold text-sm tracking-wider uppercase mb-6 border-l-2 border-accent pl-3">
                <span className="text-accent">Digital</span> <span className="text-white">Portals</span>
              </h4>
              <ul className="space-y-3.5 text-gray-300 text-xs font-normal">
                <li>
                  <Link to="/login" className="hover:text-accent hover:translate-x-1 transition-all flex items-center">
                    <ChevronRight className="h-3 w-3 mr-1.5 text-accent/70" /> Student Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-accent hover:translate-x-1 transition-all flex items-center">
                    <ChevronRight className="h-3 w-3 mr-1.5 text-accent/70" /> Teacher Portal
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-accent hover:translate-x-1 transition-all flex items-center">
                    <ChevronRight className="h-3 w-3 mr-1.5 text-accent/70" /> Parent Portal
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-accent hover:translate-x-1 transition-all flex items-center">
                    <ChevronRight className="h-3 w-3 mr-1.5 text-accent/70" /> Administrator Panel
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact Info */}
            <div className="footer-anim-col">
              <h4 className="font-bold text-sm tracking-wider uppercase mb-6 border-l-2 border-accent pl-3">
                <span className="text-accent">Reach</span> <span className="text-white">Campus</span>
              </h4>
              <ul className="space-y-3.5 text-gray-300 text-xs font-normal">
                <li className="flex items-start">
                  <Phone className="h-4 w-4 mr-3 mt-0.5 text-accent flex-shrink-0" />
                  <span>+91 {CONFIG.contact.phone} / {CONFIG.contact.phoneAlt}</span>
                </li>
                <li className="flex items-start">
                  <Mail className="h-4 w-4 mr-3 mt-0.5 text-accent flex-shrink-0" />
                  <span>{CONFIG.contact.email}</span>
                </li>
                <li className="flex items-start">
                  <MapPin className="h-4 w-4 mr-3 mt-0.5 text-accent flex-shrink-0" />
                  <span>{CONFIG.contact.address}</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400 text-[10px] tracking-widest uppercase">
            <p>© {new Date().getFullYear()} Trishul High School, Davangere. All rights reserved.</p>
            <p className="mt-1.5">Design Overhaul Powered by GSAP & Lenis Smooth Scroll</p>
          </div>
        </div>
      </footer>

      {/* Styled Animations fallback */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        @keyframes zoomSlow {
          0%, 100% { transform: scale(1.03); }
          50% { transform: scale(1.08); }
        }
        .animate-zoom-slow {
          animation: zoomSlow 18s ease-in-out infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
      
    </div>
  );
};

export default LandingPage;