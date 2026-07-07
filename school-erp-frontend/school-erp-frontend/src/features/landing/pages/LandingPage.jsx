// src/features/landing/pages/LandingPage.jsx
// NOTE: This file uses GSAP + Lenis for all animation/motion work.
// Install once in your project:  npm install gsap lenis
import Image1 from "../../../assets/1.webp";
import Image2 from "../../../assets/2.webp";
import Image3 from "../../../assets/3.webp";
import Image4 from "../../../assets/4.webp";
import Image5 from "../../../assets/5.webp";
import React, { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
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
  Image as ImageIcon
} from 'lucide-react';
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaLinkedinIn
} from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

// Professional Data Configuration
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

// Gallery Images
const GALLERY_IMAGES = [
  {
    id: 1,
    url: Image1,
    title: "Prayer View",
    description: "Childrens Dicipline players,,",
  },
  {
    id: 2,
    url: Image2,
    title: "Computer Lab",
    description: "well_structured computer lab ",
  },
  {
    id: 3,
    url: Image3,
    title: "Campus",
    description: "Beautiful campus with modern infrastructure",
  },
  {
    id: 4,
    url: Image4,
    title: "Sports Day",
    description: "Annual sports competition",
  },
  {
    id: 5,
    url: Image5,
    title: "Science Lab",
    description: "State-of-the-art science laboratory",
  },
];

const LandingPage = () => {
  // State Management
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [currentYear] = useState(new Date().getFullYear());
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const galleryIntervalRef = useRef(null);
  const lenisRef = useRef(null);

  // Preloader
  const preloaderRef = useRef(null);
  const preloaderLogoRef = useRef(null);
  const preloaderCountElRef = useRef(null);
  const preloaderBarRef = useRef(null);

  // Magnetic buttons
  const magneticRefs = useRef([]);

  // ---------- GSAP refs ----------
  const mainRef = useRef(null);

  // Hero
  const badgeIconRef = useRef(null);
  const heroBadgeRef = useRef(null);
  const heroHeadingRef = useRef(null);
  const heroParaRef = useRef(null);
  const heroButtonsRef = useRef(null);
  const heroTrustRef = useRef(null);
  const statsGridRef = useRef(null);
  const floatCard1Ref = useRef(null);
  const floatCard2Ref = useRef(null);
  const heroSectionRef = useRef(null);
  const blobRef1 = useRef(null);
  const blobRef2 = useRef(null);

  // Ticker
  const tickerContentRef = useRef(null);

  // Scroll-reveal group containers
  const aboutCardsRef = useRef(null);
  const achievementsRef = useRef(null);
  const programsRef = useRef(null);
  const galleryContainerRef = useRef(null);
  const facilitiesRef = useRef(null);
  const testimonialsRef = useRef(null);
  const contactItemsRef = useRef(null);
  const contactFormRef = useRef(null);
  const ctaContentRef = useRef(null);

  // Gallery slide refs
  const galleryImgRefs = useRef([]);
  const galleryProgressRef = useRef(null);

  // Professional Data
  const stats = useMemo(() => [
    { number: "850+", label: "Students", icon: Users, trend: "+12%" },
    { number: "96%", label: "Board Results", icon: Award, trend: "+5%" },
    { number: "15+", label: "Years Legacy", icon: BookOpen, trend: "Est. 2010" },
    { number: "4.8", label: "Parent Rating", icon: Star, trend: "★★★★★" }
  ], []);

  const programs = useMemo(() => [
    {
      title: "Kindergarten",
      age: "Age 3-6",
      color: "from-[#00A3E0] to-[#005B96]",
      icon: School,
      features: ["Play-based learning", "Social skills", "Creative activities"],
      description: "Nurturing young minds through interactive and engaging activities"
    },
    {
      title: "Primary School",
      age: "Grades 1-5",
      color: "from-[#005B96] to-[#003366]",
      icon: BookOpen,
      features: ["Core subjects", "Interactive learning", "Foundation building"],
      description: "Building strong academic foundations with innovative teaching methods"
    },
    {
      title: "High School",
      age: "Grades 6-10",
      color: "from-[#003366] to-[#001a33]",
      icon: Award,
      features: ["Advanced curriculum", "Board preparation", "Career guidance"],
      description: "Preparing students for academic excellence and future careers"
    }
  ], []);

  const facilities = useMemo(() => [
    { icon: Building2, label: "Smart Classrooms", description: "Digital learning enabled" },
    { icon: Monitor, label: "Computer Lab", description: "Latest technology" },
    { icon: BookOpen, label: "Library", description: "5000+ books" },
    { icon: Bus, label: "Transport", description: "Safe commuting" },
    { icon: Utensils, label: "Canteen", description: "Nutritious meals" },
    { icon: Wifi, label: "Wi-Fi Campus", description: "Connected learning" }
  ], []);

  const testimonials = useMemo(() => [
    {
      id: 1,
      name: "Ramesh Kumar",
      role: "Parent of Grade 8 Student",
      text: "Trishul High School has transformed my daughter's academic journey. The teachers are dedicated, and the focus on overall development is remarkable.",
      rating: 5,
      image: "https://ui-avatars.com/api/?name=Ramesh+Kumar&background=00A3E0&color=fff&size=60",
      date: "March 2026"
    },
    {
      id: 2,
      name: "Sangeetha N",
      role: "Parent of Grade 5 Student",
      text: "The school provides an excellent learning environment. My son's confidence and grades have improved significantly since joining Trishul.",
      rating: 5,
      image: "https://ui-avatars.com/api/?name=Sangeetha+N&background=00A3E0&color=fff&size=60",
      date: "February 2026"
    },
    {
      id: 3,
      name: "Prakash Rao",
      role: "Parent of Grade 10 Student",
      text: "Best decision we made for our child's education. The faculty, infrastructure, and overall environment are outstanding.",
      rating: 5,
      image: "https://ui-avatars.com/api/?name=Prakash+Rao&background=00A3E0&color=fff&size=60",
      date: "January 2026"
    }
  ], []);

  const achievements = useMemo(() => [
    { number: "50+", label: "Awards Won", icon: Trophy },
    { number: "100%", label: "Pass Rate", icon: TrendingUp },
    { number: "25+", label: "Sports Trophies", icon: Medal },
    { number: "10+", label: "Cultural Events", icon: Star }
  ], []);

  const newsItems = useMemo(() => [
    { id: 1, text: "🏆 National Science Olympiad Winners 2026", tag: "Achievement" },
    { id: 2, text: "📚 New Library with 5000+ Books Inaugurated", tag: "Infrastructure" },
    { id: 3, text: "🎯 100% Board Results for 5th Consecutive Year", tag: "Results" },
    { id: 4, text: "🌟 Annual Sports Day - March 15, 2026", tag: "Event" }
  ], []);

  // Gallery Auto-Slide
  useEffect(() => {
    galleryIntervalRef.current = setInterval(() => {
      setCurrentGalleryIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
    }, 4000);

    return () => {
      if (galleryIntervalRef.current) {
        clearInterval(galleryIntervalRef.current);
      }
    };
  }, []);

  // Scroll Handler for Header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ---------- Lenis smooth scroll, wired into GSAP's ticker ----------
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    const rafCallback = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(rafCallback);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // ---------- Preloader ----------
  useLayoutEffect(() => {
    document.body.style.overflow = 'hidden';
    const counter = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        ScrollTrigger.refresh();
      }
    });

    tl.to(preloaderLogoRef.current, {
      scale: 1.06,
      duration: 0.9,
      repeat: 1,
      yoyo: true,
      ease: 'sine.inOut'
    }, 0);

    tl.to(counter, {
      value: 100,
      duration: 1.3,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (preloaderCountElRef.current) {
          preloaderCountElRef.current.textContent = Math.floor(counter.value);
        }
      }
    }, 0);

    if (preloaderBarRef.current) {
      tl.to(preloaderBarRef.current, {
        width: '100%',
        duration: 1.3,
        ease: 'power2.inOut'
      }, 0);
    }

    tl.call(() => setIsLoaded(true), [], 1.15);

    tl.to(preloaderRef.current, {
      yPercent: -100,
      duration: 0.9,
      ease: 'expo.inOut'
    }, 1.3);

    return () => tl.kill();
  }, []);

  // ---------- GSAP: hero entrance + ambient loops + scroll reveals ----------
  useLayoutEffect(() => {
    if (!isLoaded) return;
    const ctx = gsap.context(() => {
      // Hero entrance timeline — fires the instant the preloader clears
      const heroTl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      if (badgeIconRef.current) {
        heroTl.fromTo(
          badgeIconRef.current,
          { opacity: 0, scale: 0.4, rotate: -180 },
          { opacity: 1, scale: 1, rotate: 0, duration: 0.6 }
        );
      }
      if (heroBadgeRef.current) {
        heroTl.fromTo(
          heroBadgeRef.current,
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 0.6 },
          '-=0.3'
        );
      }
      if (heroHeadingRef.current) {
        heroTl.fromTo(
          heroHeadingRef.current.children,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 },
          '-=0.2'
        );
      }
      if (heroParaRef.current) {
        heroTl.fromTo(
          heroParaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.4'
        );
      }
      if (heroButtonsRef.current) {
        heroTl.fromTo(
          heroButtonsRef.current.children,
          { opacity: 0, y: 20, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.15 },
          '-=0.3'
        );
      }
      if (heroTrustRef.current) {
        heroTl.fromTo(
          heroTrustRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          '-=0.2'
        );
      }
      if (statsGridRef.current) {
        heroTl.fromTo(
          statsGridRef.current.children,
          { opacity: 0, y: 40, scale: 0.85 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.7)' },
          '-=0.4'
        );
      }
      if (floatCard1Ref.current && floatCard2Ref.current) {
        heroTl.fromTo(
          [floatCard1Ref.current, floatCard2Ref.current],
          { opacity: 0, scale: 0.5 },
          { opacity: 1, scale: 1, duration: 0.6, stagger: 0.15, ease: 'back.out(2)' },
          '-=0.2'
        );
      }

      // Ambient float loop for the two floating info cards
      if (floatCard1Ref.current) {
        gsap.to(floatCard1Ref.current, {
          y: -14,
          duration: 2.4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }
      if (floatCard2Ref.current) {
        gsap.to(floatCard2Ref.current, {
          y: -14,
          duration: 2.4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 1.1
        });
      }

      // Seamless GSAP marquee (content is rendered twice; loop by -50%)
      if (tickerContentRef.current) {
        const totalWidth = tickerContentRef.current.scrollWidth / 2;
        gsap.fromTo(
          tickerContentRef.current,
          { x: 0 },
          { x: -totalWidth, duration: 26, ease: 'linear', repeat: -1 }
        );
      }

      // Generic section header reveal — snappier expo curve, triggers earlier
      // so it settles before the section is centered in view (no "wait" feel).
      gsap.utils.toArray('.section-header').forEach((header) => {
        gsap.fromTo(
          header,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'expo.out',
            scrollTrigger: { trigger: header, start: 'top 92%' }
          }
        );
      });

      // Staggered scroll-reveal groups (parent container -> animate its children)
      const revealGroups = [
        { ref: aboutCardsRef, y: 50, stagger: 0.1 },
        { ref: achievementsRef, y: 25, stagger: 0.08 },
        { ref: programsRef, y: 60, stagger: 0.12 },
        { ref: facilitiesRef, y: 25, stagger: 0.06 },
        { ref: testimonialsRef, y: 50, stagger: 0.12 },
        { ref: contactItemsRef, y: 35, stagger: 0.1 }
      ];

      revealGroups.forEach(({ ref, y, stagger }) => {
        if (!ref.current) return;
        gsap.fromTo(
          ref.current.children,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger,
            ease: 'expo.out',
            scrollTrigger: { trigger: ref.current, start: 'top 90%' }
          }
        );
      });

      // Single-element reveals
      if (galleryContainerRef.current) {
        gsap.fromTo(
          galleryContainerRef.current,
          { opacity: 0, y: 50, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: { trigger: galleryContainerRef.current, start: 'top 88%' }
          }
        );
      }

      if (contactFormRef.current) {
        gsap.fromTo(
          contactFormRef.current,
          { opacity: 0, x: 40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            ease: 'expo.out',
            scrollTrigger: { trigger: contactFormRef.current, start: 'top 90%' }
          }
        );
      }

      if (ctaContentRef.current) {
        gsap.fromTo(
          ctaContentRef.current.children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: 'expo.out',
            scrollTrigger: { trigger: ctaContentRef.current, start: 'top 85%' }
          }
        );
      }

      // Scroll-scrubbed parallax on the hero background blobs — continuous
      // motion tied directly to scroll position instead of a one-shot reveal.
      if (blobRef1.current && heroSectionRef.current) {
        gsap.to(blobRef1.current, {
          y: 160,
          ease: 'none',
          scrollTrigger: {
            trigger: heroSectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6
          }
        });
      }
      if (blobRef2.current && heroSectionRef.current) {
        gsap.to(blobRef2.current, {
          y: -120,
          ease: 'none',
          scrollTrigger: {
            trigger: heroSectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6
          }
        });
      }

      // Magnetic buttons — the subtle cursor-pull agency sites use
      const magnets = magneticRefs.current.filter(Boolean);
      const magnetHandlers = magnets.map((el) => {
        const onMove = (e) => {
          const rect = el.getBoundingClientRect();
          const relX = e.clientX - (rect.left + rect.width / 2);
          const relY = e.clientY - (rect.top + rect.height / 2);
          gsap.to(el, { x: relX * 0.3, y: relY * 0.4, duration: 0.5, ease: 'power2.out' });
        };
        const onLeave = () => {
          gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
        };
        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        return { el, onMove, onLeave };
      });

      return () => {
        magnetHandlers.forEach(({ el, onMove, onLeave }) => {
          el.removeEventListener('mousemove', onMove);
          el.removeEventListener('mouseleave', onLeave);
        });
      };
    }, mainRef);

    return () => ctx.revert();
  }, [isLoaded]);

  // ---------- GSAP: gallery crossfade whenever the active slide changes ----------
  useEffect(() => {
    galleryImgRefs.current.forEach((el, i) => {
      if (!el) return;
      if (i === currentGalleryIndex) {
        gsap.set(el, { zIndex: 10 });
        gsap.fromTo(
          el,
          { opacity: 0, scale: 1.08 },
          { opacity: 1, scale: 1, duration: 1.1, ease: 'power2.out' }
        );
      } else {
        gsap.set(el, { zIndex: 1 });
        gsap.to(el, { opacity: 0, duration: 0.8, ease: 'power2.out' });
      }
    });

    if (galleryProgressRef.current) {
      gsap.to(galleryProgressRef.current, {
        width: `${((currentGalleryIndex + 1) / GALLERY_IMAGES.length) * 100}%`,
        duration: 0.8,
        ease: 'power2.out'
      });
    }
  }, [currentGalleryIndex]);

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
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    if (!formData.message.trim()) errors.message = 'Message is required';
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
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setFormData({ name: '', email: '', phone: '', message: '' });
    alert('Message sent successfully! We will get back to you soon.');
  }, [formData, validateForm]);

  // Scroll to section handler — goes through Lenis so in-page nav matches
  // the same smooth-scroll feel as the rest of the page.
  const scrollToSection = useCallback((sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(element, { offset: -20, duration: 1.2 });
      } else {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      setIsMenuOpen(false);
    }
  }, []);

  // Gallery navigation handlers
  const goToGallerySlide = useCallback((index) => {
    setCurrentGalleryIndex(index);
    if (galleryIntervalRef.current) {
      clearInterval(galleryIntervalRef.current);
      galleryIntervalRef.current = setInterval(() => {
        setCurrentGalleryIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
      }, 4000);
    }
  }, []);

  return (
    <div ref={mainRef} className="min-h-screen bg-white font-['Inter',_system-ui,_sans-serif] antialiased">
      {/* Preloader — one clean, deliberate reveal instead of content settling in piecemeal */}
      <div
        ref={preloaderRef}
        className="fixed inset-0 z-[100] bg-[#1a1a1a] flex flex-col items-center justify-center"
        aria-hidden="true"
      >
        <div ref={preloaderLogoRef} className="bg-[#00A3E0] p-4 rounded-full mb-6">
          <GraduationCap className="h-10 w-10 text-white" />
        </div>
        <div className="flex items-baseline text-white font-bold tracking-tight">
          <span ref={preloaderCountElRef} className="text-5xl">0</span>
          <span className="text-2xl ml-1">%</span>
        </div>
        <div className="w-48 h-[2px] bg-white/10 mt-6 overflow-hidden rounded-full">
          <div ref={preloaderBarRef} className="h-full bg-[#00A3E0] rounded-full" style={{ width: '0%' }}></div>
        </div>
      </div>

      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:p-4 focus:shadow-lg">
        Skip to main content
      </a>

      {/* Top Bar - Professional */}
      <div className="hidden md:block bg-[#1a1a1a] text-white text-xs py-2 border-b-2 border-[#00A3E0]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <a href={`tel:${CONFIG.contact.phone}`} className="hover:text-[#00A3E0] transition-colors flex items-center gap-1.5">
                <Phone className="h-3 w-3" />
                <span>{CONFIG.contact.phone}</span>
              </a>
              <span className="text-[#555]">|</span>
              <a href={`mailto:${CONFIG.contact.email}`} className="hover:text-[#00A3E0] transition-colors flex items-center gap-1.5">
                <Mail className="h-3 w-3" />
                <span>{CONFIG.contact.email}</span>
              </a>
              <span className="text-[#555]">|</span>
              <span className="text-gray-400 flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                {CONFIG.contact.hours}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-[#555]">|</span>
              <a href={CONFIG.social.facebook} className="hover:text-[#00A3E0] transition-colors" aria-label="Facebook">
                <FaFacebookF className="h-3.5 w-3.5" />
              </a>
              <a href={CONFIG.social.twitter} className="hover:text-[#00A3E0] transition-colors" aria-label="Twitter">
                <FaTwitter className="h-3.5 w-3.5" />
              </a>
              <a href={CONFIG.social.instagram} className="hover:text-[#00A3E0] transition-colors" aria-label="Instagram">
                <FaInstagram className="h-3.5 w-3.5" />
              </a>
              <a href={CONFIG.social.youtube} className="hover:text-[#00A3E0] transition-colors" aria-label="YouTube">
                <FaYoutube className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Header - Professional Navigation */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-lg py-2' : 'bg-white/98 backdrop-blur-sm py-3'
        }`}
        role="banner"
      >
        <div className="absolute top-0 left-0 w-full h-[3px] flex">
          <div className="w-1/4 bg-[#00A3E0]"></div>
          <div className="w-1/4 bg-[#005B96]"></div>
          <div className="w-1/4 bg-[#003366]"></div>
          <div className="w-1/4 bg-[#00A3E0]"></div>
        </div>

        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-3 group" aria-label="Trishul High School Home">
              <div className="relative">
                <div className="bg-[#1a1a1a] p-2.5 rounded-full transform group-hover:scale-110 transition-transform duration-500 shadow-lg border-2 border-[#00A3E0]">
                  <GraduationCap className="h-8 w-8 text-[#00A3E0]" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#00A3E0] rounded-full animate-pulse flex items-center justify-center">
                  <Zap className="h-2 w-2 text-white" />
                </div>
              </div>
              <div>
                <span className="text-xl font-bold text-[#1a1a1a] tracking-tight">Trishul</span>
                <span className="block text-[10px] text-[#666] font-semibold tracking-[0.15em] uppercase">High School</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1" role="navigation" aria-label="Main navigation">
              {['About', 'Programs', 'Facilities', 'Testimonials', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="px-5 py-2 text-[11px] font-semibold tracking-[0.15em] uppercase text-[#1a1a1a] hover:text-[#00A3E0] transition-colors relative group cursor-pointer"
                >
                  {item}
                  <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-[#00A3E0] group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
                </button>
              ))}
            </nav>

            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="hidden md:block px-6 py-2.5 text-[11px] font-semibold tracking-[0.15em] uppercase text-[#1a1a1a] border-2 border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-all hover:scale-105"
                aria-label="Login to dashboard"
              >
                Login
              </Link>
              <Link
                to="/login"
                className="hidden md:block px-6 py-2.5 text-[11px] font-semibold tracking-[0.15em] uppercase bg-[#00A3E0] text-white hover:bg-[#005B96] transition-all hover:scale-105 shadow-lg hover:shadow-xl"
                aria-label="Apply now"
              >
                Apply Now
              </Link>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 py-4 border-t-2 border-[#00A3E0] animate-slideDown">
              <nav className="flex flex-col space-y-2" role="navigation" aria-label="Mobile navigation">
                {['About', 'Programs', 'Facilities', 'Testimonials', 'Contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="px-4 py-3 text-[12px] font-semibold tracking-[0.15em] uppercase hover:bg-[#00A3E0] hover:text-white transition-colors text-[#1a1a1a] border-l-2 border-transparent hover:border-white text-left"
                  >
                    {item}
                  </button>
                ))}
                <div className="flex flex-col space-y-2 pt-4 border-t-2 border-[#00A3E0]">
                  <Link to="/login" className="px-4 py-3 text-center text-[12px] font-semibold tracking-[0.15em] uppercase border-2 border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-colors">Login</Link>
                  <Link to="/login" className="px-4 py-3 text-center text-[12px] font-semibold tracking-[0.15em] uppercase bg-[#00A3E0] text-white hover:bg-[#005B96] transition-colors">Apply Now</Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Animated "Trishul" Brand Display - Below Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#f0f4f8] via-white to-[#f0f4f8] py-8 border-b-2 border-[#00A3E0]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-[#00A3E0]/5 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#005B96]/5 to-transparent"></div>
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#00A3E0] rounded-full animate-float opacity-20"></div>
          <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-[#005B96] rounded-full animate-float-delay opacity-20"></div>
          <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-[#003366] rounded-full animate-float opacity-30"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-center space-x-6 md:space-x-12">
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="relative">
                <div className="bg-[#1a1a1a] p-3 md:p-4 rounded-full border-2 border-[#00A3E0] animate-pulse-slow">
                  <GraduationCap className="h-8 w-8 md:h-10 md:w-10 text-[#00A3E0]" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-[#00A3E0] rounded-full animate-spin-slow flex items-center justify-center">
                  <Zap className="h-3 w-3 md:h-3.5 md:w-3.5 text-white" />
                </div>
              </div>

              <div className="relative">
                <div className="overflow-hidden">
                  <div className="flex items-baseline">
                    <span className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#1a1a1a] tracking-tight animate-gradient bg-clip-text text-transparent bg-gradient-to-r from-[#00A3E0] via-[#005B96] to-[#003366] bg-[length:200%_200%]">
                      Trishul
                    </span>
                    <div className="ml-2 md:ml-3 relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-[#00A3E0] to-[#003366] rounded-lg blur opacity-30 animate-pulse-slow"></div>
                      <span className="relative text-xs md:text-sm font-bold tracking-[0.25em] uppercase text-[#1a1a1a] bg-white/50 backdrop-blur-sm px-3 py-1 rounded border border-[#00A3E0]/30">
                        Excellence
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 h-[2px] w-full bg-gradient-to-r from-[#00A3E0] via-[#005B96] to-[#003366] animate-gradient bg-[length:200%_200%] rounded-full"></div>
                <div className="mt-1 h-[1px] w-1/2 bg-gradient-to-r from-[#00A3E0] to-transparent animate-pulse-slow rounded-full"></div>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <div className="w-px h-12 bg-gradient-to-b from-transparent via-[#00A3E0] to-transparent"></div>
              <div className="text-left">
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#666]">Since 2010</p>
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#00A3E0]">Excellence in Education</p>
              </div>
              <div className="w-px h-12 bg-gradient-to-b from-transparent via-[#00A3E0] to-transparent"></div>
            </div>

            <div className="hidden lg:flex items-center space-x-6">
              {[Shield, Award, Target].map((Icon, i) => (
                <div key={i} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00A3E0] to-[#003366] rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity animate-pulse-slow"></div>
                  <Icon className="h-6 w-6 text-[#1a1a1a] group-hover:text-[#00A3E0] transition-colors relative" />
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-4">
            <p className="text-xs md:text-sm text-[#555] tracking-widest animate-gradient bg-clip-text text-transparent bg-gradient-to-r from-[#00A3E0] via-[#005B96] to-[#003366] bg-[length:200%_200%]">
              <span className="inline-block animate-float">✦</span>
              <span className="mx-2">Empowering Young Minds for a Brighter Tomorrow</span>
              <span className="inline-block animate-float-delay">✦</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main id="main-content">
        {/* Hero Section */}
        <section ref={heroSectionRef} className="relative min-h-[90vh] flex items-center overflow-hidden" aria-label="Hero section">
          <div className="absolute inset-0 bg-gradient-to-b from-[#f0f4f8] via-white to-[#e8edf3]">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-[#00A3E0]/10 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-2/3 h-full bg-gradient-to-r from-[#005B96]/10 to-transparent"></div>
            </div>
          </div>

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div ref={blobRef1} className="absolute top-10 right-10 w-96 h-96 bg-[#00A3E0] rounded-full blur-3xl opacity-10"></div>
            <div ref={blobRef2} className="absolute bottom-10 left-10 w-96 h-96 bg-[#005B96] rounded-full blur-3xl opacity-10"></div>
            <div className="absolute top-20 left-20 opacity-5">
              <div className="w-32 h-32 border-8 border-[#00A3E0] rounded-full animate-spin-slow"></div>
            </div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                {/* Brand Element */}
                <div className="flex items-center space-x-3 mb-2">
                  <div ref={badgeIconRef} className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center border-2 border-[#00A3E0]">
                    <Zap className="h-6 w-6 text-[#00A3E0]" />
                  </div>
                  <div>
                    <div className="w-16 h-[3px] bg-[#00A3E0]"></div>
                    <div className="w-24 h-[3px] bg-[#005B96] mt-1"></div>
                    <div className="w-32 h-[3px] bg-[#003366] mt-1"></div>
                  </div>
                </div>

                {/* Badge */}
                <div ref={heroBadgeRef} className="inline-flex items-center bg-white/90 backdrop-blur-sm px-4 py-2 shadow-lg border-l-4 border-[#00A3E0] rounded-r-lg">
                  <Sparkles className="h-4 w-4 text-[#00A3E0] mr-2" />
                  <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#1a1a1a]">Admissions Open for {currentYear}-{currentYear + 1}</span>
                </div>

                {/* Main Heading */}
                <h1 ref={heroHeadingRef} className="text-6xl lg:text-8xl font-bold text-[#1a1a1a] leading-[0.9] tracking-tight">
                  <span className="block">Accelerate</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00A3E0] via-[#005B96] to-[#003366] animate-gradient">
                    Learning
                  </span>
                  <span className="block">Today</span>
                </h1>

                <p ref={heroParaRef} className="text-lg text-[#555] max-w-lg leading-relaxed tracking-wide">
                  Empowering young minds with dynamic education, innovative teaching,
                  and a passion for excellence since 2010.
                </p>

                <div ref={heroButtonsRef} className="flex flex-wrap gap-4">
                  <Link
                    to="/login"
                    ref={(el) => (magneticRefs.current[0] = el)}
                    className="group px-8 py-4 bg-[#00A3E0] text-white font-semibold tracking-[0.1em] uppercase text-sm hover:bg-[#005B96] transition-colors shadow-lg hover:shadow-xl flex items-center rounded-lg will-change-transform"
                  >
                    Enroll Now
                    <Zap className="ml-2 h-4 w-4 group-hover:animate-pulse" />
                  </Link>
                  <button
                    onClick={() => scrollToSection('programs')}
                    ref={(el) => (magneticRefs.current[1] = el)}
                    className="px-8 py-4 border-2 border-[#1a1a1a] text-[#1a1a1a] font-semibold tracking-[0.1em] uppercase text-sm hover:bg-[#1a1a1a] hover:text-white transition-colors rounded-lg will-change-transform"
                  >
                    Explore Programs
                  </button>
                </div>

                {/* Trust Indicators */}
                <div ref={heroTrustRef} className="flex items-center space-x-6 pt-4">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-r from-[#00A3E0] to-[#003366] flex items-center justify-center text-white text-xs font-bold shadow-lg">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[#555] text-xs font-bold">
                      +50
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1a1a1a]">Trusted by 850+ families</p>
                    <div className="flex text-[#00A3E0] text-sm">
                      {[1,2,3,4,5].map((i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="relative">
                <div ref={statsGridRef} className="grid grid-cols-2 gap-4">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="bg-white shadow-xl p-6 border-t-4 border-[#00A3E0] hover:shadow-2xl transition-all hover:-translate-y-2 group rounded-lg"
                    >
                      <div className="bg-[#f0f4f8] w-14 h-14 rounded-full flex items-center justify-center mb-3 group-hover:bg-[#00A3E0] transition-colors">
                        <stat.icon className="h-7 w-7 text-[#1a1a1a] group-hover:text-white transition-colors" />
                      </div>
                      <div className="text-3xl font-bold text-[#1a1a1a]">{stat.number}</div>
                      <div className="text-xs text-[#666] font-semibold tracking-[0.1em] uppercase">{stat.label}</div>
                      <div className="text-[10px] text-[#00A3E0] font-semibold mt-1">{stat.trend}</div>
                    </div>
                  ))}
                </div>

                {/* Floating Cards */}
                <div ref={floatCard1Ref} className="absolute -top-6 -right-6">
                  <div className="bg-white shadow-2xl p-4 border-l-4 border-[#005B96] rounded-r-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-[#005B96] rounded-full animate-pulse"></div>
                      <div>
                        <p className="text-xs font-bold tracking-[0.1em] uppercase text-[#1a1a1a]">Live Classes</p>
                        <p className="text-[10px] text-[#666]">Interactive Learning</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div ref={floatCard2Ref} className="absolute -bottom-4 -left-6">
                  <div className="bg-white shadow-2xl p-4 border-l-4 border-[#003366] rounded-r-lg">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-[#003366]" />
                      <div>
                        <p className="text-xs font-bold tracking-[0.1em] uppercase text-[#1a1a1a]">Safe Environment</p>
                        <p className="text-[10px] text-[#666]">24/7 Security</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* News Ticker - GSAP seamless marquee */}
        <div className="bg-[#1a1a1a] py-3 border-y-2 border-[#00A3E0] overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex items-center">
              <div className="flex items-center bg-[#00A3E0] px-4 py-1 rounded-full mr-8 whitespace-nowrap">
                <Zap className="h-4 w-4 text-white mr-2" />
                <span className="text-white text-xs font-bold tracking-[0.2em] uppercase">Latest News</span>
              </div>
              <div className="relative flex-1 overflow-hidden">
                <div ref={tickerContentRef} className="flex whitespace-nowrap">
                  {[...newsItems, ...newsItems].map((item, i) => (
                    <span key={i} className="text-white text-xs tracking-wider mx-8 inline-block">
                      <span className="text-[#00A3E0] font-bold">[{item.tag}]</span> {item.text}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <section id="about" className="py-24 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#f0f4f8] to-transparent opacity-50"></div>
          <div className="container mx-auto px-4 relative">
            <div className="section-header text-center mb-16">
              <div className="flex justify-center items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center border-2 border-[#00A3E0]">
                  <Zap className="h-6 w-6 text-[#00A3E0]" />
                </div>
                <div>
                  <div className="w-16 h-[3px] bg-[#00A3E0] mx-auto"></div>
                  <div className="w-24 h-[3px] bg-[#005B96] mx-auto mt-1"></div>
                  <div className="w-32 h-[3px] bg-[#003366] mx-auto mt-1"></div>
                </div>
              </div>
              <span className="inline-block bg-[#f0f4f8] text-[#1a1a1a] px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase mb-4 border-l-4 border-[#00A3E0]">
                About Us
              </span>
              <h2 className="text-5xl lg:text-6xl font-bold text-[#1a1a1a] mb-4 tracking-tight">
                Why Choose<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A3E0] to-[#003366]">Trishul?</span>
              </h2>
              <p className="text-[#666] max-w-2xl mx-auto text-lg tracking-wide">
                Excellence in education since 2010, shaping young minds for a better tomorrow
              </p>
            </div>

            <div ref={aboutCardsRef} className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: GraduationCap,
                  title: "Quality Education",
                  desc: "Well-structured curriculum with focus on conceptual understanding and practical learning approaches."
                },
                {
                  icon: Users,
                  title: "Experienced Faculty",
                  desc: "Dedicated teachers with years of experience in shaping young minds for academic excellence."
                },
                {
                  icon: Target,
                  title: "Holistic Growth",
                  desc: "Balanced focus on academics, sports, arts, and character development for overall growth."
                }
              ].map((item, index) => (
                <div
                  key={index}
                  className="group bg-white p-8 border-2 border-[#e8edf3] hover:border-[#00A3E0] transition-all duration-500 hover:-translate-y-3 relative rounded-lg"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#00A3E0] to-[#003366] transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500"></div>
                  <div className="relative">
                    <div className="bg-gradient-to-br from-[#f0f4f8] to-[#e8edf3] w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-[#00A3E0] group-hover:to-[#003366] transition-colors">
                      <item.icon className="h-8 w-8 text-[#1a1a1a] group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#1a1a1a] mb-4">{item.title}</h3>
                    <p className="text-[#666] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Achievements */}
            <div ref={achievementsRef} className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 bg-[#f0f4f8] p-8 border-l-4 border-[#00A3E0] rounded-r-lg">
              {achievements.map((item, index) => (
                <div key={index} className="text-center group">
                  <div className="flex justify-center mb-2">
                    <item.icon className="h-8 w-8 text-[#00A3E0] group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-4xl font-bold text-[#1a1a1a]">{item.number}</div>
                  <p className="text-xs text-[#666] font-semibold tracking-[0.1em] uppercase mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Programs Section */}
        <section id="programs" className="py-24 bg-[#f0f4f8] relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-96 h-96 bg-[#00A3E0] rounded-full blur-3xl opacity-10"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#005B96] rounded-full blur-3xl opacity-10"></div>
          </div>
          <div className="container mx-auto px-4 relative">
            <div className="section-header text-center mb-16">
              <div className="flex justify-center items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center border-2 border-[#00A3E0]">
                  <Zap className="h-6 w-6 text-[#00A3E0]" />
                </div>
                <div>
                  <div className="w-16 h-[3px] bg-[#00A3E0] mx-auto"></div>
                  <div className="w-24 h-[3px] bg-[#005B96] mx-auto mt-1"></div>
                  <div className="w-32 h-[3px] bg-[#003366] mx-auto mt-1"></div>
                </div>
              </div>
              <span className="inline-block bg-white text-[#1a1a1a] px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase mb-4 border-l-4 border-[#00A3E0]">
                Our Programs
              </span>
              <h2 className="text-5xl lg:text-6xl font-bold text-[#1a1a1a] mb-4 tracking-tight">
                Accelerating Young<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A3E0] to-[#003366]">Minds at Every Stage</span>
              </h2>
              <p className="text-[#666] max-w-2xl mx-auto text-lg tracking-wide">
                Comprehensive education from kindergarten to high school
              </p>
            </div>

            <div ref={programsRef} className="grid md:grid-cols-3 gap-8">
              {programs.map((program, index) => (
                <div
                  key={index}
                  className="group bg-white border-2 border-[#e8edf3] hover:border-[#00A3E0] transition-all duration-500 hover:-translate-y-4 overflow-hidden rounded-lg"
                >
                  <div className={`h-64 bg-gradient-to-r ${program.color} flex items-center justify-center relative`}>
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition"></div>
                    <div className="absolute top-4 right-4 opacity-20">
                      <Zap className="h-12 w-12 text-white" />
                    </div>
                    <div className="relative z-10 text-center">
                      <div className="bg-white/20 backdrop-blur-sm p-6 rounded-full mb-4 inline-block group-hover:scale-110 transition-transform duration-500 border-2 border-white/30">
                        <program.icon className="h-16 w-16 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold text-white tracking-tight">{program.title}</h3>
                      <p className="text-white/90 text-sm tracking-wider">{program.age}</p>
                      <p className="text-white/70 text-xs mt-2 max-w-xs mx-auto">{program.description}</p>
                    </div>
                  </div>
                  <div className="p-8">
                    <ul className="space-y-3">
                      {program.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-[#555] text-sm">
                          <CheckCircle className="h-4 w-4 text-[#00A3E0] mr-3 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      to="/login"
                      className="mt-6 inline-flex items-center text-[#1a1a1a] font-semibold text-sm tracking-[0.1em] uppercase hover:text-[#00A3E0] transition-colors group"
                    >
                      Learn More <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="py-24 bg-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-[#f0f4f8] to-transparent opacity-30 pointer-events-none"></div>
          <div className="container mx-auto px-4 relative">
            <div className="section-header text-center mb-16">
              <div className="flex justify-center items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center border-2 border-[#00A3E0]">
                  <Zap className="h-6 w-6 text-[#00A3E0]" />
                </div>
                <div>
                  <div className="w-16 h-[3px] bg-[#00A3E0] mx-auto"></div>
                  <div className="w-24 h-[3px] bg-[#005B96] mx-auto mt-1"></div>
                  <div className="w-32 h-[3px] bg-[#003366] mx-auto mt-1"></div>
                </div>
              </div>
              <span className="inline-block bg-[#f0f4f8] text-[#1a1a1a] px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase mb-4 border-l-4 border-[#00A3E0]">
                Gallery
              </span>
              <h2 className="text-5xl lg:text-6xl font-bold text-[#1a1a1a] mb-4 tracking-tight">
                Our Campus<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A3E0] to-[#003366]">In Focus</span>
              </h2>
              <p className="text-[#666] max-w-2xl mx-auto text-lg tracking-wide">
                A glimpse into our world-class facilities and vibrant campus life
              </p>
            </div>

            <div ref={galleryContainerRef} className="relative overflow-hidden rounded-2xl shadow-2xl">
              {/* Main Gallery Display */}
              <div className="relative aspect-[16/9] md:aspect-[16/8] bg-[#1a1a1a]">
                {GALLERY_IMAGES.map((image, index) => (
                  <div
                    key={image.id}
                    ref={(el) => (galleryImgRefs.current[index] = el)}
                    className="absolute inset-0"
                    style={{ opacity: index === 0 ? 1 : 0 }}
                  >
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/80 via-transparent to-transparent"></div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-1 h-8 bg-[#00A3E0]"></div>
                        <h3 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
                          {image.title}
                        </h3>
                      </div>
                      <p className="text-white/80 text-sm md:text-base max-w-lg ml-4">
                        {image.description}
                      </p>
                    </div>

                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-white text-xs font-bold tracking-wider">
                        {String(index + 1).padStart(2, '0')} / {String(GALLERY_IMAGES.length).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Navigation Arrows */}
                <button
                  onClick={() => goToGallerySlide((currentGalleryIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-all p-3 rounded-full text-white hover:scale-110 z-20"
                  aria-label="Previous image"
                >
                  <ChevronRight className="h-6 w-6 rotate-180" />
                </button>
                <button
                  onClick={() => goToGallerySlide((currentGalleryIndex + 1) % GALLERY_IMAGES.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-all p-3 rounded-full text-white hover:scale-110 z-20"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>

                {/* Progress Bar - animated via GSAP */}
                <div className="absolute bottom-20 left-0 right-0 px-4 md:px-10 z-20">
                  <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                    <div
                      ref={galleryProgressRef}
                      className="h-full bg-gradient-to-r from-[#00A3E0] to-[#003366] rounded-full"
                      style={{ width: `${((currentGalleryIndex + 1) / GALLERY_IMAGES.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Thumbnail Navigation */}
              <div className="grid grid-cols-5 gap-2 p-3 bg-[#f0f4f8]">
                {GALLERY_IMAGES.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => goToGallerySlide(index)}
                    className={`relative aspect-video overflow-hidden rounded-lg transition-all duration-300 ${
                      index === currentGalleryIndex
                        ? 'ring-2 ring-[#00A3E0] scale-95'
                        : 'opacity-70 hover:opacity-100 hover:scale-95'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {index === currentGalleryIndex && (
                      <div className="absolute inset-0 bg-[#00A3E0]/20"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Gallery Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {GALLERY_IMAGES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToGallerySlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentGalleryIndex
                      ? 'w-8 h-2 bg-[#00A3E0]'
                      : 'w-2 h-2 bg-[#dce1e8] hover:bg-[#00A3E0]/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Facilities Section */}
        <section id="facilities" className="py-24 bg-[#f0f4f8] relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="section-header text-center mb-16">
              <div className="flex justify-center items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center border-2 border-[#00A3E0]">
                  <Zap className="h-6 w-6 text-[#00A3E0]" />
                </div>
                <div>
                  <div className="w-16 h-[3px] bg-[#00A3E0] mx-auto"></div>
                  <div className="w-24 h-[3px] bg-[#005B96] mx-auto mt-1"></div>
                  <div className="w-32 h-[3px] bg-[#003366] mx-auto mt-1"></div>
                </div>
              </div>
              <span className="inline-block bg-white text-[#1a1a1a] px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase mb-4 border-l-4 border-[#00A3E0]">
                Facilities
              </span>
              <h2 className="text-5xl lg:text-6xl font-bold text-[#1a1a1a] mb-4 tracking-tight">
                Our Premium<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A3E0] to-[#003366]">Facilities</span>
              </h2>
              <p className="text-[#666] max-w-2xl mx-auto text-lg tracking-wide">
                State-of-the-art infrastructure for holistic development
              </p>
            </div>

            <div ref={facilitiesRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {facilities.map((facility, index) => (
                <div
                  key={index}
                  className="group bg-white p-6 text-center hover:bg-[#f0f4f8] hover:border-2 hover:border-[#00A3E0] transition-all duration-500 hover:-translate-y-2 cursor-pointer rounded-lg"
                >
                  <div className="bg-[#f0f4f8] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#00A3E0] transition-colors border-2 border-[#e8edf3] group-hover:border-[#00A3E0]">
                    <facility.icon className="h-8 w-8 text-[#1a1a1a] group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-[#1a1a1a]">{facility.label}</p>
                  <p className="text-[10px] text-[#666] mt-1">{facility.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-24 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#f0f4f8] to-transparent pointer-events-none"></div>
          <div className="container mx-auto px-4 relative">
            <div className="section-header text-center mb-16">
              <div className="flex justify-center items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center border-2 border-[#00A3E0]">
                  <Zap className="h-6 w-6 text-[#00A3E0]" />
                </div>
                <div>
                  <div className="w-16 h-[3px] bg-[#00A3E0] mx-auto"></div>
                  <div className="w-24 h-[3px] bg-[#005B96] mx-auto mt-1"></div>
                  <div className="w-32 h-[3px] bg-[#003366] mx-auto mt-1"></div>
                </div>
              </div>
              <span className="inline-block bg-[#f0f4f8] text-[#1a1a1a] px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase mb-4 border-l-4 border-[#00A3E0]">
                Testimonials
              </span>
              <h2 className="text-5xl lg:text-6xl font-bold text-[#1a1a1a] mb-4 tracking-tight">
                What Parents<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A3E0] to-[#003366]">Say</span>
              </h2>
              <p className="text-[#666] max-w-2xl mx-auto text-lg tracking-wide">
                Real stories from our school community
              </p>
            </div>

            <div ref={testimonialsRef} className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-[#f0f4f8] p-8 border-l-4 border-[#00A3E0] hover:border-[#003366] transition-all duration-500 hover:-translate-y-2 shadow-lg group rounded-r-lg"
                >
                  <div className="flex items-center mb-6">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full border-2 border-[#00A3E0]"
                      loading="lazy"
                    />
                    <div className="ml-4">
                      <h4 className="font-bold text-[#1a1a1a] text-lg">{testimonial.name}</h4>
                      <p className="text-xs text-[#666]">{testimonial.role}</p>
                      <p className="text-[10px] text-[#00A3E0] mt-0.5">{testimonial.date}</p>
                    </div>
                  </div>
                  <p className="text-[#555] leading-relaxed mb-4">"{testimonial.text}"</p>
                  <div className="flex items-center justify-between">
                    <div className="flex text-[#00A3E0]">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <div className="flex items-center text-[10px] text-[#666]">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      <span>Verified</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-[#1a1a1a] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-96 h-96 bg-[#00A3E0] rounded-full blur-3xl -translate-x-48 -translate-y-48"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#005B96] rounded-full blur-3xl translate-x-48 translate-y-48"></div>
          </div>
          <div className="absolute top-0 left-0 w-full h-1 flex">
            <div className="w-1/4 bg-[#00A3E0]"></div>
            <div className="w-1/4 bg-[#005B96]"></div>
            <div className="w-1/4 bg-[#003366]"></div>
            <div className="w-1/4 bg-[#00A3E0]"></div>
          </div>

          <div ref={ctaContentRef} className="container mx-auto px-4 text-center relative">
            <div className="flex justify-center items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-[#00A3E0] rounded-full flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="w-16 h-[3px] bg-[#00A3E0] mx-auto"></div>
                <div className="w-24 h-[3px] bg-[#005B96] mx-auto mt-1"></div>
                <div className="w-32 h-[3px] bg-[#003366] mx-auto mt-1"></div>
              </div>
            </div>

            <h2 className="text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
              Ready to<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A3E0] via-[#005B96] to-[#003366] animate-gradient">
                Accelerate Learning?
              </span>
            </h2>

            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto tracking-wide">
              Join us for the academic year {currentYear}-{currentYear + 1}.
              Limited seats available. Apply today!
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/login"
                ref={(el) => (magneticRefs.current[2] = el)}
                className="px-10 py-4 bg-[#00A3E0] text-white font-bold tracking-[0.1em] uppercase text-sm hover:bg-[#005B96] transition-colors shadow-lg hover:shadow-xl rounded-lg will-change-transform"
              >
                Apply Now
              </Link>
              <Link
                to="/login"
                ref={(el) => (magneticRefs.current[3] = el)}
                className="px-10 py-4 border-2 border-white text-white font-bold tracking-[0.1em] uppercase text-sm hover:bg-white hover:text-[#1a1a1a] transition-colors rounded-lg will-change-transform"
              >
                Parent Login
              </Link>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 bg-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-[#f0f4f8] to-transparent opacity-50 pointer-events-none"></div>
          <div className="container mx-auto px-4 relative">
            <div className="section-header text-center mb-16">
              <div className="flex justify-center items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center border-2 border-[#00A3E0]">
                  <Zap className="h-6 w-6 text-[#00A3E0]" />
                </div>
                <div>
                  <div className="w-16 h-[3px] bg-[#00A3E0] mx-auto"></div>
                  <div className="w-24 h-[3px] bg-[#005B96] mx-auto mt-1"></div>
                  <div className="w-32 h-[3px] bg-[#003366] mx-auto mt-1"></div>
                </div>
              </div>
              <span className="inline-block bg-[#f0f4f8] text-[#1a1a1a] px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase mb-4 border-l-4 border-[#00A3E0]">
                Contact
              </span>
              <h2 className="text-5xl lg:text-6xl font-bold text-[#1a1a1a] mb-4 tracking-tight">
                Get in<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A3E0] to-[#003366]">Touch</span>
              </h2>
              <p className="text-[#666] max-w-2xl mx-auto text-lg tracking-wide">
                We'd love to hear from you. Visit us or reach out!
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16">
              <div ref={contactItemsRef} className="space-y-6">
                {[
                  {
                    icon: MapPin,
                    title: "Visit Us",
                    content: (
                      <>
                        Trishul Campus, Trishul School,<br />
                        KB Extension, near Trishul Kala Bhavana,<br />
                        Davanagere, Karnataka - 577002
                      </>
                    ),
                    link: "Get Directions",
                    href: "https://maps.google.com"
                  },
                  {
                    icon: Phone,
                    title: "Call Us",
                    content: (
                      <>
                        <a href={`tel:${CONFIG.contact.phone}`} className="hover:text-[#00A3E0] transition-colors block font-bold">
                          {CONFIG.contact.phone}
                        </a>
                        <a href={`tel:${CONFIG.contact.phoneAlt}`} className="hover:text-[#00A3E0] transition-colors block font-bold">
                          {CONFIG.contact.phoneAlt}
                        </a>
                        <p className="text-xs text-[#666] mt-2">{CONFIG.contact.hours}</p>
                      </>
                    )
                  },
                  {
                    icon: Mail,
                    title: "Email Us",
                    content: (
                      <>
                        <a href={`mailto:${CONFIG.contact.email}`} className="hover:text-[#00A3E0] transition-colors font-bold">
                          {CONFIG.contact.email}
                        </a>
                        <p className="text-xs text-[#666] mt-2">We respond within 24 hours</p>
                      </>
                    )
                  }
                ].map((item, index) => (
                  <div
                    key={index}
                    className="group bg-[#f0f4f8] p-6 hover:bg-white hover:border-2 hover:border-[#00A3E0] transition-all duration-500 border-l-4 border-[#00A3E0] rounded-r-lg"
                  >
                    <div className="flex items-start">
                      <div className="bg-white p-3 rounded-full group-hover:bg-[#00A3E0] transition-colors">
                        <item.icon className="h-6 w-6 text-[#1a1a1a] group-hover:text-white transition-colors" />
                      </div>
                      <div className="ml-6">
                        <h4 className="font-bold text-[#1a1a1a] text-lg mb-2">{item.title}</h4>
                        <div className="text-[#555] leading-relaxed">{item.content}</div>
                        {item.link && (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center mt-3 text-[#1a1a1a] font-bold text-sm tracking-[0.1em] uppercase hover:text-[#00A3E0] transition-colors"
                          >
                            {item.link} <ExternalLink className="h-4 w-4 ml-1" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Social Follow */}
                <div className="bg-[#1a1a1a] p-8 border-l-4 border-[#00A3E0] rounded-r-lg">
                  <h4 className="font-bold text-white text-lg mb-4 tracking-tight">Follow Us</h4>
                  <div className="flex space-x-4">
                    {[
                      { Icon: FaFacebookF, href: CONFIG.social.facebook, label: 'Facebook' },
                      { Icon: FaTwitter, href: CONFIG.social.twitter, label: 'Twitter' },
                      { Icon: FaInstagram, href: CONFIG.social.instagram, label: 'Instagram' },
                      { Icon: FaYoutube, href: CONFIG.social.youtube, label: 'YouTube' },
                      { Icon: FaLinkedinIn, href: CONFIG.social.linkedin, label: 'LinkedIn' }
                    ].map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        className="bg-white/10 p-3 rounded-full hover:bg-[#00A3E0] transition-all hover:scale-110"
                        aria-label={social.label}
                      >
                        <social.Icon className="h-5 w-5 text-white" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <form ref={contactFormRef} onSubmit={handleSubmit} className="bg-[#f0f4f8] p-10 border-2 border-[#e8edf3] hover:border-[#00A3E0] transition rounded-lg">
                <h3 className="text-3xl font-bold text-[#1a1a1a] mb-8 tracking-tight">Send a Message</h3>
                <div className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-[#1a1a1a] font-bold mb-2 text-xs tracking-[0.1em] uppercase">
                      Full Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-5 py-3.5 border-2 ${
                        formErrors.name ? 'border-red-500' : 'border-[#dce1e8]'
                      } focus:outline-none focus:border-[#00A3E0] transition bg-white rounded-lg`}
                      placeholder="Enter your full name"
                      aria-invalid={!!formErrors.name}
                      aria-describedby={formErrors.name ? 'name-error' : undefined}
                      required
                    />
                    {formErrors.name && (
                      <p id="name-error" className="mt-1 text-xs text-red-500">{formErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-[#1a1a1a] font-bold mb-2 text-xs tracking-[0.1em] uppercase">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-5 py-3.5 border-2 ${
                        formErrors.email ? 'border-red-500' : 'border-[#dce1e8]'
                      } focus:outline-none focus:border-[#00A3E0] transition bg-white rounded-lg`}
                      placeholder="your@email.com"
                      aria-invalid={!!formErrors.email}
                      aria-describedby={formErrors.email ? 'email-error' : undefined}
                      required
                    />
                    {formErrors.email && (
                      <p id="email-error" className="mt-1 text-xs text-red-500">{formErrors.email}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-[#1a1a1a] font-bold mb-2 text-xs tracking-[0.1em] uppercase">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3.5 border-2 border-[#dce1e8] focus:outline-none focus:border-[#00A3E0] transition bg-white rounded-lg"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-[#1a1a1a] font-bold mb-2 text-xs tracking-[0.1em] uppercase">
                      Your Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleInputChange}
                      className={`w-full px-5 py-3.5 border-2 ${
                        formErrors.message ? 'border-red-500' : 'border-[#dce1e8]'
                      } focus:outline-none focus:border-[#00A3E0] transition bg-white rounded-lg resize-none`}
                      placeholder="How can we help you?"
                      aria-invalid={!!formErrors.message}
                      aria-describedby={formErrors.message ? 'message-error' : undefined}
                      required
                    ></textarea>
                    {formErrors.message && (
                      <p id="message-error" className="mt-1 text-xs text-red-500">{formErrors.message}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#00A3E0] text-white font-bold tracking-[0.1em] uppercase text-sm hover:bg-[#005B96] transition-all hover:scale-105 flex items-center justify-center group shadow-lg hover:shadow-xl rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-white pt-16 pb-8 border-t-4 border-[#00A3E0] relative">
        <div className="absolute top-0 left-0 w-full h-1 flex">
          <div className="w-1/4 bg-[#00A3E0]"></div>
          <div className="w-1/4 bg-[#005B96]"></div>
          <div className="w-1/4 bg-[#003366]"></div>
          <div className="w-1/4 bg-[#00A3E0]"></div>
        </div>

        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <Link to="/" className="flex items-center space-x-3 mb-6 group">
                <div className="bg-[#00A3E0] p-2.5 rounded-full">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold tracking-tight">Trishul</span>
                  <span className="block text-[10px] text-gray-400 font-semibold tracking-[0.15em] uppercase">High School</span>
                </div>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed">
                Empowering young minds with quality education and values since 2010.
              </p>
              <div className="mt-4 flex space-x-3">
                {[
                  { Icon: FaFacebookF, href: CONFIG.social.facebook, label: 'Facebook' },
                  { Icon: FaTwitter, href: CONFIG.social.twitter, label: 'Twitter' },
                  { Icon: FaInstagram, href: CONFIG.social.instagram, label: 'Instagram' }
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="text-gray-400 hover:text-[#00A3E0] transition-colors"
                    aria-label={social.label}
                  >
                    <social.Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6 text-white tracking-tight">Quick Links</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li>
                  <button onClick={() => scrollToSection('about')} className="hover:text-[#00A3E0] transition-colors flex items-center">
                    <ChevronRight className="h-3 w-3 mr-2" /> About Us
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('programs')} className="hover:text-[#00A3E0] transition-colors flex items-center">
                    <ChevronRight className="h-3 w-3 mr-2" /> Programs
                  </button>
                </li>
                <li>
                  <Link to="/login" className="hover:text-[#00A3E0] transition-colors flex items-center">
                    <ChevronRight className="h-3 w-3 mr-2" /> Admissions
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-[#00A3E0] transition-colors flex items-center">
                    <ChevronRight className="h-3 w-3 mr-2" /> Calendar
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6 text-white tracking-tight">Resources</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li>
                  <Link to="/login" className="hover:text-[#00A3E0] transition-colors flex items-center">
                    <ChevronRight className="h-3 w-3 mr-2" /> Student Portal
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-[#00A3E0] transition-colors flex items-center">
                    <ChevronRight className="h-3 w-3 mr-2" /> Parent Portal
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-[#00A3E0] transition-colors flex items-center">
                    <ChevronRight className="h-3 w-3 mr-2" /> Library
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-[#00A3E0] transition-colors flex items-center">
                    <ChevronRight className="h-3 w-3 mr-2" /> Dashboard Login
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6 text-white tracking-tight">Contact Info</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex items-start">
                  <Phone className="h-4 w-4 mr-3 mt-0.5 text-[#00A3E0]" />
                  <span>{CONFIG.contact.phone} / {CONFIG.contact.phoneAlt}</span>
                </li>
                <li className="flex items-start">
                  <Mail className="h-4 w-4 mr-3 mt-0.5 text-[#00A3E0]" />
                  <span>{CONFIG.contact.email}</span>
                </li>
                <li className="flex items-start">
                  <MapPin className="h-4 w-4 mr-3 mt-0.5 text-[#00A3E0]" />
                  <span>{CONFIG.contact.address}</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#333] mt-12 pt-8 text-center text-gray-500 text-xs tracking-wider">
            <p>© {currentYear} Trishul High School, Davangere. All rights reserved.</p>
            <p className="mt-1">Designed with ❤️ for education excellence</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float 4s ease-in-out infinite 2s;
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease-in-out infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
