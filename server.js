const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// TAMPILAN DASHBOARD
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>cvAI4 Downloader</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>body { background: #050505; color: white; font-family: sans-serif; }</style>
    </head>
    <body class="flex items-center justify-center min-h-screen p-6">
        <div class="bg-[#111] p-8 rounded-[2rem] w-full max-w-lg border border-[#222] text-center">
            <h1 class="text-2xl font-bold text-blue-400 mb-6 italic">cvAI4 ULTIMATE</h1>
            <input type="text" id="url" placeholder="Tempel link di sini..." class="w-full p-4 rounded-xl bg-[#1a1a1a] border border-[#333] mb-4 outline-none text-sm">
            <button onclick="dl()" id="btn" class="w-full bg-blue-600 py-4 rounded-xl font-bold shadow-lg">DOWNLOAD MEDIA</button>
            <div id="res" class="mt-8 hidden space-y-3">
                <p id="t" class="text-[10px] text-gray-500 truncate mb-4"></p>
                <a id="v1" href="#" target="_blank" class="block bg-green-600 p-3 rounded-lg text-xs font-bold">VIDEO NO WM</a>
                <a id="v2" href="#" target="_blank" class="block bg-purple-600 p-3 rounded-lg text-xs font-bold">VIDEO HD 720P</a>
                <a id="v3" href="#" target="_blank" class="block bg-orange-500 p-3 rounded-lg text-xs font-bold">MUSIC MP3</a>
            </div>
            <p id="ld" class="hidden mt-4 text-blue-500 text-[10px] animate-pulse">PROCESSING...</p>
        </div>
        <script>
            async function dl() {
                const u = document.getElementById('url').value;
                const b = document.getElementById('btn');
                const r = document.getElementById('res');
                const l = document.getElementById('ld');
                if(!u) return;
                b.disabled = true; l.classList.remove('hidden'); r.classList.add('hidden');
                try {
                    const s = await fetch('/api/download?url=' + encodeURIComponent(u));
                    const d = await s.json();
                    if(d.status === 'success') {
                        document.getElementById('t').innerText = d.title;
                        document.getElementById('v1').href = d.video;
                        document.getElementById('v2').href = d.hd || d.video;
                        document.getElementById('v3').href = d.music;
                        r.classList.remove('hidden');
                    } else { alert("Gagal! Cek linknya lagi."); }
                } catch(e) { alert("Server Error!"); }
                finally { b.disabled = false; l.classList.add('hidden'); }
            }
        </script>
    </body>
    </html>`);
});

// MESIN PENGOLAH DATA
app.get('/api/download', async (req, res) => {
    const { url } = req.query;
    try {
        const response = await axios.get(`https://api.tikwm.com/api/?url=${encodeURIComponent(url)}`);
        const data = response.data.data;
        if (!data) return res.status(404).json({ status: 'error' });
        res.json({
            status: 'success',
            title: data.title || "Media File",
            video: data.play,
            hd: data.hdplay,
            music: data.music
        });
    } catch (err) { res.status(500).json({ status: 'error' }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Engine Active'));
