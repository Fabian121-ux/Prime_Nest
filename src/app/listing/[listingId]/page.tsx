
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function ListingDetailPage({ params }: { params: { listingId: string } }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-12">
        <Card>
          <CardHeader>
            <CardTitle>Listing Details</CardTitle>
            <CardDescription>
              This is a placeholder page for listing ID: {params.listingId}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>More listing details will be shown here soon.</p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
