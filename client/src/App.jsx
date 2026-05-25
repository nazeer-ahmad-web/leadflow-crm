import { useState } from "react";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  return (
    <>
      {isLoggedIn ? (
        <Dashboard />
      ) : (
        <Login setIsLoggedIn={setIsLoggedIn} />
      )}
    </>
  );
}

export default App;