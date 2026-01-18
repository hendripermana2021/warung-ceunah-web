import { supabase } from "../lib/supabase";

const LogoutButton = () => (
  <button
    onClick={async () => await supabase.auth.signOut()}
    className="bg-red-500 px-4 py-2 border-4 border-black font-bold"
  >
    🚪 Logout
  </button>
);

export default LogoutButton;
