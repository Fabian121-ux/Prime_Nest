import Footer from '@/components/layout/footer'
import Header from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Shield } from 'lucide-react'

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <header className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold font-headline flex items-center justify-center gap-3">
                <Shield className="w-8 h-8" />
                Terms of Service
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </header>
            
            <Card>
                <CardHeader>
                    <CardTitle>Welcome to Prime Nest</CardTitle>
                    <CardDescription>
                        These terms and conditions outline the rules and regulations for the use of Prime Nest's Website, located at primenest.app.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-96 w-full pr-6">
                        <div className="space-y-6 text-sm text-muted-foreground">
                            <div className="space-y-2">
                                <h3 className="font-semibold text-foreground">1. Introduction</h3>
                                <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use Prime Nest if you do not agree to take all of the terms and conditions stated on this page.</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-foreground">2. User Accounts</h3>
                                <p>When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
                                <p>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-foreground">3. Escrow Services</h3>
                                <p>Prime Nest provides an escrow service to facilitate secure transactions between Tenants, Landlords, and Artisans. By initiating a transaction, you agree to be bound by the rules of our escrow process.</p>
                                <p>Funds will be held by Prime Nest until the service is confirmed as completed by both parties. In case of a dispute, Prime Nest will act as a mediator based on the evidence provided by all parties involved. Prime Nest's decision in a dispute is final and binding.</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-foreground">4. Listings and Content</h3>
                                <p>Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.</p>
                                <p>We reserve the right to remove any content that we determine to be unlawful, offensive, threatening, libelous, defamatory, pornographic, obscene or otherwise objectionable or violates any party’s intellectual property or these Terms of Service.</p>
                            </div>
                             <div className="space-y-2">
                                <h3 className="font-semibold text-foreground">5. Termination</h3>
                                <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
                            </div>
                             <div className="space-y-2">
                                <h3 className="font-semibold text-foreground">6. Governing Law</h3>
                                <p>These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which Prime Nest operates, without regard to its conflict of law provisions.</p>
                            </div>
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
