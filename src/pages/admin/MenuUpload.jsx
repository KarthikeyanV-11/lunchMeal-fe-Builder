import React, { useState } from "react";
import { UtensilsCrossed, Salad, Ham } from "lucide-react";
import { Layout } from "../../components/shared/Layout";
import { Button } from "../../components/ui/Button";
import CreateTemplateModal from "../../components/ui/CreateTemplateModal";
import { useSelector, useDispatch } from "react-redux";
import { setNewTemplate } from "../../slice/menuSlice";

export default function MenuUpload() {
  const [isCreateTemplateModalOpen, setIsCreateTemplateModalOpen] =
    useState(false);
  const dispatch = useDispatch();

  const menuTemplates = useSelector((state) => state.menu.availableTemplates);

  const handleCreateNewTemplate = (templateData) => {
    console.log("Creating new template:", templateData);

    dispatch(setNewTemplate(templateData)); // ✅ immediately update Redux state

    setIsCreateTemplateModalOpen(false);
  };

  return (
    <Layout>
      {/* <div className="mt-10 border rounded-xl p-4 shadow-sm hover:shadow-md transition"> */}
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold mb-4">
            Available Menu Templates
          </h2>
          <Button size="sm" onClick={() => setIsCreateTemplateModalOpen(true)}>
            + New Template
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 cursor-pointer">
          {menuTemplates?.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200 ease-in-out flex flex-col text-gray-800 overflow-hidden"
            >
              {/* Top Section: Name and Emoji */}
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
                <p className="text-sm text-gray-600">{template.description}</p>
                <span className="w-fit bg-amber-100 text-slate-800 text-[9.5px] py-[0.1rem] px-4 rounded-md shadow-sm self-center font-semibold">
                  {template.menuType}
                </span>
              </div>

              <p className="text-sm mt-4">
                <span className="font-medium">Items:</span> {template.menuItems}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Create New Template Modal */}
      {isCreateTemplateModalOpen && (
        <CreateTemplateModal
          isOpen={isCreateTemplateModalOpen}
          setIsOpen={setIsCreateTemplateModalOpen}
          onSaveTemplate={handleCreateNewTemplate}
        />
      )}
    </Layout>
  );
}
