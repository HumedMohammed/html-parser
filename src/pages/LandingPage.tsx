import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Mail,
  Eye,
  ArrowRight,
  Play,
  CheckCircle,
  Users,
  Palette,
  Shield,
  Zap,
  Building2,
  Code2,
  MousePointer,
  Sparkles,
  Clock,
  DollarSign,
  Heart,
  LayoutDashboard,
} from "lucide-react";
import { useState } from "react";

export const LandingPage = () => {
  const [texts, setTexts] = useState([
    {
      label: "Email Subject",
      value: "🚀 New Product Launch - 50% Off Today Only!",
      type: "text",
    },
    {
      label: "Headline",
      value: "Introducing Our Revolutionary New Product",
      type: "text",
    },
    {
      label: "Description",
      value:
        "Transform your workflow with our cutting-edge solution designed for modern teams.",
      type: "textarea",
    },
    {
      label: "Call to Action",
      value: "Shop Now & Save 50%",
      type: "text",
    },
  ]);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const floatingVariants: Variants = {
    animate: {
      y: [-15, 15, -15],
      rotate: [0, 3, -3, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const useCases = [
    {
      icon: Mail,
      title: "Email Marketing Teams",
      description:
        "Let your clients edit newsletter content without breaking your carefully crafted email templates",
      color: "from-blue-500 to-blue-700",
      accent: "blue-400",
      benefits: [
        "Preserve email compatibility",
        "Client-friendly editing",
        "No code breakage",
      ],
    },
    {
      icon: Building2,
      title: "Digital Agencies",
      description:
        "Deliver projects faster by letting clients update content themselves while maintaining design integrity",
      color: "from-purple-500 to-purple-700",
      accent: "purple-400",
      benefits: [
        "Reduce revision cycles",
        "Happy clients",
        "More billable hours",
      ],
    },
    {
      icon: Palette,
      title: "Template Developers",
      description:
        "Create templates once, let anyone edit content safely without touching your HTML structure",
      color: "from-emerald-500 to-emerald-700",
      accent: "emerald-400",
      benefits: [
        "Protect your code",
        "Scale your templates",
        "Zero support tickets",
      ],
    },
    {
      icon: Users,
      title: "Client Collaboration",
      description:
        "Give non-technical clients the power to update content with confidence and real-time preview",
      color: "from-orange-500 to-orange-700",
      accent: "orange-400",
      benefits: [
        "Real-time preview",
        "Intuitive interface",
        "No training needed",
      ],
    },
  ];

  const features = [
    {
      icon: Eye,
      title: "Live Preview",
      description:
        "See changes instantly as you type with synchronized scrolling and highlighting",
      color: "from-blue-600 to-blue-800",
    },
    {
      icon: Shield,
      title: "Code Protection",
      description:
        "HTML structure stays intact - only content can be modified, never the design",
      color: "from-green-600 to-green-800",
    },
    {
      icon: MousePointer,
      title: "Smart Highlighting",
      description:
        "Click any element in preview to jump to its editor - seamless workflow",
      color: "from-purple-600 to-purple-800",
    },
    {
      icon: Zap,
      title: "Zero Learning Curve",
      description:
        "Intuitive interface that anyone can use without technical knowledge",
      color: "from-yellow-600 to-yellow-800",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Email Templates Edited" },
    { number: "95%", label: "Client Satisfaction" },
    { number: "0", label: "Broken Templates" },
    { number: "500+", label: "Agencies Trust Us" },
  ];

  const testimonials = [
    {
      quote:
        "Our clients can now update their email campaigns without calling us every time. Game changer!",
      author: "Sarah Chen",
      role: "Email Marketing Director",
      company: "GrowthCo",
    },
    {
      quote:
        "We've reduced client revision requests by 80%. Our developers can focus on building, not fixing.",
      author: "Mike Rodriguez",
      role: "Agency Owner",
      company: "PixelPerfect Studio",
    },
    {
      quote:
        "Finally, a tool that lets our clients be independent while keeping our templates safe.",
      author: "Emma Thompson",
      role: "Template Designer",
      company: "MailCraft",
    },
  ];

  const painPoints = [
    "Clients breaking email templates when editing HTML",
    "Endless revision cycles for simple text changes",
    "Non-technical users afraid to touch code",
    "Developers spending time on content updates",
    "Email compatibility issues from manual edits",
    "Lost billable hours on template fixes",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 overflow-hidden relative">
      {/* Animated Background Elements */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-2xl"
      />
      <motion.div
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: "3s" }}
        className="absolute bottom-20 right-10 w-56 h-56 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl"
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10"
      >
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-24 text-center">
          <motion.div variants={itemVariants} className="mb-12">
            <Badge
              variant="outline"
              className="mb-6 px-6 py-3 text-sm font-medium bg-white/80 dark:bg-gray-800/80 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 backdrop-blur-sm"
            >
              <Mail className="w-4 h-4 mr-2" />
              FOR EMAIL MARKETERS & AGENCIES
            </Badge>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                Safe Content
              </span>
              <br />
              <span className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 dark:from-gray-200 dark:via-gray-300 dark:to-gray-400 bg-clip-text text-transparent">
                Editing
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
              Let your clients edit email templates and HTML content without
              breaking your code. Perfect for agencies, email marketers, and
              template developers.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center mb-20"
          >
            <Button
              asChild
              size="lg"
              className="text-lg px-10 py-7 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Link to="/template/editor" className="flex items-center gap-3">
                <Play className="w-5 h-5" />
                Try Live Demo
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-10 py-7 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
            >
              <Link to="/tools" className="flex items-center gap-3">
                <LayoutDashboard className="w-5 h-5" />
                Tools
              </Link>
            </Button>
          </motion.div>

          {/* Hero Demo */}
          <motion.div
            variants={itemVariants}
            className="relative max-w-6xl mx-auto"
          >
            <div className="relative rounded-xl overflow-hidden shadow-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              {/* Demo Header */}
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-gray-600 dark:text-gray-300 font-medium text-sm">
                    Email Template Editor
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Eye className="w-4 h-4" />
                  <span className="text-xs font-medium">LIVE PREVIEW</span>
                </div>
              </div>

              {/* Demo Content */}
              <div className="p-8 grid md:grid-cols-2 gap-8 min-h-[400px]">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Code2 className="w-5 h-5 text-blue-500" />
                    <span className="font-medium text-sm">CONTENT EDITOR</span>
                  </div>
                  <div className="space-y-4">
                    {texts.map((field, index) => (
                      <div key={index} className="space-y-2">
                        {field.type === "textarea" ? (
                          <textarea
                            className="w-full p-3 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 resize-none"
                            rows={3}
                            defaultValue={field.value}
                          />
                        ) : (
                          <input
                            type="text"
                            className="w-full p-3 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            defaultValue={field.value}
                            onChange={(e) => {
                              texts[index].value = e.target.value;
                              setTexts([...texts]);
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Preview */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Eye className="w-5 h-5 text-green-500" />
                    <span className="font-medium text-sm">LIVE PREVIEW</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600 overflow-hidden">
                      {/* Email Header */}
                      <div className="bg-blue-600 text-white p-4 text-center">
                        <h2 className="text-lg font-bold">{texts[0].value}</h2>
                      </div>

                      {/* Email Body */}
                      <div className="p-6 space-y-4">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                          {texts[1].value}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {texts[2].value}
                        </p>
                        <div className="pt-4">
                          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                            {texts[3].value}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating indicators */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -right-4 top-1/2 transform -translate-y-1/2"
            >
              <div className="bg-green-500 text-white p-2 rounded-full shadow-lg">
                <CheckCircle className="w-5 h-5" />
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Pain Points Section */}
        <section className="container mx-auto px-4 py-20">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-gray-200">
              Tired of These Problems?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Every email marketer and agency faces these daily frustrations
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {painPoints.map((pain, index) => (
              <Card
                key={index}
                className="p-6 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
              >
                <CardContent className="p-0">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-red-600 dark:text-red-400 font-bold text-sm">
                        ✗
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {pain}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </section>

        {/* Use Cases Section */}
        <section className="container mx-auto px-4 py-20">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-gray-200">
              Perfect For Your Team
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Whether you're an agency, marketer, or developer - we've got you
              covered
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {useCases.map((useCase, index) => (
              <motion.div key={index} variants={itemVariants} className="group">
                <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800">
                  <CardContent className="p-0">
                    <div className={`h-2 bg-gradient-to-r ${useCase.color}`} />
                    <div className="p-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-r ${useCase.color} flex items-center justify-center`}
                        >
                          <useCase.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                          {useCase.title}
                        </h3>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-lg">
                        {useCase.description}
                      </p>

                      <div className="space-y-3">
                        {useCase.benefits.map((benefit, benefitIndex) => (
                          <div
                            key={benefitIndex}
                            className="flex items-center gap-3"
                          >
                            <CheckCircle
                              className={`w-5 h-5 text-${useCase.accent}`}
                            />
                            <span className="text-gray-700 dark:text-gray-300 font-medium">
                              {benefit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-gray-200">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need for safe, efficient content editing
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants} className="group">
                <Card className="h-full text-center p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 hover:-translate-y-2">
                  <CardContent className="p-0">
                    <div
                      className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center`}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-20">
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-12">
              Trusted by Professionals Worldwide
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-4xl md:text-5xl font-black">
                    {stat.number}
                  </div>
                  <div className="text-blue-100 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Testimonials Section */}
        <section className="container mx-auto px-4 py-20">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-gray-200">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Real feedback from real professionals
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={itemVariants} className="group">
                <Card className="h-full p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800">
                  <CardContent className="p-0">
                    <div className="mb-6">
                      <div className="flex text-yellow-400 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-xl">
                            ★
                          </span>
                        ))}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg italic">
                        "{testimonial.quote}"
                      </p>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                      <div className="font-semibold text-gray-800 dark:text-gray-200">
                        {testimonial.author}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {testimonial.role}
                      </div>
                      <div className="text-blue-600 dark:text-blue-400 font-medium">
                        {testimonial.company}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <motion.div
            variants={itemVariants}
            className="text-center bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-16 text-white"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Join thousands of professionals who've eliminated template
              headaches forever
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                asChild
                size="lg"
                className="text-lg px-12 py-7 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Link to="/template/editor" className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5" />
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-lg px-12 py-7 border-gray-400 text-gray-300 hover:bg-gray-700 hover:border-gray-300 transition-all duration-300"
              >
                <Link to="/pricing" className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5" />
                  View Pricing
                </Link>
              </Button>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span>Setup in 2 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-400" />
                <span>Loved by 10,000+ users</span>
              </div>
            </div>
          </motion.div>
        </section>
      </motion.div>
    </div>
  );
};
