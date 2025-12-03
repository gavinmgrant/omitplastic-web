export async function generateMetadata() {
  return {
    title: "Terms of Service",
  }
}

async function TermsOfServicePage() {
  return (
    <div
      className={
        "prose prose-zinc dark:prose-invert text-foreground container py-8 mx-auto px-4 md:px-0"
      }
    >
      <h1>Terms of Service</h1>
      <p>Last updated: 12/03/2025</p>

      <p>
        Welcome to OmitPlastic. By using this website, you agree to these Terms
        of Service. If you do not agree, please discontinue use of the Site.
      </p>

      <h2>Use of the Website</h2>

      <h3>Eligibility</h3>
      <p>This site is intended for users age 13 and older.</p>

      <h3>User Accounts</h3>
      <p>
        Some features of OmitPlastic, such as saving products to your favorites
        list, require you to create an account. When you create an account, you
        agree to:
      </p>
      <ul>
        <li>Provide accurate and complete information</li>
        <li>Maintain the security of your account credentials</li>
        <li>
          Notify us immediately of any unauthorized access to your account
        </li>
        <li>
          Accept responsibility for all activities that occur under your account
        </li>
      </ul>
      <p>
        You may delete your account at any time by contacting us at
        support@omitplastic.com. Upon account deletion, your favorites list and
        associated data will be permanently removed.
      </p>

      <h2>Accuracy of Information</h2>
      <p>
        While we strive to maintain accurate and up-to-date information, all
        product data originates from external product data sources. We make no
        guarantee regarding:
      </p>
      <ul>
        <li>Accuracy</li>
        <li>Completeness</li>
        <li>Timeliness</li>
        <li>Availability</li>
      </ul>

      <h2>Limitation of Liability</h2>
      <p>
        OmitPlastic is provided on an “as is” and “as available” basis. We are
        not liable for any decisions, actions, or damages arising from the use
        of information published on this site.
      </p>

      <h2>Third-Party Advertising</h2>
      <p>
        The website displays advertisements from Google AdSense and other
        partners. These services operate independently and may collect data
        according to their own policies.
      </p>

      <h2>User Content and Conduct</h2>
      <p>
        You are responsible for the content you create and actions you take on
        OmitPlastic. You agree not to:
      </p>
      <ul>
        <li>Use the service for any illegal or unauthorized purpose</li>
        <li>Attempt to gain unauthorized access to any part of the service</li>
        <li>Interfere with or disrupt the service or servers</li>
        <li>Use automated systems to access the service without permission</li>
      </ul>

      <h2>Intellectual Property</h2>
      <p>
        All site design, branding, and code are owned by OmitPlastic. Product
        data is public domain and belongs to its respective sources.
      </p>

      <h2>Changes to These Terms</h2>
      <p>
        We may update these Terms of Service from time to time. Continued use of
        the site constitutes acceptance of the updated terms.
      </p>

      <h2>Contact Us</h2>
      <p>Email: support@omitplastic.com</p>
    </div>
  )
}

export default TermsOfServicePage
