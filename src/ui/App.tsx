export const App = ({ config }: { config: any }) => {
  return (
    <div className="pp-fixed pp-top-4 pp-left-4 pp-bg-white pp-shadow-lg pp-p-4 pp-z-[9999] pp-rounded-lg pp-text-black">
      <p className="pp-font-bold pp-text-lg">📌 Pinpoint Active</p>
      <p>Project ID: {config?.projectId || "not set"}</p>
    </div>
  );
};
