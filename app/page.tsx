"use client";

import React, { useState } from "react";
import ChatModal from "../components/ChatModal";
import ModalOverlay from "../components/ModalOverlay";
import ConfigureModal from "../components/ConfigureModal";
import Profile from "../components/Profile";
import Map from "../components/Map";
import NFCReader from "../components/NFCReader";
import LoobricatesList from '../components/LoobricatesList';

export default function Page() {
  const [view, setView] = useState<"Chat" | "Profile" | "Map" | "NFCReader">(
    "Chat"
  );
  const [showModal, setShowModal] = useState(false);
  const [configureOpen, setConfigureOpen] = useState(false);

  const handleToggleView = (newView: "Chat" | "Profile" | "Map" | "NFCReader") => {
    setView(newView);
  };

  const handleConfigureClick = () => {
    setConfigureOpen(true);
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Main Content Area */}
      <main className="flex flex-1 items-center justify-center">
        {/* Modal Overlay */}
        {showModal && <ModalOverlay onClose={() => setShowModal(false)} />}

        {/* Dynamic View Rendering */}
        {view === "Profile" && <Profile />}
        {view === "Map" && <Map />}
        {view === "Chat" && (
          <ChatModal
            onConfigureOpen={handleConfigureClick}
            showModal={() => setShowModal(true)}
          />
        )}
        {view === "NFCReader" && <NFCReader />}

        {/* Configure Modal */}
        {configureOpen && <ConfigureModal onClose={() => setConfigureOpen(false)} />}

        <LoobricatesList />
      </main>

      {/* Footer */}
      <footer className="p-4 bg-gray-800 text-center">Footer content here</footer>
    </div>
  );
}
