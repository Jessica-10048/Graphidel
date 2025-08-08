// AdminTemplateAssetUpload.jsx
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import URL from "../../../utils/constants/url";

const MAX_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPT = "image/*,application/zip,application/pdf,application/octet-stream";

const prettyBytes = (n) =>
  n < 1024 ? `${n} B` :
  n < 1024**2 ? `${(n/1024).toFixed(1)} KB` :
  n < 1024**3 ? `${(n/1024**2).toFixed(1)} MB` :
  `${(n/1024**3).toFixed(1)} GB`;

export default function AdminTemplateAssetUpload({
  idOrSlug,
  useToken = false,
  className = "",
  successText = "Upload réussi !",
  autoHideMs = 3000,
}) {
  // Form
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const hideTimer = useRef(null);

  // Assets
  const [assets, setAssets] = useState([]);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [listError, setListError] = useState(null);

  const clearHideTimer = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  const resetForm = () => {
    setFile(null);
    setProgress(0);
    setUploading(false);
    inputRef.current && (inputRef.current.value = "");
  };

  const setAlert = (type, text) => {
    setMessage({ type, text });
    clearHideTimer();
    if (type === "success" && autoHideMs > 0) {
      hideTimer.current = setTimeout(() => setMessage(null), autoHideMs);
    }
  };

  const validateFile = (f) => {
    if (!f) return "Aucun fichier sélectionné.";
    if (f.size > MAX_SIZE) return `Fichier trop volumineux (max ${prettyBytes(MAX_SIZE)}).`;
    const ok = /(image\/|application\/zip|application\/pdf|application\/octet-stream)/.test(f.type);
    if (!ok) return "Type de fichier non autorisé.";
    return null;
  };

  const onPickFile = (f) => {
    const err = validateFile(f);
    if (err) return setAlert("danger", err);
    setFile(f);
    setMessage(null);
  };

  const handleFileChange = (e) => onPickFile(e.target.files?.[0] || null);

  // Drag & drop
  const onDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); };
  const onDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); };
  const onDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    onPickFile(e.dataTransfer.files?.[0] || null);
  };

  // Auth opts
  const buildAuth = () => {
    const headers = {};
    const opts = { headers, withCredentials: !useToken };
    if (useToken) {
      const t = localStorage.getItem("token");
      if (t) headers.Authorization = `Bearer ${t}`;
      opts.withCredentials = false;
    }
    return opts;
  };

  // Fetch assets
  const fetchAssets = async () => {
    if (!idOrSlug) return;
    try {
      setLoadingAssets(true);
      setListError(null);
      const base = URL.GET_TEMPLATE || "http://localhost:8000/api/templates";
      const { data } = await axios.get(`${base}/${encodeURIComponent(idOrSlug)}`, buildAuth());
      setAssets(Array.isArray(data?.data?.assets) ? data.data.assets : []);
    } catch (err) {
      setListError(err?.response?.data?.message || err.message || "Erreur chargement des assets");
    } finally {
      setLoadingAssets(false);
    }
  };

  useEffect(() => {
    fetchAssets();
    return () => clearHideTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idOrSlug]);

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setAlert("danger", "Choisis un fichier d'abord.");
    if (!idOrSlug) return setAlert("danger", "Template ID/slug manquant.");

    setUploading(true);
    setMessage(null);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const base = URL.ADD_TEMPLATE_ASSET || "http://localhost:8000/api/templates";
      const url = `${base}/${encodeURIComponent(idOrSlug)}/assets`;

      const auth = buildAuth();
      const res = await axios.post(url, formData, {
        ...auth,
        headers: { ...auth.headers, "Content-Type": "multipart/form-data" },
        onUploadProgress: (p) => {
          if (!p.total) return;
          setProgress(Math.round((p.loaded * 100) / p.total));
        },
      });

      setProgress(100);
      setAlert("success", res?.data?.message || successText);

      await fetchAssets();
      setTimeout(() => resetForm(), 350);
    } catch (err) {
      const apiMsg = err?.response?.data?.message;
      setAlert("danger", apiMsg || err.message || "Erreur upload");
      setUploading(false);
    }
  };

  // UI
  const dropStyles = {
    cursor: "pointer",
    border: "2px dashed rgba(0,0,0,.2)",
    borderRadius: "1rem",
    padding: "2rem",
    transition: "all .15s ease",
    background: dragActive ? "rgba(13,110,253,.05)" : "transparent",
    outline: dragActive ? "2px solid rgba(13,110,253,.35)" : "none",
  };

  const previewBase = URL.ADD_TEMPLATE_ASSET || "http://localhost:8000/api/templates";
  const isImg = (m) => typeof m === "string" && m.startsWith("image/");

  return (
    <div className={`card shadow-sm my-3 ${className}`}>
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="card-title mb-0">Ajouter un asset privé</h5>
          <span className="badge text-bg-secondary">Template : <code className="ms-1">{idOrSlug || "—"}</code></span>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Dropzone */}
          <div
            className="mb-3 text-center"
            style={dropStyles}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
          >
            <div className="d-flex flex-column align-items-center gap-2">
              <div className="rounded-circle d-flex align-items-center justify-content-center"
                   style={{ width: 56, height: 56, background: "rgba(13,110,253,.1)" }}>
                <span className="fs-4">📦</span>
              </div>
              <div className="fw-semibold">
                Glisse ton fichier ici <span className="text-muted">ou</span> <span className="text-primary text-decoration-underline">parcours</span>
              </div>
              <small className="text-muted">
                Autorisés : images / zip / pdf — max {prettyBytes(MAX_SIZE)}
              </small>
            </div>
            <input
              ref={inputRef}
              id="assetFile"
              type="file"
              className="d-none"
              onChange={handleFileChange}
              accept={ACCEPT}
              disabled={uploading}
            />
          </div>

          {/* Aperçu fichier */}
          {file && (
            <div className="alert alert-info d-flex align-items-center justify-content-between py-2">
              <div className="me-3">
                <strong>{file.name}</strong>
                <div className="small text-muted">{prettyBytes(file.size)}</div>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={resetForm}
                disabled={uploading}
              >
                Réinitialiser
              </button>
            </div>
          )}

          {/* Progress */}
          {uploading && (
            <div className="mb-3">
              <div className="progress" role="progressbar" aria-label="Progression de l’upload" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
                <div className="progress-bar" style={{ width: `${progress}%` }}>{progress}%</div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="d-flex align-items-center gap-2">
            <button type="submit" className="btn btn-primary" disabled={!file || uploading || !idOrSlug}>
              {uploading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  Téléversement...
                </>
              ) : (
                "Uploader"
              )}
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={resetForm} disabled={uploading && !file}>
              Effacer
            </button>
          </div>
        </form>

        {message && (
          <div className={`alert alert-${message.type} mt-3`} role="alert">
            {message.text}
          </div>
        )}

        <hr className="mt-4" />

        {/* Tableau des assets */}
        <h6 className="mb-3">Assets du template</h6>

        {loadingAssets && <div className="text-muted">Chargement…</div>}

        {!loadingAssets && listError && (
          <div className="alert alert-danger">{listError}</div>
        )}

        {!loadingAssets && !listError && (
          assets?.length ? (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th style={{ width: 80 }}>Aperçu</th>
                    <th>Fichier</th>
                    <th>Type</th>
                    <th>Taille</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((a) => {
                    const previewUrl = `${previewBase}/${encodeURIComponent(idOrSlug)}/assets/${encodeURIComponent(a.filename)}/preview`;
                    return (
                      <tr key={a._id || a.filename}>
                        <td>
                          {isImg(a.mimetype) ? (
                            <img
                              src={previewUrl}
                              alt={a.filename}
                              style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8 }}
                            />
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                        <td className="fw-semibold">{a.filename}</td>
                        <td className="text-muted">{a.mimetype || "—"}</td>
                        <td className="text-muted">
                          {typeof a.size === "number" ? `${(a.size/1024/1024).toFixed(2)} MB` : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-secondary mb-0">Aucun asset pour ce template.</div>
          )
        )}

        <p className="text-muted mt-3 mb-0">
          Les fichiers sont stockés dans <code>uploads/assets</code> (privé) et <strong>ne sont pas</strong> servis en statique.
        </p>
      </div>
    </div>
  );
}
