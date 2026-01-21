'use client';

import { useState, useEffect } from 'react';

export default function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="py-8 bg-card border-t">
      <div className="container mx-auto px-6 text-center text-muted-foreground">
        <p>&copy; {year} Prime Nest. All rights reserved.</p>
      </div>
    </footer>
  );
}
