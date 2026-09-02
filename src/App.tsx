import Sidebar from "./components/sidebar/sidebar.tsx";
import Tabs from "./components/main/tab/tab.tsx";
import Request from "./components/main/request/Request.tsx";
import ResponseViewer from "./components/main/response/ResponstViewer.tsx";

function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Tabs />

        <div className="flex min-h-0 flex-1 flex-col">
          <Request />
          <ResponseViewer />
        </div>
      </div>
    </div>
  );
}

export default App;
