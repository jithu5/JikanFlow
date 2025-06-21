import { NavBar } from "../components"

function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Navbar */}
      <NavBar/>

      {/* Hero Section */}
      <header className="bg-gradient-to-br from-blue-50 to-blue-100 text-center py-32 px-6">
        <h2 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6">Your All-In-One Productivity Companion</h2>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto">
          Manage your work, automate reminders, and stay focused. JikanFlow simplifies your freelance journey.
        </p>
        <button className="mt-10 px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-medium hover:bg-blue-700 transition shadow-lg">
          Start Free Trial
        </button>
      </header>

      {/* Features Section */}
      <section id="features" className="py-24 px-8 bg-white">
        <h3 className="text-4xl font-bold text-center mb-16">Why JikanFlow?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <div className="bg-gray-50 p-8 rounded-xl shadow hover:shadow-lg transition">
            <h4 className="text-2xl font-semibold mb-4">🧠 Task Boards</h4>
            <p className="text-gray-600">Organize your work using intuitive drag-and-drop Kanban boards that adapt to your workflow.</p>
          </div>
          <div className="bg-gray-50 p-8 rounded-xl shadow hover:shadow-lg transition">
            <h4 className="text-2xl font-semibold mb-4">⏱ Auto Time Tracking</h4>
            <p className="text-gray-600">Timers start and stop automatically as you work — so you can focus on what matters most.</p>
          </div>
          <div className="bg-gray-50 p-8 rounded-xl shadow hover:shadow-lg transition">
            <h4 className="text-2xl font-semibold mb-4">🔔 Email & App Notifications</h4>
            <p className="text-gray-600">Get smart reminders based on your schedule and deadlines, powered by RabbitMQ events.</p>
          </div>
          <div className="bg-gray-50 p-8 rounded-xl shadow hover:shadow-lg transition">
            <h4 className="text-2xl font-semibold mb-4">📈 Weekly Insights</h4>
            <p className="text-gray-600">AI-generated reports summarize how your time is spent and where you can improve.</p>
          </div>
          <div className="bg-gray-50 p-8 rounded-xl shadow hover:shadow-lg transition">
            <h4 className="text-2xl font-semibold mb-4">🔒 Secure & Private</h4>
            <p className="text-gray-600">End-to-end encrypted data handling with role-based access control and JWT auth.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-8 bg-blue-50">
        <h3 className="text-4xl font-bold text-center mb-16">Pricing Plans</h3>
        <div className="flex flex-col lg:flex-row justify-center gap-10 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <h4 className="text-2xl font-bold mb-4">Free Plan</h4>
            <p className="text-4xl font-extrabold mb-6">$0<span className="text-lg font-normal">/month</span></p>
            <ul className="text-gray-600 mb-6 space-y-2">
              <li>✔️ Up to 3 projects</li>
              <li>✔️ Time tracking</li>
              <li>✔️ Email reminders</li>
            </ul>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">Start Free</button>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg text-center border border-blue-600">
            <h4 className="text-2xl font-bold mb-4">Pro Plan</h4>
            <p className="text-4xl font-extrabold mb-6">$9<span className="text-lg font-normal">/month</span></p>
            <ul className="text-gray-600 mb-6 space-y-2">
              <li>✔️ Unlimited projects</li>
              <li>✔️ AI summaries</li>
              <li>✔️ Priority support</li>
            </ul>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">Upgrade</button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-6">About JikanFlow</h3>
          <p className="text-gray-700 text-lg">
            JikanFlow is built for the modern creator. Whether you're freelancing, building your next startup, or managing a side hustle, TrackFlow empowers you to do more with less. Designed with simplicity and automation in mind.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-8 bg-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-6">Get in Touch</h3>
          <p className="text-gray-600 mb-8">Have questions or feature requests? Reach out to us.</p>
          <form className="grid gap-4">
            <input type="text" placeholder="Your Name" className="p-3 rounded border" />
            <input type="email" placeholder="Your Email" className="p-3 rounded border" />
            <textarea placeholder="Your Message" rows={4} className="p-3 rounded border"></textarea>
            <button className="mt-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">Send Message</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 text-center">
        <p>&copy; {new Date().getFullYear()} JikanFlow. All rights reserved.</p>
      </footer>
    </div>
  )}

export default LandingPage
