const {CreateClient} = require('@supabase/supabase-js')
const express = require ('express')
const port = process.env.PORT || 9000

const supabaseUrl =''
const supabaseKey = ''
const supabase = CreateClient(supabaseUrl, supabaseKey)

const app = express();

app.listen(port,() => console.log( 'server listening on port', port))