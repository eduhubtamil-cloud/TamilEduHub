export const metadata = {
  title: 'Disclaimer - TamilEduHub',
  description: 'Disclaimer for TamilEduHub.',
}

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl min-h-screen">
      <h1 className="text-4xl font-bold text-slate-900 mb-8">Disclaimer</h1>
      <div className="prose prose-lg text-slate-700 max-w-none space-y-6">
        <p><strong>Last Updated:</strong> September 16, 2026</p>
        
        <p>
          The information contained on TamilEduHub (the "Service") is for general information and educational purposes only.
        </p>

        <h2 className="text-2xl font-semibold text-slate-900">Educational Resources</h2>
        <p>
          TamilEduHub acts as an aggregator and provider of educational study materials, question papers, and articles. While we strive to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose. Any reliance you place on such information is therefore strictly at your own risk.
        </p>

        <h2 className="text-2xl font-semibold text-slate-900">External Links</h2>
        <p>
          Through this website you are able to link to other websites which are not under the control of TamilEduHub. We have no control over the nature, content and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.
        </p>
      </div>
    </div>
  )
}
