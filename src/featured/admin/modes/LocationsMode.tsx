"use client";
/* eslint-disable @next/next/no-img-element -- admin CMS previews render freshly-uploaded, arbitrary-dimension images (incl. blob: URLs); next/image optimization adds no value here and needs known dimensions. */

import { useAdminCtx } from "../adminContext";
import { deepClone, normSrc } from "../adminUtils";

export default function LocationsMode() {
  const { cms, setCms, loading, stageFile, openMediaPicker, confirmDelete } = useAdminCtx();
  return (
        <section className="adminSection">
          <div className="adminSettingsCard">
            <div style={{ fontWeight: 800 }}>Locations listing text</div>
            <div style={{ opacity: 0.75, marginTop: 6 }}>
              This appears under the location cards (Home + /locations). Leave blank for now if you don’t want it.
            </div>
            <div className="adminField" style={{ marginTop: "var(--space-8)" }}>
              <textarea
                value={cms.locationsListingText ?? ""}
                onChange={(e) => setCms((prev) => (prev ? { ...prev, locationsListingText: e.target.value } : prev))}
                disabled={loading}
                placeholder="Supports blank lines for paragraph breaks."
              />
            </div>
          </div>

          {cms.locations.map((loc, locIdx) => (
            <details key={`loc-${locIdx}`} className="adminCard">
              <summary className="adminCardHeader">
                <div>
                  <h3>{loc.name}</h3>
                  <div style={{ opacity: 0.7, fontSize: 13 }}>/location/{loc.slug}</div>
                </div>
                <div
                  className="adminCardHeaderActions"
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <button
                    className="adminButton adminButtonDeleteEntity adminCardHeaderDelete"
                    type="button"
                    onClick={() => {
                      if (!confirmDelete("location", loc.name)) return;
                      setCms((prev) => {
                        if (!prev) return prev;
                        const next = deepClone(prev);
                        next.locations = next.locations.filter((l) => l.slug !== loc.slug);
                        return next;
                      });
                    }}
                    disabled={loading}
                    aria-label={`Delete location ${loc.name}`}
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
                      value={loc.slug}
                      onChange={(e) =>
                        setCms((prev) => {
                          if (!prev) return prev;
                          const next = deepClone(prev);
                          const target = next.locations.find((l) => l.slug === loc.slug);
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
                      value={loc.eyebrow ?? ""}
                      onChange={(e) =>
                        setCms((prev) => {
                          if (!prev) return prev;
                          const next = deepClone(prev);
                          const target = next.locations.find((l) => l.slug === loc.slug);
                          if (target) target.eyebrow = e.target.value;
                          return next;
                        })
                      }
                      disabled={loading}
                      placeholder="location"
                    />
                  </div>
                  <div className="adminField">
                    <label>Name</label>
                    <input
                      value={loc.name}
                      onChange={(e) =>
                        setCms((prev) => {
                          if (!prev) return prev;
                          const next = deepClone(prev);
                          const target = next.locations.find((l) => l.slug === loc.slug);
                          if (target) target.name = e.target.value;
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
                    value={loc.excerpt ?? ""}
                    onChange={(e) =>
                      setCms((prev) => {
                        if (!prev) return prev;
                        const next = deepClone(prev);
                        const target = next.locations.find((l) => l.slug === loc.slug);
                        if (target) target.excerpt = e.target.value;
                        return next;
                      })
                    }
                    disabled={loading}
                  />
                </div>

                <div className="adminField">
                  <label>Description</label>
                  <textarea
                    value={loc.description ?? ""}
                    onChange={(e) =>
                      setCms((prev) => {
                        if (!prev) return prev;
                        const next = deepClone(prev);
                        const target = next.locations.find((l) => l.slug === loc.slug);
                        if (target) target.description = e.target.value;
                        return next;
                      })
                    }
                    disabled={loading}
                  />
                </div>

                <div className="adminRow">
                  <div className="adminField">
                    <label>Hero image</label>
                    <div className="blockPreview">
                      {loc.heroImageSrc ? <img src={loc.heroImageSrc} alt="" /> : null}
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
                              const target = next.locations.find((l) => l.slug === loc.slug);
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
                        onClick={() => openMediaPicker({ type: "location", slug: loc.slug, field: "heroImageSrc" })}
                        disabled={loading}
                      >
                        Add image from media
                      </button>
                      {loc.heroImageSrc ? (
                        <button
                          className="adminButton adminButtonDanger"
                          type="button"
                          onClick={() =>
                            setCms((prev) => {
                              if (!prev) return prev;
                              const next = deepClone(prev);
                              const target = next.locations.find((l) => l.slug === loc.slug);
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
                    <label>Icon key</label>
                    <select
                      value={loc.iconKey ?? "FaMapMarkerAlt"}
                      onChange={(e) =>
                        setCms((prev) => {
                          if (!prev) return prev;
                          const next = deepClone(prev);
                          const target = next.locations.find((l) => l.slug === loc.slug);
                          if (target) target.iconKey = e.target.value;
                          return next;
                        })
                      }
                      disabled={loading}
                    >
                      <option value="FaBuilding">FaBuilding</option>
                      <option value="FaHome">FaHome</option>
                      <option value="FaWarehouse">FaWarehouse</option>
                      <option value="FaDumbbell">FaDumbbell</option>
                      <option value="FaHospital">FaHospital</option>
                      <option value="FaGraduationCap">FaGraduationCap</option>
                      <option value="FaMapMarkerAlt">FaMapMarkerAlt</option>
                    </select>
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
                          const target = next.locations.find((l) => l.slug === loc.slug);
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
                    {loc.blocks.map((b, idx) => (
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
                                  const target = next.locations.find((l) => l.slug === loc.slug);
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
                                  const target = next.locations.find((l) => l.slug === loc.slug);
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
                                const target = next.locations.find((l) => l.slug === loc.slug);
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
                                const target = next.locations.find((l) => l.slug === loc.slug);
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
                                <div className="adminMediaEmpty">No section icon</div>
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
                                      const target = next.locations.find((l) => l.slug === loc.slug);
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
                                  openMediaPicker({ type: "location", slug: loc.slug, field: "blockIconSrc", blockIdx: idx })
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
                                      const target = next.locations.find((l) => l.slug === loc.slug);
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
                                      const target = next.locations.find((l) => l.slug === loc.slug);
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
                                onClick={() =>
                                  openMediaPicker({ type: "location", slug: loc.slug, field: "imageSrc", blockIdx: idx })
                                }
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
                                    const target = next.locations.find((l) => l.slug === loc.slug);
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
                              const target = next.locations.find((l) => l.slug === loc.slug);
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
              If disabled, Locations will not appear in the navbar and cards won’t link to /location/[slug].
            </div>
            <div className="adminRadioRow">
              <label className="adminRadio">
                <input
                  type="radio"
                  name="locations-dynamic"
                  checked={cms.dynamicPages.locations === true}
                  onChange={() => setCms((prev) => (prev ? { ...prev, dynamicPages: { ...prev.dynamicPages, locations: true } } : prev))}
                  disabled={loading}
                />
                On
              </label>
              <label className="adminRadio">
                <input
                  type="radio"
                  name="locations-dynamic"
                  checked={cms.dynamicPages.locations === false}
                  onChange={() => setCms((prev) => (prev ? { ...prev, dynamicPages: { ...prev.dynamicPages, locations: false } } : prev))}
                  disabled={loading}
                />
                Off
              </label>
            </div>
          </div>
        </section>
  );
}
