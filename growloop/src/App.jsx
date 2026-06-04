import { useState, useEffect, useRef } from "react";

const COLORS = {
  cream: "#F5F0E8",
  warmWhite: "#FDFAF4",
  sage: "#7A9E7E",
  sageDark: "#5C7A60",
  sageLight: "#A8C5AC",
  sagePale: "#E8F0E9",
  brown: "#6B5B4E",
  brownLight: "#9B8B7E",
  charcoal: "#2D2926",
  muted: "#8A7F78",
};

const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
};

const Fade = ({ children, delay = 0, className = "" }) => {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

const LoopMark = ({ size = 48, color = COLORS.sage }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path
      d="M24 8 C14 8, 6 15, 6 24 C6 33, 14 40, 24 40 C31 40, 37 36, 40 30"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M24 40 C34 40, 42 33, 42 24 C42 15, 34 8, 24 8 C17 8, 11 12, 8 18"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeDasharray="4 3"
      fill="none"
      opacity="0.5"
    />
    <polygon points="40,30 44,25 36,27" fill={color} />
  </svg>
);

const CreditPill = ({ amount, label, sub }) => (
  <div style={{
    background: COLORS.warmWhite,
    border: `1.5px solid ${COLORS.sageLight}`,
    borderRadius: "16px",
    padding: "28px 24px",
    textAlign: "center",
    flex: 1,
    minWidth: "140px",
  }}>
    <div style={{
      fontSize: "36px",
      fontFamily: "'DM Serif Display', Georgia, serif",
      color: COLORS.sage,
      lineHeight: 1,
      marginBottom: "6px",
    }}>{amount}</div>
    <div style={{
      fontSize: "13px",
      fontWeight: 600,
      color: COLORS.charcoal,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      marginBottom: "4px",
    }}>{label}</div>
    <div style={{
      fontSize: "12px",
      color: COLORS.muted,
    }}>{sub}</div>
  </div>
);

const Step = ({ number, title, body }) => (
  <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
    <div style={{
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      background: COLORS.sage,
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "14px",
      fontWeight: 700,
      flexShrink: 0,
      marginTop: "2px",
    }}>{number}</div>
    <div>
      <div style={{
        fontFamily: "'DM Serif Display', Georgia, serif",
        fontSize: "18px",
        color: COLORS.charcoal,
        marginBottom: "4px",
      }}>{title}</div>
      <div style={{
        fontSize: "15px",
        color: COLORS.muted,
        lineHeight: 1.6,
      }}>{body}</div>
    </div>
  </div>
);

const SUBURBS = [
  "Brunswick", "Coburg", "Pascoe Vale", "Glenroy",
  "Footscray", "Seddon", "Yarraville", "Newport",
  "Northcote", "Preston", "Reservoir", "Heidelberg",
  "Fitzroy North", "Carlton North", "Other suburb"
];

const SuburbModal = ({ onClose }) => {
  const [selected, setSelected] = useState("");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!selected || !email) return;
    try {
      await fetch("https://script.google.com/macros/s/AKfycbxCWMa_-heEXZpv698IjuXK-r6L9wsSuw3WkXTbcunjBAPMoyBl4BbbXIVYeTkf7Lww/exec", {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({ formType: "suburb", suburb: selected, email }),
      });
    } catch (_) {}
    setDone(true);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(45,41,38,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px",
      backdropFilter: "blur(4px)",
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: COLORS.warmWhite,
        borderRadius: "20px",
        padding: "40px 32px",
        maxWidth: "460px",
        width: "100%",
        boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
        position: "relative",
      }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "16px", right: "16px",
            background: "none", border: "none", cursor: "pointer",
            fontSize: "20px", color: COLORS.brownLight, lineHeight: 1,
          }}
        >×</button>

        {done ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <LoopMark size={40} />
            <h3 style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: "22px", color: COLORS.charcoal,
              margin: "16px 0 8px",
            }}>Noted — thank you.</h3>
            <p style={{
              fontSize: "15px", color: COLORS.muted,
              lineHeight: 1.6,
            }}>
              We'll be in touch if GrowLoop comes to {selected || "your area"}.
            </p>
          </div>
        ) : (
          <>
            <LoopMark size={32} />
            <h3 style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: "22px", color: COLORS.charcoal,
              margin: "16px 0 8px",
            }}>Register interest for your suburb</h3>
            <p style={{
              fontSize: "14px", color: COLORS.muted,
              lineHeight: 1.6, marginBottom: "24px",
            }}>
              The first GrowLoop swap covers Ascot Vale, Moonee Ponds, Flemington, Kensington, and nearby suburbs. If you're outside that area, let us know where you are — we'll reach out if GrowLoop expands your way.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "4px" }}>
                {SUBURBS.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelected(s)}
                    style={{
                      padding: "7px 14px",
                      borderRadius: "20px",
                      border: `1.5px solid ${selected === s ? COLORS.sage : "rgba(107,91,78,0.2)"}`,
                      background: selected === s ? COLORS.sagePale : "transparent",
                      color: selected === s ? COLORS.sageDark : COLORS.muted,
                      fontSize: "13px",
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: selected === s ? 600 : 400,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >{s}</button>
                ))}
              </div>

              <input
                placeholder="Your email address"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
              />

              <button
                onClick={handleSubmit}
                style={{
                  background: selected && email ? COLORS.sage : COLORS.sageLight,
                  color: "white", border: "none",
                  padding: "14px", borderRadius: "10px",
                  fontSize: "15px", fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600, cursor: selected && email ? "pointer" : "default",
                  transition: "background 0.2s",
                }}
              >
                Register my interest →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const FAQItem = ({ question, answer, isLast }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      borderBottom: isLast ? "none" : `1px solid rgba(107,91,78,0.12)`,
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 20px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          gap: "16px",
        }}
      >
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600,
          fontSize: "15px",
          color: COLORS.charcoal,
          lineHeight: 1.4,
        }}>{question}</span>
        <span style={{
          color: COLORS.sage,
          fontSize: "20px",
          flexShrink: 0,
          transition: "transform 0.2s",
          transform: open ? "rotate(45deg)" : "rotate(0deg)",
          lineHeight: 1,
        }}>+</span>
      </button>
      {open && (
        <div style={{
          padding: "0 20px 18px",
          fontSize: "14px",
          color: COLORS.muted,
          fontFamily: "'DM Sans', sans-serif",
          lineHeight: 1.6,
        }}>{answer}</div>
      )}
    </div>
  );
};

const FormField = ({ label, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
    <label style={{
      fontSize: "13px",
      fontWeight: 600,
      color: COLORS.brown,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
    }}>{label}</label>
    {children}
  </div>
);

const inputStyle = {
  padding: "12px 14px",
  border: `1.5px solid #D4C9BF`,
  borderRadius: "8px",
  fontSize: "15px",
  color: COLORS.charcoal,
  background: COLORS.warmWhite,
  outline: "none",
  fontFamily: "inherit",
  transition: "border-color 0.2s",
};

const selectStyle = {
  ...inputStyle,
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238A7F78' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 14px center",
  paddingRight: "36px",
  cursor: "pointer",
};

export default function GrowLoop() {
  const [formData, setFormData] = useState({
    name: "", email: "", suburb: "", childSizes: [], bundles: "", heardFrom: "", season: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(null);
  const [showSuburbModal, setShowSuburbModal] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) return;
    try {
      await fetch("https://script.google.com/macros/s/AKfycbxCWMa_-heEXZpv698IjuXK-r6L9wsSuw3WkXTbcunjBAPMoyBl4BbbXIVYeTkf7Lww/exec", {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
          formType: "event",
          name: formData.name,
          email: formData.email,
          suburb: formData.suburb,
          sizes: (formData.childSizes || []).join(", "),
          bundles: formData.bundles,
          season: formData.season || "",
          heardFrom: formData.heardFrom,
        }),
      });
    } catch (_) {}
    setSubmitted(true);
  };

  const inputFocusStyle = (field) => ({
    ...inputStyle,
    borderColor: focused === field ? COLORS.sage : "#D4C9BF",
  });

  return (
    <div style={{
      fontFamily: "'Lora', Georgia, serif",
      background: COLORS.cream,
      color: COLORS.charcoal,
      minHeight: "100vh",
    }}>
      {showSuburbModal && <SuburbModal onClose={() => setShowSuburbModal(false)} />}
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Lora:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* Nav */}
      <nav style={{
        padding: "20px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: `1px solid rgba(107,91,78,0.12)`,
        background: COLORS.warmWhite,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <LoopMark size={28} />
          <span style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "18px",
            color: COLORS.charcoal,
            letterSpacing: "-0.01em",
          }}>GrowLoop</span>
        </div>
        <a
          href="#register"
          style={{
            background: COLORS.sage,
            color: "white",
            padding: "9px 20px",
            borderRadius: "24px",
            fontSize: "13px",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            textDecoration: "none",
            letterSpacing: "0.02em",
            transition: "background 0.2s",
          }}
          onMouseEnter={e => e.target.style.background = COLORS.sageDark}
          onMouseLeave={e => e.target.style.background = COLORS.sage}
        >
          Register interest
        </a>
      </nav>

      {/* Hero */}
      <section style={{
        padding: "80px 24px 72px",
        textAlign: "center",
        maxWidth: "640px",
        margin: "0 auto",
        position: "relative",
      }}>
        <div style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "28px",
          animation: "spin 12s linear infinite",
        }}>
          <LoopMark size={52} />
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

        <div style={{
          display: "inline-block",
          background: COLORS.sagePale,
          color: COLORS.sageDark,
          padding: "5px 14px",
          borderRadius: "20px",
          fontSize: "12px",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginBottom: "24px",
        }}>
          Ascot Vale &amp; surrounds · First Swap — 25 July 2025
        </div>

        <h1 style={{
          fontFamily: "'DM Serif Display', Georgia, serif",
          fontSize: "clamp(36px, 6vw, 56px)",
          lineHeight: 1.1,
          color: COLORS.charcoal,
          margin: "0 0 24px",
          letterSpacing: "-0.02em",
        }}>
          A local wardrobe<br />
          <em style={{ color: COLORS.sage }}>that grows with your child.</em>
        </h1>

        <p style={{
          fontSize: "18px",
          color: COLORS.muted,
          lineHeight: 1.7,
          margin: "0 0 40px",
          fontStyle: "italic",
        }}>
          GrowLoop is a community clothing exchange starting in{" "}
          <button
            onClick={() => setShowSuburbModal(true)}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              fontFamily: "inherit",
              fontSize: "inherit",
              fontStyle: "inherit",
              color: COLORS.sageDark,
              fontWeight: 600,
              cursor: "pointer",
              textDecoration: "underline",
              textDecorationStyle: "dotted",
              textDecorationColor: COLORS.sageLight,
              textUnderlineOffset: "3px",
            }}
          >Ascot Vale</button>
          {" "}— open to families from Moonee Ponds, Flemington, Kensington, and nearby suburbs.
          Contribute what your child has outgrown — newborn to size 6. Receive the next size up.
        </p>

        <a
          href="#register"
          style={{
            display: "inline-block",
            background: COLORS.charcoal,
            color: COLORS.cream,
            padding: "15px 36px",
            borderRadius: "32px",
            fontSize: "15px",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            textDecoration: "none",
            letterSpacing: "0.02em",
            transition: "background 0.2s",
          }}
          onMouseEnter={e => e.target.style.background = COLORS.brown}
          onMouseLeave={e => e.target.style.background = COLORS.charcoal}
        >
          Register for the 25 July swap →
        </a>

        <p style={{
          marginTop: "14px",
          fontSize: "13px",
          color: COLORS.brownLight,
          fontFamily: "'DM Sans', sans-serif",
        }}>
          Hosted at Dwell, 78 St Leonards Rd, Ascot Vale
        </p>
      </section>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "0 32px", maxWidth: "700px", margin: "0 auto 64px" }}>
        <div style={{ flex: 1, height: "1px", background: "rgba(107,91,78,0.15)" }} />
        <LoopMark size={20} color={COLORS.brownLight} />
        <div style={{ flex: 1, height: "1px", background: "rgba(107,91,78,0.15)" }} />
      </div>

      {/* Problem */}
      <section style={{ maxWidth: "680px", margin: "0 auto 80px", padding: "0 24px" }}>
        <Fade>
          <h2 style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "clamp(26px, 4vw, 36px)",
            color: COLORS.charcoal,
            marginBottom: "32px",
            letterSpacing: "-0.01em",
          }}>
            Baby clothes have a short life.<br />
            <em style={{ color: COLORS.sage }}>They shouldn't go to waste.</em>
          </h2>
        </Fade>

        {[
          ["Kids outgrow clothes fast", "A size 000 might last two months. Size 1 fits for a season. You buy ten outfits, they're worn a handful of times, then sit in a box waiting for someone to need them."],
          ["Selling is time-consuming", "Photographing, listing, negotiating, arranging pickup for individual items on Facebook Marketplace takes more time than it's worth."],
          ["Donating gives nothing back", "Dropping bags at an op shop is fine — but it doesn't help you find the next size up for your own child."],
        ].map(([title, body], i) => (
          <Fade key={i} delay={i * 0.1}>
            <div style={{
              display: "flex",
              gap: "16px",
              marginBottom: "28px",
              paddingBottom: "28px",
              borderBottom: i < 2 ? `1px solid rgba(107,91,78,0.1)` : "none",
            }}>
              <div style={{
                width: "6px",
                borderRadius: "3px",
                background: COLORS.sageLight,
                flexShrink: 0,
                alignSelf: "stretch",
                minHeight: "48px",
              }} />
              <div>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: "16px",
                  color: COLORS.charcoal,
                  marginBottom: "6px",
                }}>{title}</div>
                <div style={{ fontSize: "15px", color: COLORS.muted, lineHeight: 1.6 }}>{body}</div>
              </div>
            </div>
          </Fade>
        ))}
      </section>

      {/* Condition */}
      <section style={{
        background: COLORS.sagePale,
        padding: "56px 24px",
        borderTop: `1px solid rgba(107,91,78,0.1)`,
        borderBottom: `1px solid rgba(107,91,78,0.1)`,
      }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <Fade>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: COLORS.sage,
              marginBottom: "12px",
            }}>What we accept</div>
            <h2 style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: "clamp(22px, 4vw, 32px)",
              color: COLORS.charcoal,
              marginBottom: "16px",
              letterSpacing: "-0.01em",
            }}>Play condition or better.<br /><em style={{ color: COLORS.sage }}>Brands don't matter.</em></h2>
            <p style={{
              fontSize: "16px",
              color: COLORS.muted,
              lineHeight: 1.7,
              marginBottom: "32px",
            }}>
              GrowLoop isn't about labels — it's about keeping good clothing in use. We accept any brand, any style, as long as it's something you'd genuinely be happy for another child to wear.
            </p>
          </Fade>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {[
              ["✓", "Clean and washed", true],
              ["✓", "No significant stains or holes", true],
              ["✓", "Buttons, zips, and snaps working", true],
              ["✓", "Play-worn is fine — pristine isn't required", true],
              ["✗", "Heavily stained or torn", false],
              ["✗", "Broken fastenings", false],
              ["✗", "Strong odours that washing hasn't fixed", false],
              ["✗", "Recalled or unsafe items", false],
            ].map(([mark, text, pass], i) => (
              <Fade key={i} delay={i * 0.04}>
                <div style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-start",
                  background: COLORS.warmWhite,
                  borderRadius: "10px",
                  padding: "14px 16px",
                  border: `1px solid rgba(107,91,78,0.1)`,
                }}>
                  <span style={{
                    fontWeight: 700,
                    color: pass ? COLORS.sage : COLORS.brownLight,
                    fontSize: "15px",
                    flexShrink: 0,
                    marginTop: "1px",
                  }}>{mark}</span>
                  <span style={{
                    fontSize: "14px",
                    color: COLORS.charcoal,
                    fontFamily: "'DM Sans', sans-serif",
                    lineHeight: 1.4,
                  }}>{text}</span>
                </div>
              </Fade>
            ))}
          </div>

          <Fade delay={0.2}>
            <p style={{
              fontSize: "13px",
              color: COLORS.brownLight,
              fontFamily: "'DM Sans', sans-serif",
              marginTop: "20px",
              fontStyle: "italic",
              textAlign: "center",
            }}>
              Bundles are assessed on the day. Anything that doesn't meet the standard will be donated to a local op shop rather than returned to circulation.
            </p>
          </Fade>
        </div>
      </section>

      {/* How it works */}
      <section style={{
        background: COLORS.warmWhite,
        padding: "72px 24px",
        borderTop: `1px solid rgba(107,91,78,0.1)`,
        borderBottom: `1px solid rgba(107,91,78,0.1)`,
      }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <Fade>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: COLORS.sage,
              marginBottom: "12px",
            }}>How it works</div>
            <h2 style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: "clamp(24px, 4vw, 34px)",
              color: COLORS.charcoal,
              marginBottom: "48px",
              letterSpacing: "-0.01em",
            }}>Simple enough to explain at school pickup.</h2>
          </Fade>

          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {[
              ["Morning: drop off", "Arrive between 10am–12pm with your bundle. We'll assess it on the spot and load your credits — then you're free to go."],
              ["Earn credits", "Small bundles earn 10 credits, medium 20, large 30. Credits are yours to spend in the afternoon."],
              ["Afternoon: pick up", "Return between 2pm–4pm to browse what's available. There'll be coffee and something sweet if you want to stay and look through properly."],
              ["Keep it moving", "What your child has outgrown passes to a family who needs it. The loop continues."],
            ].map(([title, body], i) => (
              <Fade key={i} delay={i * 0.08}>
                <Step number={i + 1} title={title} body={body} />
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* Credits */}
      <section style={{ maxWidth: "680px", margin: "0 auto", padding: "72px 24px" }}>
        <Fade>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: COLORS.sage,
            marginBottom: "12px",
          }}>The credit system</div>
          <h2 style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "clamp(24px, 4vw, 34px)",
            color: COLORS.charcoal,
            marginBottom: "16px",
            letterSpacing: "-0.01em",
          }}>Credits keep things fair.<br /><em style={{ color: COLORS.sage }}>Not transactional.</em></h2>
          <p style={{
            fontSize: "16px",
            color: COLORS.muted,
            lineHeight: 1.7,
            marginBottom: "40px",
          }}>
            Credits aren't money — they can't be sold or transferred. They're simply how we keep the exchange balanced, so families who contribute can access what they need.
          </p>
        </Fade>

        <Fade delay={0.15}>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <CreditPill amount="10" label="Small bundle" sub="5–8 items" />
            <CreditPill amount="20" label="Medium bundle" sub="9–15 items" />
            <CreditPill amount="30" label="Large bundle" sub="16+ items" />
          </div>
        </Fade>

        <Fade delay={0.2}>
          <p style={{
            fontSize: "14px",
            color: COLORS.brownLight,
            fontFamily: "'DM Sans', sans-serif",
            marginTop: "20px",
            fontStyle: "italic",
            textAlign: "center",
          }}>
            Credits are spent when you take a bundle. The same scale applies — a medium bundle costs 20 credits.
          </p>
        </Fade>

        <Fade delay={0.25}>
          <div style={{
            marginTop: "36px",
            background: COLORS.sagePale,
            borderRadius: "14px",
            padding: "24px",
            border: `1.5px solid ${COLORS.sageLight}`,
          }}>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              color: COLORS.sageDark,
              marginBottom: "12px",
              letterSpacing: "0.02em",
            }}>A few things worth knowing</div>
            {[
              ["Credits roll over", "If you don't find what you need at one event, your credits carry forward to the next swap. Nothing is lost."],
              ["Bundles are seasonal", "Each bundle is labelled as summer or winter. July's swap is winter-focused — layering pieces, jackets, and warmer basics are especially welcome."],
              ["No perfect size match needed", "If the right size isn't available today, your credits will be there when it is."],
            ].map(([title, body], i) => (
              <div key={i} style={{
                display: "flex",
                gap: "12px",
                paddingTop: i > 0 ? "14px" : 0,
                marginTop: i > 0 ? "14px" : 0,
                borderTop: i > 0 ? `1px solid rgba(107,91,78,0.12)` : "none",
              }}>
                <div style={{
                  width: "6px",
                  borderRadius: "3px",
                  background: COLORS.sage,
                  flexShrink: 0,
                  alignSelf: "stretch",
                  minHeight: "36px",
                }} />
                <div>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: "14px",
                    color: COLORS.charcoal,
                    marginBottom: "3px",
                  }}>{title}</div>
                  <div style={{
                    fontSize: "14px",
                    color: COLORS.muted,
                    lineHeight: 1.5,
                  }}>{body}</div>
                </div>
              </div>
            ))}
          </div>
        </Fade>
      </section>

      {/* Season */}
      <section style={{
        background: COLORS.warmWhite,
        padding: "64px 24px",
        borderTop: `1px solid rgba(107,91,78,0.1)`,
        borderBottom: `1px solid rgba(107,91,78,0.1)`,
      }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <Fade>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: COLORS.sage,
              marginBottom: "12px",
            }}>Seasonal bundles</div>
            <h2 style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: "clamp(22px, 4vw, 32px)",
              color: COLORS.charcoal,
              marginBottom: "16px",
              letterSpacing: "-0.01em",
            }}>Every bundle is labelled<br /><em style={{ color: COLORS.sage }}>summer or winter.</em></h2>
            <p style={{
              fontSize: "16px",
              color: COLORS.muted,
              lineHeight: 1.7,
              marginBottom: "32px",
            }}>
              Season matters as much as size. So every bundle at GrowLoop carries both — making it easy to find exactly what your child needs, right now.
            </p>
          </Fade>

          <Fade delay={0.1}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {[
                {
                  season: "❄️ Winter",
                  note: "In demand for July",
                  items: ["Jackets & puffer vests", "Knits & fleecy layers", "Long-sleeve onesies & thermals", "Pants, tracksuits & warm basics"],
                  highlight: true,
                },
                {
                  season: "☀️ Summer",
                  note: "Also accepted",
                  items: ["Shorts, tees & singlets", "Lightweight dresses & playsuits", "Swimmers & rashies", "Sun hats & light layers"],
                  highlight: false,
                },
              ].map(({ season, note, items, highlight }) => (
                <div key={season} style={{
                  borderRadius: "14px",
                  padding: "24px",
                  background: highlight ? COLORS.sagePale : COLORS.cream,
                  border: `1.5px solid ${highlight ? COLORS.sageLight : "rgba(107,91,78,0.15)"}`,
                }}>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: "16px",
                    color: COLORS.charcoal,
                    marginBottom: "4px",
                  }}>{season}</div>
                  <div style={{
                    display: "inline-block",
                    background: highlight ? COLORS.sage : "rgba(107,91,78,0.1)",
                    color: highlight ? "white" : COLORS.brownLight,
                    borderRadius: "20px",
                    padding: "2px 10px",
                    fontSize: "11px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    marginBottom: "16px",
                  }}>{note}</div>
                  <ul style={{
                    margin: 0,
                    padding: 0,
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}>
                    {items.map(item => (
                      <li key={item} style={{
                        fontSize: "13px",
                        color: COLORS.muted,
                        fontFamily: "'DM Sans', sans-serif",
                        display: "flex",
                        gap: "8px",
                        alignItems: "flex-start",
                      }}>
                        <span style={{ color: COLORS.sageLight, flexShrink: 0 }}>·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Fade>

          <Fade delay={0.15}>
            <p style={{
              fontSize: "13px",
              color: COLORS.brownLight,
              fontFamily: "'DM Sans', sans-serif",
              marginTop: "20px",
              fontStyle: "italic",
              textAlign: "center",
            }}>
              Both seasons are welcome at every swap. When you bring your bundle, just let us know whether it's summer or winter — we'll label it from there.
            </p>
          </Fade>
        </div>
      </section>

      {/* Venue */}
      <section style={{
        background: COLORS.charcoal,
        padding: "72px 24px",
        color: COLORS.cream,
      }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <Fade>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: COLORS.sageLight,
              marginBottom: "12px",
            }}>The venue</div>
            <h2 style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: "clamp(24px, 4vw, 34px)",
              color: COLORS.cream,
              marginBottom: "20px",
              letterSpacing: "-0.01em",
            }}>Hosted at Dwell, Ascot Vale</h2>
            <p style={{
              fontSize: "16px",
              color: COLORS.brownLight,
              lineHeight: 1.7,
              marginBottom: "32px",
            }}>
              Dwell is a neighbourhood hub on St Leonards Road, just off Union Rd. It's a community space focused on sustainability, connection, and the sharing economy — a natural home for GrowLoop.
            </p>
          </Fade>

          <Fade delay={0.1}>
            <div style={{
              background: "rgba(255,255,255,0.06)",
              borderRadius: "12px",
              padding: "24px",
              border: `1px solid rgba(255,255,255,0.1)`,
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}>
              {[
                ["📍", "78 St Leonards Rd, Ascot Vale 3032"],
                ["🗓", "Saturday 25 July 2025 — Drop-off 10am–12pm · Pickup 2pm–4pm"],
                ["🚃", "Easily accessible by public transport"],
              ].map(([icon, text], i) => (
                <div key={i} style={{
                  display: "flex",
                  gap: "12px",
                  fontSize: "15px",
                  color: COLORS.cream,
                  alignItems: "flex-start",
                }}>
                  <span style={{ fontSize: "16px", flexShrink: 0 }}>{icon}</span>
                  <span style={{ color: COLORS.brownLight }}>{text}</span>
                </div>
              ))}
            </div>
          </Fade>
        </div>
      </section>

      {/* Form */}
      <section id="register" style={{
        maxWidth: "620px",
        margin: "0 auto",
        padding: "80px 24px",
      }}>
        <Fade>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: COLORS.sage,
            marginBottom: "12px",
          }}>Register interest</div>
          <h2 style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "clamp(24px, 4vw, 36px)",
            color: COLORS.charcoal,
            marginBottom: "12px",
            letterSpacing: "-0.01em",
          }}>Join the first GrowLoop swap.</h2>
          <p style={{
            fontSize: "16px",
            color: COLORS.muted,
            lineHeight: 1.6,
            marginBottom: "40px",
          }}>
            Register your interest and we'll send you everything you need — what to bring, how credits work, and what to expect on the day. No commitment yet.
          </p>
        </Fade>

        {submitted ? (
          <Fade>
            <div style={{
              background: COLORS.sagePale,
              border: `2px solid ${COLORS.sageLight}`,
              borderRadius: "16px",
              padding: "48px 32px",
              textAlign: "center",
            }}>
              <LoopMark size={48} />
              <h3 style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                fontSize: "26px",
                color: COLORS.charcoal,
                margin: "20px 0 12px",
              }}>You're on the list.</h3>
              <p style={{
                fontSize: "16px",
                color: COLORS.muted,
                lineHeight: 1.6,
              }}>
                We'll be in touch with event details soon. In the meantime, start gathering those outgrown bundles — {formData.name.split(" ")[0] || "you"}'ll need them.
              </p>
            </div>
          </Fade>
        ) : (
          <Fade delay={0.1}>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <FormField label="Your name">
                  <input
                    style={inputFocusStyle("name")}
                    placeholder="Jane Smith"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused(null)}
                  />
                </FormField>
                <FormField label="Email address">
                  <input
                    style={inputFocusStyle("email")}
                    placeholder="jane@email.com"
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                  />
                </FormField>
              </div>

              <FormField label="Suburb">
                <input
                  style={inputFocusStyle("suburb")}
                  placeholder="Ascot Vale, Moonee Ponds, Flemington..."
                  value={formData.suburb}
                  onChange={e => setFormData({ ...formData, suburb: e.target.value })}
                  onFocus={() => setFocused("suburb")}
                  onBlur={() => setFocused(null)}
                />
              </FormField>

              <FormField label="My children&#39;s current sizes (select all that apply)">
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {["0000", "000", "00", "0", "1", "2", "3", "4", "5", "6", "Pregnant"].map(size => {
                    const selected = (formData.childSizes || []).includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          const current = formData.childSizes || [];
                          const updated = selected
                            ? current.filter(s => s !== size)
                            : [...current, size];
                          setFormData({ ...formData, childSizes: updated });
                        }}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "20px",
                          border: `1.5px solid ${selected ? COLORS.sage : "rgba(107,91,78,0.2)"}`,
                          background: selected ? COLORS.sagePale : "transparent",
                          color: selected ? COLORS.sageDark : COLORS.muted,
                          fontSize: "13px",
                          fontFamily: "'DM Sans', sans-serif",
                          fontWeight: selected ? 600 : 400,
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                      >{size}</button>
                    );
                  })}
                </div>
              </FormField>

              <FormField label="Bundles I could contribute">
                <select
                  style={selectStyle}
                  value={formData.bundles}
                  onChange={e => setFormData({ ...formData, bundles: e.target.value })}
                >
                  <option value="">Select</option>
                  <option>Not sure yet</option>
                  <option>A few items (less than 5)</option>
                  <option>1 small bundle (5–8 items)</option>
                  <option>1 medium bundle (9–15 items)</option>
                  <option>Multiple bundles</option>
                </select>
              </FormField>

              <FormField label="My bundles are mainly">
                <select
                  style={selectStyle}
                  value={formData.season || ""}
                  onChange={e => setFormData({ ...formData, season: e.target.value })}
                >
                  <option value="">Select season</option>
                  <option>Winter clothing</option>
                  <option>Summer clothing</option>
                  <option>A mix of both</option>
                  <option>Not sure yet</option>
                </select>
              </FormField>

              <FormField label="How did you hear about GrowLoop?">
                <select
                  style={selectStyle}
                  value={formData.heardFrom}
                  onChange={e => setFormData({ ...formData, heardFrom: e.target.value })}
                >
                  <option value="">Select</option>
                  <option>A friend or neighbour</option>
                  <option>Facebook group</option>
                  <option>Instagram</option>
                  <option>Dwell community</option>
                  <option>School or kinder</option>
                  <option>Other</option>
                </select>
              </FormField>

              <button
                onClick={handleSubmit}
                style={{
                  background: formData.name && formData.email ? COLORS.sage : COLORS.sageLight,
                  color: "white",
                  border: "none",
                  padding: "16px 32px",
                  borderRadius: "32px",
                  fontSize: "16px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  cursor: formData.name && formData.email ? "pointer" : "default",
                  marginTop: "8px",
                  transition: "background 0.2s",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={e => { if (formData.name && formData.email) e.target.style.background = COLORS.sageDark; }}
                onMouseLeave={e => { if (formData.name && formData.email) e.target.style.background = COLORS.sage; }}
              >
                Register my interest →
              </button>

              <p style={{
                fontSize: "13px",
                color: COLORS.brownLight,
                fontFamily: "'DM Sans', sans-serif",
                textAlign: "center",
              }}>
                No commitment. We'll be in touch with everything you need before 25 July.
              </p>
            </div>
          </Fade>
        )}
      </section>

      {/* FAQ / Contact */}
      <section style={{ maxWidth: "680px", margin: "0 auto", padding: "72px 24px" }}>
        <Fade>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: COLORS.sage,
            marginBottom: "12px",
          }}>Got questions?</div>
          <h2 style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "clamp(22px, 4vw, 32px)",
            color: COLORS.charcoal,
            marginBottom: "16px",
            letterSpacing: "-0.01em",
          }}>We're happy to help.</h2>
          <p style={{
            fontSize: "16px",
            color: COLORS.muted,
            lineHeight: 1.7,
            marginBottom: "32px",
          }}>
            If you have questions about how GrowLoop works, what to bring, or anything else — just send us an email. We're a small local initiative and we'll get back to you personally.
          </p>
        </Fade>

        <Fade delay={0.1}>
          <a
            href="mailto:hello.growloop@gmail.com"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: COLORS.warmWhite,
              border: `1.5px solid ${COLORS.sageLight}`,
              borderRadius: "12px",
              padding: "18px 24px",
              textDecoration: "none",
              transition: "border-color 0.2s, background 0.2s",
              marginBottom: "40px",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = COLORS.sage;
              e.currentTarget.style.background = COLORS.sagePale;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = COLORS.sageLight;
              e.currentTarget.style.background = COLORS.warmWhite;
            }}
          >
            <span style={{ fontSize: "20px" }}>✉️</span>
            <div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: "15px",
                color: COLORS.charcoal,
              }}>hello.growloop@gmail.com</div>
              <div style={{
                fontSize: "13px",
                color: COLORS.brownLight,
                fontFamily: "'DM Sans', sans-serif",
              }}>We'll reply within a day or two</div>
            </div>
          </a>
        </Fade>

        <Fade delay={0.15}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "0px",
            border: `1px solid rgba(107,91,78,0.15)`,
            borderRadius: "14px",
            overflow: "hidden",
          }}>
            {[
              ["Do I need to bring clothes to attend?", "Yes — GrowLoop is an exchange. Credits are earned by contributing and spent when you take a bundle home. If you don't have anything this time, register anyway and we'll keep you posted on future events."],
              ["What if I can't find the right size on the day?", "Your credits roll over to the next swap. Nothing is lost."],
              ["What sizes do you accept?", "Newborn (0000) through to size 6. All sizes welcome."],
              ["What condition do clothes need to be in?", "Play condition or better — clean, no major stains or broken fastenings. Brands don't matter."],
              ["Is this just for Ascot Vale families?", "Not at all. Families from Moonee Ponds, Flemington, Kensington, Essendon, and nearby suburbs are very welcome. Outside that area? Tap 'Ascot Vale' above to register interest for your suburb."],
            ].map(([q, a], i) => (
              <FAQItem key={i} question={q} answer={a} isLast={i === 4} />
            ))}
          </div>
        </Fade>
      </section>

      {/* About */}
      <section style={{
        background: COLORS.warmWhite,
        borderTop: `1px solid rgba(107,91,78,0.1)`,
        borderBottom: `1px solid rgba(107,91,78,0.1)`,
        padding: "72px 24px",
      }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <Fade>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: COLORS.sage,
              marginBottom: "12px",
            }}>Who's behind GrowLoop</div>
          </Fade>
          <div style={{ display: "flex", gap: "36px", alignItems: "flex-start", flexWrap: "wrap" }}>
            <Fade delay={0.05}>
              <div style={{
                width: "160px",
                height: "160px",
                borderRadius: "50%",
                flexShrink: 0,
                overflow: "hidden",
                border: `3px solid ${COLORS.sageLight}`,
              }}>
                <img
                  src={`data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAWABrQDASIAAhEBAxEB/8QAHQAAAQUBAQEBAAAAAAAAAAAAAgABAwQFBgcICf/EAFMQAAEDAgQFAQYEAwUGAwYADwEAAgMEEQUSITEGE0FRYSIHFDJxgZEjQlKhFbHBM0NiecBIFSQbeLhJKXBUhJNWdJT/xAAaAQEBAQEBAQEAAAAAAAAAAAAAAQIDBAUG/8QAKBEBAQACAgICAgMBAQEBAQEAAAECEQMSBCETMSJBBTJRFDNhI0Jx/9oADAMBAAIRAxEAPwD6hVB1ROqB0dUV9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVHVF9FVA==`}
                  alt="Founder with her three children"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center top",
                  }}
                />
              </div>
            </Fade>
            <Fade delay={0.1}>
              <div style={{ flex: 1, minWidth: "240px" }}>
                <h2 style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  fontSize: "clamp(22px, 4vw, 30px)",
                  color: COLORS.charcoal,
                  marginBottom: "16px",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.2,
                }}>A mum of three who got tired of the same cycle.</h2>
                <p style={{
                  fontSize: "15px",
                  color: COLORS.muted,
                  lineHeight: 1.7,
                  marginBottom: "14px",
                }}>
                  For years I did what most parents do — filled bags, dropped them at the op shop, and then turned around and bought the next size up at full price. Three kids in, it started to feel a bit absurd.
                </p>
                <p style={{
                  fontSize: "15px",
                  color: COLORS.muted,
                  lineHeight: 1.7,
                  marginBottom: "14px",
                }}>
                  I'd always passed things on to friends when our sizes lined up — and watching how much those exchanges meant to people made me think: what if we made that easier for everyone in the neighbourhood? Not a marketplace, not a charity drop. Just a simple, fair loop between local families.
                </p>
                <p style={{
                  fontSize: "15px",
                  color: COLORS.muted,
                  lineHeight: 1.7,
                }}>
                  GrowLoop is my attempt to build that. Small to start, local by design, and built around trust. I hope to see you at Dwell on the 25th.
                </p>
              </div>
            </Fade>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: `1px solid rgba(107,91,78,0.15)`,
        padding: "32px 24px",
        textAlign: "center",
        background: COLORS.warmWhite,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "8px" }}>
          <LoopMark size={20} />
          <span style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "16px",
            color: COLORS.charcoal,
          }}>GrowLoop</span>
        </div>
        <p style={{
          fontSize: "13px",
          color: COLORS.brownLight,
          fontFamily: "'DM Sans', sans-serif",
          margin: "0 0 8px",
        }}>
          A community clothing exchange for growing families · Newborn to size 6 · Ascot Vale, Melbourne
        </p>
        <a
          href="mailto:hello.growloop@gmail.com"
          style={{
            fontSize: "13px",
            color: COLORS.sage,
            fontFamily: "'DM Sans', sans-serif",
            textDecoration: "none",
          }}
        >
          hello.growloop@gmail.com
        </a>
      </footer>
    </div>
  );
}
