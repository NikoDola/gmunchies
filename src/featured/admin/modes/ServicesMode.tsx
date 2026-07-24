"use client";
/* eslint-disable @next/next/no-img-element -- admin CMS previews render freshly-uploaded, arbitrary-dimension images (incl. blob: URLs); next/image optimization adds no value here and needs known dimensions. */

import { useAdminCtx } from "../adminContext";
import { deepClone, normSrc } from "../adminUtils";

export default function ServicesMode() {
  const { cms, setCms, loading, stageFile, openMediaPicker, confirmDelete } = useAdminCtx();
  return (
        <section className="adminSection">
          <div className="adminSettingsCard" style={{ marginBottom: "var(--space-10)" }}>
            <div style={{ fontWeight: 800 }}>Home: Services section</div>
            <div style={{ opacity: 0.75, marginTop: 6 }}>
              This controls the heading text above the Services cards on the home page.
            </div>

            <div className="adminRow" style={{ marginTop: "var(--space-8)" }}>
              <div className="adminField">
                <label>Eyebrow</label>
                <input
                  value={cms.home.servicesIntro?.eyebrow ?? ""}
                  onChange={(e) =>
                    setCms((prev) => {
                      if (!prev) return prev;
                      const next = deepClone(prev);
                      next.home = {
                        ...next.home,
                        servicesIntro: {
                          ...(next.home.servicesIntro ?? { eyebrow: "", heading: "Modern Vending Solutions", body: "" }),
                          eyebrow: e.target.value,
                        },
                      };
                      return next;
                    })
                  }
                  disabled={loading}
                />
              </div>
              <div className="adminField">
                <label>Heading</label>
                <input
                  value={cms.home.servicesIntro?.heading ?? "Modern Vending Solutions"}
                  onChange={(e) =>
                    setCms((prev) => {
                      if (!prev) return prev;
                      const next = deepClone(prev);
                      next.home = {
                        ...next.home,
                        servicesIntro: {
                          ...(next.home.servicesIntro ?? { eyebrow: "", heading: "Modern Vending Solutions", body: "" }),
                          heading: e.target.value,
                        },
                      };
                      return next;
                    })
                  }
                  disabled={loading}
                />
              </div>
            </div>

            <div className="adminField" style={{ marginTop: "var(--space-8)" }}>
              <label>Description</label>
              <textarea
                value={cms.home.servicesIntro?.body ?? ""}
                onChange={(e) =>
                  setCms((prev) => {
                    if (!prev) return prev;
                    const next = deepClone(prev);
                    next.home = {
                      ...next.home,
                      servicesIntro: {
                        ...(next.home.servicesIntro ?? { eyebrow: "", heading: "Modern Vending Solutions", body: "" }),
                        body: e.target.value,
                      },
                    };
                    return next;
                  })
                }
                disabled={loading}
                placeholder="Supports blank lines for paragraph breaks."
              />
            </div>
          </div>

          <div className="adminSettingsCard">
            <div style={{ fontWeight: 800 }}>Services listing text</div>
            <div style={{ opacity: 0.75, marginTop: 6 }}>
              This appears under the services cards (Home + /services). Use a blank line to create a new paragraph.
            </div>
            <div className="adminField" style={{ marginTop: "var(--space-8)" }}>
              <textarea
                value={cms.servicesListingText ?? ""}
                onChange={(e) => setCms((prev) => (prev ? { ...prev, servicesListingText: e.target.value } : prev))}
                disabled={loading}
                placeholder="Supports blank lines for paragraph breaks."
              />
            </div>
          </div>

          {cms.services.map((srv, srvIdx) => (
            <details key={`srv-${srvIdx}`} className="adminCard">
              <summary className="adminCardHeader">
                <div>
                  <h3>{srv.title}</h3>
                  <div style={{ opacity: 0.7, fontSize: 13 }}>/service/{srv.slug}</div>
                </div>
                <div
                  className="adminCardHeaderActions"
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <div className="adminRadioPill adminRadioPillHeader" aria-label="Show on homepage">
                    <label className="adminRadioPillOption">
                      <input
                        type="radio"
                        name={`srv-display-header-${srvIdx}`}
                        checked={srv.display === true}
                        onChange={() =>
                          setCms((prev) => {
                            if (!prev) return prev;
                            const next = deepClone(prev);
                            const target = next.services.find((s) => s.slug === srv.slug);
                            if (target) target.display = true;
                            return next;
                          })
                        }
                        disabled={loading}
                      />
                      <span>Show</span>
                    </label>
                    <label className="adminRadioPillOption">
                      <input
                        type="radio"
                        name={`srv-display-header-${srvIdx}`}
                        checked={srv.display === false}
                        onChange={() =>
                          setCms((prev) => {
                            if (!prev) return prev;
                            const next = deepClone(prev);
                            const target = next.services.find((s) => s.slug === srv.slug);
                            if (target) target.display = false;
                            return next;
                          })
                        }
                        disabled={loading}
                      />
                      <span>Hide</span>
                    </label>
                  </div>

                  <button
                    className="adminButton adminButtonDeleteEntity adminCardHeaderDelete"
                    type="button"
                    onClick={() => {
                      if (!confirmDelete("service", srv.title)) return;
                      setCms((prev) => {
                        if (!prev) return prev;
                        const next = deepClone(prev);
                        next.services = next.services.filter((s) => s.slug !== srv.slug);
                        return next;
                      });
                    }}
                    disabled={loading}
                    aria-label={`Delete service ${srv.title}`}
                  >
                    Delete
                  </button>
                </div>
              </summary>
              <div className="adminCardBody">
                <div className="adminSubheading">Hero section</div>
                <div className="adminRow">
                  <div className="adminField">
                    <label>Slug</label>
                    <input
                      value={srv.slug}
                      onChange={(e) =>
                        setCms((prev) => {
                          if (!prev) return prev;
                          const next = deepClone(prev);
                          const target = next.services.find((s) => s.slug === srv.slug);
                          if (target) target.slug = e.target.value;
                          return next;
                        })
                      }
                      disabled={loading}
                    />
                  </div>
                  <div className="adminField">
                    <label>Hero eyebrow</label>
                    <input
                      value={srv.eyebrow ?? ""}
                      onChange={(e) =>
                        setCms((prev) => {
                          if (!prev) return prev;
                          const next = deepClone(prev);
                          const target = next.services.find((s) => s.slug === srv.slug);
                          if (target) target.eyebrow = e.target.value;
                          return next;
                        })
                      }
                      disabled={loading}
                      placeholder="service"
                    />
                  </div>
                  <div className="adminField">
                    <label>Title</label>
                    <input
                      value={srv.title}
                      onChange={(e) =>
                        setCms((prev) => {
                          if (!prev) return prev;
                          const next = deepClone(prev);
                          const target = next.services.find((s) => s.slug === srv.slug);
                          if (target) target.title = e.target.value;
                          return next;
                        })
                      }
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="adminField">
                  <label>Icon image</label>
                  <div className="blockPreview">
                    {srv.iconSrc ? <img src={srv.iconSrc} alt="" /> : null}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        stageFile(file, (blobUrl) =>
                          setCms((prev) => {
                            if (!prev) return prev;
                            const next = deepClone(prev);
                            const target = next.services.find((s) => s.slug === srv.slug);
                            if (target) target.iconSrc = blobUrl;
                            return next;
                          }),
                        );
                      }}
                      disabled={loading}
                    />
                    <button
                      className="adminButton"
                      type="button"
                      onClick={() => openMediaPicker({ type: "service", slug: srv.slug, field: "iconSrc" })}
                      disabled={loading}
                    >
                      Add icon from media
                    </button>
                    {srv.iconSrc ? (
                      <button
                        className="adminButton adminButtonDanger"
                        type="button"
                        onClick={() =>
                          setCms((prev) => {
                            if (!prev) return prev;
                            const next = deepClone(prev);
                            const target = next.services.find((s) => s.slug === srv.slug);
                            if (target) target.iconSrc = "";
                            return next;
                          })
                        }
                        disabled={loading}
                      >
                        Remove icon
                      </button>
                    ) : null}
                    <input
                      value={srv.iconSrc}
                      onChange={(e) =>
                        setCms((prev) => {
                          if (!prev) return prev;
                          const next = deepClone(prev);
                          const target = next.services.find((s) => s.slug === srv.slug);
                          if (target) target.iconSrc = e.target.value;
                          return next;
                        })
                      }
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="adminField">
                  <label>Excerpt</label>
                  <textarea
                    value={srv.excerpt}
                    onChange={(e) =>
                      setCms((prev) => {
                        if (!prev) return prev;
                        const next = deepClone(prev);
                        const target = next.services.find((s) => s.slug === srv.slug);
                        if (target) target.excerpt = e.target.value;
                        return next;
                      })
                    }
                    disabled={loading}
                  />
                </div>

                <div className="adminField">
                  <label>Hero image</label>
                  <div className="blockPreview">
                    {srv.heroImageSrc ? <img src={srv.heroImageSrc} alt="" /> : null}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        stageFile(file, (blobUrl) =>
                          setCms((prev) => {
                            if (!prev) return prev;
                            const next = deepClone(prev);
                            const target = next.services.find((s) => s.slug === srv.slug);
                            if (target) target.heroImageSrc = blobUrl;
                            return next;
                          }),
                        );
                      }}
                      disabled={loading}
                    />
                    <button
                      className="adminButton"
                      type="button"
                      onClick={() => openMediaPicker({ type: "service", slug: srv.slug, field: "heroImageSrc" })}
                      disabled={loading}
                    >
                      Add image from media
                    </button>
                    {srv.heroImageSrc ? (
                      <button
                        className="adminButton adminButtonDanger"
                        type="button"
                        onClick={() =>
                          setCms((prev) => {
                            if (!prev) return prev;
                            const next = deepClone(prev);
                            const target = next.services.find((s) => s.slug === srv.slug);
                            if (target) target.heroImageSrc = "";
                            return next;
                          })
                        }
                        disabled={loading}
                      >
                        Remove hero image
                      </button>
                    ) : null}
                  </div>
                </div>

                <div className="adminField">
                  <label>Blocks</label>
                  <div className="adminActions">
                    <button
                      className="adminButton"
                      onClick={() =>
                        setCms((prev) => {
                          if (!prev) return prev;
                          const next = deepClone(prev);
                          const target = next.services.find((s) => s.slug === srv.slug);
                          if (!target) return next;
                          target.blocks.push({ layout: "left", eyebrow: "", heading: "New block", body: "", iconSrc: "", imageSrc: "" });
                          return next;
                        })
                      }
                      disabled={loading}
                    >
                      Add block
                    </button>
                  </div>

                  <div className="blocksList">
                    {srv.blocks.map((b, idx) => (
                      <div key={idx} className="blockItem">
                        <div className="adminBlockHeader">
                          <div className="adminBlockKicker">Section {idx + 1}</div>
                          <div className="adminBlockTitle">{b.heading || "Untitled section"}</div>
                        </div>
                        <div className="adminRow">
                          <div className="adminField">
                            <label>Layout</label>
                            <select
                              value={b.layout}
                              onChange={(e) =>
                                setCms((prev) => {
                                  if (!prev) return prev;
                                  const next = deepClone(prev);
                                  const target = next.services.find((s) => s.slug === srv.slug);
                                  if (target) target.blocks[idx].layout = e.target.value as "left" | "right" | "center";
                                  return next;
                                })
                              }
                              disabled={loading}
                            >
                              <option value="left">left</option>
                              <option value="right">right</option>
                              <option value="center">center</option>
                            </select>
                          </div>
                          <div className="adminField">
                            <label>Before headline</label>
                            <input
                              value={b.eyebrow ?? ""}
                              onChange={(e) =>
                                setCms((prev) => {
                                  if (!prev) return prev;
                                  const next = deepClone(prev);
                                  const target = next.services.find((s) => s.slug === srv.slug);
                                  if (target) target.blocks[idx].eyebrow = e.target.value;
                                  return next;
                                })
                              }
                              disabled={loading}
                            />
                          </div>
                        </div>

                        <div className="adminField">
                          <label>Headline</label>
                          <input
                            value={b.heading}
                            onChange={(e) =>
                              setCms((prev) => {
                                if (!prev) return prev;
                                const next = deepClone(prev);
                                const target = next.services.find((s) => s.slug === srv.slug);
                                if (target) target.blocks[idx].heading = e.target.value;
                                return next;
                              })
                            }
                            disabled={loading}
                          />
                        </div>

                        <div className="adminField">
                          <label>After headline</label>
                          <textarea
                            value={b.body ?? ""}
                            onChange={(e) =>
                              setCms((prev) => {
                                if (!prev) return prev;
                                const next = deepClone(prev);
                                const target = next.services.find((s) => s.slug === srv.slug);
                                if (target) target.blocks[idx].body = e.target.value;
                                return next;
                              })
                            }
                            disabled={loading}
                          />
                        </div>

                        <div className="adminMediaRow adminFieldSectionIcon">
                          <div className="adminMediaCol">
                            <label>Section icon (optional)</label>
                            <div className="adminMediaPreview adminMediaPreviewIcon">
                              {normSrc(b.iconSrc) ? (
                                <img src={normSrc(b.iconSrc)} alt="Icon preview" />
                              ) : (
                                <div className="adminMediaEmpty">No icon</div>
                              )}
                            </div>
                            <div className="adminMediaControls">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  stageFile(file, (blobUrl) =>
                                    setCms((prev) => {
                                      if (!prev) return prev;
                                      const next = deepClone(prev);
                                      const target = next.services.find((s) => s.slug === srv.slug);
                                      if (target) target.blocks[idx].iconSrc = blobUrl;
                                      return next;
                                    }),
                                  );
                                }}
                                disabled={loading}
                              />
                              <button
                                className="adminButton"
                                type="button"
                                onClick={() =>
                                  openMediaPicker({ type: "service", slug: srv.slug, field: "blockIconSrc", blockIdx: idx })
                                }
                                disabled={loading}
                              >
                                Add icon from media
                              </button>
                              {normSrc(b.iconSrc) ? (
                                <button
                                  className="adminButton adminButtonDanger"
                                  type="button"
                                  onClick={() =>
                                    setCms((prev) => {
                                      if (!prev) return prev;
                                      const next = deepClone(prev);
                                      const target = next.services.find((s) => s.slug === srv.slug);
                                      if (target) target.blocks[idx].iconSrc = "";
                                      return next;
                                    })
                                  }
                                  disabled={loading}
                                >
                                  Remove icon
                                </button>
                              ) : null}
                              <div className="adminMediaPath">{normSrc(b.iconSrc)}</div>
                            </div>
                          </div>

                          <div className="adminMediaCol adminMediaColWide">
                            <label>Image</label>
                            <div className="adminMediaPreview adminMediaPreviewLarge">
                              {normSrc(b.imageSrc) ? (
                                <img src={normSrc(b.imageSrc)} alt="Section image preview" />
                              ) : (
                                <div className="adminMediaEmpty">No image</div>
                              )}
                            </div>
                            <div className="adminMediaControls">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  stageFile(file, (blobUrl) =>
                                    setCms((prev) => {
                                      if (!prev) return prev;
                                      const next = deepClone(prev);
                                      const target = next.services.find((s) => s.slug === srv.slug);
                                      if (target) target.blocks[idx].imageSrc = blobUrl;
                                      return next;
                                    }),
                                  );
                                }}
                                disabled={loading}
                              />
                              <button
                                className="adminButton"
                                type="button"
                                onClick={() => openMediaPicker({ type: "service", slug: srv.slug, field: "imageSrc", blockIdx: idx })}
                                disabled={loading}
                              >
                                Add image from media
                              </button>
                              <button
                                className="adminButton adminButtonDanger"
                                type="button"
                                onClick={() =>
                                  setCms((prev) => {
                                    if (!prev) return prev;
                                    const next = deepClone(prev);
                                    const target = next.services.find((s) => s.slug === srv.slug);
                                    if (target) target.blocks[idx].imageSrc = "";
                                    return next;
                                  })
                                }
                                disabled={loading}
                              >
                                Remove image
                              </button>
                              <div className="adminMediaPath">{normSrc(b.imageSrc)}</div>
                            </div>
                          </div>
                        </div>

                        <button
                          className="adminButton adminButtonDanger"
                          onClick={() =>
                            setCms((prev) => {
                              if (!prev) return prev;
                              const next = deepClone(prev);
                              const target = next.services.find((s) => s.slug === srv.slug);
                              if (target) target.blocks.splice(idx, 1);
                              return next;
                            })
                          }
                          disabled={loading}
                        >
                          Delete block
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </details>
          ))}

          <div className="adminSettingsCard">
            <div style={{ fontWeight: 800 }}>Dynamic pages</div>
            <div style={{ opacity: 0.75, marginTop: 6 }}>
              If disabled, Services will not appear in the navbar and cards won’t link to /service/[slug].
            </div>
            <div className="adminRadioRow">
              <label className="adminRadio">
                <input
                  type="radio"
                  name="services-dynamic"
                  checked={cms.dynamicPages.services === true}
                  onChange={() => setCms((prev) => (prev ? { ...prev, dynamicPages: { ...prev.dynamicPages, services: true } } : prev))}
                  disabled={loading}
                />
                On
              </label>
              <label className="adminRadio">
                <input
                  type="radio"
                  name="services-dynamic"
                  checked={cms.dynamicPages.services === false}
                  onChange={() => setCms((prev) => (prev ? { ...prev, dynamicPages: { ...prev.dynamicPages, services: false } } : prev))}
                  disabled={loading}
                />
                Off
              </label>
            </div>
          </div>
        </section>
  );
}
