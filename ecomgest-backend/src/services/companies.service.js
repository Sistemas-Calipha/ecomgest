import supabase from "../config/supabase.js";

export const getCompanies = async () => {
  const { data, error } = await supabase
    .from("empresas")
    .select("*")
    .order("id", { ascending: true });

  if (error) throw new Error(error.message);

  return data;
};
