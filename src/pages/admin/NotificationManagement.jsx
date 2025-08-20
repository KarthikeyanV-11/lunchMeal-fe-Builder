import { useEffect, useState } from "react";
import { Layout } from "../../components/shared/Layout";
import axios from "axios";
import { Pencil, Trash2, X } from "lucide-react";
import { toast } from "react-hot-toast";

function NotificationManagement() {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [formData, setFormData] = useState({ title: "", message: "" });

  // Delete confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingNotificationId, setDeletingNotificationId] = useState(null);

  // Fetch all notifications
  useEffect(() => {
    const fetchCreatedNotifications = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/notifications/all`);
        setNotifications(response.data || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch notifications",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCreatedNotifications();
  }, [BASE_URL]);

  // Open edit modal
  const handleEditClick = (notification) => {
    setEditingNotification(notification);
    setFormData({ title: notification.title, message: notification.message });
    setIsModalOpen(true);
  };

  // Save edit
  const handleSave = async () => {
    try {
      const { id } = editingNotification;
      await axios.put(`${BASE_URL}/notifications/${id}`, formData);
      toast.success("Notification updated successfully");

      // Update state
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, ...formData } : n)),
      );

      setIsModalOpen(false);
      setEditingNotification(null);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update notification",
      );
    }
  };

  // Open delete modal
  const handleDeleteClick = (id) => {
    setDeletingNotificationId(id);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/notifications/${deletingNotificationId}`);
      toast.success("Notification deleted successfully");
      setNotifications((prev) =>
        prev.filter((n) => n.id !== deletingNotificationId),
      );
      setIsDeleteModalOpen(false);
      setDeletingNotificationId(null);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete notification",
      );
    }
  };

  return (
    <div>
      <Layout>
        <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-orange-500">
              Notification Management
            </h2>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="text-center text-gray-400">No notifications found</p>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex justify-between items-center p-4 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition"
                >
                  {/* Notification content */}
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {notification.message}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEditClick(notification)}
                      className="p-2 rounded-full hover:bg-orange-100 text-orange-500"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(notification.id)}
                      className="p-2 rounded-full hover:bg-red-100 text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Layout>

      {/* Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setIsModalOpen(false)}
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-orange-500 mb-4">
              Edit Notification
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  rows="3"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
                ></textarea>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm relative text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-red-500 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this notification?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                No
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationManagement;
