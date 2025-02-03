const {createClient} = require('@supabase/supabase-js')
const express = require ('express')
const port = process.env.PORT || 9000

const supabaseUrl ='https://cmzgqyfvwnsxrbinxkjk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtemdxeWZ2d25zeHJiaW54a2prIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODU3MjU5MCwiZXhwIjoyMDU0MTQ4NTkwfQ.DSRew9cWsqX22HZIR6JkxDr5F7lAdxQbT4R5XqYYaUA'
const supabase = createClient(supabaseUrl, supabaseKey)

const app = express();

//routes

app.get('/', (req, res)=> {
    res.send("Welcome to Felix's API");
})

app.listen(port,() => console.log( 'server listening on port', port))