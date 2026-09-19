import { ShieldCheck, Zap, Globe, Sparkles } from 'lucide-react'

export function FeaturesBanner({ dict }: { dict: Record<string, string> }) {
  const features = [
    {
      icon: <Globe className="h-6 w-6" />,
      title: dict.featureBilingualTitle || "Bilingual Support",
      description: dict.featureBilingualDesc || "All resources available in both Tamil and English mediums.",
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: dict.featureQualityTitle || "Curated Quality",
      description: dict.featureQualityDesc || "Materials verified and shared by experienced government teachers.",
      color: "text-emerald-600",
      bg: "bg-emerald-100"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: dict.featureFastTitle || "Fast & Free",
      description: dict.featureFastDesc || "Lightning-fast direct PDF downloads with zero hidden costs.",
      color: "text-amber-600",
      bg: "bg-amber-100"
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: dict.featureUpdatedTitle || "Always Updated",
      description: dict.featureUpdatedDesc || "Get the latest question papers and syllabus updates instantly.",
      color: "text-purple-600",
      bg: "bg-purple-100"
    }
  ]

  return (
    <section className="py-12 w-full">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-500 opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-purple-500 opacity-10 blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {dict.whyChooseUs || "Why Choose TamilEduHub?"}
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-lg">
              {dict.whyChooseUsDesc || "We are dedicated to providing the best educational experience for Tamil Nadu students."}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:-translate-y-1 transition-transform duration-300">
                <div className={`${feature.bg} ${feature.color} w-12 h-12 flex items-center justify-center rounded-xl mb-5 shadow-sm`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
