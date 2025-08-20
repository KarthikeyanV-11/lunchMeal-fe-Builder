import React, { useState } from "react";
import { UtensilsCrossed, Salad, Ham, Pencil, Trash2 } from "lucide-react";
import { Layout } from "../../components/shared/Layout";
import { Button } from "../../components/ui/Button";
import CreateTemplateModal from "../../components/ui/CreateTemplateModal";
import UpdateTemplateModal from "../admin/UpdateTemplateModal";
import { useSelector, useDispatch } from "react-redux";
import { deleteTemplate, updateTemplate } from "../../slice/menuSlice";
import axios from "axios";

export default function VendorMenuUpload() {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const [isCreateTemplateModalOpen, setIsCreateTemplateModalOpen] =
    useState(false);
  const [isUpdateTemplateModalOpen, setIsUpdateTemplateModalOpen] =
    useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const dispatch = useDispatch();
  const menuTemplates = useSelector((state) => state.menu.availableTemplates);

  const handleCreateNewTemplate = () => {
    setIsCreateTemplateModalOpen(false);
  };

  // Update
  const handleUpdateTemplate = async (updatedData) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/menu/${selectedTemplate.id}`,
        updatedData,
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      console.log("fetched from backend", res);
      // Backend returns updated object and storing it in redux
      dispatch(updateTemplate(res.data));

      setIsUpdateTemplateModalOpen(false);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  // Delete
  const handleDeleteTemplate = async (templateId) => {
    try {
      await axios.delete(`${BASE_URL}/menu/${templateId}`);
      // Remove from Redux
      dispatch(deleteTemplate(templateId));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold mb-4">
            Available Menu Templates
          </h2>
          <Button size="sm" onClick={() => setIsCreateTemplateModalOpen(true)}>
            + New Template
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {menuTemplates
            ?.filter((template) => !template.isDeleted) // only show non-deleted
            .map((template) => (
              <div
                key={template.id}
                className="relative group bg-white rounded-lg p-4 border border-gray-200 transition-shadow duration-200 ease-in-out flex flex-col text-gray-800 overflow-hidden hover:shadow-md"
              >
                {/* Hover Overlay with Icons */}
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4 z-10">
                  <button
                    onClick={() => {
                      setSelectedTemplate(template);
                      setIsUpdateTemplateModalOpen(true);
                    }}
                    className="p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(template.id)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Top Section */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold flex-grow pr-2 break-words">
                    {template.menuName}
                  </h3>
                  <div
                    className="text-2xl"
                    role="img"
                    aria-label={template.menuName}
                  >
                    {template.menuType === "VEG" && <Salad stroke="green" />}
                    {template.menuType === "NON_VEG" && <Ham stroke="red" />}
                    {template.menuType === "BOTH" && (
                      <UtensilsCrossed stroke="orange" />
                    )}
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <p className="text-sm text-gray-600">
                    {template.description}
                  </p>
                  <span className="w-fit bg-amber-100 text-slate-800 text-[9.5px] py-[0.1rem] px-4 rounded-md shadow-sm self-center font-semibold">
                    {template.menuType}
                  </span>
                </div>

                <p className="text-sm mt-4">
                  <span className="font-medium">Items:</span>{" "}
                  {template.menuItems}
                </p>
              </div>
            ))}
        </div>
      </div>

      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold mb-4">Delete Template?</h2>
            <p className="text-gray-600 mb-6">
              This template will be permanently deleted. This action cannot be
              undone. All future dates using this template will also be deleted.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                No
              </button>
              <button
                onClick={() => {
                  handleDeleteTemplate(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Template Modal */}
      {isCreateTemplateModalOpen && (
        <CreateTemplateModal
          isOpen={isCreateTemplateModalOpen}
          setIsOpen={setIsCreateTemplateModalOpen}
          onSaveTemplate={handleCreateNewTemplate}
        />
      )}

      {/* Update Template Modal */}
      {isUpdateTemplateModalOpen && selectedTemplate && (
        <UpdateTemplateModal
          isOpen={isUpdateTemplateModalOpen}
          setIsOpen={setIsUpdateTemplateModalOpen}
          template={selectedTemplate}
          onUpdateTemplate={handleUpdateTemplate}
        />
      )}
    </Layout>
  );
}
