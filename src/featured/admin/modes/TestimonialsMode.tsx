"use client";

import { useAdminCtx } from "../adminContext";
import { deepClone } from "../adminUtils";

export default function TestimonialsMode() {
  const { cms, setCms, loading } = useAdminCtx();
  return (
        <section className="adminSection">
          <div className="adminSettingsCard">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 800 }}>Testimonials section</div>
                <div style={{ opacity: 0.75, marginTop: 6 }}>
                  When off, the testimonials section is hidden from the home page, the /testimonials page returns 404, and the nav link is removed.
                </div>
              </div>
              <label className="adminToggle" style={{ flexShrink: 0, marginLeft: 16 }}>
                <input
                  type="checkbox"
                  checked={!!cms.dynamicPages.testimonials}
                  onChange={(e) =>
                    setCms((prev) =>
                      prev ? { ...prev, dynamicPages: { ...prev.dynamicPages, testimonials: e.target.checked } } : prev
                    )
                  }
                  disabled={loading}
                />
                <span className="adminToggleTrack" />
              </label>
            </div>
          </div>

          {cms.testimonials.map((t, idx) => (
            <details key={`t-${idx}`} className="adminCard">
              <summary className="adminCardHeader">
                <div>
                  <h3>{t.clientName || "New testimonial"}</h3>
                  <div style={{ opacity: 0.7, fontSize: 13 }}>{t.id}</div>
                </div>
              </summary>

              <div className="adminCardBody">
                <div className="adminSubheading">Hero section</div>

                <div className="adminRow">
                  <div className="adminField">
                    <label>ID</label>
                    <input
                      value={t.id}
                      onChange={(e) =>
                        setCms((prev) => {
                          if (!prev) return prev;
                          const next = deepClone(prev);
                          if (next.testimonials[idx]) next.testimonials[idx].id = e.target.value;
                          return next;
                        })
                      }
                      disabled={loading}
                    />
                  </div>
                  <div className="adminField">
                    <label>Location slug (for location pages)</label>
                    <input
                      value={t.locationSlug}
                      onChange={(e) =>
                        setCms((prev) => {
                          if (!prev) return prev;
                          const next = deepClone(prev);
                          if (next.testimonials[idx]) next.testimonials[idx].locationSlug = e.target.value;
                          return next;
                        })
                      }
                      disabled={loading}
                      placeholder="office-building"
                    />
                  </div>
                </div>

                <div className="adminRow">
                  <div className="adminField">
                    <label>Client name</label>
                    <input
                      value={t.clientName}
                      onChange={(e) =>
                        setCms((prev) => {
                          if (!prev) return prev;
                          const next = deepClone(prev);
                          if (next.testimonials[idx]) next.testimonials[idx].clientName = e.target.value;
                          return next;
                        })
                      }
                      disabled={loading}
                    />
                  </div>
                  <div className="adminField">
                    <label>Location label</label>
                    <input
                      value={t.locationLabel ?? ""}
                      onChange={(e) =>
                        setCms((prev) => {
                          if (!prev) return prev;
                          const next = deepClone(prev);
                          if (next.testimonials[idx]) next.testimonials[idx].locationLabel = e.target.value;
                          return next;
                        })
                      }
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="adminField">
                  <label>Quote</label>
                  <textarea
                    value={t.quote}
                    onChange={(e) =>
                      setCms((prev) => {
                        if (!prev) return prev;
                        const next = deepClone(prev);
                        if (next.testimonials[idx]) next.testimonials[idx].quote = e.target.value;
                        return next;
                      })
                    }
                    disabled={loading}
                  />
                </div>

                <div className="adminRow">
                  <div className="adminToggleField">
                    <label htmlFor={`t-enabled-${idx}`}>Enabled</label>
                    <label className="adminToggle">
                      <input
                        id={`t-enabled-${idx}`}
                        type="checkbox"
                        checked={!!t.enabled}
                        onChange={(e) =>
                          setCms((prev) => {
                            if (!prev) return prev;
                            const next = deepClone(prev);
                            if (next.testimonials[idx]) next.testimonials[idx].enabled = e.target.checked;
                            return next;
                          })
                        }
                        disabled={loading}
                      />
                      <span className="adminToggleTrack" />
                    </label>
                  </div>
                  <div className="adminToggleField">
                    <label htmlFor={`t-showOnHome-${idx}`}>Show on home</label>
                    <label className="adminToggle">
                      <input
                        id={`t-showOnHome-${idx}`}
                        type="checkbox"
                        checked={!!t.showOnHome}
                        onChange={(e) =>
                          setCms((prev) => {
                            if (!prev) return prev;
                            const next = deepClone(prev);
                            if (next.testimonials[idx]) next.testimonials[idx].showOnHome = e.target.checked;
                            return next;
                          })
                        }
                        disabled={loading}
                      />
                      <span className="adminToggleTrack" />
                    </label>
                  </div>
                  <div className="adminToggleField">
                    <label htmlFor={`t-showOnTestimonialsPage-${idx}`}>Show on /testimonials</label>
                    <label className="adminToggle">
                      <input
                        id={`t-showOnTestimonialsPage-${idx}`}
                        type="checkbox"
                        checked={!!t.showOnTestimonialsPage}
                        onChange={(e) =>
                          setCms((prev) => {
                            if (!prev) return prev;
                            const next = deepClone(prev);
                            if (next.testimonials[idx]) next.testimonials[idx].showOnTestimonialsPage = e.target.checked;
                            return next;
                          })
                        }
                        disabled={loading}
                      />
                      <span className="adminToggleTrack" />
                    </label>
                  </div>
                </div>

                <div className="adminRow">
                  <div className="adminField">
                    <label>Rating (optional)</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={t.rating ?? ""}
                      onChange={(e) =>
                        setCms((prev) => {
                          if (!prev) return prev;
                          const next = deepClone(prev);
                          const v = e.target.value ? Number(e.target.value) : undefined;
                          if (next.testimonials[idx]) next.testimonials[idx].rating = v;
                          return next;
                        })
                      }
                      disabled={loading}
                      placeholder="5"
                    />
                  </div>
                </div>

                <button
                  className="adminButton adminButtonDeleteEntity"
                  onClick={() => {
                    if (!window.confirm(`Delete testimonial "${t.clientName || t.id}"?`)) return;
                    setCms((prev) => {
                      if (!prev) return prev;
                      const next = deepClone(prev);
                      next.testimonials.splice(idx, 1);
                      return next;
                    });
                  }}
                  disabled={loading}
                >
                  Delete testimonial
                </button>
              </div>
            </details>
          ))}
        </section>
  );
}
