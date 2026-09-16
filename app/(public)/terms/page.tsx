export const metadata = {
  title: 'Terms & Conditions - TamilEduHub',
  description: 'Terms and Conditions for TamilEduHub.',
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl min-h-screen">
      <h1 className="text-4xl font-bold text-slate-900 mb-8">Terms & Conditions</h1>
      <div className="prose prose-lg text-slate-700 max-w-none space-y-6">
        <p><strong>Last Updated:</strong> September 16, 2026</p>
        
        <p>
          Welcome to TamilEduHub! By accessing this website, we assume you accept these terms and conditions. Do not continue to use TamilEduHub if you do not agree to take all of the terms and conditions stated on this page.
        </p>

        <h2 className="text-2xl font-semibold text-slate-900">1. Intellectual Property Rights</h2>
        <p>
          Other than the content you own, under these Terms, TamilEduHub and/or its licensors own all the intellectual property rights and materials contained in this Website. Many educational resources provided on this platform are aggregated from public domains or permitted sources for educational purposes. 
        </p>

        <h2 className="text-2xl font-semibold text-slate-900">2. Restrictions</h2>
        <p>You are specifically restricted from all of the following:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Publishing any Website material in any other media without proper attribution</li>
          <li>Selling, sublicensing and/or otherwise commercializing any Website material</li>
          <li>Using this Website in any way that is or may be damaging to this Website</li>
          <li>Using this Website in any way that impacts user access to this Website</li>
          <li>Using this Website contrary to applicable laws and regulations</li>
        </ul>

        <h2 className="text-2xl font-semibold text-slate-900">3. User Accounts</h2>
        <p>
          If you create an account on the Website, you are responsible for maintaining the security of your account and you are fully responsible for all activities that occur under the account. We reserve the right to terminate accounts that violate our terms.
        </p>

        <h2 className="text-2xl font-semibold text-slate-900">4. No Warranties</h2>
        <p>
          This Website is provided "as is," with all faults, and TamilEduHub expresses no representations or warranties, of any kind related to this Website or the materials contained on this Website. The educational materials are provided for reference and study purposes.
        </p>

        <h2 className="text-2xl font-semibold text-slate-900">5. DMCA / Takedown Policy</h2>
        <p>
          We respect the intellectual property rights of others. If you believe that any material on our website infringes upon your copyright, please use our Contact page to submit a takedown request with the URL of the material and proof of ownership.
        </p>
      </div>
    </div>
  )
}
