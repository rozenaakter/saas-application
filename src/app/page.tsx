import LandingHeader from "@/components/landing/LandingHeader";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { 
  Sparkles, 
  ListChecks, 
  FolderKanban, 
  MessageSquare,
  CheckCircle,
  Zap,
  Shield,
  ArrowRight,
  BarChart3
} from "lucide-react";

export default function LandingPage() {
  return (
    <>
      <LandingHeader />
      
      <main className="min-h-screen">
        
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-blue-50 via-purple-50 to-white">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-blue-100 rounded-full">
              <span className="text-blue-700 font-medium text-sm">
                ✨ Powered by FREE AI Models
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Task Management
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Powered by AI
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Let artificial intelligence help you break down tasks, prioritize
              work, and accomplish more every day. 100% Free Forever.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700 text-lg px-8">
                <Link href="/register">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8">
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              No credit card required • Sign up in 30 seconds
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Everything You Need to Stay Productive
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Simple yet powerful features designed to help you manage tasks efficiently
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Feature 1: AI Suggestions */}
              <Link href="/register" className="group">
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-purple-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Sparkles className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-purple-600 transition-colors">
                      AI Task Suggestions
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Get smart subtasks, time estimates, and productivity tips
                    </p>
                    <span className="text-xs text-purple-600 font-medium inline-flex items-center">
                    Try it now <ArrowRight className="ml-1 h-3 w-3" />
                  
                    </span>

                    

                  </CardContent>
                </Card>
              </Link>

              {/* Feature 2: Todo Lists */}
              <Link href="/register" className="group">
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-blue-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <ListChecks className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                      Smart Todo Lists
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Interactive checklists with real-time progress tracking
                    </p>
                    <span className="text-xs text-blue-600 font-medium inline-flex items-center">
                      Explore <ArrowRight className="ml-1 h-3 w-3" />
                    </span>
                  </CardContent>
                </Card>
              </Link>

              {/* Feature 3: Projects */}
              <Link href="/register" className="group">
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-orange-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <FolderKanban className="h-8 w-8 text-orange-600" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-orange-600 transition-colors">
                      Project Management
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Organize tasks into projects with custom colors
                    </p>
                    <span className="text-xs text-orange-600 font-medium inline-flex items-center">
                      Get organized <ArrowRight className="ml-1 h-3 w-3" />
                    </span>
                  </CardContent>
                </Card>
              </Link>

              {/* Feature 4: AI Chat */}
              <Link href="/register" className="group">
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-green-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <MessageSquare className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-green-600 transition-colors">
                      AI Chat Assistant
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Get instant help and advice from AI assistant
                    </p>
                    <span className="text-xs text-green-600 font-medium inline-flex items-center">
                      Chat now <ArrowRight className="ml-1 h-3 w-3" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {/* Dashboard Preview Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Powerful Dashboard at Your Fingertips
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Everything you need in one place. Get real-time statistics and insights.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              
              {/* Dashboard Feature 1 */}
              <Card className="border-2">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                      <BarChart3 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Real-time Statistics</h3>
                      <p className="text-sm text-gray-600">
                        Track your tasks, completion rate, and productivity metrics
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dashboard Feature 2 */}
              <Card className="border-2">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Quick Actions</h3>
                      <p className="text-sm text-gray-600">
                        Create tasks, projects, and chat with AI in seconds
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dashboard Feature 3 */}
              <Card className="border-2">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                      <Zap className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">AI-Powered Insights</h3>
                      <p className="text-sm text-gray-600">
                        Get personalized recommendations and productivity tips
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8">
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Free to Use Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">
              100% Free to Use
            </h2>
            <p className="text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
              No hidden fees, no credit card required. Start managing your tasks today.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              
              {/* Benefit 1 */}
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-bold mb-2">Free Forever</h3>
                  <p className="text-sm text-gray-600">
                    No subscription, no trials. Completely free always.
                  </p>
                </CardContent>
              </Card>

              {/* Benefit 2 */}
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold mb-2">No Credit Card</h3>
                  <p className="text-sm text-gray-600">
                    Sign up with just your email. That's it.
                  </p>
                </CardContent>
              </Card>

              {/* Benefit 3 */}
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-bold mb-2">Unlimited Everything</h3>
                  <p className="text-sm text-gray-600">
                    Unlimited tasks, projects, and AI suggestions.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700 text-lg px-12">
              <Link href="/register">
                Start for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}