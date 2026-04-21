import { useState } from "react";

export default function App() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [userName, setUserName] = useState("Guest");
  const [showAbout, setShowAbout] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const colors = {
    bg: "#f6f8fb",
    bgGradient: "linear-gradient(135deg, #f6f8fb 0%, #eef3f9 100%)",
    card: "#ffffff",
    text: "#142033",
    subtext: "#6b7280",
    border: "#e5eaf1",
    primary: "#2563eb",
    secondary: "#1d4ed8",
    accent: "#f2f7ff",
    accentBg: "#f5f9ff",
    hover: "#f8fafc",
    shadow: "rgba(15, 23, 42, 0.08)",
    darkShadow: "rgba(15, 23, 42, 0.18)",
    highlight: "#e8f0ff",
    danger: "#fef2f2",
    warning: "#fffbeb",
    success: "#f0fdf4"
  };

  const cautionQuotes = [
    {
      title: "Medical Consultation Required",
      text: "Always consult with a licensed healthcare professional before making any medication changes or decisions based on pricing information.",
    },
    {
      title: "Information Disclaimer",
      text: "Prices displayed are approximate and sourced from available pharmacy networks. Actual costs may vary by location and availability.",
    },
    {
      title: "Professional Guidance Essential",
      text: "Never self-medicate or make treatment decisions solely based on price comparisons. Your health requires professional medical oversight.",
    },
    {
      title: "Informed Decision Making",
      text: "Use this tool to understand medication costs and alternatives, but always prioritize your healthcare provider's recommendations.",
    },
    {
      title: "Quality Over Cost",
      text: "While saving money is important, never compromise on medication quality or efficacy. Cost should not override medical necessity.",
    }
  ];

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const askAPI = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          question: query,
          city: "Bangalore"
        })
      });

      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      askAPI();
    }
  };

  const handleLogin = () => {
    if (loginEmail && loginPassword) {
      setIsLoggedIn(true);
      setUserName(loginEmail.split("@")[0]);
      setLoginEmail("");
      setLoginPassword("");
      setShowLoginModal(false);
      setShowAccountMenu(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName("Guest");
    setShowAccountMenu(false);
  };

  const nextQuote = () => {
    setCurrentQuoteIndex((prev) => (prev + 1) % cautionQuotes.length);
  };

  const prevQuote = () => {
    setCurrentQuoteIndex((prev) => (prev - 1 + cautionQuotes.length) % cautionQuotes.length);
  };

  const renderHighlightedText = (text) => {
    if (!text) return null;

    return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <span key={index} className="highlighted">
            {part.slice(2, -2)}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const renderListItems = (text) => {
    if (!text) return null;
    
    if (typeof text === 'string') {
      const items = text.split('\n').filter(item => item.trim());
      return items.map((item, index) => {
        const cleanItem = item.replace(/^[-•*]\s*/, '').trim();
        return (
          <div key={index} className="listItem">
            <span className="bullet">•</span>
            <span>{cleanItem}</span>
          </div>
        );
      });
    }
    
    if (Array.isArray(text)) {
      return text.map((item, index) => (
        <div key={index} className="listItem">
          <span className="bullet">•</span>
          <span>{item}</span>
        </div>
      ));
    }

    return null;
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes floatUp {
          0% {
            opacity: 0;
            transform: translateY(60px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(37, 99, 235, 0.2);
          }
          50% {
            box-shadow: 0 0 40px rgba(37, 99, 235, 0.4);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html, body {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background: ${colors.bgGradient};
          color: ${colors.text};
        }

        body {
          border: none;
          outline: none;
        }

        #root {
          width: 100%;
          min-height: 100vh;
          background: ${colors.bgGradient};
        }

        button, input {
          outline: none;
        }

        .appWrapper {
          width: 100%;
          min-height: 100vh;
          background: ${colors.bgGradient};
          display: flex;
          flex-direction: column;
        }

        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          width: 100%;
          background: rgba(255, 255, 255, 0.82);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid ${colors.border};
          padding: 16px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
          animation: slideDown 0.4s ease-out;
        }

        .navLeft {
          display: flex;
          align-items: center;
        }

        .logo {
          font-size: 24px;
          font-weight: 800;
          color: ${colors.primary};
          letter-spacing: -0.6px;
          cursor: pointer;
          transition: transform 0.25s ease;
        }

        .logo:hover {
          transform: translateY(-1px) scale(1.02);
        }

        .navRight {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .aboutBtn {
          border: none;
          background: transparent;
          color: ${colors.text};
          font-size: 14px;
          font-weight: 600;
          padding: 10px 16px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .aboutBtn:hover {
          background: ${colors.hover};
          color: ${colors.primary};
          transform: translateY(-1px);
        }

        .accountWrapper {
          position: relative;
        }

        .accountBtn {
          width: 42px;
          height: 42px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
          color: white;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 22px rgba(37, 99, 235, 0.24);
          transition: all 0.28s ease;
        }

        .accountBtn:hover {
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 14px 28px rgba(37, 99, 235, 0.28);
        }

        .accountMenu {
          position: absolute;
          top: 54px;
          right: 0;
          min-width: 220px;
          background: ${colors.card};
          border-radius: 14px;
          box-shadow: 0 24px 44px ${colors.darkShadow};
          border: 1px solid ${colors.border};
          overflow: hidden;
          animation: slideDown 0.25s ease-out;
        }

        .accountMenuHeader {
          padding: 16px;
          background: linear-gradient(180deg, #f8fbff 0%, #f4f8ff 100%);
          border-bottom: 1px solid ${colors.border};
        }

        .accountMenuName {
          margin: 0;
          font-size: 14px;
          font-weight: 700;
          color: ${colors.text};
        }

        .accountMenuEmail {
          margin: 4px 0 0 0;
          font-size: 12px;
          color: ${colors.subtext};
        }

        .accountMenuItem {
          width: 100%;
          text-align: left;
          border: none;
          background: transparent;
          padding: 14px 16px;
          font-size: 14px;
          font-weight: 600;
          color: ${colors.text};
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .accountMenuItem:hover {
          background: ${colors.hover};
          color: ${colors.primary};
          padding-left: 20px;
        }

        .accountMenuItem.logout {
          color: #dc2626;
          border-top: 1px solid ${colors.border};
        }

        .accountMenuItem.logout:hover {
          background: #fff1f2;
          color: #b91c1c;
        }

        .mainContent {
          width: 100%;
          flex: 1;
          padding: 48px 40px;
          display: flex;
          gap: 40px;
        }

        .leftSection {
          width: 35%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          padding-top: 24px;
        }

        .header {
          animation: slideUp 0.6s ease-out;
        }

        .title {
          margin: 0;
          font-size: 48px;
          line-height: 1.15;
          font-weight: 800;
          color: ${colors.text};
          letter-spacing: -1px;
        }

        .titleSpan {
          display: block;
          margin-top: 4px;
          background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          margin: 16px 0 0;
          color: ${colors.subtext};
          font-size: 15px;
          line-height: 1.6;
        }

        .searchBox {
          width: 100%;
          margin-top: 32px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          animation: slideUp 0.75s ease-out;
        }

        .searchBox input {
          width: 100%;
          background: rgba(255, 255, 255, 0.86);
          border: 1px solid ${colors.border};
          border-radius: 14px;
          padding: 16px 20px;
          font-size: 15px;
          color: ${colors.text};
          box-shadow: 0 10px 28px rgba(15, 23, 42, 0.05);
          transition: all 0.28s ease;
        }

        .searchBox input::placeholder {
          color: ${colors.subtext};
        }

        .searchBox input:focus {
          border-color: ${colors.primary};
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
        }

        .searchBox button {
          width: 100%;
          border: none;
          border-radius: 14px;
          padding: 16px 28px;
          font-size: 15px;
          font-weight: 700;
          color: white;
          cursor: pointer;
          background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
          box-shadow: 0 14px 26px rgba(37, 99, 235, 0.22);
          transition: all 0.28s ease;
        }

        .searchBox button:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 32px rgba(37, 99, 235, 0.28);
        }

        .cautionSection {
          width: 100%;
          margin-top: 28px;
          padding: 24px;
          background: linear-gradient(135deg, #f0f4ff 0%, #f5f8ff 100%);
          border: 1px solid #dbeafe;
          border-left: 4px solid ${colors.primary};
          border-radius: 12px;
          animation: slideUp 0.9s ease-out;
          position: relative;
          overflow: hidden;
        }

        .cautionSection::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
          animation: shimmer 3s infinite;
        }

        .cautionContent {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .cautionIcon {
          font-size: 32px;
          flex-shrink: 0;
          opacity: 0.8;
          margin-top: 2px;
        }

        .cautionText {
          flex: 1;
        }

        .cautionText h4 {
          margin: 0 0 8px 0;
          color: ${colors.primary};
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          animation: fadeIn 0.6s ease-out;
        }

        .cautionText p {
          margin: 0;
          color: ${colors.text};
          font-size: 14px;
          font-weight: 500;
          line-height: 1.7;
          animation: fadeIn 0.7s ease-out 0.1s both;
        }

        .cautionNavigation {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-top: 16px;
          animation: slideUp 0.7s ease-out 0.2s both;
        }

        .cautionButton {
          border: 1px solid ${colors.border};
          background: white;
          color: ${colors.primary};
          cursor: pointer;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cautionButton:hover {
          background: ${colors.primary};
          color: white;
          border-color: ${colors.primary};
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }

        .cautionDots {
          display: flex;
          gap: 6px;
          justify-content: center;
          margin-top: 14px;
        }

        .cautionDot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${colors.border};
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cautionDot.active {
          background: ${colors.primary};
          width: 24px;
          border-radius: 3px;
          box-shadow: 0 0 8px rgba(37, 99, 235, 0.4);
        }

        .rightSection {
          width: 65%;
          display: flex;
          flex-direction: column;
          gap: 20px;
          overflow-y: auto;
          padding-right: 12px;
        }

        .emptyStateContainer {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 40px;
          animation: fadeIn 0.6s ease-out;
        }

        .emptyState {
          width: 100%;
          max-width: 500px;
          text-align: center;
        }

        .emptyStateIllustration {
          font-size: 120px;
          margin-bottom: 30px;
          animation: float 4s ease-in-out infinite;
        }

        .emptyStateTitle {
          font-size: 28px;
          font-weight: 700;
          color: ${colors.text};
          margin-bottom: 12px;
          animation: slideUp 0.6s ease-out;
        }

        .emptyStateSubtitle {
          font-size: 16px;
          color: ${colors.subtext};
          line-height: 1.8;
          margin-bottom: 30px;
          animation: slideUp 0.7s ease-out 0.1s both;
        }

        .emptyStateSteps {
          display: flex;
          flex-direction: column;
          gap: 16px;
          text-align: left;
          background: linear-gradient(135deg, ${colors.accent} 0%, #ffffff 100%);
          padding: 24px;
          border-radius: 12px;
          border: 1px solid #dbeafe;
          animation: slideUp 0.8s ease-out 0.2s both;
        }

        .step {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .stepNumber {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
        }

        .stepContent {
          flex: 1;
          padding-top: 2px;
        }

        .stepContent p {
          margin: 0;
          color: ${colors.text};
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 4px;
        }

        .stepContent span {
          color: ${colors.subtext};
          font-size: 13px;
          display: block;
          line-height: 1.5;
        }

        .decorativeCircle {
          position: absolute;
          width: 200px;
          height: 200px;
          border: 2px solid ${colors.primary}20;
          border-radius: 50%;
          animation: rotate 20s linear infinite;
        }

        .decorativeCircle1 {
          top: -100px;
          right: -100px;
        }

        .decorativeCircle2 {
          bottom: -80px;
          left: -80px;
          animation-direction: reverse;
        }

        .loading {
          animation: fadeIn 0.3s ease;
          padding: 40px 20px;
          text-align: center;
        }

        .loading-text {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: ${colors.subtext};
          font-weight: 600;
          font-size: 15px;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: ${colors.primary};
          animation: pulse 1.2s infinite ease-in-out;
        }

        .dot:nth-child(2) {
          animation-delay: 0.15s;
        }

        .dot:nth-child(3) {
          animation-delay: 0.3s;
        }

        .results {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .card {
          position: relative;
          width: 100%;
          overflow: hidden;
          background: ${colors.card};
          border: 1px solid ${colors.border};
          border-radius: 18px;
          padding: 24px;
          box-shadow: 0 12px 28px ${colors.shadow};
          animation: fadeIn 0.5s ease forwards;
          transition: all 0.28s ease;
        }

        .card::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 0%, rgba(37, 99, 235, 0.05) 50%, transparent 100%);
          transform: translateX(-100%);
          transition: transform 0.7s ease;
          pointer-events: none;
        }

        .card:hover::after {
          transform: translateX(100%);
        }

        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 36px rgba(15, 23, 42, 0.12);
        }

        .card h2,
        .card h3 {
          margin: 0 0 14px 0;
          color: ${colors.text};
          font-size: 19px;
          font-weight: 700;
        }

        .card p {
          margin: 10px 0;
          color: ${colors.subtext};
          line-height: 1.7;
          font-size: 15px;
        }

        .aiBox {
          background: linear-gradient(180deg, ${colors.accent} 0%, #ffffff 100%);
          border-left: 4px solid ${colors.primary};
        }

        .switch {
          background: linear-gradient(180deg, ${colors.accentBg} 0%, #ffffff 100%);
          border-left: 4px solid ${colors.primary};
        }

        .sideEffectsCard {
          background: linear-gradient(180deg, ${colors.danger} 0%, #ffffff 100%);
          border-left: 4px solid #ef4444;
        }

        .usageCard {
          background: linear-gradient(180deg, ${colors.warning} 0%, #ffffff 100%);
          border-left: 4px solid #f59e0b;
        }

        .dosageCard {
          background: linear-gradient(180deg, ${colors.success} 0%, #ffffff 100%);
          border-left: 4px solid #22c55e;
        }

        .precautionsCard {
          background: linear-gradient(180deg, #f5f3ff 0%, #ffffff 100%);
          border-left: 4px solid #a855f7;
        }

        .highlighted {
          display: inline-block;
          background: ${colors.highlight};
          color: ${colors.primary};
          padding: 2px 8px;
          border-radius: 8px;
          font-weight: 700;
          margin: 0 2px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          padding: 10px 14px;
          border-radius: 10px;
          background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
          color: white;
          font-size: 14px;
          font-weight: 700;
          box-shadow: 0 10px 20px rgba(37, 99, 235, 0.18);
          transition: transform 0.25s ease;
        }

        .badge:hover {
          transform: scale(1.03);
        }

        .listItem {
          display: flex;
          gap: 10px;
          margin: 12px 0;
          color: ${colors.subtext};
          line-height: 1.6;
          font-size: 14px;
        }

        .bullet {
          color: ${colors.primary};
          font-weight: 700;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .grid {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          margin-top: 18px;
        }

        .gridItem {
          width: 100%;
          background: ${colors.hover};
          border: 1px solid ${colors.border};
          border-radius: 14px;
          padding: 18px;
          transition: all 0.28s ease;
          cursor: pointer;
        }

        .gridItem:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 24px rgba(37, 99, 235, 0.08);
          border-color: #cfe0ff;
          background: #fbfdff;
        }

        .gridItem b {
          display: block;
          font-size: 12px;
          color: ${colors.subtext};
          text-transform: uppercase;
          letter-spacing: 0.7px;
          margin-bottom: 8px;
        }

        .gridItem p {
          margin: 0;
          font-size: 24px;
          font-weight: 800;
          color: ${colors.primary};
        }

        .item {
          width: 100%;
          margin-top: 12px;
          background: ${colors.hover};
          border: 1px solid ${colors.border};
          border-left: 4px solid ${colors.primary};
          border-radius: 14px;
          padding: 16px;
          transition: all 0.28s ease;
          cursor: pointer;
        }

        .item:hover {
          transform: translateX(6px);
          box-shadow: 0 12px 22px rgba(37, 99, 235, 0.08);
          background: #fbfdff;
        }

        .itemLabel {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.7px;
          color: ${colors.subtext};
          margin-bottom: 6px;
        }

        .itemValue {
          font-size: 16px;
          font-weight: 700;
          color: ${colors.primary};
        }

        .medicineName {
          color: ${colors.primary};
          font-weight: 700;
        }

        .medicinePrice {
          float: right;
          color: ${colors.text};
          font-weight: 700;
        }

        .savingsHighlight {
          width: 100%;
          margin-top: 18px;
          background: linear-gradient(135deg, #eff6ff 0%, #f8fbff 100%);
          border: 1px solid #dbeafe;
          border-radius: 16px;
          padding: 18px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
          transition: all 0.28s ease;
        }

        .savingsHighlight:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 24px rgba(37, 99, 235, 0.08);
        }

        .savingsItem {
          flex: 1;
        }

        .savingsLabel {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.7px;
          color: ${colors.subtext};
          margin-bottom: 6px;
        }

        .savingsValue {
          font-size: 24px;
          font-weight: 800;
          color: ${colors.primary};
        }

        .modal {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          background: rgba(15, 23, 42, 0.35);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          animation: fadeIn 0.25s ease;
          padding: 20px;
        }

        .modalContent {
          width: 100%;
          max-width: 500px;
          background: ${colors.card};
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 30px 60px ${colors.darkShadow};
          animation: scaleIn 0.3s ease;
          border: none;
          outline: none;
        }

        .modalContent h2 {
          margin: 0 0 8px 0;
          font-size: 26px;
          color: ${colors.text};
          font-weight: 800;
        }

        .modalContent p {
          margin: 0 0 20px 0;
          color: ${colors.subtext};
          line-height: 1.7;
          font-size: 14px;
        }

        .formGroup {
          margin-bottom: 16px;
        }

        .formLabel {
          display: block;
          margin-bottom: 8px;
          color: ${colors.text};
          font-size: 14px;
          font-weight: 700;
        }

        .formInput {
          width: 100%;
          padding: 14px 16px;
          border-radius: 12px;
          border: 1px solid ${colors.border};
          background: ${colors.hover};
          color: ${colors.text};
          font-size: 14px;
          transition: all 0.25s ease;
        }

        .formInput:focus {
          border-color: ${colors.primary};
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
          background: white;
        }

        .formInput::placeholder {
          color: ${colors.subtext};
        }

        .modalButtonGroup {
          width: 100%;
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .modalButton {
          flex: 1;
          border: none;
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .loginBtn {
          background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
          color: white;
          box-shadow: 0 12px 22px rgba(37, 99, 235, 0.2);
        }

        .loginBtn:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 28px rgba(37, 99, 235, 0.24);
        }

        .cancelBtn {
          background: ${colors.hover};
          color: ${colors.text};
          border: 1px solid ${colors.border};
        }

        .cancelBtn:hover {
          background: #eef2f7;
          transform: translateY(-2px);
        }

        @media (max-width: 1200px) {
          .mainContent {
            width: 100%;
            flex-direction: column;
            gap: 30px;
          }

          .leftSection {
            width: 100%;
          }

          .rightSection {
            width: 100%;
            padding-right: 0;
          }

          .grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .navbar {
            width: 100%;
            padding: 14px 18px;
          }

          .mainContent {
            width: 100%;
            padding: 24px 18px;
            gap: 24px;
          }

          .title {
            font-size: 32px;
          }

          .subtitle {
            font-size: 14px;
          }

          .card {
            width: 100%;
            padding: 16px;
          }

          .cautionSection {
            margin-top: 20px;
            padding: 16px;
          }

          .emptyStateTitle {
            font-size: 24px;
          }

          .emptyStateIllustration {
            font-size: 80px;
            margin-bottom: 20px;
          }
        }

        .rightSection::-webkit-scrollbar {
          width: 8px;
        }

        .rightSection::-webkit-scrollbar-track {
          background: transparent;
        }

        .rightSection::-webkit-scrollbar-thumb {
          background: ${colors.border};
          border-radius: 4px;
        }

        .rightSection::-webkit-scrollbar-thumb:hover {
          background: ${colors.primary};
        }
      `}</style>

      <div className="appWrapper">
        <div className="navbar">
          <div className="navLeft">
            <div className="logo">Swashtya AI💊</div>
          </div>

          <div className="navRight">
            <button className="aboutBtn" onClick={() => setShowAbout(true)}>
              About
            </button>

            <div className="accountWrapper">
              <button
                className="accountBtn"
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                title="Account"
              >
                {isLoggedIn ? userName.charAt(0).toUpperCase() : "A"}
              </button>

              {showAccountMenu && (
                <div className="accountMenu">
                  {isLoggedIn ? (
                    <>
                      <div className="accountMenuHeader">
                        <p className="accountMenuName">{userName}</p>
                        <p className="accountMenuEmail">{loginEmail || "user@healthhub.com"}</p>
                      </div>
                      <button
                        className="accountMenuItem logout"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <button
                      className="accountMenuItem"
                      onClick={() => {
                        setShowLoginModal(true);
                        setShowAccountMenu(false);
                      }}
                    >
                      Login
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mainContent">
          <div className="leftSection">
            <div className="header">
              <h1 className="title">
                Medicine<br />
                Information
                <span className="titleSpan">& Price Comparison</span>
              </h1>
              <p className="subtitle">
                Find the best prices for medicines and discover trusted alternatives near you.
              </p>
            </div>

            <div className="searchBox">
              <input
                placeholder="Search for medicines..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <button onClick={askAPI}>Search</button>
            </div>

            {/* Formal Caution Section */}
            <div className="cautionSection">
              <div className="cautionContent">
                <div className="cautionIcon">⚠️</div>
                <div className="cautionText">
                  <h4>Important Notice</h4>
                  <p>{cautionQuotes[currentQuoteIndex].text}</p>
                </div>
              </div>
              <div className="cautionNavigation">
                <button className="cautionButton" onClick={prevQuote}>
                  ← Previous
                </button>
                <button className="cautionButton" onClick={nextQuote}>
                  Next →
                </button>
              </div>
              <div className="cautionDots">
                {cautionQuotes.map((_, index) => (
                  <div
                    key={index}
                    className={`cautionDot ${index === currentQuoteIndex ? 'active' : ''}`}
                    onClick={() => setCurrentQuoteIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="rightSection">
            {loading && (
              <div className="loading">
                <div className="loading-text">
                  <span>Processing</span>
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
            )}

            {!data && !loading && (
              <div className="emptyStateContainer">
                <div className="emptyState">
                  <div className="emptyStateIllustration">💊</div>
                  <br/>
                  <h2 className="emptyStateTitle">Start Your Search</h2>
                  <p className="emptyStateSubtitle">
                    Search for any medicine to discover pricing information, alternatives, and nearby pharmacies
                  </p>
                  <div className="emptyStateSteps">
                    <div className="step">
                      <div className="stepNumber">1</div>
                      <div className="stepContent">
                        <p>Enter Medicine Name</p>
                        <span>Type the name of any medicine or drug you're looking for</span>
                      </div>
                    </div>
                    <div className="step">
                      <div className="stepNumber">2</div>
                      <div className="stepContent">
                        <p>Review Information</p>
                        <span>Get comprehensive details including dosage and precautions</span>
                      </div>
                    </div>
                    <div className="step">
                      <div className="stepNumber">3</div>
                      <div className="stepContent">
                        <p>Compare Prices</p>
                        <span>Find the best deals and discover cost-effective alternatives</span>
                      </div>
                    </div>
                    <div className="step">
                      <div className="stepNumber">4</div>
                      <div className="stepContent">
                        <p>Consult Physician</p>
                        <span>Always verify with your healthcare provider before purchasing</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="decorativeCircle decorativeCircle1"></div>
                <div className="decorativeCircle decorativeCircle2"></div>
              </div>
            )}

            {data && (
              <div className="results">
                <div className="card aiBox">
                  <h2>Analysis</h2>
                  <p>{renderHighlightedText(data.answer)}</p>
                </div>

                <div className="card switch">
                  <h3>Recommendation</h3>
                  <div className="badge">
                    {data.switch_recommendation?.action}
                  </div>
                  <p>{data.switch_recommendation?.warning_message}</p>
                </div>

                {data.overpricing_score && (
                  <div className="card">
                    <h3>Pricing Details</h3>

                    <div className="grid">
                      <div className="gridItem">
                        <b>Current Price</b>
                        <p>₹{data.overpricing_score.original_price}</p>
                      </div>

                      <div className="gridItem">
                        <b>Best Price</b>
                        <p>₹{data.overpricing_score.cheapest_price}</p>
                      </div>

                      <div className="gridItem">
                        <b>Price Difference</b>
                        <p>{data.overpricing_score.overpricing_percentage}%</p>
                      </div>

                      <div className="gridItem">
                        <b>Price Status</b>
                        <p>{data.overpricing_score.score_label}</p>
                      </div>
                    </div>

                    <div className="savingsHighlight">
                      <div className="savingsItem">
                        <div className="savingsLabel">Monthly Savings</div>
                        <div className="savingsValue">
                          ₹{data.overpricing_score.monthly_savings}
                        </div>
                      </div>
                      <div className="savingsItem">
                        <div className="savingsLabel">Yearly Savings</div>
                        <div className="savingsValue">
                          ₹{data.overpricing_score.yearly_savings}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="card">
                  <h3>Medicine Details</h3>

                  <div className="item">
                    <div className="itemLabel">Composition</div>
                    <div className="itemValue">
                      {data.medicine_info?.salt_composition}
                    </div>
                  </div>

                  <div className="item">
                    <div className="itemLabel">Strength</div>
                    <div className="itemValue">
                      {data.medicine_info?.strength}
                    </div>
                  </div>
                </div>

                {data.usage && (
                  <div className="card usageCard">
                    <h3>When to Use</h3>
                    <div>
                      {renderListItems(data.usage)}
                    </div>
                  </div>
                )}

                {data.dosage && (
                  <div className="card dosageCard">
                    <h3>Dosage</h3>
                    <p>{data.dosage}</p>
                  </div>
                )}

                {data.side_effects && (
                  <div className="card sideEffectsCard">
                    <h3>Side Effects</h3>
                    <div>
                      {renderListItems(data.side_effects)}
                    </div>
                  </div>
                )}

                {data.precautions && (
                  <div className="card precautionsCard">
                    <h3>Precautions & Warnings</h3>
                    <div>
                      {renderListItems(data.precautions)}
                    </div>
                  </div>
                )}

                {data.contraindications && (
                  <div className="card">
                    <h3>Contraindications</h3>
                    <div>
                      {renderListItems(data.contraindications)}
                    </div>
                  </div>
                )}

                {data.interactions && (
                  <div className="card">
                    <h3>Drug Interactions</h3>
                    <div>
                      {renderListItems(data.interactions)}
                    </div>
                  </div>
                )}

                {data.alternatives && data.alternatives.length > 0 && (
                  <div className="card">
                    <h3>Alternatives</h3>
                    <p>Available at lower prices</p>

                    {data.alternatives.map((m, i) => (
                      <div key={i} className="item">
                        <span className="medicineName">{m.brand_name}</span>
                        <span className="medicinePrice">₹{m.avg_price_inr}</span>
                      </div>
                    ))}
                  </div>
                )}

                {data.pharmacies && data.pharmacies.length > 0 && (
                  <div className="card">
                    <h3>Nearby Pharmacies</h3>
                    <p>{data.pharmacies.length} pharmacies available in Bangalore</p>

                    {data.pharmacies.map((p, i) => (
                      <div key={i} className="item">
                        {p.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showLoginModal && (
        <div className="modal">
          <div className="modalContent">
            <h2>Login</h2>
            <p>Enter your credentials to access your account.</p>

            <div className="formGroup">
              <label className="formLabel">Email</label>
              <input
                type="email"
                className="formInput"
                placeholder="Enter your email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>

            <div className="formGroup">
              <label className="formLabel">Password</label>
              <input
                type="password"
                className="formInput"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>

            <div className="modalButtonGroup">
              <button className="modalButton loginBtn" onClick={handleLogin}>
                Login
              </button>
              <button
                className="modalButton cancelBtn"
                onClick={() => setShowLoginModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showAbout && (
        <div className="modal">
          <div className="modalContent">
            <h2>About HealthHub</h2>
            <p>
              Swasthya AI is a medicine information and price comparison platform
              designed to help users find better pricing, alternatives, and nearby
              pharmacy availability with comprehensive medicine details.
            </p>

            <p>
              Features include AI-powered medicine analysis, dosage information,
              side effects, precautions, pricing comparison, and nearby pharmacy visibility.
            </p>

            <div className="modalButtonGroup">
              <button
                className="modalButton loginBtn"
                onClick={() => setShowAbout(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}