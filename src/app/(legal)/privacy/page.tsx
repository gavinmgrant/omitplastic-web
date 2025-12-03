export async function generateMetadata() {
  return {
    title: "Privacy Policy",
  }
}

async function PrivacyPolicyPage() {
  return (
    <div
      className={
        "prose prose-zinc dark:prose-invert text-foreground container py-8 mx-auto px-4 md:px-0"
      }
    >
      <h1>Privacy Policy</h1>
      <p>Last updated: 12/03/2025</p>

      <p>
        OmitPlastic (“we”, “us”, or “the Site”) is a website that helps users
        search and browse product information sourced from publicly available
        product data sources. This Privacy Policy explains how we collect, use,
        and protect your information when you use our website.
      </p>

      <h2>Information We Collect</h2>

      <h3>1. Account Information</h3>
      <p>
        When you create an account on OmitPlastic, we collect information
        necessary to provide authentication and personalized features:
      </p>
      <ul>
        <li>Email address (required for account creation)</li>
        <li>
          Account credentials (managed securely through our authentication
          provider)
        </li>
        <li>Account creation date and last login information</li>
      </ul>
      <p>
        Account authentication is provided through Neon Auth (Stack Auth), which
        securely manages your login credentials and session data. Your account
        information is stored in our secure database.
      </p>

      <h3>2. User-Generated Content</h3>
      <p>When you use features that require an account, we store:</p>
      <ul>
        <li>
          <strong>Favorites data:</strong> Products you save to your personal
          favorites list, including the date and time you added each product
        </li>
      </ul>
      <p>
        This information is associated with your account and is used solely to
        provide personalized features. You can remove items from your favorites list
        at any time through your account settings.
      </p>

      <h3>3. Automatically Collected Information</h3>
      <p>
        When you use OmitPlastic, certain technical information is automatically
        collected, including:
      </p>
      <ul>
        <li>IP address (anonymized if supported by your browser or device)</li>
        <li>Browser type and version</li>
        <li>Device type and operating system</li>
        <li>Pages viewed and actions taken</li>
        <li>Referral sources (links you followed to our site)</li>
      </ul>

      <h3>4. Cookies and Tracking Technologies</h3>
      <p>
        We use cookies to improve site functionality, analyze usage, deliver
        relevant advertising, and maintain your authentication session. Cookies
        may be set by OmitPlastic or by third-party providers such as Google. For
        more details, see our <a href="/cookies">Cookie Policy</a>.
      </p>

      <h2>Use of Google Analytics</h2>
      <p>
        We use Google Analytics to understand how visitors interact with
        OmitPlastic. Google Analytics collects information such as page views,
        session duration, device information, approximate location, and
        referring sources. Google may use this data to improve its own services
        and advertising products.
      </p>
      <p>
        Google Analytics uses cookies and similar technologies. Data may be
        transmitted to Google servers in the United States.
      </p>

      <h3>Opt-Out Options</h3>
      <ul>
        <li>
          Google Analytics Opt-Out Add-On:{" "}
          <a href="https://tools.google.com/dlpage/gaoptout">
            https://tools.google.com/dlpage/gaoptout
          </a>
        </li>
        <li>
          Google Ads settings:
          <a href="https://www.google.com/settings/ads">
            https://www.google.com/settings/ads
          </a>
        </li>
      </ul>

      <h2>Advertising</h2>
      <p>
        OmitPlastic displays ads from Google AdSense and may use other approved
        advertising partners in the future. These ad providers may use cookies,
        including advertising identifiers, to:
      </p>
      <ul>
        <li>Serve relevant ads</li>
        <li>Limit repetitive ads</li>
        <li>Measure ad performance</li>
      </ul>
      <p>
        Google and other partners may combine information from your visits to
        this site with data collected across the web.
      </p>

      <h3>Ad Personalization Controls</h3>
      <p>
        You may opt out of personalized advertising by visiting:{" "}
        <a href="https://www.google.com/settings/ads">Google Ads Settings</a>.
      </p>

      <h2>How We Use Your Information</h2>
      <p>We use collected information to:</p>
      <ul>
        <li>Provide and maintain your user account and authentication</li>
        <li>Enable personalized features such as your favorites list</li>
        <li>Improve website functionality and user experience</li>
        <li>Analyze site performance and user behavior</li>
        <li>Serve relevant advertisements and measure ad effectiveness</li>
        <li>Prevent fraudulent activity and secure our website</li>
        <li>
          Communicate with you about your account or important service updates
        </li>
      </ul>

      <h2>Data Sharing</h2>
      <p>
        We do not sell your personal information. We may share data with
        third-party providers solely for the purposes described above, such as:
      </p>
      <ul>
        <li>
          <strong>Authentication services:</strong> Neon Auth (Stack Auth) for
          secure account management and authentication
        </li>
        <li>
          <strong>Analytics services:</strong> Google Analytics for website
          usage analysis
        </li>
        <li>
          <strong>Advertising services:</strong> Google AdSense and other
          approved advertising partners
        </li>
      </ul>
      <p>
        All third-party providers are contractually obligated to protect your
        data and use it only for the purposes we specify.
      </p>

      <h2>Links to External Sites</h2>
      <p>
        OmitPlastic may contain links to third-party websites. We are not
        responsible for their content or privacy practices.
      </p>

      <h2>Your Privacy Rights</h2>
      <p>
        Depending on your location, you may have rights related to accessing,
        correcting, or deleting your personal data. You can:
      </p>
      <ul>
        <li>
          Access and update your account information through your account
          settings
        </li>
        <li>Delete items from your favorites list at any time</li>
        <li>Delete your account and associated data by contacting us</li>
        <li>Request a copy of your personal data</li>
      </ul>
      <p>
        Contact us if you have any privacy-related requests or questions about
        your data.
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. The updated version
        will be posted on this page with a new &quot;Last updated&quot; date.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have questions about this Privacy Policy, please email:
        support@omitplastic.com
      </p>
    </div>
  )
}

export default PrivacyPolicyPage
