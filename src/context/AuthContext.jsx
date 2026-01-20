import { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const initialized = useRef(false);

  const fetchProfile = async (user) => {
    if (!user) {
      setProfile(null);
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!error) {
      setProfile(data);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user);
      }

      setLoading(false);
      initialized.current = true;
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // ⛔ Abaikan re-trigger setelah init
      if (!initialized.current) return;

      if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);
      }

      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user);
        await fetchProfile(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
