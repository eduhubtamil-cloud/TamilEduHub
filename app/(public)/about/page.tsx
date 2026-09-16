export const metadata = {
  title: 'About Us - TamilEduHub',
  description: 'Learn more about TamilEduHub, your premier destination for Tamil educational resources.',
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl min-h-screen">
      <h1 className="text-4xl font-bold text-slate-900 mb-8">About Us</h1>
      <div className="prose prose-lg text-slate-700 max-w-none">
        <p>
          Welcome to <strong>TamilEduHub</strong>, your premier destination for Tamil educational resources. Our mission is to empower students, teachers, and parents in Tamil Nadu and beyond by providing free, high-quality, and easily accessible study materials.
        </p>
        <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">Our Vision</h2>
        <p>
          We believe that quality education should be accessible to everyone, regardless of their background or geographic location. Our platform is designed to bridge the educational resource gap by centralizing study guides, question papers, and articles tailored specifically for the Samacheer Kalvi syllabus.
        </p>
        <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">What We Offer</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Study Materials:</strong> Comprehensive guides and notes for 1st to 12th standard.</li>
          <li><strong>Question Papers:</strong> Previous year question papers and model test papers.</li>
          <li><strong>Educational Articles:</strong> In-depth articles covering various academic subjects and study strategies.</li>
        </ul>
        <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">Our Commitment</h2>
        <p>
          We are committed to keeping our platform mobile-friendly, fast, and easy to navigate so you can focus on learning. We continuously update our database to ensure you have the most relevant and up-to-date materials for the academic year.
        </p>
        <p className="mt-8">
          Thank you for choosing TamilEduHub as your learning companion!
        </p>
      </div>
    </div>
  )
}
