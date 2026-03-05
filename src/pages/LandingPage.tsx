import { motion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrandLogo } from "@/components/icons/BrandLogo";
import {
  ArrowRight,
  Check,
  Eye,
  LayoutDashboard,
  Shield,
  Sparkles,
} from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.7,
      staggerChildren: 0.12,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const metrics = [
  { value: "400", label: "Templates edited" },
  { value: "99.9%", label: "Structure-safe sessions" },
  { value: "3x", label: "Faster client handoff" },
];

const features = [
  {
    icon: Shield,
    title: "Structural Safety",
    description:
      "Content updates are isolated from layout, styles, and markup integrity.",
  },
  {
    icon: Eye,
    title: "Live Preview",
    description:
      "Editors and reviewers see changes in real time before anything goes live.",
  },
  {
    icon: LayoutDashboard,
    title: "Client-Ready Workflow",
    description:
      "Share controlled editing experiences without exposing fragile HTML.",
  },
];

export const LandingPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-stone-100 text-stone-900 dark:bg-[#0f0f0f] dark:text-stone-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(255,255,255,0.72),transparent_38%),radial-gradient(circle_at_85%_0%,rgba(120,113,108,0.16),transparent_35%)] dark:bg-[radial-gradient(circle_at_15%_15%,rgba(255,255,255,0.05),transparent_38%),radial-gradient(circle_at_85%_0%,rgba(255,255,255,0.08),transparent_35%)]" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10"
      >
        <section className="container mx-auto px-4 pt-10 pb-14 md:pt-16 md:pb-20">
          <motion.div
            variants={itemVariants}
            className="mx-auto mb-10 flex max-w-6xl items-center justify-between"
          >
            <BrandLogo />
            <Button
              asChild
              variant="outline"
              className="border-stone-300 bg-white/85 text-stone-800 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900/70 dark:text-stone-100"
            >
              <Link to="/tools">Open Dashboard</Link>
            </Button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mx-auto max-w-5xl text-center"
          >
            <Badge className="mb-5 border border-stone-300 bg-white/80 px-4 py-1.5 text-stone-700 dark:border-stone-700 dark:bg-stone-900/70 dark:text-stone-200">
              <Sparkles className="mr-2 h-4 w-4" />
              Professional HTML Content Editing Platform
            </Badge>

            <h1 className="mx-auto max-w-4xl text-4xl font-semibold tracking-tight text-stone-900 md:text-6xl dark:text-stone-100">
              Clean editing experience.
              <span className="block text-stone-600 dark:text-stone-400">
                Enterprise-level control.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-stone-600 md:text-xl dark:text-stone-300">
              Give your team and clients the freedom to update copy with
              confidence, while your design system and HTML structure stay fully
              protected.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 min-w-[210px] bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
              >
                <Link
                  to="/live-demo"
                  className="inline-flex items-center gap-2"
                >
                  Try Live Demo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 min-w-[210px] border-stone-300 bg-white/80 text-stone-800 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900/60 dark:text-stone-100"
              >
                <Link to="/pricing">View Pricing</Link>
              </Button>
            </div>
          </motion.div>
        </section>

        <section className="container mx-auto px-4 pb-14 md:pb-20">
          <motion.div variants={itemVariants} className="mx-auto max-w-6xl">
            <Card className="overflow-hidden border-stone-300/80 bg-white/90 shadow-2xl shadow-stone-300/20 dark:border-stone-800 dark:bg-stone-900/70 dark:shadow-black/30">
              <CardContent className="p-0">
                <div className="grid gap-0 lg:grid-cols-[1fr_1.1fr]">
                  <div className="border-b border-stone-200 p-7 lg:border-b-0 lg:border-r dark:border-stone-800">
                    <p className="mb-5 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                      Content Panel
                    </p>
                    <div className="space-y-3">
                      <div className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200">
                        Subject: Q2 Product Launch Brief
                      </div>
                      <div className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200">
                        Headline: Introduce your new release with confidence
                      </div>
                      <div className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-relaxed text-stone-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200">
                        Description: Make fast updates with zero risk to
                        template structure, spacing, or rendering compatibility.
                      </div>
                      <div className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200">
                        CTA: Review Proposal
                      </div>
                    </div>
                  </div>

                  <div className="p-7">
                    <p className="mb-5 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                      Live Output
                    </p>
                    <div className="rounded-xl border border-stone-200 bg-stone-50 p-5 dark:border-stone-700 dark:bg-stone-800/70">
                      <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm dark:border-stone-700 dark:bg-stone-900">
                        <div className="border-b border-stone-200 bg-stone-900 px-5 py-3 text-sm font-medium text-stone-100 dark:border-stone-700">
                          Q2 Product Launch Brief
                        </div>
                        <div className="space-y-4 px-5 py-6 text-left">
                          <h3 className="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                            Introduce your new release with confidence
                          </h3>
                          <p className="leading-relaxed text-stone-600 dark:text-stone-300">
                            Make fast updates with zero risk to template
                            structure, spacing, or rendering compatibility.
                          </p>
                          <button className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white dark:bg-stone-100 dark:text-stone-900">
                            Review Proposal
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        <section className="container mx-auto px-4 pb-14 md:pb-20">
          <motion.div
            variants={itemVariants}
            className="mx-auto grid max-w-5xl grid-cols-1 gap-3 md:grid-cols-3"
          >
            {metrics.map((metric) => (
              <Card
                key={metric.label}
                className="border-stone-300/70 bg-white/85 dark:border-stone-800 dark:bg-stone-900/60"
              >
                <CardContent className="p-6">
                  <p className="text-3xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                    {metric.value}
                  </p>
                  <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
                    {metric.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </section>

        <section className="container mx-auto px-4 pb-20 md:pb-24">
          <motion.div variants={itemVariants} className="mx-auto max-w-6xl">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Why Teams Choose MarkGuard
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-stone-600 dark:text-stone-300">
                Built for agencies, marketers, and product teams that need speed
                without compromising quality.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="border-stone-300/70 bg-white/85 dark:border-stone-800 dark:bg-stone-900/60"
                >
                  <CardContent className="p-6">
                    <div className="mb-4 inline-flex rounded-md border border-stone-300 bg-stone-100 p-2.5 dark:border-stone-700 dark:bg-stone-800">
                      <feature.icon className="h-5 w-5 text-stone-700 dark:text-stone-200" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="container mx-auto px-4 pb-24">
          <motion.div variants={itemVariants} className="mx-auto max-w-5xl">
            <Card className="border-stone-300/80 bg-stone-900 text-stone-100 dark:border-stone-700 dark:bg-stone-100 dark:text-stone-900">
              <CardContent className="p-8 text-center md:p-12">
                <h3 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  A calmer, sharper workflow starts here.
                </h3>
                <p className="mx-auto mt-4 max-w-2xl text-stone-300 dark:text-stone-700">
                  Replace messy, risky edits with a branded experience your team
                  can trust and your clients can use immediately.
                </p>

                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Button
                    asChild
                    size="lg"
                    className="h-12 min-w-[210px] bg-white text-stone-900 hover:bg-stone-200 dark:bg-stone-900 dark:text-stone-100 dark:hover:bg-stone-800"
                  >
                    <Link
                      to="/template/editor"
                      className="inline-flex items-center gap-2"
                    >
                      Start Editing
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="h-12 min-w-[210px] border-stone-500 bg-stone-800 dark:border-stone-400 dark:text-stone-900 dark:hover:bg-stone-300"
                  >
                    <Link to="/live-demo">Preview Experience</Link>
                  </Button>
                </div>

                <div className="mt-7 flex flex-col items-center justify-center gap-2 text-xs uppercase tracking-[0.13em] text-stone-400 sm:flex-row sm:gap-6 dark:text-stone-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5" />
                    No code changes required
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5" />
                    Works with existing templates
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5" />
                    Setup in minutes
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>
      </motion.div>
    </div>
  );
};
