import supabase from "./connect";

async() => {

    const { data, error } = await supabase
        .from('ttk_fav')
        .select('*');
    }
    console.log(data);