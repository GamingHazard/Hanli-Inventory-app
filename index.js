import { registerRootComponent } from "expo";

import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";

<AuthProvider>{registerRootComponent(App)}</AuthProvider>;
