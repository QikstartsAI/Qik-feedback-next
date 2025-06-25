"use client";
import { useState, useEffect } from "react";
import { CardFooter } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Star,
  Heart,
  MapPin,
  Plus,
  User,
  Gift,
  CalendarIcon,
  Navigation,
  Search,
  Trophy,
  Zap,
  QrCode,
  Eye,
  Crown,
  Diamond,
  Award,
  Copy,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Share2,
  Camera,
  Upload,
  Utensils,
  SpadeIcon as Spa,
  Film,
  Coffee,
  Building,
  MessageCircle,
  Settings,
  Trash2,
  Edit,
  Mic,
  Type,
} from "lucide-react";

export default function QikLoyaltyPlatform() {
  const translations = {
    es: {
      welcome: "¡Bienvenido!",
      opinion: "Valoramos tu opinión",
      seconds: "Te tomará menos de 60 segundos",
      newCustomer: "Cliente nuevo",
      frequentCustomer: "Cliente frecuente",
      leaveReview: "Dejar una reseña",
      loyaltyProgram: "Programa de fidelización",
      phone: "Teléfono",
      fullName: "Nombre completo",
      whereKnow: "¿De dónde nos conoces?",
      continue: "Continuar",
      accessProgram: "Acceder al programa",
    },
    en: {
      welcome: "Welcome!",
      opinion: "We value your opinion",
      seconds: "It will take you less than 60 seconds",
      newCustomer: "New customer",
      frequentCustomer: "Frequent customer",
      leaveReview: "Leave a review",
      loyaltyProgram: "Loyalty program",
      phone: "Phone",
      fullName: "Full name",
      whereKnow: "How did you hear about us?",
      continue: "Continue",
      accessProgram: "Access program",
    },
  };

  // Datos de negocios - moved to top
  const businesses = {
    "la-romagna": {
      name: "La Romagna",
      type: "Restaurante Italiano",
      rating: 4.9,
      reviews: 950,
      distance: 0.2,
      image: "/restaurant-bg.jpg",
      logo: "/logo.png",
      phone: "+593995679002",
      location: "https://maps.app.goo.gl/XAC4siBa1Jx11Vru8",
      icon: <Utensils className="h-4 w-4" />,
      cardProgress: { current: 3, total: 10 },
      nextBenefit: "15% descuento en pizzas",
      expiryDate: "31 Jul 2025",
      isNew: false,
      todaysBenefits: [
        {
          id: "pizza-2x1",
          title: "2x1 en Pizzas",
          description: "Válido para pizzas medianas y grandes",
          image: "/placeholder.svg?height=60&width=60",
          visitRequired: 3,
          type: "visit",
        },
      ],
      pointsBenefits: [
        {
          id: "wine-glass",
          title: "Copa de vino gratis",
          points: 500,
          available: true,
          image: "/placeholder.svg?height=60&width=60",
        },
        {
          id: "dessert-free",
          title: "Postre gratis",
          points: 800,
          available: true,
          image: "/placeholder.svg?height=60&width=60",
        },
        {
          id: "dinner-discount",
          title: "25% descuento cena",
          points: 1500,
          available: false,
          pointsNeeded: 250,
          image: "/placeholder.svg?height=60&width=60",
        },
      ],
    },
    "sushi-fusion": {
      name: "Sushi Fusion",
      type: "Restaurante Japonés",
      rating: 4.7,
      reviews: 420,
      distance: 0.8,
      image: "/placeholder.svg?height=200&width=300",
      logo: "/placeholder.svg?height=60&width=60",
      phone: "+593995679002",
      location: "https://maps.app.goo.gl/XAC4siBa1Jx11Vru8",
      icon: <Utensils className="h-4 w-4" />,
      cardProgress: { current: 7, total: 10 },
      nextBenefit: "Sushi gratis",
      expiryDate: "15 Ago 2025",
      isNew: false,
    },
    "spa-relax": {
      name: "Spa Relax",
      type: "Spa & Wellness",
      rating: 4.8,
      reviews: 320,
      distance: 1.2,
      image: "/placeholder.svg?height=200&width=300",
      logo: "/placeholder.svg?height=60&width=60",
      phone: "+593995679002",
      location: "https://maps.app.goo.gl/XAC4siBa1Jx11Vru8",
      icon: <Spa className="h-4 w-4" />,
      cardProgress: { current: 0, total: 8 },
      nextBenefit: "Masaje gratis",
      expiryDate: "30 Sep 2025",
      isNew: true,
    },
  };

  const [language, setLanguage] = useState("es");

  const t = translations[language as keyof typeof translations];

  const [currentView, setCurrentView] = useState<
    "welcome" | "survey" | "dashboard"
  >("welcome");
  const [step, setStep] = useState(1);
  const [customerType, setCustomerType] = useState<string>("");
  const [frequentCustomerAction, setFrequentCustomerAction] =
    useState<string>("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [acceptPromotions, setAcceptPromotions] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [referralSource, setReferralSource] = useState("");
  const [socialNetwork, setSocialNetwork] = useState("");
  const [otherSource, setOtherSource] = useState("");
  const [rating, setRating] = useState<string>("");
  const [specificIssue, setSpecificIssue] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [showReferralDialog, setShowReferralDialog] = useState(false);
  const [showReservationDialog, setShowReservationDialog] = useState(false);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [showStoryUpload, setShowStoryUpload] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [showGenomeDialog, setShowGenomeDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [activeTab, setActiveTab] = useState("inicio");
  const [selectedBusiness, setSelectedBusiness] = useState("la-romagna");
  const [selectedNewBusiness, setSelectedNewBusiness] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState<string>("");
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [copiedText, setCopiedText] = useState("");
  const [showSocialOptions, setShowSocialOptions] = useState(false);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [showBusinessCard, setShowBusinessCard] = useState(false);
  const [selectedBusinessForCard, setSelectedBusinessForCard] = useState("");
  const [businessFilter, setBusinessFilter] = useState("all");
  const [userBusinesses, setUserBusinesses] = useState(Object.keys(businesses));
  const [showBusinessSearch, setShowBusinessSearch] = useState(false);
  const [businessSearchQuery, setBusinesSearchQuery] = useState("");
  const [ownerForm, setOwnerForm] = useState({
    name: "",
    position: "",
    phone: "",
    branches: "",
  });

  // Reservation form
  const [reservationName, setReservationName] = useState("");
  const [reservationDate, setReservationDate] = useState<Date>();
  const [reservationTime, setReservationTime] = useState("");
  const [reservationPeople, setReservationPeople] = useState("");
  const [reservationRequirements, setReservationRequirements] = useState("");

  // Genome data
  const [genomeInput, setGenomeInput] = useState("");
  const [genomeType, setGenomeType] = useState<"text" | "voice">("text");
  const [genomeProfile, setGenomeProfile] = useState<string[]>([]);
  const [isGenomeProcessing, setIsGenomeProcessing] = useState(false);
  const [genomeEnabled, setGenomeEnabled] = useState(true);
  const [isEditingGenome, setIsEditingGenome] = useState(false);
  const [editingGenomeIndex, setEditingGenomeIndex] = useState(-1);

  const progress = (step / 3) * 100;

  // Datos del usuario (simulados)
  const userData = {
    name: "Ricardo Mendoza",
    phone: "+593 99 123 4567",
    points: 1250,
    level: "Gold",
    ranking: 847,
    totalSavings: 45.5,
    memberSince: "Enero 2024",
    avatar: "👨‍💼",
    benefitsRedeemed: 12,
    pointsToNextLevel: 250,
    nextLevel: "Platinum",
    totalVisits: 23,
    totalBusinesses: 5,
    visits: {
      "la-romagna": 3,
      "sushi-fusion": 7,
      "cafe-central": 2,
    },
  };

  // Simulación de datos de Google Maps
  const googleData = {
    rating: 4.9,
    totalReviews: 950,
    lastReviewDate: "Hace 2 horas",
  };

  // Simulación de reviews recientes
  const recentReviews = [
    {
      name: "María González",
      text: "Excelente pasta, ambiente acogedor",
      rating: 5,
      date: "Hace 2 horas",
    },
    {
      name: "Carlos Ruiz",
      text: "La mejor lasaña de Quito, sin duda",
      rating: 5,
      date: "Hace 5 horas",
    },
    {
      name: "Ana López",
      text: "Servicio impecable y comida deliciosa",
      rating: 5,
      date: "Hace 1 día",
    },
    {
      name: "Pedro Silva",
      text: "Auténtica comida italiana, recomendado",
      rating: 4,
      date: "Hace 2 días",
    },
  ];

  const exploreBusinesses = [
    {
      id: "cine-plaza",
      name: "Cine Plaza",
      type: "Entretenimiento",
      rating: 4.6,
      reviews: 280,
      distance: 2.1,
      image: "/placeholder.svg?height=200&width=300",
      logo: "/placeholder.svg?height=60&width=60",
      icon: <Film className="h-4 w-4" />,
      location: "https://maps.app.goo.gl/n4DZeG75TDY5TRPc6",
    },
    {
      id: "cafe-aroma",
      name: "Café Aroma",
      type: "Cafetería",
      rating: 4.5,
      reviews: 150,
      distance: 0.5,
      image: "/placeholder.svg?height=200&width=300",
      logo: "/placeholder.svg?height=60&width=60",
      icon: <Coffee className="h-4 w-4" />,
      location: "https://maps.app.goo.gl/XAC4siBa1Jx11Vru8",
    },
  ];

  const stories = [
    {
      id: 1,
      user: "María G.",
      image: "/placeholder.svg?height=120&width=120",
      fullImage: "/placeholder.svg?height=600&width=400",
      views: 45,
      likes: 12,
      business: "la-romagna",
      isLiked: false,
    },
    {
      id: 2,
      user: "Carlos R.",
      image: "/placeholder.svg?height=120&width=120",
      fullImage: "/placeholder.svg?height=600&width=400",
      views: 67,
      likes: 23,
      business: "la-romagna",
      isLiked: true,
    },
    {
      id: 3,
      user: "Ana L.",
      image: "/lasagna-spectacular.jpg",
      fullImage: "/lasagna-spectacular.jpg",
      views: 89,
      likes: 34,
      business: "la-romagna",
      isLiked: false,
    },
  ];

  const globalRanking = [
    {
      rank: 1,
      name: "Sofia Martinez",
      points: 15420,
      level: "Diamond",
      avatar: "👩‍🦰",
      country: "🇲🇽",
      visits: 156,
      businesses: 23,
    },
    {
      rank: 2,
      name: "Carlos Ruiz",
      points: 14890,
      level: "Diamond",
      avatar: "👨‍💼",
      country: "🇨🇴",
      visits: 142,
      businesses: 19,
    },
    {
      rank: 3,
      name: "Ana Lopez",
      points: 13250,
      level: "Platinum",
      avatar: "👩‍💻",
      country: "🇦🇷",
      visits: 128,
      businesses: 17,
    },
    {
      rank: 847,
      name: "Ricardo Mendoza",
      points: 1250,
      level: "Gold",
      avatar: "👨‍💼",
      country: "🇪🇨",
      visits: 23,
      businesses: 5,
      isUser: true,
    },
  ];

  const ratingEmojis = [
    {
      id: "terrible",
      emoji: "😡",
      label: "Terrible",
      color: "hover:bg-red-50",
    },
    { id: "bad", emoji: "😞", label: "Malo", color: "hover:bg-orange-50" },
    {
      id: "regular",
      emoji: "😐",
      label: "Regular",
      color: "hover:bg-yellow-50",
    },
    { id: "good", emoji: "😊", label: "Bueno", color: "hover:bg-blue-50" },
    {
      id: "excellent",
      emoji: "🤩",
      label: "Excelente",
      color: "hover:bg-green-50",
    },
  ];

  const restaurantIssues = [
    { id: "food", label: "Comida", emoji: "🍽️" },
    { id: "service", label: "Servicio", emoji: "👥" },
    { id: "environment", label: "Ambiente", emoji: "🏪" },
    { id: "other", label: "Otro", emoji: "💭" },
  ];

  const reviewSuggestions = [
    "¡Deliciosa lasaña, la mejor de Quito! 🍝⭐⭐⭐⭐⭐",
    "¡Increíble pizza italiana! Totalmente recomendado 🍕⭐⭐⭐⭐⭐",
    "Excelente pasta y atención. Mi lugar favorito 🍝❤️",
  ];

  const sources = [
    { id: "google_maps", label: "Google Maps" },
    { id: "whatsapp", label: "WhatsApp" },
    { id: "referral", label: "Referido" },
    { id: "walking", label: "Caminaba" },
    { id: "social_media", label: "Redes sociales" },
    { id: "other", label: "Otro" },
  ];

  const socialNetworks = [
    { id: "google", label: "Google" },
    { id: "instagram", label: "Instagram" },
    { id: "tiktok", label: "TikTok" },
    { id: "facebook", label: "Facebook" },
    { id: "youtube", label: "YouTube" },
  ];

  const timeSlots = [
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
  ];

  const userRecommendations = [
    {
      id: 1,
      friendName: "María López",
      restaurant: "La Romagna",
      status: "pending",
      pointsEarned: 0,
      phone: "+593991234567",
    },
    {
      id: 2,
      friendName: "Carlos Ruiz",
      restaurant: "Sushi Fusion",
      status: "completed",
      pointsEarned: 1000,
      phone: "+593997654321",
    },
  ];

  const businessTypes = {
    all: { count: userBusinesses.length, label: "Todos" },
    restaurant: { count: 3, label: "Restaurantes" },
    spa: { count: 1, label: "Spa" },
    entertainment: { count: 0, label: "Entretenimiento" },
  };

  const [showSuggestBusiness, setShowSuggestBusiness] = useState(false);
  const [suggestedBusinesses, setSuggestedBusinesses] = useState([
    {
      id: "pizza-hut",
      name: "Pizza Hut",
      city: "Quito",
      rating: 4.1,
      reviews: 1235,
      hearts: 15,
      type: "restaurant",
    },
    {
      id: "kfc",
      name: "KFC",
      city: "Guayaquil",
      rating: 4.3,
      reviews: 890,
      hearts: 12,
      type: "restaurant",
    },
    {
      id: "burger-king",
      name: "Burger King",
      city: "Cuenca",
      rating: 4.0,
      reviews: 567,
      hearts: 8,
      type: "restaurant",
    },
  ]);

  // Auto-avance de reviews
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReviewIndex((prev) => (prev + 1) % recentReviews.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-avance de stories
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showStoryViewer) {
      interval = setInterval(() => {
        if (currentStoryIndex < stories.length - 1) {
          setCurrentStoryIndex((prev) => prev + 1);
        } else {
          setShowStoryViewer(false);
          setCurrentStoryIndex(0);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [showStoryViewer, currentStoryIndex]);

  const validatePhone = (phoneNumber: string) => {
    const cleanPhone = phoneNumber.replace("+593 ", "").replace(/\s/g, "");
    if (cleanPhone.length > 10) {
      setPhoneError("Número incorrecto - máximo 10 dígitos");
      return false;
    } else if (cleanPhone.length < 10 && cleanPhone.length > 0) {
      setPhoneError("Número incompleto");
      return false;
    } else {
      setPhoneError("");
      return true;
    }
  };

  const handlePhoneChange = (value: string) => {
    const formattedPhone = "+593 " + value;
    setPhone(formattedPhone);
    validatePhone(formattedPhone);
  };

  const handleSourceSelect = (sourceId: string) => {
    setReferralSource(sourceId);
    setShowSocialOptions(false);
    setShowOtherInput(false);

    if (sourceId === "social_media") {
      setShowSocialOptions(true);
    } else if (sourceId === "other") {
      setShowOtherInput(true);
    } else if (sourceId === "referral") {
      setShowReferralDialog(true);
    }
  };

  const handleSocialSelect = (socialId: string) => {
    setSocialNetwork(socialId);
    setShowSocialOptions(false);
  };

  const handleReferralShare = () => {
    const message = `¡Hola! 🎉

Te regalo 1000 puntos al momento que te unes al programa de fidelidad de algunos de los restaurantes que yo ya he visitado, te van a encantar. 

Mi código: ${userData.phone.replace("+", "").slice(-4)}

Descarga la app: https://qik.app

¡Nos vemos pronto! 🎁

𝘲𝘪𝘬`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    setShowReferralDialog(false);
  };

  const handleCustomerTypeSelect = (type: string) => {
    setCustomerType(type);
  };

  const handleFrequentAction = (action: string) => {
    setFrequentCustomerAction(action);
  };

  const handlePhoneVerification = () => {
    if (phone && !phoneError) {
      if (frequentCustomerAction === "review") {
        setName("Ricardo Mendoza");
        setCurrentView("survey");
        setStep(2);
      } else {
        setShowCodeDialog(true);
      }
    }
  };

  const handleCodeVerification = () => {
    if (verificationCode === "1234") {
      setShowCodeDialog(false);
      setCurrentView("dashboard");
    }
  };

  const handleBenefitRedeem = (benefitId: string) => {
    setSelectedBenefit(benefitId);
    setShowQRCode(true);
  };

  const handleReservation = () => {
    setShowReservationDialog(true);
  };

  const handleReservationSubmit = () => {
    const message = `🍽️ *RESERVA - LA ROMAGNA*

👤 *Nombre:* ${reservationName}
📅 *Fecha:* ${reservationDate?.toLocaleDateString("es-ES")}
🕐 *Hora:* ${reservationTime}
👥 *Personas:* ${reservationPeople}
📝 *Requerimientos:* ${reservationRequirements || "Ninguno"}

*Reserva realizada desde Qik* ✨

𝘲𝘪𝘬`;

    const whatsappUrl = `https://wa.me/0995679002?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
    setShowReservationDialog(false);

    // Reset form
    setReservationName("");
    setReservationDate(undefined);
    setReservationTime("");
    setReservationPeople("");
    setReservationRequirements("");
  };

  const handleJoinBusiness = (businessId: string) => {
    setSelectedNewBusiness(businessId);
    setShowJoinDialog(true);
  };

  const handleJoinConfirm = () => {
    setUserBusinesses((prev) => [...prev, selectedNewBusiness]);
    setShowJoinDialog(false);
    alert(
      `¡Te has unido exitosamente al programa de ${
        exploreBusinesses.find((b) => b.id === selectedNewBusiness)?.name
      }!`
    );
  };

  const copyToClipboard = (text: string) => {
    const textWithSignature = `${text}

𝘲𝘪𝘬`;
    navigator.clipboard.writeText(textWithSignature);
    setCopiedText(text);
    setTimeout(() => setCopiedText(""), 2000);
  };

  const openGoogleMaps = () => {
    window.open("https://g.page/r/CdUpuKOxF_CvEBM/review", "_blank");
    if (customerType === "new") {
      // Para clientes nuevos, enviar WhatsApp con link de cartilla
      setTimeout(() => {
        const message = `¡Gracias por tu reseña! 🌟

Accede a tu cartilla digital y beneficios exclusivos:
https://qik.app/cartilla/${userData.phone}

¡Disfruta de increíbles descuentos! 🎉

𝘲𝘪𝘬`;

        const whatsappUrl = `https://wa.me/${userData.phone.replace(
          "+",
          ""
        )}?text=${encodeURIComponent(message)}`;
        // En producción esto se enviaría automáticamente
        console.log("WhatsApp enviado:", whatsappUrl);
      }, 2000);
    }
    setStep(3);
  };

  const handleIssueToggle = (issueId: string) => {
    setSpecificIssue((prev) =>
      prev.includes(issueId)
        ? prev.filter((id) => id !== issueId)
        : [...prev, issueId]
    );
  };

  const handleStoryClick = (index: number) => {
    setCurrentStoryIndex(index);
    setShowStoryViewer(true);
  };

  const handleStoryLike = (storyId: number) => {
    // Simular like en story
    console.log(`Liked story ${storyId}`);
  };

  const nextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex((prev) => prev + 1);
    } else {
      setShowStoryViewer(false);
      setCurrentStoryIndex(0);
    }
  };

  const prevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prev) => prev - 1);
    }
  };

  const handleZoeAI = () => {
    // Implementar chat con Zoe AI
    alert("¡Zoe AI Premium disponible por $1.99/mes! 🤖✨");
  };

  const handleGenomeProcess = () => {
    setIsGenomeProcessing(true);

    // Simular procesamiento de IA
    setTimeout(() => {
      const mockProfile = [
        "Te gusta la comida italiana 🍝",
        "Prefieres ambientes familiares 👨‍👩‍👧‍👦",
        "Disfrutas de experiencias gastronómicas 🍷",
        "Te interesa el entretenimiento nocturno 🌙",
      ];
      setGenomeProfile(mockProfile);
      setIsGenomeProcessing(false);
      setGenomeInput("");
    }, 3000);
  };

  const handleBusinessOwner = () => {
    const message = `¡Hola Ricardo! 👋

Me gustaría habilitar mi negocio con este increíble sistema de fidelización Qik.

Por favor, ayúdame a activar mi establecimiento para ofrecer beneficios exclusivos a mis clientes.

¡Gracias! 🚀

𝘲𝘪𝘬`;

    const whatsappUrl = `https://wa.me/0995679002?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "Diamond":
        return <Diamond className="h-4 w-4 text-blue-400" />;
      case "Platinum":
        return <Award className="h-4 w-4 text-gray-400" />;
      case "Gold":
        return <Crown className="h-4 w-4 text-yellow-500" />;
      default:
        return <Star className="h-4 w-4 text-gray-400" />;
    }
  };

  const getBusinessIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "restaurante italiano":
      case "restaurante japonés":
        return <Utensils className="h-4 w-4" />;
      case "spa & wellness":
        return <Spa className="h-4 w-4" />;
      case "entretenimiento":
        return <Film className="h-4 w-4" />;
      case "cafetería":
        return <Coffee className="h-4 w-4" />;
      default:
        return <Building className="h-4 w-4" />;
    }
  };

  const canContinueStep1 =
    customerType === "new"
      ? name &&
        phone &&
        !phoneError &&
        referralSource &&
        (!showSocialOptions || socialNetwork) &&
        (!showOtherInput || otherSource)
      : phone && !phoneError && frequentCustomerAction;

  const isPositiveRating = rating === "good" || rating === "excellent";
  const isNegativeRating =
    rating === "terrible" || rating === "bad" || rating === "regular";

  if (currentView === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 via-blue-50 to-white">
        {/* Header con imagen de fondo */}
        <div
          className="relative h-32 bg-cover bg-center"
          style={{ backgroundImage: "url('/restaurant-bg.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10 flex items-center justify-center h-full px-4">
            <div className="flex items-center space-x-3 w-full max-w-md">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="w-8 h-8 rounded-full"
                />
              </div>
              <div className="text-white">
                <h1 className="text-lg font-bold">La Romagna</h1>
                <p className="text-sm text-gray-200">
                  Restaurante Italiano • 0.2 km
                </p>
              </div>
            </div>
          </div>

          {/* Language selector */}
          <div className="absolute top-4 right-4 z-20">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-20 bg-white/90 border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="es">🇪🇸 ES</SelectItem>
                <SelectItem value="en">🇺🇸 EN</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="max-w-md mx-auto p-6 -mt-8 relative z-20">
          {/* Rating de Google Maps */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="font-bold text-lg">{googleData.rating}</span>
              <span className="text-gray-600">({googleData.totalReviews})</span>
            </div>

            {/* Carrusel de Reviews */}
            <div className="bg-gray-50 rounded-lg p-3 relative">
              <div className="flex items-center justify-between">
                <button
                  onClick={() =>
                    setCurrentReviewIndex(
                      (prev) =>
                        (prev - 1 + recentReviews.length) % recentReviews.length
                    )
                  }
                  className="p-1"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-400" />
                </button>
                <div className="flex-1 text-center">
                  <div className="text-xs font-medium">
                    {recentReviews[currentReviewIndex].name}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {recentReviews[currentReviewIndex].text}
                  </div>
                  <div className="flex justify-center mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3 w-3 ${
                          star <= recentReviews[currentReviewIndex].rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {recentReviews[currentReviewIndex].date}
                  </div>
                </div>
                <button
                  onClick={() =>
                    setCurrentReviewIndex(
                      (prev) => (prev + 1) % recentReviews.length
                    )
                  }
                  className="p-1"
                >
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              Última reseña: {googleData.lastReviewDate}
            </div>
          </div>

          <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
            <CardHeader className="text-center pb-4">
              <div className="text-4xl mb-2">😊</div>
              <CardTitle className="text-xl text-gray-800">
                {t.welcome}
              </CardTitle>
              <CardDescription className="text-purple-600 font-medium">
                {t.opinion}
                <br />
                <span className="text-sm text-gray-600">{t.seconds}</span>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Barra de progreso solo para clientes nuevos */}
              {customerType === "new" && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>Encuesta rápida</span>
                    <span>{"< 25 segundos"}</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  ¿Quieres conocerte?
                </Label>
                <RadioGroup
                  value={customerType}
                  onValueChange={handleCustomerTypeSelect}
                  className="grid grid-cols-1 gap-3 mt-2"
                >
                  <div
                    className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all ${
                      customerType === "new"
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200"
                    }`}
                  >
                    <RadioGroupItem value="new" id="new" className="sr-only" />
                    <Label
                      htmlFor="new"
                      className="flex items-center w-full cursor-pointer"
                    >
                      <Star className="h-5 w-5 mr-3 text-yellow-500" />
                      <span className="font-medium">{t.newCustomer}</span>
                    </Label>
                  </div>
                  <div
                    className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all ${
                      customerType === "frequent"
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200"
                    }`}
                  >
                    <RadioGroupItem
                      value="frequent"
                      id="frequent"
                      className="sr-only"
                    />
                    <Label
                      htmlFor="frequent"
                      className="flex items-center w-full cursor-pointer"
                    >
                      <Heart className="h-5 w-5 mr-3 text-red-500" />
                      <span className="font-medium">{t.frequentCustomer}</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {customerType === "frequent" && (
                <div className="space-y-3 animate-in slide-in-from-top duration-300">
                  <Label className="text-sm font-medium text-gray-700">
                    ¿Qué quieres hacer?
                  </Label>
                  <div className="grid grid-cols-1 gap-3">
                    <Button
                      variant={
                        frequentCustomerAction === "review"
                          ? "default"
                          : "outline"
                      }
                      onClick={() => handleFrequentAction("review")}
                      className="h-12 justify-start"
                    >
                      <Star className="h-4 w-4 mr-2" />
                      {t.leaveReview}
                    </Button>
                    <Button
                      variant={
                        frequentCustomerAction === "loyalty"
                          ? "default"
                          : "outline"
                      }
                      onClick={() => handleFrequentAction("loyalty")}
                      className="h-12 justify-start bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      <Gift className="h-4 w-4 mr-2" />
                      {t.loyaltyProgram}
                    </Button>
                  </div>
                </div>
              )}

              {(customerType === "new" || frequentCustomerAction) && (
                <div className="space-y-4 animate-in slide-in-from-top duration-300">
                  <div>
                    <Label
                      htmlFor="phone"
                      className="text-sm font-medium text-gray-700"
                    >
                      {t.phone}
                    </Label>
                    <div className="flex mt-1">
                      <div className="flex items-center px-3 bg-gray-50 border border-r-0 rounded-l-md">
                        <span className="text-lg">🇪🇨</span>
                        <span className="ml-1 text-sm">+593</span>
                      </div>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="99 123 4567"
                        value={phone.replace("+593 ", "")}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        className="rounded-l-none"
                        maxLength={10}
                      />
                    </div>
                    {phoneError && (
                      <p className="text-red-500 text-xs mt-1">{phoneError}</p>
                    )}
                  </div>

                  {customerType === "new" && (
                    <>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="promotions"
                          checked={acceptPromotions}
                          onCheckedChange={(checked) =>
                            setAcceptPromotions(checked as boolean)
                          }
                        />
                        <Label htmlFor="promotions" className="text-sm">
                          Acepto recibir promociones por{" "}
                          <span className="text-green-600 font-medium">
                            WhatsApp
                          </span>
                        </Label>
                      </div>

                      <div>
                        <Label
                          htmlFor="name"
                          className="text-sm font-medium text-gray-700"
                        >
                          {t.fullName}
                        </Label>
                        <Input
                          id="name"
                          placeholder="Tu nombre completo"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          {t.whereKnow}
                        </Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {sources.map((source) => (
                            <button
                              key={source.id}
                              onClick={() => handleSourceSelect(source.id)}
                              className={`p-2 text-center rounded-lg border transition-all text-xs ${
                                referralSource === source.id
                                  ? "border-purple-500 bg-purple-50 border-2"
                                  : "border-gray-300 hover:border-gray-400"
                              }`}
                            >
                              {source.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Opciones de redes sociales */}
                      {showSocialOptions && (
                        <div>
                          <Label className="text-sm font-medium">
                            ¿Cuál red social?
                          </Label>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {socialNetworks.map((social) => (
                              <button
                                key={social.id}
                                onClick={() => handleSocialSelect(social.id)}
                                className={`p-2 text-center rounded-lg border transition-all text-xs ${
                                  socialNetwork === social.id
                                    ? "border-purple-500 bg-purple-50 border-2"
                                    : "border-gray-300 hover:border-gray-400"
                                }`}
                              >
                                {social.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Campo "Otro" */}
                      {showOtherInput && (
                        <div>
                          <Input
                            placeholder="Especifica dónde nos conociste"
                            value={otherSource}
                            onChange={(e) => setOtherSource(e.target.value)}
                            className="mt-2"
                          />
                        </div>
                      )}
                    </>
                  )}

                  <Button
                    onClick={() => {
                      if (customerType === "new") {
                        setCurrentView("survey");
                        setStep(2);
                      } else {
                        handlePhoneVerification();
                      }
                    }}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    disabled={!canContinueStep1}
                  >
                    {frequentCustomerAction === "loyalty"
                      ? t.accessProgram
                      : t.continue}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Dialog para referidos */}
        <Dialog open={showReferralDialog} onOpenChange={setShowReferralDialog}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-center">
                ¡Comparte y gana!
              </DialogTitle>
              <DialogDescription className="text-center">
                Invita a tus amigos y ambos ganan 1000 puntos
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-3 bg-green-50 rounded-lg text-sm">
                <p className="font-medium mb-2">Mensaje que se enviará:</p>
                <p className="text-gray-700">
                  ¡Hola! Te regalo 1000 puntos al momento que te unes al
                  programa de fidelidad...
                </p>
              </div>
              <Button
                onClick={handleReferralShare}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Compartir por WhatsApp
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog para código de verificación */}
        <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-center">
                Código de verificación
              </DialogTitle>
              <DialogDescription className="text-center">
                Hemos enviado un código a tu WhatsApp
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Ingresa el código de 4 dígitos"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={4}
                className="text-center text-lg"
              />
              <Button
                onClick={handleCodeVerification}
                className="w-full"
                disabled={verificationCode.length !== 4}
              >
                Verificar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (currentView === "survey") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 via-blue-50 to-white">
        <div
          className="relative h-32 bg-cover bg-center"
          style={{ backgroundImage: "url('/restaurant-bg.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative z-10 flex items-center justify-center h-full">
            <h1 className="text-2xl font-bold text-white">La Romagna</h1>
          </div>
        </div>

        <div className="max-w-md mx-auto p-6 -mt-8 relative z-20">
          {/* Barra de progreso */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Encuesta rápida</span>
              <span>{"< 25 segundos"}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
            {step === 2 && (
              <>
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">
                    ¿Cómo fue tu experiencia?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-2">
                    {ratingEmojis.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setRating(item.id)}
                        className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center justify-center ${
                          rating === item.id
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200"
                        } ${item.color}`}
                      >
                        <div className="text-2xl mb-1">{item.emoji}</div>
                        <div className="text-xs font-medium text-center">
                          {item.label}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Feedback negativo */}
                  {isNegativeRating && (
                    <div className="mt-6 space-y-4">
                      <div>
                        <Label className="text-sm font-medium">
                          ¿Qué podemos mejorar?
                        </Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {restaurantIssues.map((issue) => (
                            <button
                              key={issue.id}
                              onClick={() => handleIssueToggle(issue.id)}
                              className={`p-3 rounded-lg border-2 transition-all text-sm ${
                                specificIssue.includes(issue.id)
                                  ? "border-orange-500 bg-orange-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <div className="text-lg mb-1">{issue.emoji}</div>
                              <div className="font-medium">{issue.label}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                      <Textarea
                        placeholder="Cuéntanos más detalles (opcional)"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="min-h-[80px]"
                      />

                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="terms"
                            checked={acceptTerms}
                            onCheckedChange={(checked) =>
                              setAcceptTerms(checked as boolean)
                            }
                          />
                          <Label
                            htmlFor="terms"
                            className="text-xs text-gray-600 leading-tight"
                          >
                            Al presionar "Enviar", acepto los Términos y
                            Condiciones y las Políticas de Privacidad.
                          </Label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Feedback positivo */}
                  {isPositiveRating && (
                    <div className="mt-6 space-y-4">
                      <div className="text-center">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                        <h3 className="font-bold text-green-600">
                          ¡Gracias {name.split(" ")[0]}!
                        </h3>
                        <p className="text-sm text-gray-600">
                          +500 puntos agregados
                        </p>
                      </div>

                      {/* Stories de clientes */}
                      <div>
                        <Label className="text-sm font-medium mb-3 block">
                          Mira lo que otros clientes comparten:
                        </Label>
                        <div className="flex space-x-3 overflow-x-auto pb-2">
                          {/* Botón para subir story */}
                          <div className="flex-shrink-0">
                            <button
                              onClick={() => setShowStoryUpload(true)}
                              className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                              <Plus className="h-6 w-6 text-gray-400" />
                            </button>
                            <p className="text-xs text-center mt-1 text-gray-500">
                              Tu story
                            </p>
                          </div>

                          {/* Stories de otros clientes */}
                          {stories.map((story, index) => (
                            <div key={story.id} className="flex-shrink-0">
                              <button
                                onClick={() => handleStoryClick(index)}
                                className="relative w-16 h-16 rounded-full border-2 border-orange-400 p-0.5 hover:border-orange-500 transition-colors"
                              >
                                <img
                                  src={story.image || "/placeholder.svg"}
                                  alt={`Story de ${story.user}`}
                                  className="w-full h-full rounded-full object-cover"
                                />
                                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                                  <div className="flex items-center space-x-1 text-xs">
                                    <Eye className="h-2 w-2" />
                                    <span className="text-xs">
                                      {story.views}
                                    </span>
                                    <Heart
                                      className={`h-2 w-2 ${
                                        story.isLiked
                                          ? "text-red-500 fill-red-500"
                                          : "text-gray-400"
                                      }`}
                                    />
                                    <span className="text-xs">
                                      {story.likes}
                                    </span>
                                  </div>
                                </div>
                              </button>
                              <p className="text-xs text-center mt-1 text-gray-600">
                                {story.user}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">
                          ¿Nos ayudas con una reseña?
                        </Label>
                        <div className="space-y-2 mt-2">
                          {reviewSuggestions.map((suggestion, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <div className="flex-1 p-2 bg-gray-50 rounded text-xs">
                                {suggestion}
                                <div className="text-right mt-1">
                                  <span className="text-xs italic text-gray-400 font-light">
                                    qik
                                  </span>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(suggestion)}
                                className="px-2"
                              >
                                {copiedText === suggestion ? (
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-start space-x-2">
                            <Checkbox
                              id="terms-positive"
                              checked={acceptTerms}
                              onCheckedChange={(checked) =>
                                setAcceptTerms(checked as boolean)
                              }
                            />
                            <Label
                              htmlFor="terms-positive"
                              className="text-xs text-gray-600 leading-tight"
                            >
                              Al continuar, acepto los Términos y Condiciones y
                              las Políticas de Privacidad.
                            </Label>
                          </div>
                        </div>

                        <Button
                          onClick={openGoogleMaps}
                          className="w-full mt-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                          disabled={!acceptTerms}
                        >
                          <MapPin className="mr-2 h-4 w-4" />
                          Escribir mi reseña en Google
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
                {isNegativeRating && (
                  <CardFooter>
                    <Button
                      onClick={() => setStep(3)}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      disabled={
                        !rating || specificIssue.length === 0 || !acceptTerms
                      }
                    >
                      Enviar feedback
                    </Button>
                  </CardFooter>
                )}
              </>
            )}

            {step === 3 && (
              <>
                <CardHeader className="text-center">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <CardTitle className="text-xl text-green-600">
                    ¡Gracias!
                  </CardTitle>
                  <CardDescription>
                    Tu opinión es muy valiosa para nosotros
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-gray-600">
                    {isPositiveRating
                      ? "¡Esperamos verte pronto de nuevo!"
                      : "Trabajaremos para mejorar tu próxima experiencia."}
                  </p>
                  {customerType === "new" && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        📱 Te enviaremos un WhatsApp con el link a tu cartilla
                        digital para que disfrutes de beneficios exclusivos.
                      </p>
                    </div>
                  )}
                </CardContent>
              </>
            )}
          </Card>
        </div>

        {/* Visor de Stories */}
        <Dialog open={showStoryViewer} onOpenChange={setShowStoryViewer}>
          <DialogContent className="max-w-sm p-0 bg-black border-0">
            <div className="relative h-[600px] w-full">
              <div className="absolute top-2 left-2 right-2 flex space-x-1 z-10">
                {stories.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 flex-1 rounded-full ${
                      index <= currentStoryIndex ? "bg-white" : "bg-white/30"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setShowStoryViewer(false)}
                className="absolute top-4 right-4 z-10 text-white hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="relative h-full w-full">
                <img
                  src={
                    stories[currentStoryIndex]?.fullImage || "/placeholder.svg"
                  }
                  alt={`Story de ${stories[currentStoryIndex]?.user}`}
                  className="h-full w-full object-cover"
                />

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <div className="text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">
                          {stories[currentStoryIndex]?.user}
                        </p>
                        <div className="flex items-center space-x-3 text-sm">
                          <div className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>{stories[currentStoryIndex]?.views}</span>
                          </div>
                          <button
                            onClick={() =>
                              handleStoryLike(stories[currentStoryIndex]?.id)
                            }
                            className="flex items-center space-x-1"
                          >
                            <Heart
                              className={`h-3 w-3 ${
                                stories[currentStoryIndex]?.isLiked
                                  ? "text-red-500 fill-red-500"
                                  : "text-white"
                              }`}
                            />
                            <span>{stories[currentStoryIndex]?.likes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={prevStory}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                  disabled={currentStoryIndex === 0}
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                  onClick={nextStory}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog para subir story */}
        <Dialog open={showStoryUpload} onOpenChange={setShowStoryUpload}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-center">
                ¡Comparte tu experiencia!
              </DialogTitle>
              <DialogDescription className="text-center">
                Sube una foto de tu comida favorita
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setShowStoryUpload(false);
                    alert(
                      "¡Gracias por compartir! Tu story será revisada y publicada pronto."
                    );
                  }}
                  className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 transition-colors"
                >
                  <Camera className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-xs">Tomar foto</span>
                </button>
                <button
                  onClick={() => {
                    setShowStoryUpload(false);
                    alert(
                      "¡Gracias por compartir! Tu story será revisada y publicada pronto."
                    );
                  }}
                  className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 transition-colors"
                >
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-xs">Subir archivo</span>
                </button>
              </div>
              <p className="text-xs text-center text-gray-600">
                Tu foto será revisada y publicada en nuestras stories
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (currentView === "dashboard") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50">
        {/* Header del usuario */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{userData.avatar}</div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">
                ¡Hola {userData.name.split(" ")[0]} de nuevo!
              </h2>
              <p className="text-purple-100">
                Bienvenido al programa de fidelización
              </p>
            </div>
          </div>
        </div>

        {/* Navegación principal */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="inicio" className="p-4 space-y-6">
            {/* Stories */}
            <div>
              <h3 className="font-semibold mb-3">Stories de la comunidad</h3>
              <div className="flex space-x-3 overflow-x-auto pb-2">
                <div className="flex-shrink-0">
                  <button
                    onClick={() => setShowStoryUpload(true)}
                    className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50"
                  >
                    <Plus className="h-6 w-6 text-gray-400" />
                  </button>
                  <p className="text-xs text-center mt-1">Tu story</p>
                </div>
                {stories.map((story, index) => (
                  <div key={story.id} className="flex-shrink-0">
                    <div className="relative">
                      <button
                        onClick={() => handleStoryClick(index)}
                        className="w-16 h-16 rounded-full border-2 border-purple-400 p-0.5"
                      >
                        <img
                          src={story.image || "/placeholder.svg"}
                          alt={`Story de ${story.user}`}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </button>
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                        <div className="flex items-center space-x-1 text-xs">
                          <Eye className="h-2 w-2" />
                          <span className="text-xs">{story.views}</span>
                          <Heart
                            className={`h-2 w-2 ${
                              story.isLiked
                                ? "text-red-500 fill-red-500"
                                : "text-gray-400"
                            }`}
                          />
                          <span className="text-xs">{story.likes}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-center mt-1 text-gray-600">
                      {story.user}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Restaurante actual */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        businesses[selectedBusiness].logo || "/placeholder.svg"
                      }
                      alt={`Logo ${businesses[selectedBusiness].name}`}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <CardTitle className="text-lg flex items-center">
                        Hoy estás en
                        <span className="ml-2">
                          {getBusinessIcon(businesses[selectedBusiness].type)}
                        </span>
                      </CardTitle>
                      <CardDescription className="text-purple-600 font-medium">
                        {businesses[selectedBusiness].name}
                      </CardDescription>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className="h-3 w-3 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                        <span className="text-xs font-medium">
                          {businesses[selectedBusiness].rating}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({businesses[selectedBusiness].reviews})
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    Actual
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Beneficios del restaurante */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Beneficios en {businesses[selectedBusiness].name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="hoy" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="hoy">Hoy</TabsTrigger>
                    <TabsTrigger value="visitas">Cartilla</TabsTrigger>
                    <TabsTrigger value="puntos">Puntos</TabsTrigger>
                  </TabsList>

                  <TabsContent value="hoy" className="space-y-4">
                    {businesses[selectedBusiness].todaysBenefits.map(
                      (benefit) => (
                        <div
                          key={benefit.id}
                          className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg"
                        >
                          <img
                            src={benefit.image || "/placeholder.svg"}
                            alt={benefit.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{benefit.title}</h4>
                            <p className="text-sm text-gray-600">
                              {benefit.description}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleBenefitRedeem(benefit.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Redimir
                          </Button>
                        </div>
                      )
                    )}
                  </TabsContent>

                  <TabsContent value="visitas" className="space-y-4">
                    <div className="text-center">
                      <h4 className="font-medium">Cartilla activa</h4>
                      <p className="text-sm text-gray-600">
                        {businesses[selectedBusiness].name}
                      </p>
                      <div className="mt-2">
                        <span className="text-lg font-bold text-purple-600">
                          Visita{" "}
                          {businesses[selectedBusiness].cardProgress.current}/
                          {businesses[selectedBusiness].cardProgress.total}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                      {Array.from(
                        {
                          length:
                            businesses[selectedBusiness].cardProgress.total,
                        },
                        (_, i) => (
                          <div
                            key={i}
                            className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium ${
                              i <
                              businesses[selectedBusiness].cardProgress.current
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-400"
                            }`}
                          >
                            {i + 1}
                          </div>
                        )
                      )}
                    </div>

                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-sm font-medium">Próximo beneficio:</p>
                      <p className="text-sm text-gray-600">
                        {businesses[selectedBusiness].nextBenefit}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Expira el {businesses[selectedBusiness].expiryDate}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        onClick={() =>
                          window.open(
                            businesses[selectedBusiness].location,
                            "_blank"
                          )
                        }
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        Cómo llegar
                      </Button>
                      <Button onClick={handleReservation}>
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Reservar
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="puntos" className="space-y-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        {userData.points} puntos
                      </p>
                      <p className="text-sm text-gray-600">
                        disponibles para redimir
                      </p>
                    </div>

                    {businesses[selectedBusiness].pointsBenefits.map(
                      (benefit) => (
                        <div
                          key={benefit.id}
                          className={`flex items-center space-x-3 p-3 rounded-lg ${
                            benefit.available ? "bg-blue-50" : "bg-gray-50"
                          }`}
                        >
                          <img
                            src={benefit.image || "/placeholder.svg"}
                            alt={benefit.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{benefit.title}</h4>
                            <p className="text-sm text-gray-600">
                              {benefit.points} puntos
                            </p>
                            {!benefit.available && (
                              <p className="text-xs text-red-600">
                                Te faltan {benefit.pointsNeeded} puntos
                              </p>
                            )}
                          </div>
                          <Button
                            size="sm"
                            disabled={!benefit.available}
                            onClick={() => handleBenefitRedeem(benefit.id)}
                          >
                            {benefit.available ? "Redimir" : "Bloqueado"}
                          </Button>
                        </div>
                      )
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="negocios" className="p-4">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Mis negocios</h3>
                <p className="text-sm text-gray-600">
                  Restaurantes y servicios donde tienes beneficios
                </p>
              </div>

              {/* Lista de negocios del usuario */}
              <div className="space-y-3">
                {Object.entries(businesses).map(([key, business]) => (
                  <Card key={key} className="relative">
                    {business.isNew && (
                      <Badge className="absolute top-2 right-2 bg-green-500 text-white">
                        Nuevo
                      </Badge>
                    )}
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={business.logo || "/placeholder.svg"}
                          alt={`Logo ${business.name}`}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium flex items-center">
                            {business.name}
                            <span className="ml-2">{business.icon}</span>
                          </h4>
                          <p className="text-sm text-gray-600">
                            {business.type}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className="h-3 w-3 fill-yellow-400 text-yellow-400"
                                />
                              ))}
                            </div>
                            <span className="text-xs">
                              {business.rating} ({business.reviews})
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedBusinessForCard(key);
                            setShowBusinessCard(true);
                          }}
                        >
                          Ver cartilla
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recomendaciones */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mis recomendaciones</CardTitle>
                  <CardDescription>
                    Negocios que has recomendado a amigos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userRecommendations.map((recommendation) => (
                      <div
                        key={recommendation.id}
                        className={`flex items-center justify-between p-3 ${
                          recommendation.status === "pending"
                            ? "bg-gray-50"
                            : "bg-green-50"
                        } rounded-lg`}
                      >
                        <div>
                          <p className="font-medium">
                            {recommendation.friendName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {recommendation.restaurant} -{" "}
                            {recommendation.status === "pending"
                              ? "Pendiente"
                              : "Activado"}
                          </p>
                        </div>
                        {recommendation.status === "pending" ? (
                          <Badge variant="outline">Pendiente</Badge>
                        ) : (
                          <Badge className="bg-green-500">Activado</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recomienda y gana */}
              <Card>
                <CardContent className="p-4 text-center">
                  <h4 className="font-bold text-lg mb-2">
                    ¡Recomienda y gana!
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Por cada amigo que se una a un restaurante con tu código
                    ambos recibirán 1000 puntos adicionales
                  </p>
                  <Button
                    onClick={handleReferralShare}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Compartir código
                  </Button>
                </CardContent>
              </Card>

              {/* Tengo un negocio */}
              <Card>
                <CardContent className="p-4 text-center">
                  <h4 className="font-bold text-lg mb-2">
                    ¿Tienes un negocio?
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Únete a la plataforma de fidelización más avanzada
                  </p>
                  <Button
                    onClick={() => setShowBusinessSearch(true)}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600"
                  >
                    <Building className="mr-2 h-4 w-4" />
                    Habilitar mi negocio
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="explorar" className="p-4">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Explorar</h3>
                <p className="text-sm text-gray-600">
                  Descubre nuevos lugares increíbles
                </p>
              </div>

              {/* Buscador */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Buscar negocio..." className="pl-10" />
              </div>

              {/* Negocios disponibles */}
              <div className="space-y-3">
                {exploreBusinesses.map((business) => (
                  <Card key={business.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={business.logo || "/placeholder.svg"}
                          alt={`Logo ${business.name}`}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium flex items-center">
                            {business.name}
                            <span className="ml-2">{business.icon}</span>
                          </h4>
                          <p className="text-sm text-gray-600">
                            {business.type}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className="h-3 w-3 fill-yellow-400 text-yellow-400"
                                />
                              ))}
                            </div>
                            <span className="text-xs">
                              {business.rating} ({business.reviews})
                            </span>
                            <span className="text-xs text-gray-500">
                              • {business.distance} km
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button
                            size="sm"
                            onClick={() => handleJoinBusiness(business.id)}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            Unirse
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              window.open(business.location, "_blank")
                            }
                          >
                            Ver mapa
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Sugerir negocio */}
              <Card>
                <CardContent className="p-4 text-center">
                  <h4 className="font-medium mb-2">
                    ¿No encuentras tu negocio favorito?
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Sugiérenos un lugar y lo evaluaremos para agregarlo a Qik
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setShowSuggestBusiness(true)}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Sugerir negocio
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="perfil" className="p-4">
            <div className="space-y-6">
              {/* Información del usuario */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{userData.avatar}</div>
                    <div>
                      <CardTitle>{userData.name}</CardTitle>
                      <CardDescription>
                        Cliente desde {userData.memberSince}
                      </CardDescription>
                    </div>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        {getLevelIcon(userData.level)}
                        <span className="ml-1 font-medium">
                          {userData.level}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">Nivel actual</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="font-medium">#{userData.ranking}</div>
                      <p className="text-xs text-gray-600">Ranking mundial</p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-sm font-medium">
                      Te faltan {userData.pointsToNextLevel} puntos para subir
                      al nivel {userData.nextLevel}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{
                          width: `${((userData.points % 1000) / 1000) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Teléfono:</span>
                      <span className="text-sm font-medium">
                        {userData.phone}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Puntos totales:</span>
                      <span className="text-sm font-medium">
                        {userData.points}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Total ahorrado:</span>
                      <span className="text-sm font-medium text-green-600">
                        ${userData.totalSavings}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Beneficios redimidos:</span>
                      <span className="text-sm font-medium">
                        {userData.benefitsRedeemed}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Configuración del genoma */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-purple-500" />
                    Perfil inteligente
                  </CardTitle>
                  <CardDescription>
                    Cuéntanos tus gustos para recomendaciones personalizadas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {genomeProfile.length > 0 ? (
                    <div className="space-y-2">
                      <h4 className="font-medium">Tu perfil de gustos:</h4>
                      {genomeProfile.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-purple-50 rounded-lg"
                        >
                          <span className="text-sm">{item}</span>
                          <Button size="sm" variant="ghost">
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <p className="text-sm">
                        Aún no has configurado tu perfil de gustos
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={() => setShowGenomeDialog(true)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Configurar perfil
                  </Button>
                </CardContent>
              </Card>

              {/* Configuraciones */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Configuraciones
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Idioma</p>
                      <p className="text-sm text-gray-600">
                        Cambiar idioma de la aplicación
                      </p>
                    </div>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">🇪🇸 ES</SelectItem>
                        <SelectItem value="en">🇺🇸 EN</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Inteligencia predictiva</p>
                      <p className="text-sm text-gray-600">
                        Recibir sugerencias personalizadas
                      </p>
                    </div>
                    <Checkbox defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notificaciones WhatsApp</p>
                      <p className="text-sm text-gray-600">
                        Recibir ofertas y promociones
                      </p>
                    </div>
                    <Checkbox defaultChecked />
                  </div>
                </CardContent>
              </Card>

              {/* Ranking mundial */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                    Top Mundial
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {globalRanking.map((user) => (
                      <div
                        key={user.rank}
                        className={`flex items-center space-x-3 p-2 rounded-lg ${
                          user.isUser
                            ? "bg-purple-50 border border-purple-200"
                            : ""
                        }`}
                      >
                        <div className="text-lg">{user.avatar}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-sm">{user.name}</p>
                            <span className="text-lg">{user.country}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getLevelIcon(user.level)}
                            <span className="text-xs text-gray-600">
                              {user.points} pts
                            </span>
                            <span className="text-xs text-gray-500">
                              • {user.visits} visitas
                            </span>
                            <span className="text-xs text-gray-500">
                              • {user.businesses} negocios
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-sm">#{user.rank}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Eliminar cuenta */}
              <Card>
                <CardContent className="p-4 text-center">
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteDialog(true)}
                    className="w-full"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar cuenta
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Navegación inferior */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
            <TabsList className="grid w-full grid-cols-4 bg-transparent h-16">
              <TabsTrigger
                value="inicio"
                className="flex flex-col items-center py-2 data-[state=active]:bg-purple-50"
              >
                <MapPin className="h-5 w-5 mb-1" />
                <span className="text-xs">Aquí estoy</span>
              </TabsTrigger>
              <TabsTrigger
                value="negocios"
                className="flex flex-col items-center py-2 data-[state=active]:bg-purple-50"
              >
                <Gift className="h-5 w-5 mb-1" />
                <span className="text-xs">Mis negocios</span>
              </TabsTrigger>
              <TabsTrigger
                value="explorar"
                className="flex flex-col items-center py-2 data-[state=active]:bg-purple-50"
              >
                <Search className="h-5 w-5 mb-1" />
                <span className="text-xs">Explorar</span>
              </TabsTrigger>
              <TabsTrigger
                value="perfil"
                className="flex flex-col items-center py-2 data-[state=active]:bg-purple-50"
              >
                <User className="h-5 w-5 mb-1" />
                <span className="text-xs">Mi perfil</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>

        {/* Botón flotante de Zoe AI */}
        <div className="fixed bottom-20 right-4">
          <Button
            size="lg"
            onClick={handleZoeAI}
            className="rounded-full w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
          >
            <Zap className="h-6 w-6" />
          </Button>
        </div>

        {/* Dialogs */}

        {/* Dialog para QR de beneficio */}
        <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-center">
                ¡Beneficio activado!
              </DialogTitle>
              <DialogDescription className="text-center">
                Muestra este código QR al mesero
              </DialogDescription>
            </DialogHeader>
            <div className="text-center space-y-4">
              <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
                <QrCode className="h-32 w-32 mx-auto text-gray-400" />
              </div>
              <p className="text-sm text-gray-600">
                Código: {selectedBenefit?.toUpperCase()}
              </p>
              <Button onClick={() => setShowQRCode(false)} className="w-full">
                Cerrar
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog para reservas */}
        <Dialog
          open={showReservationDialog}
          onOpenChange={setShowReservationDialog}
        >
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-center">Hacer reserva</DialogTitle>
              <DialogDescription className="text-center">
                Completa los datos para tu reserva en{" "}
                {businesses[selectedBusiness].name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="res-name">A nombre de:</Label>
                <Input
                  id="res-name"
                  value={reservationName}
                  onChange={(e) => setReservationName(e.target.value)}
                  placeholder="Nombre completo"
                />
              </div>

              <div>
                <Label>Fecha:</Label>
                <Calendar
                  mode="single"
                  selected={reservationDate}
                  onSelect={setReservationDate}
                  className="rounded-md border"
                  disabled={(date) => date < new Date()}
                />
              </div>

              <div>
                <Label>Hora:</Label>
                <Select
                  value={reservationTime}
                  onValueChange={setReservationTime}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una hora" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Número de personas:</Label>
                <Select
                  value={reservationPeople}
                  onValueChange={setReservationPeople}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="¿Cuántas personas?" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} persona{num > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="requirements">Requerimientos especiales:</Label>
                <Textarea
                  id="requirements"
                  value={reservationRequirements}
                  onChange={(e) => setReservationRequirements(e.target.value)}
                  placeholder="Alergias, celebraciones, etc. (opcional)"
                />
              </div>

              <Button
                onClick={handleReservationSubmit}
                className="w-full bg-green-600 hover:bg-green-700 text-sm"
                disabled={
                  !reservationName ||
                  !reservationDate ||
                  !reservationTime ||
                  !reservationPeople
                }
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Confirmar reserva
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog para unirse a negocio */}
        <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-center">
                ¡Únete al programa!
              </DialogTitle>
              <DialogDescription className="text-center">
                ¿Aceptas unirte al programa de fidelidad de{" "}
                {
                  exploreBusinesses.find((b) => b.id === selectedNewBusiness)
                    ?.name
                }
                ?
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="join-whatsapp" defaultChecked />
                <Label htmlFor="join-whatsapp" className="text-sm">
                  Acepto recibir información por WhatsApp
                </Label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowJoinDialog(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleJoinConfirm}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Unirse
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog para configurar genoma */}
        <Dialog open={showGenomeDialog} onOpenChange={setShowGenomeDialog}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-center">
                Configura tu perfil
              </DialogTitle>
              <DialogDescription className="text-center">
                Cuéntanos tus gustos para recomendaciones personalizadas
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={genomeType === "text" ? "default" : "outline"}
                  onClick={() => setGenomeType("text")}
                  className="flex flex-col items-center p-4 h-auto"
                >
                  <Type className="h-6 w-6 mb-2" />
                  <span className="text-xs">Escribir</span>
                </Button>
                <Button
                  variant={genomeType === "voice" ? "default" : "outline"}
                  onClick={() => setGenomeType("voice")}
                  className="flex flex-col items-center p-4 h-auto"
                >
                  <Mic className="h-6 w-6 mb-2" />
                  <span className="text-xs">Voz</span>
                </Button>
              </div>

              {genomeType === "text" ? (
                <Textarea
                  value={genomeInput}
                  onChange={(e) => setGenomeInput(e.target.value)}
                  placeholder="Ej: Me gusta la pizza, el cine, salir con mi familia a parques de diversiones..."
                  className="min-h-[100px]"
                />
              ) : (
                <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <Mic className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Función de voz disponible próximamente
                  </p>
                </div>
              )}

              <Button
                onClick={handleGenomeProcess}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                disabled={!genomeInput || isGenomeProcessing}
              >
                {isGenomeProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Procesando...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Construir mi perfil
                  </>
                )}
              </Button>

              {genomeProfile.length === 0 && (
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-2">
                    ¿Quieres más funciones?
                  </p>
                  <Badge
                    variant="outline"
                    className="text-purple-600 border-purple-600"
                  >
                    Premium $1.99/mes
                  </Badge>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog para eliminar cuenta */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-center text-red-600">
                ¿Eliminar cuenta?
              </DialogTitle>
              <DialogDescription className="text-center">
                Se eliminará todo tu historial, cartillas habilitadas y hábitos
                de consumo. Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setShowDeleteDialog(false);
                    alert("Cuenta eliminada exitosamente");
                  }}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Visor de Stories */}
        <Dialog open={showStoryViewer} onOpenChange={setShowStoryViewer}>
          <DialogContent className="max-w-sm p-0 bg-black border-0">
            <div className="relative h-[600px] w-full">
              <div className="absolute top-2 left-2 right-2 flex space-x-1 z-10">
                {stories.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 flex-1 rounded-full ${
                      index <= currentStoryIndex ? "bg-white" : "bg-white/30"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setShowStoryViewer(false)}
                className="absolute top-4 right-4 z-10 text-white hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="absolute top-8 left-4 right-4 z-10 flex items-center space-x-2">
                <img
                  src={
                    businesses[stories[currentStoryIndex]?.business]?.logo ||
                    "/placeholder.svg"
                  }
                  alt="Logo"
                  className="w-8 h-8 rounded-full"
                />
                <div className="text-white text-sm">
                  <div className="font-semibold">
                    {businesses[stories[currentStoryIndex]?.business]?.name}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>
                      {businesses[stories[currentStoryIndex]?.business]?.rating}{" "}
                      (
                      {
                        businesses[stories[currentStoryIndex]?.business]
                          ?.reviews
                      }
                      )
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative h-full w-full">
                <img
                  src={
                    stories[currentStoryIndex]?.fullImage || "/placeholder.svg"
                  }
                  alt={`Story de ${stories[currentStoryIndex]?.user}`}
                  className="h-full w-full object-cover"
                />

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <div className="text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">
                          {stories[currentStoryIndex]?.user}
                        </p>
                        <div className="flex items-center space-x-3 text-sm">
                          <div className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>{stories[currentStoryIndex]?.views}</span>
                          </div>
                          <button
                            onClick={() =>
                              handleStoryLike(stories[currentStoryIndex]?.id)
                            }
                            className="flex items-center space-x-1"
                          >
                            <Heart
                              className={`h-3 w-3 ${
                                stories[currentStoryIndex]?.isLiked
                                  ? "text-red-500 fill-red-500"
                                  : "text-white"
                              }`}
                            />
                            <span>{stories[currentStoryIndex]?.likes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={prevStory}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                  disabled={currentStoryIndex === 0}
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                  onClick={nextStory}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                  disabled={currentStoryIndex === 0}
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog para subir story */}
        <Dialog open={showStoryUpload} onOpenChange={setShowStoryUpload}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-center">
                ¡Comparte tu experiencia!
              </DialogTitle>
              <DialogDescription className="text-center">
                Sube una foto de tu comida favorita
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setShowStoryUpload(false);
                    alert(
                      "¡Gracias por compartir! Tu story será revisada y publicada pronto."
                    );
                  }}
                  className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 transition-colors"
                >
                  <Camera className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-xs">Tomar foto</span>
                </button>
                <button
                  onClick={() => {
                    setShowStoryUpload(false);
                    alert(
                      "¡Gracias por compartir! Tu story será revisada y publicada pronto."
                    );
                  }}
                  className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 transition-colors"
                >
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-xs">Subir archivo</span>
                </button>
              </div>
              <p className="text-xs text-center text-gray-600">
                Tu foto será revisada y publicada en nuestras stories
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog para sugerir negocio */}
        <Dialog
          open={showSuggestBusiness}
          onOpenChange={setShowSuggestBusiness}
        >
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-center">Sugerir negocio</DialogTitle>
              <DialogDescription className="text-center">
                Recomienda tu negocio favorito para que se una a Qik
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Label htmlFor="suggest-name">Nombre del negocio:</Label>
              <Input id="suggest-name" placeholder="Ej: Pizzeria Roma" />

              <Label htmlFor="suggest-city">Ciudad:</Label>
              <Input id="suggest-city" placeholder="Ej: Quito" />

              <Button
                onClick={() => alert("Sugerencia enviada")}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Enviar sugerencia
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="text-center mt-6 pb-20 text-sm text-gray-500">
          <p>
            Powered by <span className="text-[#0088cc] font-semibold">Qik</span>
          </p>
        </div>
      </div>
    );
  }

  return null;
}
