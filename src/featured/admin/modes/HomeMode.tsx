"use client";
/* eslint-disable @next/next/no-img-element -- admin CMS previews render freshly-uploaded, arbitrary-dimension images (incl. blob: URLs); next/image optimization adds no value here and needs known dimensions. */

import { useAdminCtx } from "../adminContext";

export default function HomeMode() {
  const { cms, setCms, loading, stageFile, openMediaPicker } = useAdminCtx();
  return (
        <section className="adminSection">
          <div className="adminCard">
            <div className="adminCardBody">
              <div className="adminSubheading">Home Hero</div>

              <div className="adminRow">
                <div className="adminField">
                  <label>Headline</label>
                  <input
                    value={cms.home.hero?.headline ?? ""}
                    onChange={(e) =>
                      setCms((prev) => {
                        if (!prev) return prev;
                        return { ...prev, home: { ...prev.home, hero: { ...prev.home.hero, headline: e.target.value } } };
                      })
                    }
                    disabled={loading}
                    placeholder="Your Trusted Vending Partner"
                  />
                </div>
                <div className="adminField">
                  <label>CTA button label</label>
                  <input
                    value={cms.home.hero?.ctaLabel ?? ""}
                    onChange={(e) =>
                      setCms((prev) => {
                        if (!prev) return prev;
                        return { ...prev, home: { ...prev.home, hero: { ...prev.home.hero, ctaLabel: e.target.value } } };
                      })
                    }
                    disabled={loading}
                    placeholder="Request Service"
                  />
                </div>
              </div>

              <div className="adminField">
                <label>Body text</label>
                <textarea
                  value={cms.home.hero?.body ?? ""}
                  onChange={(e) =>
                    setCms((prev) => {
                      if (!prev) return prev;
                      return { ...prev, home: { ...prev.home, hero: { ...prev.home.hero, body: e.target.value } } };
                    })
                  }
                  disabled={loading}
                  rows={4}
                />
              </div>

              <div className="adminField">
                <label>Hero image</label>
                <div className="blockPreview">
                  {cms.home.hero?.imageSrc ? <img src={cms.home.hero.imageSrc} alt="" /> : null}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      stageFile(file, (blobUrl) =>
                        setCms((prev) => {
                          if (!prev) return prev;
                          return { ...prev, home: { ...prev.home, hero: { ...prev.home.hero, imageSrc: blobUrl } } };
                        }),
                      );
                    }}
                    disabled={loading}
                  />
                  <button
                    className="adminButton"
                    type="button"
                    onClick={() => openMediaPicker({ type: "home", field: "imageSrc" })}
                    disabled={loading}
                  >
                    Add image from media
                  </button>
                  {cms.home.hero?.imageSrc ? (
                    <button
                      className="adminButton adminButtonDanger"
                      type="button"
                      onClick={() =>
                        setCms((prev) =>
                          prev ? { ...prev, home: { ...prev.home, hero: { ...prev.home.hero, imageSrc: "" } } } : prev
                        )
                      }
                      disabled={loading}
                    >
                      Remove image
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>
  );
}
