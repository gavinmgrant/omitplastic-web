export async function generateMetadata() {
  return {
    title: "Cookies",
  }
}

async function CookiesPage() {
  return (
    <div
      className={
        "prose prose-zinc dark:prose-invert text-foreground container py-8 mx-auto px-4 md:px-0"
      }
    >
      <h1>Cookie Policy</h1>
      <p>Last updated: 12/03/2025</p>

      <p>
        This Cookie Policy explains how OmitPlastic uses cookies and similar
        technologies to improve your browsing experience, analyze usage, and
        deliver relevant advertising.
      </p>

      <h2>What Are Cookies?</h2>
      <p>
        Cookies are small text files stored on your device when you visit a
        website. They help the site function correctly and provide analytics and
        personalization.
      </p>

      <h2>Types of Cookies We Use</h2>

      <h3>1. Essential Cookies</h3>
      <p>
        These cookies are required for the website to function properly,
        including:
      </p>
      <ul>
        <li>
          <strong>Authentication cookies:</strong> Used to maintain your login
          session and keep you signed in as you navigate the site. These cookies
          are set by our authentication provider (Neon Auth/Stack Auth) and are
          essential for account-based features such as your favorites list.
        </li>
        <li>
          <strong>Security cookies:</strong> Help protect against unauthorized
          access and maintain the security of your account.
        </li>
      </ul>

      <h3>2. Analytics Cookies</h3>
      <p>
        We use Google Analytics to understand how visitors interact with our
        site. These cookies track page views, usage patterns, session duration,
        and other metrics.
      </p>
      <p>
        More information on how Google uses partner data:{" "}
        <a href="https://policies.google.com/technologies/partner-sites">
          https://policies.google.com/technologies/partner-sites
        </a>
      </p>

      <h3>3. Advertising Cookies</h3>
      <p>
        We use Google AdSense and third-party advertising networks that may set
        cookies to:
      </p>
      <ul>
        <li>Serve personalized ads</li>
        <li>Measure advertising effectiveness</li>
        <li>Limit repetitive ads</li>
      </ul>

      <h2>Managing Cookies</h2>
      <p>
        You may manage or disable cookies through your browser settings.
        However, please note that disabling essential cookies, particularly
        authentication cookies, may prevent you from accessing account-based
        features such as your favorites list.
      </p>
      <p>
        To limit personalized advertising, you may visit:{" "}
        <a href="https://www.google.com/settings/ads">Google Ads Settings</a>
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        We may update this Cookie Policy periodically. Updates will be posted on
        this page with a revised &quot;Last updated&quot; date.
      </p>

      <h2>Contact Us</h2>
      <p>Email: support@omitplastic.com</p>
    </div>
  )
}

export default CookiesPage
