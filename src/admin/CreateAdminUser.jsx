import { supabase } from "../lib/supabase";

export const createAdminUser = async () => {
  const { data, error } = await supabase.auth.signUp({
    email: "admin@gmail.com",
    password: "admin123",
  });

  if (error) {
    console.error(error);
    return;
  }

  await supabase.from("users").insert({
    id: data.user.id,
    email: data.user.email,
    role: "admin",
  });

  console.log("✅ Admin created");
};
