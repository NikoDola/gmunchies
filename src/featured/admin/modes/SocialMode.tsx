"use client";

import { useAdminCtx } from "../adminContext";
import { deepClone } from "../adminUtils";

export default function SocialMode() {
  const { cms, setCms, loading } = useAdminCtx();
  return (
        <section className="adminSection">
          <div className="adminSettingsCard">
            <div style={{ fontWeight: 800 }}>Social media</div>
            <div style={{ opacity: 0.75, marginTop: 6 }}>
              These links are used in the footer. Add only the platforms you want visible.
            </div>
          </div>

          {(cms.socialLinks ?? []).map((s, idx) => (
            <div key={`${s.platform}-${idx}`} className="adminSettingsCard">
              <div className="adminRow">
                <div className="adminField">
                  <label>Platform</label>
                  <select
                    value={s.platform}
                    onChange={(e) =>
                      setCms((prev) => {
                        if (!prev) return prev;
                        const next = deepClone(prev);
                        if (!next.socialLinks) next.socialLinks = [];
                        if (next.socialLinks[idx]) next.socialLinks[idx].platform = e.target.value;
                        return next;
                      })
                    }
                    disabled={loading}
                  >
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Yelp">Yelp</option>
                    <option value="Google">Google</option>
                    <option value="X">X</option>
                  </select>
                </div>

                <div className="adminField">
                  <label>Enabled</label>
                  <select
                    value={s.enabled === false ? "no" : "yes"}
                    onChange={(e) =>
                      setCms((prev) => {
                        if (!prev) return prev;
                        const next = deepClone(prev);
                        if (!next.socialLinks) next.socialLinks = [];
                        if (next.socialLinks[idx]) next.socialLinks[idx].enabled = e.target.value === "yes";
                        return next;
                      })
                    }
                    disabled={loading}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>

              <div className="adminField">
                <label>URL</label>
                <input
                  value={s.url}
                  onChange={(e) =>
                    setCms((prev) => {
                      if (!prev) return prev;
                      const next = deepClone(prev);
                      if (!next.socialLinks) next.socialLinks = [];
                      if (next.socialLinks[idx]) next.socialLinks[idx].url = e.target.value;
                      return next;
                    })
                  }
                  disabled={loading}
                  placeholder="https://..."
                />
              </div>

              <div className="adminActions">
                <button
                  className="adminButton"
                  type="button"
                  onClick={() =>
                    setCms((prev) => {
                      if (!prev) return prev;
                      const next = deepClone(prev);
                      if (!next.socialLinks) next.socialLinks = [];
                      if (idx <= 0) return next;
                      const tmp = next.socialLinks[idx - 1];
                      next.socialLinks[idx - 1] = next.socialLinks[idx];
                      next.socialLinks[idx] = tmp;
                      return next;
                    })
                  }
                  disabled={loading || idx === 0}
                >
                  Move up
                </button>
                <button
                  className="adminButton"
                  type="button"
                  onClick={() =>
                    setCms((prev) => {
                      if (!prev) return prev;
                      const next = deepClone(prev);
                      if (!next.socialLinks) next.socialLinks = [];
                      if (idx >= next.socialLinks.length - 1) return next;
                      const tmp = next.socialLinks[idx + 1];
                      next.socialLinks[idx + 1] = next.socialLinks[idx];
                      next.socialLinks[idx] = tmp;
                      return next;
                    })
                  }
                  disabled={loading || idx === (cms.socialLinks?.length ?? 0) - 1}
                >
                  Move down
                </button>
                <button
                  className="adminButton adminButtonDeleteEntity"
                  type="button"
                  onClick={() => {
                    if (!window.confirm(`Delete social link "${s.platform}"?`)) return;
                    setCms((prev) => {
                      if (!prev) return prev;
                      const next = deepClone(prev);
                      next.socialLinks = (next.socialLinks ?? []).filter((_, i) => i !== idx);
                      return next;
                    });
                  }}
                  disabled={loading}
                >
                  Delete link
                </button>
              </div>
            </div>
          ))}
        </section>
  );
}
