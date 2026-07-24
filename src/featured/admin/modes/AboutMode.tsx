"use client";
/* eslint-disable @next/next/no-img-element -- admin CMS previews render freshly-uploaded, arbitrary-dimension images (incl. blob: URLs); next/image optimization adds no value here and needs known dimensions. */

import { useAdminCtx } from "../adminContext";
import { deepClone } from "../adminUtils";

export default function AboutMode() {
  const { cms, setCms, loading, stageFile, openMediaPicker } = useAdminCtx();
  return (
        <section className="adminSection">
          <div className="adminSettingsCard">
            <div style={{ fontWeight: 800 }}>Home: Results section</div>
            <div style={{ opacity: 0.75, marginTop: 6 }}>Controls the “Results” counters section on the home page.</div>

            <div className="adminRow" style={{ marginTop: "var(--space-8)" }}>
              <div className="adminField">
                <label>Eyebrow</label>
                <input
                  value={cms.home.resultsIntro?.eyebrow ?? ""}
                  onChange={(e) =>
                    setCms((prev) => {
                      if (!prev) return prev;
                      return {
                        ...prev,
                        home: {
                          ...prev.home,
                          resultsIntro: { ...(prev.home.resultsIntro ?? { eyebrow: "", heading: "Results", body: "" }), eyebrow: e.target.value },
                        },
                      };
                    })
                  }
                  disabled={loading}
                />
              </div>
              <div className="adminField">
                <label>Heading</label>
                <input
                  value={cms.home.resultsIntro?.heading ?? "Results"}
                  onChange={(e) =>
                    setCms((prev) => {
                      if (!prev) return prev;
                      return {
                        ...prev,
                        home: {
                          ...prev.home,
                          resultsIntro: { ...(prev.home.resultsIntro ?? { eyebrow: "", heading: "Results", body: "" }), heading: e.target.value },
                        },
                      };
                    })
                  }
                  disabled={loading}
                />
              </div>
            </div>

            <div className="adminField" style={{ marginTop: "var(--space-8)" }}>
              <label>Description</label>
              <textarea
                value={cms.home.resultsIntro?.body ?? ""}
                onChange={(e) =>
                  setCms((prev) => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      home: {
                        ...prev.home,
                        resultsIntro: { ...(prev.home.resultsIntro ?? { eyebrow: "", heading: "Results", body: "" }), body: e.target.value },
                      },
                    };
                  })
                }
                disabled={loading}
                rows={4}
              />
            </div>

            <div className="adminField" style={{ marginTop: "var(--space-8)" }}>
              <label>Stats</label>
              <div className="blocksList">
                {(cms.home.resultsStats ?? []).map((s, idx) => (
                  <div key={`rs-${idx}`} className="blockItem">
                    <div className="adminRow">
                      <div className="adminField">
                        <label>Headline</label>
                        <input
                          value={s.headline}
                          onChange={(e) =>
                            setCms((prev) => {
                              if (!prev) return prev;
                              const next = deepClone(prev);
                              if (!next.home.resultsStats) next.home.resultsStats = [];
                              if (next.home.resultsStats[idx]) next.home.resultsStats[idx].headline = e.target.value;
                              return next;
                            })
                          }
                          disabled={loading}
                        />
                      </div>
                      <div className="adminField">
                        <label>Value</label>
                        <input
                          type="text"
                          placeholder="e.g. 10 or Weekly-Biweekly"
                          value={s.target}
                          onChange={(e) =>
                            setCms((prev) => {
                              if (!prev) return prev;
                              const next = deepClone(prev);
                              if (!next.home.resultsStats) next.home.resultsStats = [];
                              if (next.home.resultsStats[idx]) {
                                const v = e.target.value;
                                const n = Number(v);
                                next.home.resultsStats[idx].target = v !== "" && !isNaN(n) ? n : v;
                              }
                              return next;
                            })
                          }
                          disabled={loading}
                        />
                      </div>
                      <div className="adminField" style={{ justifyContent: "flex-end" }}>
                        <label>Show +</label>
                        <input
                          type="checkbox"
                          checked={s.plus ?? false}
                          onChange={(e) =>
                            setCms((prev) => {
                              if (!prev) return prev;
                              const next = deepClone(prev);
                              if (!next.home.resultsStats) next.home.resultsStats = [];
                              if (next.home.resultsStats[idx]) next.home.resultsStats[idx].plus = e.target.checked || undefined;
                              return next;
                            })
                          }
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="adminRow">
                      <div className="adminField">
                        <label>Icon</label>
                        <select
                          value={s.iconKey}
                          onChange={(e) =>
                            setCms((prev) => {
                              if (!prev) return prev;
                              const next = deepClone(prev);
                              if (!next.home.resultsStats) next.home.resultsStats = [];
                              if (next.home.resultsStats[idx]) next.home.resultsStats[idx].iconKey = e.target.value;
                              return next;
                            })
                          }
                          disabled={loading}
                        >
                          <option value="BiUser">User</option>
                          <option value="GoLocation">Location</option>
                          <option value="GiVendingMachine">Vending machine</option>
                          <option value="GrHostMaintenance">Maintenance</option>
                        </select>
                      </div>
                      <div className="adminField" style={{ justifyContent: "flex-end" }}>
                        <label style={{ opacity: 0 }}>Delete</label>
                        <button
                          className="adminButton adminButtonDanger"
                          type="button"
                          onClick={() =>
                            setCms((prev) => {
                              if (!prev) return prev;
                              const next = deepClone(prev);
                              next.home.resultsStats = (next.home.resultsStats ?? []).filter((_, i) => i !== idx);
                              return next;
                            })
                          }
                          disabled={loading}
                        >
                          Delete stat
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="adminActions" style={{ marginTop: "var(--space-8)" }}>
                <button
                  className="adminButton"
                  type="button"
                  onClick={() =>
                    setCms((prev) => {
                      if (!prev) return prev;
                      const next = deepClone(prev);
                      next.home.resultsStats = [
                        ...(next.home.resultsStats ?? []),
                        { headline: "New stat", target: 0, iconKey: "BiUser", plus: false },
                      ];
                      return next;
                    })
                  }
                  disabled={loading}
                >
                  Add stat
                </button>
              </div>
            </div>
          </div>

          <div className="adminCard">
            <div className="adminCardBody">
              <div className="adminSubheading">About Page</div>

              <div className="adminRow">
                <div className="adminField">
                  <label>Eyebrow text</label>
                  <input
                    value={cms.about.eyebrow ?? ""}
                    onChange={(e) =>
                      setCms((prev) => {
                        if (!prev) return prev;
                        return { ...prev, about: { ...prev.about, eyebrow: e.target.value } };
                      })
                    }
                    disabled={loading}
                    placeholder="Who we are"
                  />
                </div>
                <div className="adminField">
                  <label>Headline</label>
                  <input
                    value={cms.about.headline ?? ""}
                    onChange={(e) =>
                      setCms((prev) => {
                        if (!prev) return prev;
                        return { ...prev, about: { ...prev.about, headline: e.target.value } };
                      })
                    }
                    disabled={loading}
                    placeholder="About G Munchies"
                  />
                </div>
              </div>

              <div className="adminField">
                <label>Body text</label>
                <textarea
                  value={cms.about.body ?? ""}
                  onChange={(e) =>
                    setCms((prev) => {
                      if (!prev) return prev;
                      return { ...prev, about: { ...prev.about, body: e.target.value } };
                    })
                  }
                  disabled={loading}
                  rows={8}
                />
              </div>

              <div className="adminRow">
                <div className="adminField">
                  <label>Hero image</label>
                  <div className="blockPreview">
                    {cms.about.heroImageSrc ? <img src={cms.about.heroImageSrc} alt="" /> : null}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        stageFile(file, (blobUrl) =>
                          setCms((prev) => {
                            if (!prev) return prev;
                            return { ...prev, about: { ...prev.about, heroImageSrc: blobUrl } };
                          }),
                        );
                      }}
                      disabled={loading}
                    />
                    <button
                      className="adminButton"
                      type="button"
                      onClick={() => openMediaPicker({ type: "about", field: "heroImageSrc" })}
                      disabled={loading}
                    >
                      Add image from media
                    </button>
                    {cms.about.heroImageSrc ? (
                      <button
                        className="adminButton adminButtonDanger"
                        type="button"
                        onClick={() =>
                          setCms((prev) =>
                            prev ? { ...prev, about: { ...prev.about, heroImageSrc: "" } } : prev
                          )
                        }
                        disabled={loading}
                      >
                        Remove hero image
                      </button>
                    ) : null}
                  </div>
                </div>

                <div className="adminField">
                  <label>Content image</label>
                  <div className="blockPreview">
                    {cms.about.imageSrc ? <img src={cms.about.imageSrc} alt="" /> : null}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        stageFile(file, (blobUrl) =>
                          setCms((prev) => {
                            if (!prev) return prev;
                            return { ...prev, about: { ...prev.about, imageSrc: blobUrl } };
                          }),
                        );
                      }}
                      disabled={loading}
                    />
                    <button
                      className="adminButton"
                      type="button"
                      onClick={() => openMediaPicker({ type: "about", field: "imageSrc" })}
                      disabled={loading}
                    >
                      Add image from media
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
  );
}
