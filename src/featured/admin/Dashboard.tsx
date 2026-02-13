"use client";

import "./Admin.css";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CmsContent } from "@/lib/content";
import { FiArrowLeft } from "react-icons/fi";

type EditorMode = "locations" | "services";

function deepClone<T>(value: T): T {
  // structuredClone isn't available in older iOS Safari
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sc = (globalThis as any).structuredClone as undefined | ((v: unknown) => unknown);
  if (sc) return sc(value) as T;
  return JSON.parse(JSON.stringify(value)) as T;
}

export default function Dashboard() {
  const [cms, setCms] = useState<CmsContent | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<EditorMode>("locations");
  const [mediaOpen, setMediaOpen] = useState(false);
  const [media, setMedia] = useState<string[]>([]);
  const [mediaTarget, setMediaTarget] = useState<null | { type: "location" | "service"; slug: string; blockIdx?: number; field: "heroImageSrc" | "imageSrc" }>(null);

  const secret = useMemo(() => process.env.NEXT_PUBLIC_ADMIN_SECRET ?? "", []);

  async function load() {
    if (loading) return;
    setLoading(true);
    setStatus("loading...");
    try {
      const res = await fetch("/api/admin/content", {
        method: "GET",
        headers: { "x-admin-secret": secret },
      });
      const json = await res.json();
      if (!res.ok) {
        const details = json.details ? `\n${JSON.stringify(json.details, null, 2)}` : "";
        setStatus(`error: ${json.error ?? "load failed"}${details}`);
        return;
      }
      setCms(json.data as CmsContent);
      setStatus(json.warning ? `loaded (warning: ${json.warning})` : "loaded");
    } catch {
      setStatus("network error");
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    if (!cms || loading) return;
    setLoading(true);
    setStatus("saving...");
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-secret": secret },
        body: JSON.stringify(cms),
      });
      const json = await res.json();
      if (!res.ok) {
        const details = json.details
          ? `\n${JSON.stringify(json.details, null, 2)}`
          : json.issues
            ? `\n${JSON.stringify(json.issues, null, 2)}`
            : "";
        setStatus(`error: ${json.error ?? "save failed"}${details}`);
        return;
      }
      setStatus("saved & redeploying, wait 5 to 10 minutes for changes");
    } catch {
      setStatus("network error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function uploadFile(file: File): Promise<string | null> {
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "x-admin-secret": secret },
        body: form,
      });
      const json = await res.json();
      if (!res.ok) {
        const details = json.details ? `\n${JSON.stringify(json.details, null, 2)}` : "";
        setStatus(`error: ${json.error ?? "upload failed"}${details}`);
        return null;
      }
      return json.path as string;
    } catch {
      setStatus("error: upload network error");
      return null;
    }
  }

  async function openMediaPicker(target: NonNullable<typeof mediaTarget>) {
    setMediaTarget(target);
    setMediaOpen(true);
    try {
      const res = await fetch("/api/admin/media", { headers: { "x-admin-secret": secret } });
      const json = await res.json();
      if (!res.ok) {
        setStatus(`error: ${json.error ?? "failed to load media"}`);
        setMedia([]);
        return;
      }
      setMedia(json.items as string[]);
    } catch {
      setStatus("error: failed to load media");
      setMedia([]);
    }
  }

  function setImageFromPicker(path: string) {
    if (!cms || !mediaTarget) return;

    setCms((prev) => {
      if (!prev) return prev;
      const next: CmsContent = deepClone(prev);
      if (mediaTarget.type === "location") {
        const loc = next.locations.find((l) => l.slug === mediaTarget.slug);
        if (!loc) return next;
        if (mediaTarget.field === "heroImageSrc") {
          loc.heroImageSrc = path;
        } else {
          const idx = mediaTarget.blockIdx ?? -1;
          if (idx >= 0 && loc.blocks[idx]) loc.blocks[idx].imageSrc = path;
        }
      } else {
        const srv = next.services.find((s) => s.slug === mediaTarget.slug);
        if (!srv) return next;
        if (mediaTarget.field === "heroImageSrc") {
          srv.heroImageSrc = path;
        } else {
          const idx = mediaTarget.blockIdx ?? -1;
          if (idx >= 0 && srv.blocks[idx]) srv.blocks[idx].imageSrc = path;
        }
      }
      return next;
    });
    setMediaOpen(false);
  }

  function confirmDelete(kind: "service" | "location", name: string) {
    return window.confirm(`Are you sure to remove the "${kind}" (${name})?`);
  }

  function addLocation() {
    if (!cms) return;
    const slug = `new-location-${Date.now()}`;
    setCms({
      ...cms,
      locations: [
        ...cms.locations,
        {
          slug,
          name: "New Location",
          description: "",
          iconKey: "FaMapMarkerAlt",
          heroImageSrc: "",
          blocks: [],
        },
      ],
    });
  }

  function addService() {
    if (!cms) return;
    const slug = `new-service-${Date.now()}`;
    setCms({
      ...cms,
      services: [
        ...cms.services,
        {
          slug,
          display: true,
          iconSrc: "/uploads/icon-04.svg",
          title: "New Service",
          excerpt: "",
          heroImageSrc: "/uploads/hero.webp",
          blocks: [],
        },
      ],
    });
  }

  if (!cms) {
    return (
      <main className="adminPage">
        <div className="adminTopbar">
          <h2>Admin Dashboard</h2>
          <div className="adminActions">
            <button className="adminButton" onClick={load} disabled={loading}>
              {loading ? "Loading..." : "Reload"}
            </button>
          </div>
        </div>
        {status && <p className="adminStatus">{status}</p>}
      </main>
    );
  }

  return (
    <main className="adminPage adminPageWithTopbar">
      <div className="adminFixedTopbar">
        <Link href="/" className="adminBackLink">
          <FiArrowLeft size={18} />
          <span>Back to website</span>
        </Link>

        <div className="adminModeSwitch">
          <button
            className={`adminButton ${mode === "locations" ? "adminButtonPrimary" : ""}`}
            onClick={() => setMode("locations")}
            disabled={loading}
          >
            Edit locations
          </button>
          <button
            className={`adminButton ${mode === "services" ? "adminButtonPrimary" : ""}`}
            onClick={() => setMode("services")}
            disabled={loading}
          >
            Edit services
          </button>
        </div>

        <div className="adminActions">
          <button
            className="adminButton"
            onClick={mode === "locations" ? addLocation : addService}
            disabled={loading}
          >
            {mode === "locations" ? "Add location" : "Add service"}
          </button>
          <button className="adminButton" onClick={load} disabled={loading}>
            {loading ? "Loading..." : "Reload"}
          </button>
          <button className="adminButton adminButtonPrimary" onClick={save} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {status && <p className="adminStatus">{status}</p>}

      {mode === "locations" ? (
        <section className="adminSection">
          {cms.locations.map((loc) => (
            <details key={loc.slug} className="adminCard">
              <summary className="adminCardHeader">
                <div>
                  <h3>{loc.name}</h3>
                  <div style={{ opacity: 0.7, fontSize: 13 }}>/location/{loc.slug}</div>
                </div>
              </summary>

              <div className="adminCardBody">
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
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const path = await uploadFile(file);
                          if (!path) return;
                          setCms((prev) => {
                            if (!prev) return prev;
                            const next = deepClone(prev);
                            const target = next.locations.find((l) => l.slug === loc.slug);
                            if (target) target.heroImageSrc = path;
                            return next;
                          });
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
                          target.blocks.push({ layout: "left", eyebrow: "", heading: "New block", body: "", imageSrc: "" });
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
                                  if (target) target.blocks[idx].layout = e.target.value as any;
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

                        <div className="adminField">
                          <label>Image</label>
                          <div className="blockPreview">
                            {b.imageSrc ? <img src={b.imageSrc} alt="" /> : null}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const path = await uploadFile(file);
                                if (!path) return;
                                setCms((prev) => {
                                  if (!prev) return prev;
                                  const next = deepClone(prev);
                                  const target = next.locations.find((l) => l.slug === loc.slug);
                                  if (target) target.blocks[idx].imageSrc = path;
                                  return next;
                                });
                              }}
                              disabled={loading}
                            />
                            <button
                              className="adminButton"
                              type="button"
                              onClick={() => openMediaPicker({ type: "location", slug: loc.slug, field: "imageSrc", blockIdx: idx })}
                              disabled={loading}
                            >
                              Add image from media
                            </button>
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

                <button
                  className="adminButton adminButtonDanger"
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
                >
                  Delete location
                </button>
              </div>
            </details>
          ))}
        </section>
      ) : (
        <section className="adminSection">
          {cms.services.map((srv) => (
            <details key={srv.slug} className="adminCard">
              <summary className="adminCardHeader">
                <div>
                  <h3>{srv.title}</h3>
                  <div style={{ opacity: 0.7, fontSize: 13 }}>/service/{srv.slug}</div>
                </div>
              </summary>
              <div className="adminCardBody">
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

                <div className="adminRow">
                  <div className="adminField">
                    <label>Display on homepage</label>
                    <select
                      value={srv.display ? "yes" : "no"}
                      onChange={(e) =>
                        setCms((prev) => {
                          if (!prev) return prev;
                          const next = deepClone(prev);
                          const target = next.services.find((s) => s.slug === srv.slug);
                          if (target) target.display = e.target.value === "yes";
                          return next;
                        })
                      }
                      disabled={loading}
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div className="adminField">
                    <label>Icon (image path)</label>
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
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const path = await uploadFile(file);
                        if (!path) return;
                        setCms((prev) => {
                          if (!prev) return prev;
                          const next = deepClone(prev);
                          const target = next.services.find((s) => s.slug === srv.slug);
                          if (target) target.heroImageSrc = path;
                          return next;
                        });
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
                          target.blocks.push({ layout: "left", eyebrow: "", heading: "New block", body: "", imageSrc: "" });
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
                                  if (target) target.blocks[idx].layout = e.target.value as any;
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

                        <div className="adminField">
                          <label>Image</label>
                          <div className="blockPreview">
                            {b.imageSrc ? <img src={b.imageSrc} alt="" /> : null}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const path = await uploadFile(file);
                                if (!path) return;
                                setCms((prev) => {
                                  if (!prev) return prev;
                                  const next = deepClone(prev);
                                  const target = next.services.find((s) => s.slug === srv.slug);
                                  if (target) target.blocks[idx].imageSrc = path;
                                  return next;
                                });
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

                <button
                  className="adminButton adminButtonDanger"
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
                >
                  Delete service
                </button>
              </div>
            </details>
          ))}
        </section>
      )}

      {mediaOpen ? (
        <div className="adminModalOverlay" role="dialog" aria-modal="true">
          <div className="adminModal">
            <div className="adminModalHeader">
              <h3>Media</h3>
              <button className="adminButton" onClick={() => setMediaOpen(false)} disabled={loading}>
                Close
              </button>
            </div>
            <div className="adminMediaGrid">
              {media.map((p) => (
                <button key={p} className="adminMediaItem" onClick={() => setImageFromPicker(p)}>
                  <img src={p} alt={p} />
                  <div className="adminMediaLabel">{p}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

