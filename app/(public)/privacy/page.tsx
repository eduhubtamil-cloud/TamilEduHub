export const metadata = {
  title: 'Privacy Policy - TamilEduHub',
  description: 'Privacy Policy for TamilEduHub.',
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl min-h-screen">
      <h1 className="text-4xl font-bold text-slate-900 mb-8">Privacy Policy</h1>
      <div className="prose prose-lg text-slate-700 max-w-none space-y-6">
        <p><strong>Last Updated:</strong> September 16, 2026</p>
        
        <p>
          At TamilEduHub, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by TamilEduHub and how we use it.
        </p>

        <h2 className="text-2xl font-semibold text-slate-900">1. Information We Collect</h2>
        <p>
          We collect information to provide better services to our users. The types of information we collect include:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Personal Information:</strong> When you register an account, we collect your email address and display name.</li>
          <li><strong>Usage Data:</strong> We automatically collect analytics regarding page views, search queries, and resource downloads.</li>
          <li><strong>Cookies:</strong> We use cookies to maintain your session and save your preferences (e.g., bookmarks).</li>
        </ul>

        <h2 className="text-2xl font-semibold text-slate-900">2. How We Use Your Information</h2>
        <p>We use the collected information in various ways, including to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide, operate, and maintain our website</li>
          <li>Improve, personalize, and expand our website</li>
          <li>Understand and analyze how you use our website</li>
          <li>Develop new products, services, features, and functionality</li>
        </ul>

        <h2 className="text-2xl font-semibold text-slate-900">3. Log Files</h2>
        <p>
          TamilEduHub follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
        </p>

        <h2 className="text-2xl font-semibold text-slate-900">4. Contact Us</h2>
        <p>
          If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
        </p>
      </div>
    </div>
  )
}
