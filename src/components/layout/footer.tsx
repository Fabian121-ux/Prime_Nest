export default function Footer() {
  return (
    <footer className="py-8 bg-card border-t">
      <div className="container mx-auto px-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Prime Nest. All rights reserved.</p>
      </div>
    </footer>
  );
}
