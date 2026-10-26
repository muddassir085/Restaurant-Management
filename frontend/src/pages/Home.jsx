import { Link } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";

function Home() {
  return (
    <div className="app-shell flex min-h-screen flex-col">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_20%,rgba(251,191,36,0.18),transparent_22rem)]" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="page-enter text-center lg:text-left">
              <span className="inline-block rounded-full border border-teal-100 bg-white/70 px-4 py-2 text-sm font-bold text-teal-800 shadow-sm backdrop-blur">
                Fresh • Delicious • Made With Love
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.05] mt-5">
                Taste the
                <span className="text-teal-600"> Royal </span>
                Biryani
              </h1>

              <p className="text-slate-600 text-lg leading-relaxed mt-5 max-w-xl mx-auto lg:mx-0">
                Enjoy delicious food made with quality ingredients and
                unforgettable flavours.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
                <Link
                  to="/menu"
                  className="btn-primary px-7 py-3.5 text-center"
                >
                  Explore Menu
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="page-enter reveal-delay-1 flex justify-center">
              <div className="glass-panel w-full max-w-lg rounded-[2rem] p-3">
                <img
                  src="/biryani.jpg"
                  alt="Delicious biryani"
                  className="w-full h-72 sm:h-96 object-cover rounded-[1.5rem] shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center">
            <p className="eyebrow">Why BiryaniKing?</p>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mt-2">
              Good Food, Great Experience
            </h2>

            <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
              We focus on great taste, quality ingredients and a simple ordering
              experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {/* Card 1 */}
            <div className="glass-card page-enter p-7 rounded-2xl text-center">
              <div className="w-14 h-14 mx-auto flex items-center justify-center bg-teal-50/80 rounded-2xl text-3xl shadow-sm">
                🍗
              </div>

              <h3 className="text-xl font-bold text-gray-900 mt-5">
                Delicious Food
              </h3>

              <p className="text-gray-600 mt-3 leading-relaxed">
                Carefully prepared dishes packed with flavour for every food
                lover.
              </p>
            </div>

            {/* Card 2 */}
            <div className="glass-card page-enter reveal-delay-1 p-7 rounded-2xl text-center">
              <div className="w-14 h-14 mx-auto flex items-center justify-center bg-teal-50/80 rounded-2xl text-3xl shadow-sm">
                🌿
              </div>

              <h3 className="text-xl font-bold text-gray-900 mt-5">
                Quality Ingredients
              </h3>

              <p className="text-gray-600 mt-3 leading-relaxed">
                We believe quality ingredients make every dish taste better.
              </p>
            </div>

            {/* Card 3 */}
            <div className="glass-card page-enter reveal-delay-2 p-7 rounded-2xl text-center">
              <div className="w-14 h-14 mx-auto flex items-center justify-center bg-teal-50/80 rounded-2xl text-3xl shadow-sm">
                ❤️
              </div>

              <h3 className="text-xl font-bold text-gray-900 mt-5">
                Made With Love
              </h3>

              <p className="text-gray-600 mt-3 leading-relaxed">
                Every meal is prepared with care to give you a memorable
                experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-5 mb-10 overflow-hidden rounded-[2rem] bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-700 shadow-xl sm:mx-8">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold">Hungry Already?</h2>

          <p className="mt-3 text-teal-50">
            Explore our menu and find something delicious.
          </p>

          <Link
            to="/menu"
            className="btn-secondary mt-7 bg-white px-7 py-3 text-teal-800"
          >
            View Menu
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

export default Home;
