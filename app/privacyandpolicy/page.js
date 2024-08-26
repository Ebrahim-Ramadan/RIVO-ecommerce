
export const metadata = {
  title:"Rivo Privacy and Policy",
  description: 'High-performance ecommerce store built with Next.js, Vercel, and Shopify.',
  openGraph: {
    type: 'website'
  }
};

export default async function HomePage() {

  return (
    <div className=" mx-auto p-2">
      <h1 className="text-2xl md:text-4xl font-bold mb-6">Privacy Policy for Rivo Gallery</h1>
      <p className="NISIDEPRIVACY">
        We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, disclose, and protect your information when you use our website {process.env.NEXT_PUBLIC_API_URL}.
      </p>
      <p className="NISIDEPRIVACY">
        Please take the time to read this Privacy Policy carefully. By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by the terms of this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not use our Services.
      </p>

      <h2 className="OneTwoThreePrivacy">1. Information We Collect:</h2>

      <h3 className="ABCPrivacy">a. Personal Information:</h3>
      <ul className="list-disc list-inside NISIDEPRIVACY">
        <li>We may collect personal information such as your name, address, email address, phone number, and payment information when you make a purchase on our website.</li>
      </ul>

      <h3 className="ABCPrivacy">b. Non-Personal Information:</h3>
      <ul className="list-disc list-inside NISIDEPRIVACY">
        <li>We automatically collect non-personal information, such as browser type, device information, and IP address, to enhance your experience and improve our services.</li>
      </ul>

      <h2 className="OneTwoThreePrivacy">2. How We Use Your Information:</h2>

      <h3 className="ABCPrivacy">a. Order Processing:</h3>
      <ul className="list-disc list-inside NISIDEPRIVACY">
        <li>We use your personal information to process and fulfill your orders, send order confirmations, and communicate with you regarding your purchase.</li>
      </ul>

      <h3 className="ABCPrivacy">b. Customer Support:</h3>
      <ul className="list-disc list-inside NISIDEPRIVACY">
        <li>We may use your contact information to provide customer support, respond to inquiries, and address any issues or concerns you may have.</li>
      </ul>

      <h3 className="ABCPrivacy">c. Marketing and Promotions:</h3>
      <ul className="list-disc list-inside NISIDEPRIVACY">
        <li>With your consent, we may use your email address to send you promotional materials, newsletters, and special offers. You can opt-out of these communications at any time.</li>
      </ul>

      <h3 className="ABCPrivacy">d. Analytics:</h3>
      <ul className="list-disc list-inside NISIDEPRIVACY">
        <li>We analyze non-personal information to improve the functionality of our website, enhance user experience, and optimize our marketing efforts.</li>
      </ul>

      <h2 className="OneTwoThreePrivacy">3. How We Protect Your Information:</h2>

      <h3 className="ABCPrivacy">a. Security Measures:</h3>
      <ul className="list-disc list-inside NISIDEPRIVACY">
        <li>We employ industry-standard security measures to safeguard your personal and non-personal information from unauthorized access, disclosure, alteration, and destruction.</li>
      </ul>

      <h3 className="ABCPrivacy">b. Secure Transactions:</h3>
      <ul className="list-disc list-inside NISIDEPRIVACY">
        <li>For online transactions, we use secure payment gateways to ensure the confidentiality of your payment information.</li>
      </ul>

      <h2 className="OneTwoThreePrivacy">4. Information Sharing:</h2>

      <h3 className="ABCPrivacy">a. Third-Party Service Providers:</h3>
      <ul className="list-disc list-inside NISIDEPRIVACY">
        <li>We may share your information with trusted third-party service providers who assist us in delivering our services (e.g., payment processors, shipping companies).</li>
      </ul>

      <h3 className="ABCPrivacy">b. Legal Compliance:</h3>
      <ul className="list-disc list-inside NISIDEPRIVACY">
        <li>We may disclose your information if required by law or to protect our legal rights, comply with legal processes, or respond to government requests.</li>
      </ul>

      <h2 className="OneTwoThreePrivacy">5. Your Choices:</h2>
      <p className="NISIDEPRIVACY">You have the right to access, update, or delete your personal information. You can manage your communication preferences and opt-out of marketing emails.</p>

      <h2 className="OneTwoThreePrivacy">6. Changes to Privacy Policy:</h2>
      <p className="NISIDEPRIVACY">We may update this Privacy Policy to reflect changes in our practices. Any changes will be posted on this page, and the date of the last revision will be indicated.</p>

      <h2 className="OneTwoThreePrivacy">7. Contact Us:</h2>
      <p className="NISIDEPRIVACY">
        If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us at <a href="mailto:Rivogallery@gmail.com" className="text-blue-500">Rivogallery@gmail.com</a>.
      </p>

      <p className="mt-6">By using our services, you agree to the terms outlined in this Privacy Policy. Thank you for choosing Rivo Gallery.</p>
    </div>
  );
}
