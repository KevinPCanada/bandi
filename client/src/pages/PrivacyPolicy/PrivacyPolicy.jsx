// This component displays the detailed privacy policy text.
const PrivacyPolicy = () => {
    return (
      <div className="container mx-auto max-w-3xl py-12 px-6">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy for Bandi</h1>
        <p className="text-muted-foreground mb-8">Last Updated: October 11, 2025</p>
  
        <div className="space-y-6 text-foreground/90">
          <p>
            Welcome to Bandi! This Privacy Policy explains what information we collect from you and why. Our goal is to be as transparent as possible while keeping things simple.
          </p>
  
          <h2 className="text-2xl font-semibold pt-4 border-t">What We Collect</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Registered Users:</strong> When you create an account, we store your <strong>username</strong> and <strong>email address</strong>. Your password is encrypted and we can never see it.
            </li>
            <li>
              <strong>Guest Users:</strong> When you "Continue as a guest," we create a temporary, anonymous account for you. This account is automatically deleted, along with all its data, after 30 days of inactivity.
            </li>
            <li>
              <strong>Your Content:</strong> We store the decks and flashcards you create so you can access them when you log in.
            </li>
            <li>
              <strong>AI Usage:</strong> To prevent abuse and manage costs, we keep a simple, anonymous count of how many AI-generated questions your account (including guest accounts) has requested each day.
            </li>
          </ul>
  
          <h2 className="text-2xl font-semibold pt-4 border-t">How We Use Your Data</h2>
          <p>
            We only use your data to provide the core functionality of the Bandi app:
          </p>
          <ul className="list-disc list-inside space-y-2">
              <li>To save your decks and cards.</li>
              <li>To allow you to log in and out of your account.</li>
              <li>To ensure fair use of the AI generation feature.</li>
          </ul>
          <p>
            <strong>We do not share or sell your personal data with any third parties for marketing or advertising purposes.</strong> The only external service we interact with is the Google Gemini API, which receives the content of a single flashcard to generate a sentence. This data is not linked to your personal identity.
          </p>
  
          <h2 className="text-2xl font-semibold pt-4 border-t">Our Use of Cookies</h2>
          <p>
            We use one single, strictly necessary cookie:
          </p>
          <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Authentication Cookie (JWT):</strong> This cookie is a secure token that keeps you logged in as you navigate the site. Without it, you would have to log in on every single page.
              </li>
          </ul>
          <p>
            We do not use any cookies for tracking, analytics, or advertising.
          </p>
  
          <h2 className="text-2xl font-semibold pt-4 border-t">Data Deletion</h2>
           <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Guest Accounts:</strong> All data associated with a guest account is automatically and permanently deleted 24 hours after its creation.
              </li>
               <li>
                <strong>Registered Users:</strong> You can manually delete any of your decks or cards at any time from within the app.
              </li>
          </ul>
        </div>
      </div>
    );
  };
  
  export default PrivacyPolicy;
