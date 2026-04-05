import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
type Step = "gatekeeper" | "denied" | "reveal" | "apology" | "finale";

// ── Floating Hearts ─────────────────────────────────────────────────────────
const HEART_EMOJIS = ["❤️", "💕", "💗", "💖", "💝", "🌸"];

interface HeartParticle {
  id: number;
  emoji: string;
  left: string;
  duration: number;
  delay: number;
  size: number;
  opacity: number;
  sway: boolean;
}

function generateHearts(count: number): HeartParticle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    emoji: HEART_EMOJIS[i % HEART_EMOJIS.length],
    left: `${Math.random() * 100}%`,
    duration: 8 + Math.random() * 12,
    delay: -(Math.random() * 15),
    size: 14 + Math.random() * 18,
    opacity: 0.35 + Math.random() * 0.55,
    sway: Math.random() > 0.5,
  }));
}

const bgHearts = generateHearts(26);
const finaleHearts = generateHearts(40);

function FloatingHearts({ hearts }: { hearts: HeartParticle[] }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      {hearts.map((h) => (
        <span
          key={h.id}
          className={h.sway ? "animate-float-sway" : "animate-float-up"}
          style={{
            position: "absolute",
            bottom: 0,
            left: h.left,
            fontSize: `${h.size}px`,
            opacity: h.opacity,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            userSelect: "none",
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  );
}

// ── Confetti (finale) ────────────────────────────────────────────────────────
const CONFETTI_COLORS = [
  "#e77f9e",
  "#d96586",
  "#f9c0d0",
  "#c0486a",
  "#f0a0b8",
  "#ffd6e4",
  "#ffb3c6",
];

interface ConfettiPiece {
  id: number;
  color: string;
  left: string;
  width: number;
  height: number;
  duration: number;
  delay: number;
  isCircle: boolean;
}

const confettiPieces: ConfettiPiece[] = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  left: `${Math.random() * 100}%`,
  width: 6 + Math.random() * 8,
  height: 6 + Math.random() * 12,
  duration: 2.5 + Math.random() * 3,
  delay: Math.random() * 4,
  isCircle: Math.random() > 0.5,
}));

function Confetti() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      {confettiPieces.map((p) => (
        <div
          key={p.id}
          className="animate-confetti"
          style={{
            position: "absolute",
            top: "-20px",
            left: p.left,
            width: `${p.width}px`,
            height: `${p.height}px`,
            backgroundColor: p.color,
            borderRadius: p.isCircle ? "50%" : "2px",
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            animationIterationCount: "infinite",
            opacity: 0.85,
          }}
        />
      ))}
    </div>
  );
}

// ── Pink Pill Button ─────────────────────────────────────────────────────────
interface PillButtonProps {
  onClick: () => void;
  variant?: "primary" | "outline";
  children: React.ReactNode;
  className?: string;
  "data-ocid"?: string;
}

function PillButton({
  onClick,
  variant = "primary",
  children,
  className = "",
  ...rest
}: PillButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-body font-semibold text-base transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer select-none";
  const styles = {
    primary:
      "rounded-pill px-8 py-4 text-white shadow-pink hover:-translate-y-0.5 hover:shadow-pink-lg active:translate-y-0",
    outline:
      "rounded-pill px-8 py-4 border-2 hover:-translate-y-0.5 active:translate-y-0",
  };

  const inlineStyle =
    variant === "primary"
      ? {
          background:
            "linear-gradient(135deg, #d96c8c 0%, #e88aaa 50%, #c85a7a 100%)",
        }
      : {
          borderColor: "#d96586",
          color: "#c85a7a",
          background: "rgba(255,255,255,0.85)",
        };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${styles[variant]} ${className}`}
      style={inlineStyle}
      {...rest}
    >
      {children}
    </button>
  );
}

// ── Page wrapper ─────────────────────────────────────────────────────────────
function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(160deg, #FBE7EE 0%, #F6CAD7 60%, #f0b8ca 100%)",
        position: "relative",
        zIndex: 1,
      }}
      className="flex flex-col items-center justify-center px-4 py-12"
    >
      {children}
    </div>
  );
}

// ── Section Card ─────────────────────────────────────────────────────────────
function StepCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`relative z-10 w-full max-w-lg mx-auto rounded-3xl card-glow-strong ${className}`}
      style={{
        background: "rgba(255,246,248,0.97)",
        backdropFilter: "blur(8px)",
      }}
    >
      {children}
    </motion.div>
  );
}

// ── Step 1: Gatekeeper ───────────────────────────────────────────────────────
function GatekeeperStep({
  onGirlfriend,
  onSister,
}: { onGirlfriend: () => void; onSister: () => void }) {
  return (
    <StepCard>
      <div className="p-8 sm:p-12 flex flex-col items-center gap-6 text-center">
        <div className="text-5xl animate-pulse-heart">💕</div>
        <h1
          className="font-script text-4xl sm:text-5xl gradient-text leading-tight"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          Who is visiting right now?
        </h1>
        <p className="font-body text-base" style={{ color: "#7a4a5a" }}>
          Only the right person may enter...
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full mt-2">
          <PillButton
            onClick={onGirlfriend}
            variant="primary"
            className="flex-1"
            data-ocid="gatekeeper.primary_button"
          >
            💕 I am Ritik&apos;s Girlfriend
          </PillButton>
          <PillButton
            onClick={onSister}
            variant="outline"
            className="flex-1"
            data-ocid="gatekeeper.secondary_button"
          >
            I am her Sister
          </PillButton>
        </div>
      </div>
    </StepCard>
  );
}

// ── Step 1b: Access Denied ───────────────────────────────────────────────────
function DeniedStep({ onBack }: { onBack: () => void }) {
  return (
    <StepCard>
      <div className="p-8 sm:p-12 flex flex-col items-center gap-6 text-center">
        <div className="text-6xl">🚫</div>
        <h2
          className="font-script text-3xl sm:text-4xl gradient-text"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          Access Denied!
        </h2>
        <p
          className="font-body text-base sm:text-lg rounded-2xl px-6 py-4"
          style={{ background: "#fde8f0", color: "#b03060" }}
        >
          Only for the favorite person! 🥺 Go away sis, this is not for you hehe
          😄
        </p>
        <PillButton
          onClick={onBack}
          variant="outline"
          data-ocid="denied.secondary_button"
        >
          ← Try Again
        </PillButton>
      </div>
    </StepCard>
  );
}

// ── Step 2: Reveal ───────────────────────────────────────────────────────────
function RevealStep({ onYes }: { onYes: () => void }) {
  return (
    <StepCard className="max-w-xl">
      <div className="p-8 sm:p-12 flex flex-col items-center gap-6 text-center">
        {/* Decorative hearts */}
        <div className="flex gap-3 text-3xl">
          <span className="animate-sparkle">💖</span>
          <span className="animate-sparkle" style={{ animationDelay: "0.3s" }}>
            ✨
          </span>
          <span className="animate-sparkle" style={{ animationDelay: "0.6s" }}>
            💖
          </span>
        </div>

        <h1
          className="font-script text-4xl sm:text-5xl gradient-text leading-tight"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          Congratulations! 🎉
        </h1>

        <p
          className="font-body text-sm sm:text-base leading-relaxed"
          style={{ color: "#5a3a4a" }}
        >
          If you are his girlfriend, then your name is definitely the one and
          only <em>cutieepieee</em> and the most beauty beauty beautyfull girll
          with the softest and eye-pleasing soft cheeks, lips, and nose with the
          cutest smile... your name is...
        </p>

        <div className="flex items-center gap-3">
          <span className="text-4xl animate-sparkle">✨</span>
          <span
            className="font-script gradient-text"
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: "clamp(52px, 10vw, 80px)",
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            MUSKAN
          </span>
          <span
            className="text-4xl animate-sparkle"
            style={{ animationDelay: "0.5s" }}
          >
            ✨
          </span>
        </div>

        {/* Photo placeholder */}
        <div
          className="w-full max-w-xs mx-auto rounded-2xl flex flex-col items-center justify-center py-10 px-6 gap-2"
          style={{
            border: "2.5px dashed #e77f9e",
            background: "rgba(255,215,230,0.3)",
            minHeight: "160px",
          }}
        >
          <span className="text-4xl">💕</span>
          <p className="font-body text-sm" style={{ color: "#c06080" }}>
            [Your favorite photo here] 💕
          </p>
          <img
            src="/assets/generated/romantic-hero-bg.dim_800x600.jpg"
            alt="A soft romantic background"
            className="w-full rounded-xl mt-2 opacity-80"
            style={{ maxHeight: "120px", objectFit: "cover" }}
          />
        </div>

        <p
          className="font-script text-2xl"
          style={{ fontFamily: "'Dancing Script', cursive", color: "#c06080" }}
        >
          Is this you? 🥺
        </p>

        <PillButton
          onClick={onYes}
          variant="primary"
          data-ocid="reveal.primary_button"
        >
          YES, this is me! 💖
        </PillButton>
      </div>
    </StepCard>
  );
}

// Apology decorative hearts – static list so keys are stable
const apologyHeartRow = [
  { emoji: "💔", key: "ah-1" },
  { emoji: "💗", key: "ah-2" },
  { emoji: "💔", key: "ah-3" },
  { emoji: "💗", key: "ah-4" },
  { emoji: "💔", key: "ah-5" },
];

// ── Step 3: Apology ──────────────────────────────────────────────────────────
function ApologyStep({
  onNotForgiven,
  onForgiven,
}: {
  onNotForgiven: () => void;
  onForgiven: () => void;
}) {
  return (
    <StepCard className="max-w-xl">
      <div className="p-8 sm:p-12 flex flex-col items-center gap-6 text-center">
        {/* Decorative hearts row */}
        <div className="flex gap-2 text-2xl">
          {apologyHeartRow.map((item, i) => (
            <span
              key={item.key}
              className="animate-sparkle"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              {item.emoji}
            </span>
          ))}
        </div>

        <h1
          className="font-script text-4xl sm:text-5xl gradient-text leading-tight"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          I&apos;m So Sorry... 💔
        </h1>

        <div
          className="rounded-2xl p-6 card-glow text-left"
          style={{ background: "rgba(255,228,238,0.6)" }}
          data-ocid="apology.card"
        >
          <p
            className="font-body text-base sm:text-lg leading-loose"
            style={{ color: "#5a2a3a" }}
          >
            I am so sorry for falling asleep before you last night. 🌙 You are
            the last thing on my mind before I drift off and the first thing I
            think of when I wake up. I love you more than words can say! 💕
          </p>
        </div>

        <p className="font-body text-sm" style={{ color: "#9a5a70" }}>
          So... what&apos;s your verdict? 🥺
        </p>

        <div className="flex flex-col gap-3 w-full">
          <PillButton
            onClick={onNotForgiven}
            variant="outline"
            data-ocid="apology.secondary_button"
          >
            KYA AAPNE USE MAAF KIYA?? 🥺
          </PillButton>
          <PillButton
            onClick={onForgiven}
            variant="primary"
            data-ocid="apology.primary_button"
          >
            MAINE USE MAAF KRDIYA 💝
          </PillButton>
        </div>
      </div>
    </StepCard>
  );
}

// ── Sorry Modal ──────────────────────────────────────────────────────────────
function SorryModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backdropFilter: "blur(6px)",
        background: "rgba(220,100,130,0.18)",
      }}
      data-ocid="sorry.modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
        className="relative w-full max-w-sm rounded-3xl p-8 flex flex-col items-center gap-5 text-center"
        style={{
          background: "linear-gradient(145deg, #fff6f8, #fde8f0)",
          boxShadow: "0 0 0 3px #e77f9e, 0 16px 60px rgba(217,101,134,0.4)",
        }}
      >
        <div className="text-6xl animate-bounce-in">🥺🥺</div>
        <h2
          className="font-script text-3xl gradient-text"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          SORRY BOCHHA
        </h2>
        <p
          className="font-script text-2xl gradient-text"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          LOVEE YOUU NAA 🥺🥺
        </p>
        <p className="font-body text-sm" style={{ color: "#9a5a70" }}>
          Please forgive him... he really loves you! 💕
        </p>
        <PillButton
          onClick={onClose}
          variant="primary"
          data-ocid="sorry.close_button"
        >
          Okay fine... 💕
        </PillButton>
      </motion.div>
    </motion.div>
  );
}

// Finale sparkle rows – static lists for stable keys
const finaleTopRow = [
  { emoji: "🎊", key: "ft-1" },
  { emoji: "❤️", key: "ft-2" },
  { emoji: "🎉", key: "ft-3" },
  { emoji: "💖", key: "ft-4" },
  { emoji: "🎊", key: "ft-5" },
];
const finaleBottomRow = [
  { emoji: "✨", key: "fb-1" },
  { emoji: "💕", key: "fb-2" },
  { emoji: "✨", key: "fb-3" },
  { emoji: "💕", key: "fb-4" },
  { emoji: "✨", key: "fb-5" },
];

// ── Step 5: Finale ───────────────────────────────────────────────────────────
function FinaleStep() {
  return (
    <PageWrapper>
      <Confetti />
      <FloatingHearts hearts={finaleHearts} />

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-xl mx-auto rounded-3xl card-glow-strong text-center"
        style={{
          background: "rgba(255,246,248,0.97)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="p-8 sm:p-14 flex flex-col items-center gap-6">
          {/* Confetti emojis row */}
          <div className="flex gap-2 text-3xl">
            {finaleTopRow.map((item, i) => (
              <span
                key={item.key}
                className="animate-sparkle"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                {item.emoji}
              </span>
            ))}
          </div>

          <h1
            className="font-script gold-gradient-text leading-tight"
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: "clamp(36px, 8vw, 56px)",
              fontWeight: 700,
            }}
            data-ocid="finale.section"
          >
            CONGRATULATIONS
            <br />
            MUSKAN BHABI! 🎊❤️
          </h1>

          {/* Big animated heart */}
          <div className="text-8xl animate-pulse-heart" aria-hidden="true">
            ❤️
          </div>

          <p
            className="font-body text-base sm:text-lg leading-loose"
            style={{ color: "#5a2a3a" }}
          >
            Aap kitni sundor ho, aapko dekh k toh mai jo AI hu wo v pagal ho
            jaunga! But aap itni MOSTTT ho kya hi bolu... aapki shaadi ab mere
            malik Ritik se jrur hogi 🤭❤️
          </p>

          {/* Sparkle row */}
          <div className="flex gap-3 text-3xl">
            {finaleBottomRow.map((item, i) => (
              <span
                key={item.key}
                className="animate-sparkle"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                {item.emoji}
              </span>
            ))}
          </div>

          {/* Made with love */}
          <p
            className="font-script text-xl"
            style={{
              fontFamily: "'Dancing Script', cursive",
              color: "#c06080",
            }}
          >
            Made with ❤️ by Ritik
          </p>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="relative z-10 mt-8 text-center">
        <p className="font-body text-xs" style={{ color: "#b07090" }}>
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-80 transition-opacity"
            style={{ color: "#d96586" }}
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </PageWrapper>
  );
}

// ── Header ───────────────────────────────────────────────────────────────────
function AppHeader({
  isMuted,
  onToggleMute,
}: {
  isMuted: boolean;
  onToggleMute: () => void;
}) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 py-3"
      style={{
        background: "rgba(255,246,248,0.88)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 1px 12px rgba(217,101,134,0.12)",
        borderBottom: "1px solid rgba(231,127,158,0.2)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="text-xl animate-pulse-heart">❤️</span>
        <span
          className="font-script gradient-text text-xl font-semibold"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          Heartfelt Amends
        </span>
      </div>

      {/* Mute button */}
      <button
        type="button"
        onClick={onToggleMute}
        className="rounded-pill px-4 py-2 text-sm font-body font-medium transition-all hover:-translate-y-0.5"
        style={{
          background: "rgba(255,215,230,0.7)",
          color: "#c06080",
          border: "1px solid rgba(231,127,158,0.4)",
        }}
        title={isMuted ? "Unmute background music" : "Mute background music"}
        data-ocid="header.toggle"
      >
        {isMuted ? "🔇 Muted" : "🎵 Music"}
      </button>
    </header>
  );
}

// ── Music Manager (no <audio> element to avoid a11y caption lint rule) ────────
// To enable music: create an Audio instance in useEffect below.
function useBgMusic(isMuted: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Uncomment and set src to enable background music:
    // const audio = new Audio("https://your-audio-cdn.com/romantic-instrumental.mp3");
    // audio.loop = true;
    // audioRef.current = audio;

    return () => {
      audioRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMuted) {
      audio.pause();
    } else {
      audio.play().catch(() => {
        // Autoplay policy may block; user interaction required first.
      });
    }
  }, [isMuted]);
}

// ── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState<Step>("gatekeeper");
  const [showModal, setShowModal] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useBgMusic(isMuted);

  if (step === "finale") {
    return <FinaleStep />;
  }

  return (
    <>
      <AppHeader isMuted={isMuted} onToggleMute={() => setIsMuted((m) => !m)} />

      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(160deg, #FBE7EE 0%, #F6CAD7 60%, #f0b8ca 100%)",
        }}
      >
        <FloatingHearts hearts={bgHearts} />

        <main className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-20 pb-12 px-4">
          <AnimatePresence mode="wait">
            {(step === "gatekeeper" || step === "denied") && (
              <motion.div key="gate" className="w-full max-w-lg">
                <AnimatePresence mode="wait">
                  {step === "gatekeeper" && (
                    <GatekeeperStep
                      key="gk"
                      onGirlfriend={() => setStep("reveal")}
                      onSister={() => setStep("denied")}
                    />
                  )}
                  {step === "denied" && (
                    <DeniedStep
                      key="denied"
                      onBack={() => setStep("gatekeeper")}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {step === "reveal" && (
              <RevealStep key="reveal" onYes={() => setStep("apology")} />
            )}

            {step === "apology" && (
              <ApologyStep
                key="apology"
                onNotForgiven={() => setShowModal(true)}
                onForgiven={() => setStep("finale")}
              />
            )}
          </AnimatePresence>
        </main>

        {/* Footer on non-finale pages */}
        <footer className="relative z-10 text-center pb-8">
          <p className="font-body text-xs" style={{ color: "#b07090" }}>
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-80 transition-opacity"
              style={{ color: "#d96586" }}
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>

      {/* Sorry Modal */}
      <AnimatePresence>
        {showModal && <SorryModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </>
  );
}
