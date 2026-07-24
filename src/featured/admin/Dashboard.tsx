"use client";
/* eslint-disable @next/next/no-img-element -- admin CMS previews render freshly-uploaded, arbitrary-dimension images (incl. blob: URLs); next/image optimization adds no value here and needs known dimensions. */

import "./Admin.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { CmsContent } from "@/lib/content";
import {
  FiArrowLeft,
  FiGrid,
  FiHome,
  FiInfo,
  FiLogOut,
  FiMapPin,
  FiMessageSquare,
  FiPlus,
  FiRefreshCw,
  FiSave,
  FiShare2,
} from "react-icons/fi";
import { signIn, signOut, useSession } from "next-auth/react";
import AdminCtx, { type MediaTarget } from "./adminContext";
import { deepClone } from "./adminUtils";
import HomeMode from "./modes/HomeMode";
import AboutMode from "./modes/AboutMode";
import LocationsMode from "./modes/LocationsMode";
import ServicesMode from "./modes/ServicesMode";
import TestimonialsMode from "./modes/TestimonialsMode";
import SocialMode from "./modes/SocialMode";

type EditorMode = "home" | "about" | "locations" | "services" | "testimonials" | "social";

export default function Dashboard() {
  const { data: session, status: sessionStatus } = useSession();
  const [cms, setCms] = useState<CmsContent | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [popup, setPopup] = useState<null | { title: string; body: string; kind: "success" | "error" | "info" }>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<EditorMode>("services");
  const [mediaOpen, setMediaOpen] = useState(false);
  const [media, setMedia] = useState<string[]>([]);
  const [mediaTarget, setMediaTarget] = useState<MediaTarget | null>(null);
  const [pendingFiles, setPendingFiles] = useState<Map<string, File>>(new Map());

  async function load() {
    if (loading) return;
    setLoading(true);
    setStatus("loading...");
    try {
      const res = await fetch("/api/admin/content", {
        method: "GET",
        credentials: "include",
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
      let resolved: CmsContent = deepClone(cms);
      const pendingImages: Array<{ repoPath: string; content: string }> = [];

      if (pendingFiles.size > 0) {
        setStatus("preparing images...");

        // Collect all blob URLs referenced in cms
        const blobUrls = new Set<string>();
        function collectBlobUrls(obj: unknown) {
          if (typeof obj === "string" && obj.startsWith("blob:") && pendingFiles.has(obj)) {
            blobUrls.add(obj);
          } else if (obj && typeof obj === "object") {
            for (const v of Object.values(obj as Record<string, unknown>)) collectBlobUrls(v);
          }
        }
        collectBlobUrls(resolved);

        // Convert each file to base64 and build replacement map
        const replacements = new Map<string, string>();
        for (const blobUrl of blobUrls) {
          const file = pendingFiles.get(blobUrl)!;
          const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "upload";
          const unique = `${Date.now()}-${safeName}`;
          const repoPath = `public/uploads/${unique}`;
          const localPath = `/uploads/${unique}`;

          const arrayBuffer = await file.arrayBuffer();
          const bytes = new Uint8Array(arrayBuffer);
          let binary = "";
          const chunk = 0x8000;
          for (let i = 0; i < bytes.length; i += chunk) {
            binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
          }
          pendingImages.push({ repoPath, content: btoa(binary) });
          replacements.set(blobUrl, localPath);
        }

        // Replace blob URLs in cms with final /uploads/ paths
        function replaceBlobUrls(obj: unknown): unknown {
          if (typeof obj === "string") return replacements.has(obj) ? replacements.get(obj)! : obj;
          if (Array.isArray(obj)) return obj.map(replaceBlobUrls);
          if (obj && typeof obj === "object") {
            return Object.fromEntries(
              Object.entries(obj as Record<string, unknown>).map(([k, v]) => [k, replaceBlobUrls(v)]),
            );
          }
          return obj;
        }
        resolved = replaceBlobUrls(resolved) as CmsContent;

        for (const blobUrl of pendingFiles.keys()) URL.revokeObjectURL(blobUrl);
        setPendingFiles(new Map());
        setCms(resolved);
        setStatus("saving...");
      }

      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ data: resolved, images: pendingImages }),
      });
      const json = await res.json();
      if (!res.ok) {
        const details = json.details
          ? `\n${JSON.stringify(json.details, null, 2)}`
          : json.issues
            ? `\n${JSON.stringify(json.issues, null, 2)}`
            : "";
        const msg = `Error while saving.\n\n${json.error ?? "save failed"}${details}\n\nContact your site administrator if this keeps happening.`;
        setStatus(`error: ${json.error ?? "save failed"}${details}`);
        setPopup({ title: "Save failed", body: msg, kind: "error" });
        return;
      }
      if (json.committed === false) {
        const msg = `Saved locally only.\n\n${json.warning ?? "GitHub sync disabled"}`;
        setStatus(`saved locally only (warning: ${json.warning ?? "GitHub sync disabled"})`);
        setPopup({ title: "Saved locally", body: msg, kind: "info" });
        return;
      }

      const sha = json.commit?.sha as string | undefined;
      const url = json.commit?.url as string | undefined;
      const msg = url
        ? `Saved to GitHub.\n\nCommit: ${sha?.slice(0, 7) ?? "unknown"}\n${url}\n\nVercel should auto-deploy shortly.`
        : "Saved to GitHub.\n\nVercel should auto-deploy shortly.";
      setStatus(url ? `saved to GitHub (${sha?.slice(0, 7) ?? "unknown"}): ${url}` : "saved to GitHub");
      setPopup({ title: "Saved", body: msg, kind: "success" });
    } catch {
      setStatus("network error");
      setPopup({
        title: "Save failed",
        body: "Network error while saving.\n\nContact your site administrator if this keeps happening.",
        kind: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!popup) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPopup(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [popup]);

  useEffect(() => {
    if (sessionStatus !== "authenticated") return;
    if (cms) return;
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionStatus]);

  function stageFile(file: File, onStaged: (blobUrl: string) => void) {
    const blobUrl = URL.createObjectURL(file);
    setPendingFiles((prev) => {
      const next = new Map(prev);
      next.set(blobUrl, file);
      return next;
    });
    onStaged(blobUrl);
  }

  async function openMediaPicker(target: NonNullable<typeof mediaTarget>) {
    setMediaTarget(target);
    setMediaOpen(true);
    try {
      const res = await fetch("/api/admin/media", { credentials: "include" });
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
      if (mediaTarget.type === "home") {
        next.home = { ...next.home, hero: { ...next.home.hero, imageSrc: path } };
      } else if (mediaTarget.type === "about") {
        next.about = { ...next.about, [mediaTarget.field]: path };
      } else if (mediaTarget.type === "location") {
        const loc = next.locations.find((l) => l.slug === mediaTarget.slug);
        if (!loc) return next;
        if (mediaTarget.field === "heroImageSrc") {
          loc.heroImageSrc = path;
        } else if (mediaTarget.field === "blockIconSrc") {
          const idx = mediaTarget.blockIdx ?? -1;
          if (idx >= 0 && loc.blocks[idx]) loc.blocks[idx].iconSrc = path;
        } else if (mediaTarget.field === "imageSrc") {
          const idx = mediaTarget.blockIdx ?? -1;
          if (idx >= 0 && loc.blocks[idx]) loc.blocks[idx].imageSrc = path;
        }
      } else if (mediaTarget.type === "service") {
        const srv = next.services.find((s) => s.slug === mediaTarget.slug);
        if (!srv) return next;
        if (mediaTarget.field === "heroImageSrc") {
          srv.heroImageSrc = path;
        } else if (mediaTarget.field === "iconSrc") {
          srv.iconSrc = path;
        } else if (mediaTarget.field === "blockIconSrc") {
          const idx = mediaTarget.blockIdx ?? -1;
          if (idx >= 0 && srv.blocks[idx]) srv.blocks[idx].iconSrc = path;
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
          eyebrow: "location",
          excerpt: "",
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
          eyebrow: "service",
          iconSrc: "/uploads/icon-04.svg",
          title: "New Service",
          excerpt: "",
          sectionsIntro: "",
          heroImageSrc: "/uploads/hero.webp",
          blocks: [],
        },
      ],
    });
  }

  function addTestimonial() {
    if (!cms) return;
    const id = `t-${Date.now()}`;
    setCms({
      ...cms,
      testimonials: [
        ...cms.testimonials,
        {
          id,
          locationSlug: "other",
          quote: "",
          clientName: "",
          locationLabel: "",
          enabled: true,
          showOnHome: true,
          showOnTestimonialsPage: true,
        },
      ],
    });
  }

  function addSocialLink() {
    if (!cms) return;
    setCms({
      ...cms,
      socialLinks: [
        ...(cms.socialLinks ?? []),
        {
          platform: "Instagram",
          url: "https://instagram.com",
          enabled: true,
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
            {session ? (
              <button className="adminButton" onClick={() => signOut()} disabled={loading}>
                Sign out
              </button>
            ) : (
              <button className="adminButton adminButtonPrimary" onClick={() => signIn("google")} disabled={loading}>
                Sign in with Google
              </button>
            )}
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
    <AdminCtx.Provider value={{ cms, setCms, loading, stageFile, openMediaPicker, confirmDelete }}>
    <main className="adminShell">
      <aside className="adminSidebar">
        <Link href="/" className="adminBackLink">
          <FiArrowLeft size={18} />
          <span>Back to website</span>
        </Link>

        <div className="adminSidebarNav" role="navigation" aria-label="Admin sections">
          <button
            className={`adminSidebarNavItem ${mode === "home" ? "active" : ""}`}
            onClick={() => setMode("home")}
            disabled={loading}
            type="button"
          >
            <FiHome size={18} />
            <span>Edit home hero</span>
          </button>
          <button
            className={`adminSidebarNavItem ${mode === "services" ? "active" : ""}`}
            onClick={() => setMode("services")}
            disabled={loading}
            type="button"
          >
            <FiGrid size={18} />
            <span>Edit services</span>
          </button>
          <button
            className={`adminSidebarNavItem ${mode === "locations" ? "active" : ""}`}
            onClick={() => setMode("locations")}
            disabled={loading}
            type="button"
          >
            <FiMapPin size={18} />
            <span>Edit locations</span>
          </button>
          <button
            className={`adminSidebarNavItem ${mode === "about" ? "active" : ""}`}
            onClick={() => setMode("about")}
            disabled={loading}
            type="button"
          >
            <FiInfo size={18} />
            <span>Edit about</span>
          </button>
          <button
            className={`adminSidebarNavItem ${mode === "testimonials" ? "active" : ""}`}
            onClick={() => setMode("testimonials")}
            disabled={loading}
            type="button"
          >
            <FiMessageSquare size={18} />
            <span>Edit testimonials</span>
          </button>
          <button
            className={`adminSidebarNavItem ${mode === "social" ? "active" : ""}`}
            onClick={() => setMode("social")}
            disabled={loading}
            type="button"
          >
            <FiShare2 size={18} />
            <span>Edit social media</span>
          </button>
        </div>

        <div className="adminSidebarActions" />

        <div className="adminSidebarFooter">
          {session ? (
            <button className="adminSidebarAction adminButton" onClick={() => signOut()} disabled={loading} type="button">
              <FiLogOut size={18} />
              <span>Sign out</span>
            </button>
          ) : null}
        </div>
      </aside>

      <div className="adminMain">
        <div className="adminMainInner">
          <div className="adminMainTopActions">
            {mode !== "about" && mode !== "home" ? (
              <button
                className="adminMainActionButton adminButton"
                onClick={
                  mode === "locations"
                    ? addLocation
                    : mode === "services"
                      ? addService
                      : mode === "testimonials"
                        ? addTestimonial
                        : addSocialLink
                }
                disabled={loading}
                type="button"
              >
                <FiPlus size={18} />
                <span>Add</span>
              </button>
            ) : null}

            <button className="adminMainActionButton adminButton" onClick={load} disabled={loading} type="button">
              <FiRefreshCw size={18} />
              <span>{loading ? "Loading..." : "Reload"}</span>
            </button>

            <button
              className="adminMainActionButton adminButton adminButtonSave"
              onClick={save}
              disabled={loading}
              type="button"
            >
              <FiSave size={18} />
              <span>{loading ? "Saving..." : "Save"}</span>
            </button>
          </div>

          {status && <p className="adminStatus">{status}</p>}
          {popup ? (
            <div
              className="adminPopupOverlay"
              role="dialog"
              aria-modal="true"
              aria-label={popup.title}
              onClick={() => setPopup(null)}
            >
              <div className="adminPopup" onClick={(e) => e.stopPropagation()}>
                <div className="adminPopupHeader">
                  <strong>{popup.title}</strong>
                  <button className="adminPopupClose" type="button" onClick={() => setPopup(null)} aria-label="Close">
                    ✕
                  </button>
                </div>
                <div className="adminPopupBody">
                  {popup.body}
                </div>
              </div>
            </div>
          ) : null}

      {mode === "home" ? (
        <HomeMode />
      ) : mode === "about" ? (
        <AboutMode />
      ) : mode === "locations" ? (
        <LocationsMode />
      ) : mode === "services" ? (
        <ServicesMode />
      ) : mode === "testimonials" ? (
        <TestimonialsMode />
      ) : (
        <SocialMode />
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
        </div>
      </div>
    </main>
    </AdminCtx.Provider>
  );
}

