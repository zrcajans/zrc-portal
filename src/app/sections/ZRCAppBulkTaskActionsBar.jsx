

export default function ZRCAppBulkTaskActionsBar({
  activeContentMenu,
  boardView,
  currentPermissions,
  handleBulkArchive,
  handleBulkDelete,
  selectedTasks,
  setSelectedTasks,
}) {
  return (
    <>
        {selectedTasks.length > 0 && currentPermissions.deleteTasks && boardView === 'Tüm Görevler' && activeContentMenu === 'Projeler' && (
          <div className="fixed bottom-6 right-6 bg-white border border-zinc-200 shadow-[0_20px_60px_rgba(0,0,0,0.15)] rounded-xl p-5 w-[380px] z-[90] animate-modal">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-[13px] font-black text-zinc-800">{selectedTasks.length} Görev Seçildi</h4>

              <button onClick={() => setSelectedTasks([])} className="text-zinc-400 hover:text-zinc-700 transition-colors">
                ×
              </button>
            </div>

            <div className="flex items-center space-x-2 mt-4">
              <button onClick={handleBulkArchive} className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-3.5 py-1.5 rounded-md text-[10.5px] font-bold shadow-sm">
                Arşivle
              </button>

              <button onClick={handleBulkDelete} className="bg-[#ef4444] hover:bg-[#dc2626] text-white px-3.5 py-1.5 rounded-md text-[10.5px] font-bold shadow-sm">
                Sil
              </button>
            </div>
          </div>
        )}
    </>
  );
}
