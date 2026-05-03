import { useState, useEffect, useRef } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";

const API = "/banners";

export default function BannerManagement() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [editingBanner, setEditingBanner] = useState(null);
  
  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    link: "",
    order: 0,
    isActive: true,
  });

  const fileRef = useRef(null);

  // ── Fetch all banners ──────────────────────────────────────
  const fetchBanners = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(API);
      // Handle both array response and { banners: [] } response
      setBanners(Array.isArray(data) ? data : data.banners || []);
    } catch (error) {
      toast.error("Failed to fetch banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // ── Handle file selection ──────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    
    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, and WebP images are allowed");
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    
    setPreview(URL.createObjectURL(file));
  };

  // ── Reset form ─────────────────────────────────────────────
  const resetForm = () => {
    setForm({ title: "", link: "", order: 0, isActive: true });
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    setEditingBanner(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  // ── Submit (create or update) ──────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const file = fileRef.current?.files[0];

    if (!editingBanner && !file) {
      toast.error("Please select an image.");
      return;
    }

    const formData = new FormData();
    if (file) formData.append("image", file);
    formData.append("title", form.title);
    formData.append("link", form.link);
    formData.append("order", form.order);
    formData.append("isActive", form.isActive);

    setUploading(true);
    try {
      if (editingBanner) {
        await api.put(`${API}/${editingBanner._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Banner updated successfully!");
      } else {
        await api.post(API, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Banner uploaded successfully!");
      }
      resetForm();
      fetchBanners();
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  // ── Edit ───────────────────────────────────────────────────
  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setForm({
      title: banner.title,
      link: banner.link || "",
      order: banner.order,
      isActive: banner.isActive,
    });
    setPreview(banner.imageUrl);
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast.success("Editing banner mode activated");
  };

  // ── Toggle active ──────────────────────────────────────────
  const handleToggleActive = async (banner) => {
    const newStatus = !banner.isActive;
    try {
      await api.put(`${API}/${banner._id}`, {
        isActive: newStatus,
        title: banner.title,
      });
      fetchBanners();
      toast.success(`Banner ${newStatus ? "activated" : "deactivated"} successfully!`);
    } catch (error) {
      toast.error("Failed to update banner status");
    }
  };

  // ── Show delete confirmation modal ─────────────────────────
  const confirmDelete = (banner) => {
    setBannerToDelete(banner);
    setShowDeleteModal(true);
  };

  // ── Delete banner ──────────────────────────────────────────
  const handleDelete = async () => {
    if (!bannerToDelete) return;
    
    setDeleting(true);
    try {
      await api.delete(`${API}/${bannerToDelete._id}`);
      toast.success("Banner deleted successfully!");
      setShowDeleteModal(false);
      setBannerToDelete(null);
      fetchBanners();
    } catch (error) {
      toast.error("Failed to delete banner");
    } finally {
      setDeleting(false);
    }
  };

  // ── Close modal ────────────────────────────────────────────
  const closeModal = () => {
    setShowDeleteModal(false);
    setBannerToDelete(null);
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          🖼️ Banner Management
        </h1>

        {/* ── Upload / Edit Form ───────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-5">
            {editingBanner ? "Edit Banner" : "Upload New Banner"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Image upload area */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Banner Image{" "}
                {!editingBanner && <span className="text-red-500">*</span>}
              </label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-400 transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-lg object-cover"
                  />
                ) : (
                  <div className="text-gray-400">
                    <svg
                      className="w-10 h-10 mx-auto mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm">
                      Click to select image (JPEG / PNG / WebP, max 5 MB)
                    </p>
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              {preview && (
                <button
                  type="button"
                  onClick={() => {
                    if (preview && !preview.startsWith('http')) {
                      URL.revokeObjectURL(preview);
                    }
                    setPreview(null);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                  className="mt-2 text-xs text-red-500 hover:underline"
                >
                  Remove image
                </button>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Title <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Summer Sale"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
              />
            </div>

            {/* Link */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Click URL (optional)
              </label>
              <input
                type="url"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                placeholder="https://example.com/sale"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
              />
            </div>

            {/* Order & Active */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                />
              </div>
              <div className="flex items-end pb-1 gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.checked })
                  }
                  className="w-4 h-4 accent-indigo-600"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium text-gray-600"
                >
                  Active
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={uploading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-60 transition-colors text-sm"
              >
                {uploading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {editingBanner ? "Saving..." : "Uploading..."}
                  </span>
                ) : (
                  editingBanner ? "Save Changes" : "Upload Banner"
                )}
              </button>
              {editingBanner && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ── Banner List ──────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-5">
            All Banners ({banners.length})
          </h2>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : banners.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-2 text-gray-500">No banners yet. Upload your first one above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {banners.map((banner) => (
                <div
                  key={banner._id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  {/* Thumbnail */}
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-24 h-16 object-cover rounded-lg flex-shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">
                      {banner.title || "Untitled Banner"}
                    </p>
                    {banner.link && (
                      <a
                        href={banner.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-500 hover:underline truncate block"
                      >
                        {banner.link}
                      </a>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Order: {banner.order} ·{" "}
                      {new Date(banner.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Status badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                      banner.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {banner.isActive ? "Active" : "Inactive"}
                  </span>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleToggleActive(banner)}
                      title={banner.isActive ? "Deactivate" : "Activate"}
                      className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                      {banner.isActive ? (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>

                    <button
                      onClick={() => handleEdit(banner)}
                      title="Edit banner"
                      className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>

                    <button
                      onClick={() => confirmDelete(banner)}
                      title="Delete banner"
                      className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Delete Confirmation Modal ───────────────────────── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={closeModal}
          />
          
          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all">
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Icon */}
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Delete Banner
              </h3>

              {/* Message */}
              <p className="text-sm text-gray-500 text-center mb-6">
                Are you sure you want to delete the banner 
                {bannerToDelete?.title && (
                  <span className="font-medium text-gray-700"> "{bannerToDelete.title}"</span>
                )}?
                <br />
                This action cannot be undone.
              </p>

              {/* Banner preview (if image exists) */}
              {bannerToDelete?.imageUrl && (
                <div className="mb-6 flex justify-center">
                  <img
                    src={bannerToDelete.imageUrl}
                    alt={bannerToDelete.title}
                    className="h-24 w-auto object-cover rounded-lg border border-gray-200"
                  />
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={closeModal}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </span>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}