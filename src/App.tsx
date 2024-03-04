import "../app/globals.css"
import { ThemeProvider } from "./components/ThemeProvider";
import { FileUploader } from "./components/FileUploader";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {/* <img src={imageSrc} /> */}
      <div className="container mx-auto">
        <FileUploader />
      </div>
    </ThemeProvider>
  )
}

export default App;
