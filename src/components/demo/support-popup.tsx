'use client';
import { useState, useEffect, useCallback } from 'react';
import { useUser, useFirestore, useAuth } from '@/firebase';
import { doc, getDoc, addDoc, serverTimestamp, collection } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, HeartCrack, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';

type PopupState = 'initial' | 'confirm_yes' | 'confirm_no';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const auth = useAuth();
  const router = useRouter();

  const [popupState, setPopupState] = useState<PopupState>('initial');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [hasSeenPopup, setHasSeenPopup] = useState(false);

  // Check if user already responded to popup
  useEffect(() => {
    if (!user || !firestore) return;
    const checkPopup = async () => {
      try {
        const querySnap = await getDoc(doc(firestore, 'support_demo_responses', user.uid));
        if (!querySnap.exists()) {
          setIsPopupOpen(true); // Show popup if not responded
        } else {
          setHasSeenPopup(true);
        }
      } catch (err) {
        console.error('Error checking popup:', err);
      }
    };
    checkPopup();
  }, [user, firestore]);

  // Handle "Yes" click
  const handleYes = useCallback(async () => {
    if (!firestore || !user) return;
    try {
      await addDoc(collection(firestore, 'support_demo_responses'), {
        uid: user.uid,
        email: user.email,
        response: 'yes',
        createdAt: serverTimestamp(),
        demoVersion: 'v1-demo',
      });
      setPopupState('confirm_yes');
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => {
        setIsPopupOpen(false);
        setHasSeenPopup(true);
      }, 4000);
    } catch (err) {
      console.error('Error saving response:', err);
      setIsPopupOpen(false);
      setHasSeenPopup(true);
    }
  }, [firestore, user]);

  // Handle "No" click
  const handleNo = useCallback(async () => {
    if (!firestore || !user) return;
    try {
      await addDoc(collection(firestore, 'support_demo_responses'), {
        uid: user.uid,
        email: user.email,
        response: 'no',
        createdAt: serverTimestamp(),
        demoVersion: 'v1-demo',
      });
      setPopupState('confirm_no');
    } catch (err) {
      console.error('Error saving response:', err);
      setIsPopupOpen(false);
    }
  }, [firestore, user]);

  // Countdown for "No" response
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (popupState === 'confirm_no' && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (popupState === 'confirm_no' && countdown === 0) {
      handleLogout();
    }
    return () => clearTimeout(timer);
  }, [popupState, countdown]);

  const handleLogout = useCallback(async () => {
    if (!auth) return;
    setIsPopupOpen(false);
    setHasSeenPopup(true);
    await signOut(auth);
    router.push('/login');
  }, [auth, router]);

  if (isUserLoading) return <div>Loading...</div>;

  return (
    <div className="relative min-h-screen bg-background">
      {/* Your dashboard content goes here */}
      <h1 className="text-3xl font-bold p-6">Welcome to Prime Nest Dashboard</h1>

      {/* Support Popup */}
      {user && !hasSeenPopup && (
        <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
          <DialogContent className="sm:max-w-md">
            <AnimatePresence mode="wait">
              {popupState === 'initial' && (
                <motion.div
                  key="initial"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                >
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                      <Heart className="text-primary" /> A Quick Question
                    </DialogTitle>
                    <DialogDescription className="pt-2">
                      This Prime Nest demo has consumed over 7GB of data! Show some love by subscribing airtime/data.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4 text-center bg-muted/50 rounded-lg my-4">
                    <p className="font-bold text-lg">🙏 Sub Airtime/Data 🙏</p>
                    <p className="font-mono text-xl font-semibold text-primary tracking-widest">
                      09036553377 (MTN)
                    </p>
                  </div>
                  <DialogFooter className="grid grid-cols-2 gap-2">
                    <Button onClick={handleNo} variant="outline">
                      No, maybe later
                    </Button>
                    <Button onClick={handleYes}>Yes, I got you</Button>
                  </DialogFooter>
                </motion.div>
              )}

              {popupState === 'confirm_yes' && (
                <motion.div
                  key="confirm_yes"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center p-4"
                >
                  <PartyPopper className="h-16 w-16 text-green-500 mx-auto animate-bounce" />
                  <h2 className="text-2xl font-bold mt-4">You promised! 😌</h2>
                  <p className="text-muted-foreground mt-2">
                    Please keep to it ❤️. This popup will now close.
                  </p>
                </motion.div>
              )}

              {popupState === 'confirm_no' && (
                <motion.div
                  key="confirm_no"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center p-4"
                >
                  <HeartCrack className="h-16 w-16 text-destructive mx-auto mb-4" />
                  <h2 className="text-xl font-bold">Aww, that's a shame 😔</h2>
                  <p className="text-muted-foreground mt-2">
                    You’ll be logged out in...
                  </p>
                  <motion.div
                    key={countdown}
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-6xl font-bold text-destructive my-4"
                  >
                    {countdown}
                  </motion.div>
                  <div className="grid grid-cols-2 gap-2 mt-6">
                    <Button variant="outline" onClick={handleLogout}>
                      Proceed to Logout
                    </Button>
                    <Button onClick={handleYes}>Okay okay, YES!</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
